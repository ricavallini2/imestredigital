/**
 * ═══════════════════════════════════════════════════════════════
 * Tipos de Autenticação e Autorização
 * ═══════════════════════════════════════════════════════════════
 * Interfaces compartilhadas entre todos os microserviços para
 * autenticação, tokens JWT e contexto de tenant.
 */

/** Cargos disponíveis no sistema */
export enum Cargo {
  ADMIN = 'admin',
  GERENTE = 'gerente',
  OPERADOR = 'operador',
  VISUALIZADOR = 'visualizador',
}

/** Status possíveis de um usuário */
export enum StatusUsuario {
  ATIVO = 'ativo',
  PENDENTE = 'pendente',
  INATIVO = 'inativo',
  REMOVIDO = 'removido',
}

/** Status possíveis de um tenant */
export enum StatusTenant {
  ATIVO = 'ativo',
  SUSPENSO = 'suspenso',
  CANCELADO = 'cancelado',
}

/** Planos disponíveis */
export enum Plano {
  STARTER = 'starter',
  GROWTH = 'growth',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

/** Payload decodificado do JWT (presente em req.user) */
export interface UsuarioAutenticado {
  /** ID do usuário (UUID) */
  usuarioId: string;
  /** ID do tenant/empresa (UUID) */
  tenantId: string;
  /** Email do usuário */
  email: string;
  /** Cargo/role do usuário */
  cargo: Cargo;
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
