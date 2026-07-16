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
    /** SKU e nome do item — exigidos pelo contrato real do order-service. */
    sku?: string;
    nome?: string;
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

/** Janelas aceitas pelo `PeriodoEstatisticasDto` do order-service. */
export type PeriodoEstatisticas = 'hoje' | 'semana' | 'mes' | 'ano';

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

/**
 * Normaliza um pedido do shape REAL do order-service para o que as telas leem:
 *   cliente ← clienteNome · valor ← Number(valorTotal) · canal ← canalOrigem ·
 *   itens (nas listas) ← contagem. Sem isso a lista de pedidos crasha
 *   (undefined.toLocaleString) ao receber dados reais em produção.
 */
function normalizarPedidoLista(p: any): any {
  const itens =
    typeof p.itens === 'number'
      ? p.itens
      : Array.isArray(p.itens)
        ? p.itens.length
        : (p._count?.itens ?? 0);
  return {
    ...p,
    cliente: p.cliente ?? p.clienteNome ?? 'Consumidor',
    valor: Number(p.valor ?? p.valorTotal) || 0,
    itens,
    canal: p.canal ?? p.canalOrigem ?? 'OUTROS',
    criadoEm: p.criadoEm ?? p.data ?? null,
  };
}

export const pedidosService = {
  listar: async (filtros?: FiltrosPedido): Promise<RespostaPaginada<Pedido>> => {
    const { data } = await api.get('/v1/pedidos', { params: filtros });
    // Envelope canônico { dados, ... } ou array puro (mock legado).
    if (Array.isArray(data))
      return {
        dados: data.map(normalizarPedidoLista),
        total: data.length,
        pagina: 1,
        limite: data.length,
        totalPaginas: 1,
      } as any;
    return { ...data, dados: (data?.dados ?? []).map(normalizarPedidoLista) };
  },

  buscarPorId: async (id: string): Promise<Pedido> => {
    const { data } = await api.get(`/v1/pedidos/${id}`);
    // No detalhe preserva `itens` como ARRAY (a tela itera os itens).
    return {
      ...data,
      cliente: data?.cliente ?? data?.clienteNome ?? 'Consumidor',
      valor: Number(data?.valor ?? data?.valorTotal) || 0,
      canal: data?.canal ?? data?.canalOrigem ?? 'OUTROS',
      itens: Array.isArray(data?.itens) ? data.itens : [],
    } as any;
  },

  /**
   * KPIs de pedidos da janela `periodo`.
   *
   * `periodo` é EXPLÍCITO e default 'mes' de propósito: sem ele o
   * `PeriodoEstatisticasDto` não define nada, o switch do order-service cai no
   * `default:` e calcula 30 DIAS CORRIDOS — uma janela diferente da que o
   * Dashboard pede ('mes', mês-calendário). As duas telas mostravam "a receita"
   * a partir do mesmo endpoint e discordavam por medirem períodos distintos.
   * Só os valores do enum do backend valem: hoje | semana | mes | ano.
   *
   * Aceita os três shapes que a rota pode devolver: o real do order-service
   * (`totalPedidos`/`totalVendas`) e o do mock do Next (`pedidos30d`/
   * `receita30d`) — `pedidos`/`receita` cobrem uma fonte já normalizada.
   */
  obterEstatisticas: async (
    periodo: PeriodoEstatisticas = 'mes',
  ): Promise<EstatisticasPedidos> => {
    const { data } = await api.get('/v1/pedidos/estatisticas/dashboard', {
      params: { periodo },
    });
    return {
      pedidos: Number(data?.pedidos ?? data?.totalPedidos ?? data?.pedidos30d) || 0,
      receita: Number(data?.receita ?? data?.totalVendas ?? data?.receita30d) || 0,
      ticketMedio: Number(data?.ticketMedio) || 0,
      porStatus: data?.porStatus ?? {},
    };
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

  /**
   * Cria o pedido traduzindo o shape da UI para o contrato REAL do
   * order-service (CriarPedidoDto): itens[{produtoId, sku, titulo, quantidade,
   * valorUnitario, valorDesconto, variacaoId}], clienteNome, origem etc.
   * O pagamento NÃO entra aqui — é registrado à parte via registrarPagamento
   * (fluxo do caixa), deixando o pedido "em aberto" quando quem vende não é caixa.
   */
  criar: async (dto: CriarPedidoDTO): Promise<Pedido> => {
    const observacaoPartes = [
      dto.vendedor ? `Vendedor: ${dto.vendedor}` : '',
      dto.troco && dto.troco > 0 ? `Troco: R$ ${dto.troco.toFixed(2)}` : '',
      dto.observacoes ?? '',
    ].filter(Boolean);

    const payload = {
      origem: 'LOJA_FISICA',
      canalOrigem: dto.canal ?? 'BALCAO',
      clienteId: dto.clienteId || undefined,
      clienteNome: dto.cliente || 'Consumidor Final',
      itens: dto.itensList.map((i) => ({
        produtoId: i.produtoId,
        variacaoId: i.variacaoId || undefined,
        sku: i.sku ?? '',
        titulo: [i.nome ?? 'Item', i.variacao].filter(Boolean).join(' — '),
        quantidade: i.quantidade,
        valorUnitario: i.precoUnitario ?? 0,
        valorDesconto: i.desconto || undefined,
      })),
      metodoPagamento: dto.formasPagamento?.[0]?.forma ?? dto.formaPagamento,
      parcelas: dto.formasPagamento?.[0]?.parcelas ?? dto.parcelas,
      valorDesconto: dto.desconto || undefined,
      valorFrete: dto.frete || undefined,
      observacao: observacaoPartes.length ? observacaoPartes.join(' · ') : undefined,
    };
    const { data } = await api.post('/v1/pedidos', payload);
    return data;
  },

  /**
   * Registra o RECEBIMENTO de um pedido (fluxo do caixa).
   * POST /v1/pagamentos/pedido/:pedidoId com status PAGO — o order-service
   * atualiza o statusPagamento do pedido e publica o evento de captura.
   */
  registrarPagamento: async (
    pedidoId: string,
    pgto: { forma: string; valor: number; parcelas?: number; descricao?: string },
  ): Promise<void> => {
    await api.post(`/v1/pagamentos/pedido/${pedidoId}`, {
      tipo: pgto.forma,
      status: 'PAGO',
      valor: pgto.valor,
      ...(pgto.parcelas && pgto.parcelas > 1 ? { parcelas: pgto.parcelas } : {}),
      // Forma cadastrada usada (ex: "Amex Crédito 02x") — rastreável p/ conciliação.
      ...(pgto.descricao ? { dadosGateway: { formaPagamento: pgto.descricao } } : {}),
    });
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
