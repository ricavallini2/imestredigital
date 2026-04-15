import api from '@/lib/api';
import type { Pedido, EstatisticasPedidos, FiltrosPedido, RespostaPaginada } from '@/types';

export interface CriarPedidoDTO {
  clienteId?: string;
  cliente?: string;
  canal?: string;
  itensList: { produtoId: string; quantidade: number; precoUnitario?: number; desconto?: number; variacaoId?: string; variacao?: string }[];
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
  preco: number;   // preço efetivo da variação (já com fallback ao preço base)
  estoque: number;
}

export interface CatalogoPedidoResponse {
  produtos: {
    id: string; nome: string; sku: string; preco: number; estoque: number;
    categoria?: string; marca?: string;
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

  obterCatalogo: async (): Promise<CatalogoPedidoResponse> => {
    const { data } = await api.get('/v1/pedidos/catalogo');
    return data;
  },

  criar: async (dto: CriarPedidoDTO): Promise<Pedido> => {
    const { data } = await api.post('/v1/pedidos', dto);
    return data;
  },

  confirmar: async (id: string): Promise<Pedido> => {
    const { data } = await api.patch(`/v1/pedidos/${id}/confirmar`);
    return data;
  },

  cancelar: async (id: string, motivo?: string): Promise<Pedido> => {
    const { data } = await api.patch(`/v1/pedidos/${id}/cancelar`, { motivo });
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
