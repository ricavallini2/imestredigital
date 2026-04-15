/**
 * Cliente HTTP centralizado para comunicação com os microserviços.
 *
 * - Base URL aponta para o proxy do Next.js (/api → microserviços)
 * - Interceptor automático de autenticação (JWT Bearer)
 * - Refresh token automático em caso de 401
 * - Redireciona para /login em caso de sessão expirada
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/** Instância do Axios pré-configurada */
export const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'pt-BR',
  },
});

// ─── Helpers de token ──────────────────────────────────────

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  // Cookie para o middleware de SSR/middleware.ts
  document.cookie = `access_token=${accessToken}; path=/; max-age=3600; SameSite=Strict`;
}

function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  document.cookie = 'access_token=; path=/; max-age=0';
}

// ─── Interceptor de Requisição ─────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Interceptor de Resposta (com refresh automático) ──────

let refreshEmAndamento = false;
let filaAguardando: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processarFila(erro: unknown, token: string | null) {
  filaAguardando.forEach(({ resolve, reject }) => {
    if (erro) {
      reject(erro);
    } else {
      resolve(token);
    }
  });
  filaAguardando = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Não tentar refresh na rota de login/refresh
    const url = originalRequest.url || '';
    if (url.includes('/auth/login') || url.includes('/auth/refresh')) {
      clearTokens();
      if (typeof window !== 'undefined') window.location.href = '/login';
      return Promise.reject(error);
    }

    if (refreshEmAndamento) {
      // Enfileira a requisição e aguarda o refresh completar
      return new Promise((resolve, reject) => {
        filaAguardando.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    refreshEmAndamento = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error('Sem refresh token');

      const { data } = await api.post('/v1/auth/refresh', { refreshToken });
      setTokens(data.accessToken, data.refreshToken);
      processarFila(null, data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processarFila(refreshError, null);
      clearTokens();
      if (typeof window !== 'undefined') window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      refreshEmAndamento = false;
    }
  },
);

export default api;
