/**
 * ═══════════════════════════════════════════════════════════════
 * Tipos Comuns Compartilhados
 * ═══════════════════════════════════════════════════════════════
 * Interfaces e tipos usados por múltiplos microserviços.
 */

/** Resposta padrão da API */
export interface RespostaAPI<T = any> {
  /** Dados da resposta */
  dados: T;
  /** Mensagem de sucesso/info (opcional) */
  mensagem?: string;
}

/** Resposta paginada da API */
export interface RespostaPaginada<T = any> {
  /** Lista de itens da página atual */
  dados: T[];
  /** Metadados de paginação */
  meta: MetaPaginacao;
}

/** Metadados de paginação */
export interface MetaPaginacao {
  /** Total de registros */
  total: number;
  /** Página atual */
  pagina: number;
  /** Itens por página */
  itensPorPagina: number;
  /** Total de páginas */
  totalPaginas: number;
}

/** Parâmetros de paginação comuns */
export interface ParametrosPaginacao {
  pagina?: number;
  itensPorPagina?: number;
  ordenarPor?: string;
  direcao?: 'asc' | 'desc';
}

/** Erro padronizado da API */
export interface ErroAPI {
  /** Código HTTP */
  statusCode: number;
  /** Mensagem de erro legível */
  mensagem: string;
  /** Detalhes adicionais (validação, etc.) */
  detalhes?: Record<string, any>;
  /** Timestamp do erro */
  timestamp: string;
  /** Path da requisição */
  path: string;
}

/** Evento de domínio base (publicado no Kafka) */
export interface EventoDominio<T = any> {
  /** ID único do evento (UUID) */
  id: string;
  /** Tipo do evento (ex: 'produto.criado', 'pedido.pago') */
  tipo: string;
  /** ID do tenant que gerou o evento */
  tenantId: string;
  /** Dados do evento */
  dados: T;
  /** ID do usuário que causou o evento */
  usuarioId?: string;
  /** Timestamp de criação */
  criadoEm: string;
  /** Versão do schema do evento */
  versao: number;
}

/** Resultado de operação de auditoria */
export interface RegistroAuditoria {
  id: string;
  tenantId: string;
  usuarioId: string;
  acao: string;
  entidade: string;
  entidadeId: string;
  dadosAnteriores?: Record<string, any>;
  dadosNovos?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  criadoEm: string;
}
