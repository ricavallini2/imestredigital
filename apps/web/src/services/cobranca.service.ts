import api from '@/lib/api';

export type StatusTitulo = 'EM_ABERTO' | 'EM_COBRANCA' | 'NEGOCIANDO' | 'ACORDO' | 'PAGO' | 'PERDIDO';
export type PrioridadeTitulo = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type TipoAcao = 'WHATSAPP' | 'EMAIL' | 'SMS' | 'LIGACAO';

export interface TituloCobranca {
  id: string; lancamentoId: string; clienteId: string; clienteNome: string;
  clienteTelefone: string; clienteEmail: string; descricao: string;
  valor: number; dataVencimento: string; diasAtraso: number;
  status: StatusTitulo; prioridade: PrioridadeTitulo; tentativas: number;
  ultimaAcaoEm: string | null; canalUltimaAcao: string | null;
  observacao: string | null; scoreIA: number;
}

export interface AcaoCobranca {
  id: string; tituloId: string; clienteNome: string; tipo: TipoAcao;
  mensagem: string; status: 'ENVIADO' | 'ENTREGUE' | 'LIDO' | 'RESPONDIDO' | 'FALHOU';
  automatica: boolean; criadoEm: string;
  valor?: number; dataVencimento?: string; diasAtraso?: number;
}

export interface Parcela { numero: number; valor: number; vencimento: string; pago: boolean; pagoEm: string | null; }
export interface Acordo {
  id: string; tituloId: string; clienteId: string; clienteNome: string;
  valorOriginal: number; descontoAplicado: number; valorFinal: number;
  numeroParcelas: number; parcelas: Parcela[];
  status: 'ATIVO' | 'CUMPRIDO' | 'QUEBRADO'; criadoEm: string; observacao: string | null;
}

export interface RegraCobranca { diasAtraso: number; canal: TipoAcao; template: string; ativo: boolean; }
export interface ConfiguracaoCobranca {
  ativo: boolean; webhookN8n: string; callbackUrl: string;
  regras: RegraCobranca[]; descontoMaximo: number; parcelasMaximas: number;
  horarioInicio: string; horarioFim: string; pausarFimDeSemana: boolean;
}

export interface StatsCobranca {
  totalVencido: number; emCobranca: number; negociando: number; acordo: number;
  acordosAtivos: number; taxaRecuperacao: number; previsaoRecuperacao: number;
  mediaDiasAtraso: number; porPrioridade: Record<string, number>;
  topCriticos: (TituloCobranca)[]; pagos: number; perdidos: number; totalTitulos: number;
}

export interface FiltrosTitulos { status?: string; prioridade?: string; diasMin?: number; diasMax?: number; busca?: string; }
export interface FiltrosHistorico { tituloId?: string; tipo?: string; status?: string; dataInicio?: string; dataFim?: string; busca?: string; }
export interface AcaoDto { tipo: TipoAcao; mensagem: string; automatica?: boolean; }
export interface NegociarDto { descontoAplicado: number; numeroParcelas: number; primeiroVencimento?: string; observacao?: string; }
export interface DisparadorDto { ids?: string[]; filtro?: { prioridade?: string; diasMin?: number }; }

export interface RespostaPaginada<T> { dados: T[]; total: number; }

const BASE = '/v1/cobranca';

export const cobrancaService = {
  async listarTitulos(filtros?: FiltrosTitulos): Promise<RespostaPaginada<TituloCobranca>> {
    const { data } = await api.get(BASE, { params: filtros });
    return data;
  },
  async criarTitulo(dto: Partial<TituloCobranca>): Promise<TituloCobranca> {
    const { data } = await api.post(BASE, dto);
    return data;
  },
  async obterStats(): Promise<StatsCobranca> {
    const { data } = await api.get(`${BASE}/stats`);
    return data;
  },
  async registrarAcao(tituloId: string, dto: AcaoDto): Promise<AcaoCobranca> {
    const { data } = await api.post(`${BASE}/${tituloId}/acao`, dto);
    return data;
  },
  async negociar(tituloId: string, dto: NegociarDto): Promise<Acordo> {
    const { data } = await api.post(`${BASE}/${tituloId}/negociar`, dto);
    return data;
  },
  async listarAcordos(filtros?: { status?: string; clienteId?: string }): Promise<RespostaPaginada<Acordo>> {
    const { data } = await api.get(`${BASE}/acordos`, { params: filtros });
    return data;
  },
  async pagarParcela(acordoId: string, numeroParcela: number): Promise<Acordo> {
    const { data } = await api.post(`${BASE}/acordos/${acordoId}/pagar`, { numeroParcela });
    return data;
  },
  async obterConfiguracoes(): Promise<ConfiguracaoCobranca> {
    const { data } = await api.get(`${BASE}/configuracoes`);
    return data;
  },
  async atualizarConfiguracoes(dto: Partial<ConfiguracaoCobranca>): Promise<ConfiguracaoCobranca> {
    const { data } = await api.put(`${BASE}/configuracoes`, dto);
    return data;
  },
  async disparar(dto: DisparadorDto): Promise<{ disparados: number; acoes: AcaoCobranca[]; erroWebhook: boolean; webhookUrl: string }> {
    const { data } = await api.post(`${BASE}/disparar`, dto);
    return data;
  },
  async listarHistorico(filtros?: FiltrosHistorico): Promise<RespostaPaginada<AcaoCobranca>> {
    const { data } = await api.get(`${BASE}/historico`, { params: filtros });
    return data;
  },
};
