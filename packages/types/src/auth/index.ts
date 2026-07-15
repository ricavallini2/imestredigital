/**
 * ═══════════════════════════════════════════════════════════════
 * Tipos de Autenticação e Autorização
 * ═══════════════════════════════════════════════════════════════
 * Interfaces compartilhadas entre todos os microserviços para
 * autenticação, tokens JWT e contexto de tenant.
 */

/**
 * Cargos disponíveis no sistema.
 * Valores UPPERCASE espelham o enum `CargoUsuario` do schema Prisma
 * (auth-service) — fonte da verdade. O payload JWT transporta o cargo
 * em lowercase (ver `JwtPayload.cargo`); a comparação de RBAC é
 * case-insensitive.
 */
export enum Cargo {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  OPERADOR = 'OPERADOR',
  VISUALIZADOR = 'VISUALIZADOR',
}

/**
 * Status possíveis de um usuário.
 * Espelha o enum `StatusUsuario` do schema Prisma (auth-service).
 */
export enum StatusUsuario {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  BLOQUEADO = 'BLOQUEADO',
  PENDENTE = 'PENDENTE',
  REMOVIDO = 'REMOVIDO',
}

/**
 * Status possíveis de um tenant.
 * Espelha o enum `StatusTenant` do schema Prisma (auth-service).
 */
export enum StatusTenant {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  SUSPENSO = 'SUSPENSO',
  TRIAL = 'TRIAL',
  CANCELADO = 'CANCELADO',
}

/**
 * Planos disponíveis.
 * Espelha o enum `PlanoTenant` do schema Prisma (auth-service).
 */
export enum Plano {
  STARTER = 'STARTER',
  PROFISSIONAL = 'PROFISSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

/** Payload decodificado do JWT (presente em req.user) */
export interface UsuarioAutenticado {
  /** ID do usuário (UUID) */
  usuarioId: string;
  /** ID do tenant/empresa (UUID) */
  tenantId: string;
  /** Email do usuário */
  email: string;
  /** Cargo/role do usuário — transportado em lowercase no JWT (ex.: 'admin') */
  cargo: string;
}

/** Payload codificado no JWT */
export interface JwtPayload {
  /** Subject: ID do usuário */
  sub: string;
  /** ID do tenant */
  tenantId: string;
  /** Email do usuário */
  email: string;
  /** Cargo do usuário */
  cargo: string;
  /** Issued at (timestamp) */
  iat?: number;
  /** Expiration (timestamp) */
  exp?: number;
}

/** Resposta do endpoint de login */
export interface RespostaLogin {
  usuario: {
    id: string;
    nome: string;
    email: string;
    cargo: string;
    tenant: {
      id: string;
      nome: string;
      plano: string;
    };
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/** Resposta do endpoint de registro */
export interface RespostaRegistro {
  mensagem: string;
  tenant: {
    id: string;
    nome: string;
    plano: string;
  };
  usuario: {
    id: string;
    nome: string;
    email: string;
    cargo: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/** Dados do tenant para contexto */
export interface DadosTenant {
  id: string;
  nome: string;
  cnpj?: string;
  plano: Plano;
  status: StatusTenant;
  limiteUsuarios: number;
  limitePedidosMes: number;
}
