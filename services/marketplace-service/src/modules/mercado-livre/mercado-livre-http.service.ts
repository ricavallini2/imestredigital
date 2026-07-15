import { Injectable, Logger } from '@nestjs/common'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { ContaMarketplace } from '../../../generated/client'
import { MercadoLivreConfig } from './mercado-livre.config'
import { MercadoLivreTokenService } from './mercado-livre-token.service'

/** Máximo de tentativas em caso de 429 (rate limit) antes de desistir. */
const MAX_RETRIES_429 = 4
/** Base do backoff exponencial (ms): 1s, 2s, 4s, 8s. */
const BACKOFF_BASE_MS = 1_000
/** Teto do backoff por tentativa (ms). */
const BACKOFF_MAX_MS = 30_000

/**
 * Cliente HTTP autenticado para a API do Mercado Livre.
 *
 * Recursos:
 * - baseURL fixa em api.mercadolibre.com, timeout de 10s.
 * - Authorization: Bearer injetado automaticamente a partir da conta (token
 *   descriptografado + refresh proativo pelo MercadoLivreTokenService).
 * - Refresh reativo: em 401, tenta UMA vez renovar o token e repetir a chamada.
 * - Rate-limit awareness: em 429, aplica backoff exponencial respeitando o
 *   header Retry-After quando presente.
 *
 * Cada método recebe a `ContaMarketplace` para operar no escopo/token do seller
 * correto (multi-tenant). Não guarda token em estado de instância.
 */
@Injectable()
export class MercadoLivreHttpService {
  private readonly logger = new Logger(MercadoLivreHttpService.name)
  private readonly http: AxiosInstance

  constructor(
    private readonly config: MercadoLivreConfig,
    private readonly tokenService: MercadoLivreTokenService,
  ) {
    this.http = axios.create({
      baseURL: this.config.apiUrl,
      timeout: 10_000,
      headers: { Accept: 'application/json' },
    })
  }

  /**
   * GET autenticado. Ex.: get(conta, '/orders/123').
   */
  async get<T = unknown>(
    conta: ContaMarketplace,
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.requisitar<T>(conta, { ...config, method: 'GET', url })
  }

  /**
   * POST autenticado.
   */
  async post<T = unknown>(
    conta: ContaMarketplace,
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.requisitar<T>(conta, { ...config, method: 'POST', url, data })
  }

  /**
   * PUT autenticado.
   */
  async put<T = unknown>(
    conta: ContaMarketplace,
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.requisitar<T>(conta, { ...config, method: 'PUT', url, data })
  }

  /**
   * Executa a requisição aplicando auth, refresh-on-401 (uma vez) e backoff 429.
   *
   * @param tokenForcado quando presente (retry pós-401), usa este access token
   *        já renovado em vez de rederivar da conta (que pode estar em estado
   *        stale). Garante que a repetição use o token novo.
   */
  private async requisitar<T>(
    conta: ContaMarketplace,
    config: AxiosRequestConfig,
    tokenForcado?: string,
  ): Promise<T> {
    const accessToken =
      tokenForcado ?? (await this.tokenService.obterAccessTokenValido(conta))

    try {
      return await this.executarComBackoff<T>(conta, config, accessToken)
    } catch (erro) {
      // 401 → tenta renovar o token UMA vez e repetir com o token novo.
      if (this.eStatus(erro, 401) && tokenForcado === undefined) {
        this.logger.warn(
          `401 do Mercado Livre na conta ${conta.id} — renovando token e repetindo`,
        )
        const novoToken = await this.tokenService.forcarRefresh(
          conta.id,
          conta.tenantId,
        )
        return this.requisitar<T>(conta, config, novoToken)
      }
      throw erro
    }
  }

  /**
   * Executa a chamada aplicando backoff exponencial em respostas 429.
   */
  private async executarComBackoff<T>(
    conta: ContaMarketplace,
    config: AxiosRequestConfig,
    accessToken: string,
  ): Promise<T> {
    let tentativa = 0

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const resposta = await this.http.request<T>({
          ...config,
          headers: {
            ...(config.headers ?? {}),
            Authorization: `Bearer ${accessToken}`,
          },
        })
        return resposta.data
      } catch (erro) {
        if (this.eStatus(erro, 429) && tentativa < MAX_RETRIES_429) {
          const esperaMs = this.calcularEspera(erro, tentativa)
          this.logger.warn(
            `429 (rate limit) do Mercado Livre — tentativa ${tentativa + 1}/${MAX_RETRIES_429}, ` +
              `aguardando ${esperaMs}ms`,
          )
          await this.dormir(esperaMs)
          tentativa++
          continue
        }
        throw erro
      }
    }
  }

  /**
   * Calcula o tempo de espera para retry de 429.
   * Respeita Retry-After (segundos) quando presente; senão, backoff exponencial.
   */
  private calcularEspera(erro: unknown, tentativa: number): number {
    const retryAfter = this.lerRetryAfter(erro)
    if (retryAfter !== null) {
      return Math.min(retryAfter * 1000, BACKOFF_MAX_MS)
    }
    return Math.min(BACKOFF_BASE_MS * 2 ** tentativa, BACKOFF_MAX_MS)
  }

  /**
   * Lê o header Retry-After (em segundos) de uma resposta de erro, se houver.
   */
  private lerRetryAfter(erro: unknown): number | null {
    if (!axios.isAxiosError(erro) || !erro.response) return null
    const header = erro.response.headers?.['retry-after']
    if (header === undefined || header === null) return null
    const segundos = Number(Array.isArray(header) ? header[0] : header)
    return Number.isFinite(segundos) && segundos >= 0 ? segundos : null
  }

  /**
   * Testa se um erro Axios tem determinado status HTTP.
   */
  private eStatus(erro: unknown, status: number): boolean {
    return (
      axios.isAxiosError(erro) &&
      Boolean(erro.response) &&
      (erro as AxiosError).response!.status === status
    )
  }

  /**
   * Sleep utilitário (Promise-based) para o backoff.
   */
  private dormir(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
