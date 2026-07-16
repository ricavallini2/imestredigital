import api from '@/lib/api';

/**
 * Cadastro de usuários e permissões (auth-service).
 * O RBAC é módulo × ação (visualizar/incluir/editar/excluir); o cargo apenas
 * define o template inicial e pode ser ajustado por usuário.
 */

export type CargoUsuario =
  | 'admin'
  | 'gerente'
  | 'vendedor'
  | 'caixa'
  | 'estoquista'
  | 'financeiro'
  | 'funcionario'
  | 'operador'
  | 'visualizador';

export type StatusUsuario = 'ativo' | 'inativo' | 'bloqueado' | 'pendente';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: CargoUsuario;
  status: StatusUsuario;
  podeLiberarVenda: boolean;
  ultimoLogin?: string | null;
  criadoEm?: string;
}

export interface PermissaoModulo {
  modulo: string;
  visualizar: boolean;
  incluir: boolean;
  editar: boolean;
  excluir: boolean;
}

export interface UsuarioDetalhe extends Usuario {
  permissoes: PermissaoModulo[];
}

export interface ModuloCatalogo {
  chave: string;
  label: string;
  grupo: string;
}

export interface CriarUsuarioDTO {
  nome: string;
  email: string;
  cargo?: CargoUsuario;
  senha?: string;
  podeLiberarVenda?: boolean;
}

export interface AtualizarUsuarioDTO {
  nome?: string;
  cargo?: CargoUsuario;
  status?: StatusUsuario;
  senha?: string;
  podeLiberarVenda?: boolean;
  /** Ao trocar o cargo, redefine as permissões pelo template do novo cargo. */
  reaplicarTemplateCargo?: boolean;
}

export const CARGO_LABELS: Record<CargoUsuario, string> = {
  admin: 'Administrador',
  gerente: 'Gerente',
  vendedor: 'Vendedor',
  caixa: 'Caixa',
  estoquista: 'Estoquista',
  financeiro: 'Financeiro',
  funcionario: 'Funcionário',
  operador: 'Operador',
  visualizador: 'Visualizador',
};

/** Cargos oferecidos na criação (operador é legado — não aparece na lista). */
export const CARGOS_SELECIONAVEIS: CargoUsuario[] = [
  'admin',
  'gerente',
  'vendedor',
  'caixa',
  'estoquista',
  'financeiro',
  'funcionario',
  'visualizador',
];

export const STATUS_LABELS: Record<StatusUsuario, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  bloqueado: 'Bloqueado',
  pendente: 'Pendente',
};

/** Backend devolve cargo/status em UPPERCASE no Prisma e lowercase no login. */
function normalizar(u: any): Usuario {
  return {
    id: u.id,
    nome: u.nome ?? '',
    email: u.email ?? '',
    cargo: String(u.cargo ?? 'funcionario').toLowerCase() as CargoUsuario,
    status: String(u.status ?? 'ativo').toLowerCase() as StatusUsuario,
    podeLiberarVenda: u.podeLiberarVenda === true,
    ultimoLogin: u.ultimoLogin ?? null,
    criadoEm: u.criadoEm,
  };
}

function normalizarDetalhe(u: any): UsuarioDetalhe {
  return {
    ...normalizar(u),
    permissoes: ((u.permissoes ?? []) as any[]).map((p) => ({
      modulo: p.modulo,
      visualizar: p.visualizar === true,
      incluir: p.incluir === true,
      editar: p.editar === true,
      excluir: p.excluir === true,
    })),
  };
}

export const usuariosService = {
  listar: async (): Promise<Usuario[]> => {
    const { data } = await api.get('/v1/usuarios');
    return ((data?.dados ?? []) as any[]).map(normalizar);
  },

  /** Catálogo de módulos/ações — a matriz da tela é montada a partir do backend. */
  obterCatalogo: async (): Promise<{ modulos: ModuloCatalogo[]; acoes: string[] }> => {
    const { data } = await api.get('/v1/usuarios/permissoes/modulos');
    return { modulos: data?.modulos ?? [], acoes: data?.acoes ?? [] };
  },

  /** Perfil + permissões do usuário logado. */
  obterMe: async (): Promise<UsuarioDetalhe> => {
    const { data } = await api.get('/v1/usuarios/me');
    return normalizarDetalhe(data);
  },

  obterPorId: async (id: string): Promise<UsuarioDetalhe> => {
    const { data } = await api.get(`/v1/usuarios/${id}`);
    return normalizarDetalhe(data);
  },

  /** Cria o usuário; senhaGerada só volta quando a senha não foi informada. */
  criar: async (
    dto: CriarUsuarioDTO,
  ): Promise<{ usuario: Usuario; senhaGerada: string | null }> => {
    const { data } = await api.post('/v1/usuarios', dto);
    return { usuario: normalizar(data?.usuario ?? {}), senhaGerada: data?.senhaGerada ?? null };
  },

  atualizar: async (id: string, dto: AtualizarUsuarioDTO): Promise<UsuarioDetalhe> => {
    const { data } = await api.put(`/v1/usuarios/${id}`, dto);
    return normalizarDetalhe(data);
  },

  definirPermissoes: async (id: string, permissoes: PermissaoModulo[]): Promise<UsuarioDetalhe> => {
    const { data } = await api.put(`/v1/usuarios/${id}/permissoes`, { permissoes });
    return normalizarDetalhe(data);
  },

  /** Desativa (soft delete). */
  remover: async (id: string): Promise<void> => {
    await api.delete(`/v1/usuarios/${id}`);
  },
};
