import api from '@/lib/api';
import type { Pedido, EstatisticasPedidos, FiltrosPedido, RespostaPaginada } from '@/types';

export interface CriarPedidoDTO {
  clienteId?: string;
  cliente?: string;
  canal?: string;
  itensList: {
    produtoId: string;
    quantidade: number;
    precoUnitario?: number;
    desconto?: number;
    variacaoId?: string;
    variacao?: string;
  }[];
  desconto?: number;
  frete?: number;
  formaPagamento?: string;
  formasPagamento?: { forma: string; valor: number; parcelas?: number }[];
  parcelas?: number;
  troco?: number;
  enderecoEntrega?: string;
  observacoes?: string;
  vendedor?: string;
}

export interface AtualizarStatusDTO {
  status: string;
  rastreio?: string;
  transportadora?: string;
}

export interface VariacaoCatalogo {
  id: string;
  tipo: string;
  valor: string;
  sku?: string;
  preco: number; // preço efetivo da variação (já com fallback ao preço base)
  estoque: number;
}

export interface CatalogoPedidoResponse {
  produtos: {
    id: string;
    nome: string;
    sku: string;
    preco: number;
    estoque: number;
    categoria?: string;
    marca?: string;
    variacoes: VariacaoCatalogo[];
  }[];
  clientes: { id: string; nome: string; email: string; telefone: string; tipo: string }[];
}

export const pedidosService = {
  listar: async (filtros?: FiltrosPedido): Promise<RespostaPaginada<Pedido>> => {
    const { data } = await api.get('/v1/pedidos', { params: filtros });
    return data;
  },

  buscarPorId: async (id: string): Promise<Pedido> => {
    const { data } = await api.get(`/v1/pedidos/${id}`);
    return data;
  },

  obterEstatisticas: async (): Promise<EstatisticasPedidos> => {
    const { data } = await api.get('/v1/pedidos/estatisticas/dashboard');
    return data;
  },

  /**
   * Catálogo do PDV/venda composto de fontes REAIS:
   *   - /v1/produtos (catalog, com variações via incluirVariacoes)
   *   - /v1/estoque/resumo (inventory — saldo disponível por produto/SKU)
   *   - /v1/clientes (customer — opcional; falha não bloqueia a venda)
   * O antigo GET /v1/pedidos/catalogo era um mock do Next e não existe no
   * order-service — em produção retornava 500 e o PDV ficava vazio.
   */
  obterCatalogo: async (): Promise<CatalogoPedidoResponse> => {
    const [prodRes, estoqueRes, clientesRes] = await Promise.all([
      api.get('/v1/produtos', {
        params: { itensPorPagina: 100, status: 'ATIVO', incluirVariacoes: true },
      }),
      api.get('/v1/estoque/resumo').catch(() => ({ data: { itens: [] } })),
      // customer-service pagina com `limite` (não `itensPorPagina`).
      api.get('/v1/clientes', { params: { limite: 100 } }).catch(() => ({ data: { dados: [] } })),
    ]);

    // Saldo disponível agregado por produto e por SKU (variação).
    const itensEstoque: any[] = estoqueRes.data?.itens ?? [];
    const estoquePorProduto = new Map<string, number>();
    const estoquePorSku = new Map<string, number>();
    for (const it of itensEstoque) {
      const disp = Number(it.disponivel) || 0;
      if (it.produtoId)
        estoquePorProduto.set(it.produtoId, (estoquePorProduto.get(it.produtoId) ?? 0) + disp);
      if (it.sku) {
        const k = String(it.sku).toUpperCase();
        estoquePorSku.set(k, (estoquePorSku.get(k) ?? 0) + disp);
      }
    }

    const produtos = ((prodRes.data?.dados ?? []) as any[]).map((p) => {
      const precoBase = Number(p.precoVenda ?? p.preco) || 0;
      const estoqueProduto = estoquePorProduto.get(p.id) ?? 0;
      const variacoes: VariacaoCatalogo[] = ((p.variacoes ?? []) as any[]).map((v) => {
        const skuVar = v.sku ? String(v.sku).toUpperCase() : '';
        return {
          id: v.id,
          tipo: v.atributos?.[0]?.nome ?? v.tipo ?? 'Variação',
          valor: v.valor ?? v.nome ?? ((v.atributos ?? []) as any[]).map((a) => a.valor).join(' '),
          sku: v.sku,
          preco: Number(v.precoVenda ?? v.preco) || precoBase,
          // Saldo específico da variação quando o inventário conhece o SKU dela;
          // senão herda o saldo do produto (inventário ainda por produto).
          estoque: estoquePorSku.has(skuVar) ? estoquePorSku.get(skuVar)! : estoqueProduto,
        };
      });
      return {
        id: p.id,
        nome: p.nome,
        sku: p.sku,
        preco: precoBase,
        estoque: estoqueProduto,
        categoria: typeof p.categoria === 'object' ? p.categoria?.nome : p.categoria,
        marca: typeof p.marca === 'object' ? p.marca?.nome : p.marca,
        variacoes,
      };
    });

    const clientes = ((clientesRes.data?.dados ?? []) as any[]).map((c) => ({
      id: c.id,
      nome: c.nome ?? c.razaoSocial ?? '',
      email: c.email ?? '',
      telefone: c.telefone ?? '',
      tipo: c.tipo ?? '',
    }));

    return { produtos, clientes };
  },

  criar: async (dto: CriarPedidoDTO): Promise<Pedido> => {
    const { data } = await api.post('/v1/pedidos', dto);
    return data;
  },

  confirmar: async (id: string): Promise<Pedido> => {
    const { data } = await api.patch(`/v1/pedidos/${id}/confirmar`);
    return data;
  },

  // Cancelamento trafega pelo endpoint unificado de transição de status
  // (o backend expõe PATCH /:id/status como rota de compatibilidade que
  // aciona a máquina de estados; a rota semântica de cancelar é DELETE).
  cancelar: async (id: string, motivo?: string): Promise<Pedido> => {
    const { data } = await api.patch(`/v1/pedidos/${id}/status`, { status: 'CANCELADO', motivo });
    return data;
  },

  atualizarStatus: async (id: string, dto: AtualizarStatusDTO): Promise<Pedido> => {
    const { data } = await api.patch(`/v1/pedidos/${id}/status`, dto);
    return data;
  },

  atualizar: async (id: string, dto: Partial<Pedido>): Promise<Pedido> => {
    const { data } = await api.put(`/v1/pedidos/${id}`, dto);
    return data;
  },
};
