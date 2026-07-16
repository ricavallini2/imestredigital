import api from '@/lib/api';

/**
 * Cadastro de formas de pagamento (order-service).
 * Ex: "Amex Crédito 02x" (CARTAO_CREDITO, bandeira Amex, 2 parcelas, taxa 4.29%).
 */

export type TipoFormaPagamento =
  | 'DINHEIRO'
  | 'PIX'
  | 'CARTAO_CREDITO'
  | 'CARTAO_DEBITO'
  | 'BOLETO'
  | 'TRANSFERENCIA'
  | 'OUTRO';

export interface FormaPagamento {
  id: string;
  descricao: string;
  tipo: TipoFormaPagamento;
  bandeira?: string | null;
  parcelas: number;
  taxaPct?: number | null;
  taxaFixa?: number | null;
  prazoRecebimentoDias?: number | null;
  ativa: boolean;
}

export interface FormaPagamentoDto {
  descricao: string;
  tipo: TipoFormaPagamento;
  bandeira?: string;
  parcelas?: number;
  taxaPct?: number;
  taxaFixa?: number;
  prazoRecebimentoDias?: number;
  ativa?: boolean;
}

export const TIPO_FORMA_LABELS: Record<TipoFormaPagamento, string> = {
  DINHEIRO: 'Dinheiro',
  PIX: 'PIX',
  CARTAO_CREDITO: 'Cartão de Crédito',
  CARTAO_DEBITO: 'Cartão de Débito',
  BOLETO: 'Boleto',
  TRANSFERENCIA: 'Transferência',
  OUTRO: 'Outro',
};

function normalizar(f: any): FormaPagamento {
  return {
    id: f.id,
    descricao: f.descricao ?? '',
    tipo: f.tipo ?? 'OUTRO',
    bandeira: f.bandeira ?? null,
    parcelas: Number(f.parcelas) || 1,
    taxaPct: f.taxaPct != null ? Number(f.taxaPct) : null,
    taxaFixa: f.taxaFixa != null ? Number(f.taxaFixa) : null,
    prazoRecebimentoDias: f.prazoRecebimentoDias != null ? Number(f.prazoRecebimentoDias) : null,
    ativa: f.ativa !== false,
  };
}

export const formasPagamentoService = {
  listar: async (filtros?: {
    tipo?: TipoFormaPagamento;
    ativa?: boolean;
  }): Promise<FormaPagamento[]> => {
    const { data } = await api.get('/v1/formas-pagamento', {
      params: { limite: 500, ...filtros },
    });
    return ((data?.dados ?? []) as any[]).map(normalizar);
  },

  criar: async (dto: FormaPagamentoDto): Promise<FormaPagamento> => {
    const { data } = await api.post('/v1/formas-pagamento', dto);
    return normalizar(data);
  },

  atualizar: async (id: string, dto: Partial<FormaPagamentoDto>): Promise<FormaPagamento> => {
    const { data } = await api.put(`/v1/formas-pagamento/${id}`, dto);
    return normalizar(data);
  },

  /** Soft delete (inativa). */
  remover: async (id: string): Promise<void> => {
    await api.delete(`/v1/formas-pagamento/${id}`);
  },
};
