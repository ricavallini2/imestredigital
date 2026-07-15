import api from '@/lib/api';
import type { Produto, FiltrosProduto, RespostaPaginada } from '@/types';

/** Converte Decimal/string/number vindo do backend em `number`, ou `undefined`. */
function paraNumero(v: unknown): number | undefined {
  if (v === null || v === undefined || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Normaliza um produto do catalog-service para o shape que a UI espera.
 *
 * O backend catalog devolve `{ precoVenda, precoCusto, precoPromocional }` como
 * strings Decimal e NÃO envia `preco`, `margem`/`margemLucro` nem `estoque` (o
 * saldo vive no inventory-service). Aqui derivamos:
 *   - `preco` ← precoVenda (Number), com fallback ao shape legado do mock
 *   - `precoCusto`/`precoPromocional` coeridos a Number
 *   - `margem`/`margemLucro` = ((precoVenda - precoCusto) / precoVenda) * 100
 *
 * A margem é sobre o PREÇO DE VENDA (markup do faturamento), 1 casa decimal.
 * `estoque` é resolvido à parte pelas telas (cruzando com /v1/estoque/resumo).
 */
function normalizarProduto(p: any): Produto {
  const preco = paraNumero(p.precoVenda) ?? paraNumero(p.preco) ?? 0;
  const precoCusto = paraNumero(p.precoCusto);
  const precoPromocional = paraNumero(p.precoPromocional);
  // Aceita margem já calculada pelo mock legado; senão deriva de venda/custo.
  const margem =
    paraNumero(p.margem) ??
    paraNumero(p.margemLucro) ??
    (preco > 0 ? Math.round(((preco - (precoCusto ?? 0)) / preco) * 1000) / 10 : 0);

  return {
    ...p,
    preco,
    precoCusto,
    precoPromocional,
    margem,
    margemLucro: margem,
    // O catalog usa `gtin`; a UI lê `ean`. Mantém `ean` legado se já vier.
    ean: p.ean ?? p.gtin ?? undefined,
    status: (p.status?.toUpperCase() ?? 'ATIVO') as Produto['status'],
    categoria: typeof p.categoria === 'object' ? p.categoria?.nome : p.categoria,
    marca: typeof p.marca === 'object' ? p.marca?.nome : p.marca,
    imagens: p.imagens?.map((img: any) => img.url ?? img) ?? [],
  };
}

/**
 * Normaliza o envelope de paginação recebido do backend para o formato
 * canônico PLANO da Fase 0: `{ dados, total, pagina, limite, totalPaginas }`.
 *
 * Aceita, de forma tolerante, formatos legados: o aninhado `{ dados, paginacao }`
 * e `{ dados, meta: { total, pagina, itensPorPagina, totalPaginas } }`.
 */
function normalizarPaginacao(data: any, filtros?: FiltrosProduto): RespostaPaginada<Produto> {
  const dados = (data?.dados ?? []).map(normalizarProduto);
  const fonte = data?.paginacao ?? data?.meta ?? data ?? {};

  const limite =
    fonte.limite ?? fonte.itensPorPagina ?? filtros?.limite ?? filtros?.itensPorPagina ?? 20;
  const total = fonte.total ?? dados.length;
  const pagina = fonte.pagina ?? filtros?.pagina ?? 1;
  const totalPaginas = fonte.totalPaginas ?? (limite > 0 ? Math.ceil(total / limite) : 1);

  return { dados, total, pagina, limite, totalPaginas };
}

export const produtosService = {
  listar: async (filtros?: FiltrosProduto): Promise<RespostaPaginada<Produto>> => {
    const params = filtros
      ? { ...filtros, itensPorPagina: filtros.limite ?? filtros.itensPorPagina, limite: undefined }
      : undefined;
    const { data } = await api.get('/v1/produtos', { params });
    return normalizarPaginacao(data, filtros);
  },

  buscarPorId: async (id: string): Promise<Produto> => {
    const { data } = await api.get(`/v1/produtos/${id}`);
    return normalizarProduto(data);
  },

  obterEstatisticas: async () => {
    const { data } = await api.get('/v1/produtos/estatisticas');
    return data;
  },

  criar: async (dto: Partial<Produto>): Promise<Produto> => {
    const { data } = await api.post('/v1/produtos', dto);
    return normalizarProduto(data);
  },

  atualizar: async (id: string, dto: Partial<Produto>): Promise<Produto> => {
    const { data } = await api.put(`/v1/produtos/${id}`, dto);
    return normalizarProduto(data);
  },

  remover: async (id: string): Promise<void> => {
    await api.delete(`/v1/produtos/${id}`);
  },

  analisarComIA: async (id: string) => {
    const { data } = await api.get(`/v1/produtos/${id}/analisar-ia`);
    return data as {
      scoreGeral: number;
      perfil: string;
      recomendacoes: string[];
      alerta: string | null;
      metricas: {
        giroEstoque: number;
        margemLiquida: number;
        estoqueStatus: string;
        diasSemVenda: string;
        ticketMedio: number;
        receitaMensal: number;
      };
      precoSugeridoIA: number;
      ncmSugerido: string;
      geradoEm: string;
    };
  },
};
