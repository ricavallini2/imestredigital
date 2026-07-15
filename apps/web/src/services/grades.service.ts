import api from '@/lib/api';
import type { Grade, GradeDto, FiltrosGrade, RespostaPaginada } from '@/types';

/**
 * Normaliza uma grade vinda do backend garantindo que `tamanhos` seja sempre um
 * array ordenado por `ordem` e que `ativa` seja booleano.
 */
function normalizarGrade(g: unknown): Grade {
  const d = (g ?? {}) as Record<string, unknown>;
  const tamanhos = Array.isArray(d.tamanhos)
    ? [...(d.tamanhos as Grade['tamanhos'])].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
    : [];
  return {
    id: String(d.id ?? ''),
    nome: String(d.nome ?? ''),
    descricao: (d.descricao as string | undefined) ?? undefined,
    ativa: d.ativa !== false,
    tamanhos,
    criadoEm: d.criadoEm as string | undefined,
    atualizadoEm: d.atualizadoEm as string | undefined,
  };
}

/**
 * Normaliza o envelope de paginação recebido do catalog-service para o formato
 * canônico PLANO da Fase 0: `{ dados, total, pagina, limite, totalPaginas }`.
 *
 * Tolerante a formatos legados (`{ dados, paginacao }`, `{ dados, meta }`) e ao
 * caso de o backend retornar um array puro.
 */
function normalizarPaginacao(data: unknown, filtros?: FiltrosGrade): RespostaPaginada<Grade> {
  if (Array.isArray(data)) {
    return {
      dados: data.map(normalizarGrade),
      total: data.length,
      pagina: filtros?.pagina ?? 1,
      limite: filtros?.itensPorPagina ?? data.length,
      totalPaginas: 1,
    };
  }

  const d = (data ?? {}) as Record<string, unknown>;
  const dados = ((d.dados as unknown[]) ?? []).map(normalizarGrade);
  const fonte = (d.paginacao ?? d.meta ?? d) as Record<string, unknown>;

  const limite =
    (fonte.limite as number) ?? (fonte.itensPorPagina as number) ?? filtros?.itensPorPagina ?? 20;
  const total = (fonte.total as number) ?? dados.length;
  const pagina = (fonte.pagina as number) ?? filtros?.pagina ?? 1;
  const totalPaginas =
    (fonte.totalPaginas as number) ?? (limite > 0 ? Math.ceil(total / limite) : 1);

  return { dados, total, pagina, limite, totalPaginas };
}

/**
 * Converte o DTO da UI para o payload do backend na FRONTEIRA da API.
 * O catalog-service espera `tamanhos: string[]` (na ordem de exibição);
 * a UI trabalha com objetos `{ valor, ordem }`. A tradução aqui evita o
 * 400 "Cada tamanho deve ser um texto" sem espalhar o shape do backend
 * pelas telas.
 */
function paraPayloadBackend(dto: Partial<GradeDto>): Record<string, unknown> {
  const { tamanhos, ...resto } = dto;
  if (!tamanhos) return resto;
  const valores = [...tamanhos]
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
    .map((t) => (typeof t === 'string' ? t : t.valor))
    .filter(Boolean);
  return { ...resto, tamanhos: valores };
}

export const gradesService = {
  /** Lista grades do tenant (envelope paginado canônico). */
  listar: async (filtros?: FiltrosGrade): Promise<RespostaPaginada<Grade>> => {
    const { data } = await api.get('/v1/grades', { params: filtros });
    return normalizarPaginacao(data, filtros);
  },

  buscarPorId: async (id: string): Promise<Grade> => {
    const { data } = await api.get(`/v1/grades/${id}`);
    return normalizarGrade(data);
  },

  criar: async (dto: GradeDto): Promise<Grade> => {
    const { data } = await api.post('/v1/grades', paraPayloadBackend(dto));
    return normalizarGrade(data);
  },

  atualizar: async (id: string, dto: Partial<GradeDto>): Promise<Grade> => {
    const { data } = await api.put(`/v1/grades/${id}`, paraPayloadBackend(dto));
    return normalizarGrade(data);
  },

  /** Soft delete via flag `ativa` no backend. */
  remover: async (id: string): Promise<void> => {
    await api.delete(`/v1/grades/${id}`);
  },
};
