// Interfaces
export interface TituloCobrancaMock {
  id: string;
  lancamentoId: string;
  clienteId: string;
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail: string;
  descricao: string;
  valor: number;
  dataVencimento: string; // ISO date string YYYY-MM-DD
  diasAtraso: number;
  status: 'EM_ABERTO' | 'EM_COBRANCA' | 'NEGOCIANDO' | 'ACORDO' | 'PAGO' | 'PERDIDO';
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  tentativas: number;
  ultimaAcaoEm: string | null;
  canalUltimaAcao: string | null;
  observacao: string | null;
}

export interface AcaoCobrancaMock {
  id: string;
  tituloId: string;
  clienteNome: string;
  tipo: 'WHATSAPP' | 'EMAIL' | 'SMS' | 'LIGACAO';
  mensagem: string;
  status: 'ENVIADO' | 'ENTREGUE' | 'LIDO' | 'RESPONDIDO' | 'FALHOU';
  automatica: boolean;
  criadoEm: string; // ISO datetime
}

export interface ParcelaMock {
  numero: number;
  valor: number;
  vencimento: string; // ISO date string
  pago: boolean;
  pagoEm: string | null;
}

export interface AcordoMock {
  id: string;
  tituloId: string;
  clienteId: string;
  clienteNome: string;
  valorOriginal: number;
  descontoAplicado: number; // percent
  valorFinal: number;
  numeroParcelas: number;
  parcelas: ParcelaMock[];
  status: 'ATIVO' | 'CUMPRIDO' | 'QUEBRADO';
  criadoEm: string;
  observacao: string | null;
}

export interface RegraCobrancaMock {
  diasAtraso: number;
  canal: 'WHATSAPP' | 'EMAIL' | 'SMS' | 'LIGACAO';
  template: string;
  ativo: boolean;
}

export interface ConfiguracaoCobrancaMock {
  ativo: boolean;
  webhookN8n: string;
  callbackUrl: string;
  regras: RegraCobrancaMock[];
  descontoMaximo: number;
  parcelasMaximas: number;
  horarioInicio: string;
  horarioFim: string;
  pausarFimDeSemana: boolean;
}

// Declare globalThis
declare global {
  // eslint-disable-next-line no-var
  var __titulosCobrancaMock: TituloCobrancaMock[] | undefined;
  var __acoesCobrancaMock: AcaoCobrancaMock[] | undefined;
  var __acordosMock: AcordoMock[] | undefined;
  var __configuracaoCobrancaMock: ConfiguracaoCobrancaMock | undefined;
  var __titulosCobrancaSeq: number | undefined;
  var __acoesCobrancaSeq: number | undefined;
  var __acordosSeq: number | undefined;
}

// Default config
const DEFAULT_CONFIG: ConfiguracaoCobrancaMock = {
  ativo: true,
  webhookN8n: 'https://n8n.imestredigital.com.br/webhook/cobranca',
  callbackUrl: 'https://app.imestredigital.com.br/api/v1/cobranca/callback',
  regras: [
    { diasAtraso: 1,  canal: 'WHATSAPP', ativo: true, template: 'Olá {nome}, notamos que seu boleto de {valor} venceu ontem. Para facilitar, clique aqui para pagar: {link}' },
    { diasAtraso: 7,  canal: 'WHATSAPP', ativo: true, template: 'Olá {nome}, seu título de {valor} está em atraso há {dias} dias. Evite juros e resolva agora: {link}' },
    { diasAtraso: 15, canal: 'EMAIL',    ativo: true, template: '{nome}, seu débito de {valor} com vencimento em {vencimento} precisa de regularização urgente. Proposta especial disponível: {link}' },
    { diasAtraso: 30, canal: 'WHATSAPP', ativo: true, template: '{nome}, última oportunidade de regularizar seu débito de {valor} com até 20% de desconto. Responda SIM para receber proposta.' },
    { diasAtraso: 60, canal: 'LIGACAO',  ativo: true, template: 'Ligar para {nome} no {telefone} sobre débito de {valor} em atraso há {dias} dias. Proposta máxima de desconto.' },
  ],
  descontoMaximo: 30,
  parcelasMaximas: 12,
  horarioInicio: '08:00',
  horarioFim: '18:00',
  pausarFimDeSemana: true,
};

// Initial mock titles (diasAtraso calculated from 2026-04-08)
const INITIAL_TITULOS: TituloCobrancaMock[] = [
  {
    id: 'cob-001', lancamentoId: 'lan-027', clienteId: 'cli-003',
    clienteNome: 'Supermercados Bom Preço', clienteTelefone: '11987654321', clienteEmail: 'financeiro@bompreco.com.br',
    descricao: 'Fornecimento de mercadorias — Fatura 2026/03', valor: 8750.00, dataVencimento: '2026-02-15',
    diasAtraso: 52, status: 'EM_COBRANCA', prioridade: 'CRITICA', tentativas: 4,
    ultimaAcaoEm: '2026-04-05T10:00:00Z', canalUltimaAcao: 'WHATSAPP', observacao: null,
  },
  {
    id: 'cob-002', lancamentoId: 'lan-028', clienteId: 'cli-007',
    clienteNome: 'Padaria Pão de Mel', clienteTelefone: '11976543210', clienteEmail: 'contato@paodemel.com.br',
    descricao: 'Serviços de consultoria — Janeiro 2026', valor: 3200.00, dataVencimento: '2026-02-28',
    diasAtraso: 39, status: 'NEGOCIANDO', prioridade: 'ALTA', tentativas: 3,
    ultimaAcaoEm: '2026-04-03T14:30:00Z', canalUltimaAcao: 'WHATSAPP', observacao: 'Cliente solicitou parcelamento',
  },
  {
    id: 'cob-003', lancamentoId: 'lan-029', clienteId: 'cli-012',
    clienteNome: 'Restaurante Sabor & Arte', clienteTelefone: '11965432109', clienteEmail: 'admin@saborarte.com.br',
    descricao: 'Venda de equipamentos — Pedido #4521', valor: 15400.00, dataVencimento: '2026-01-31',
    diasAtraso: 67, status: 'EM_COBRANCA', prioridade: 'CRITICA', tentativas: 6,
    ultimaAcaoEm: '2026-04-06T09:15:00Z', canalUltimaAcao: 'EMAIL', observacao: 'Dificuldade financeira relatada',
  },
  {
    id: 'cob-004', lancamentoId: 'lan-030', clienteId: 'cli-002',
    clienteNome: 'Tech Solutions ME', clienteTelefone: '11954321098', clienteEmail: 'pagar@techsolutions.com.br',
    descricao: 'Licença de software anual', valor: 2100.00, dataVencimento: '2026-03-20',
    diasAtraso: 19, status: 'EM_ABERTO', prioridade: 'MEDIA', tentativas: 1,
    ultimaAcaoEm: '2026-03-22T08:00:00Z', canalUltimaAcao: 'EMAIL', observacao: null,
  },
  {
    id: 'cob-005', lancamentoId: 'lan-031', clienteId: 'cli-009',
    clienteNome: 'Academia Força Total', clienteTelefone: '11943210987', clienteEmail: 'financeiro@forcatotal.com.br',
    descricao: 'Fornecimento equipamentos fitness', valor: 5800.00, dataVencimento: '2026-03-25',
    diasAtraso: 14, status: 'EM_ABERTO', prioridade: 'MEDIA', tentativas: 1,
    ultimaAcaoEm: null, canalUltimaAcao: null, observacao: null,
  },
  {
    id: 'cob-006', lancamentoId: 'lan-032', clienteId: 'cli-015',
    clienteNome: 'Farmácia Saúde & Vida', clienteTelefone: '11932109876', clienteEmail: 'contas@saudevida.com.br',
    descricao: 'Produtos higiene — Nota 8821', valor: 980.00, dataVencimento: '2026-04-01',
    diasAtraso: 7, status: 'EM_ABERTO', prioridade: 'BAIXA', tentativas: 0,
    ultimaAcaoEm: null, canalUltimaAcao: null, observacao: null,
  },
  {
    id: 'cob-007', lancamentoId: 'lan-033', clienteId: 'cli-004',
    clienteNome: 'Loja de Roupas Moda Atual', clienteTelefone: '11921098765', clienteEmail: 'administrativo@modaatual.com.br',
    descricao: 'Coleção outono/inverno 2026', valor: 12300.00, dataVencimento: '2026-01-15',
    diasAtraso: 83, status: 'ACORDO', prioridade: 'ALTA', tentativas: 5,
    ultimaAcaoEm: '2026-03-01T11:00:00Z', canalUltimaAcao: 'LIGACAO', observacao: 'Acordo firmado em 01/03',
  },
  {
    id: 'cob-008', lancamentoId: 'lan-034', clienteId: 'cli-018',
    clienteNome: 'Mecânica Rápida Ltda', clienteTelefone: '11910987654', clienteEmail: 'financeiro@mecanicaRapida.com.br',
    descricao: 'Peças e acessórios — Fatura 03/2026', valor: 4200.00, dataVencimento: '2026-03-10',
    diasAtraso: 29, status: 'EM_COBRANCA', prioridade: 'ALTA', tentativas: 2,
    ultimaAcaoEm: '2026-04-01T16:00:00Z', canalUltimaAcao: 'WHATSAPP', observacao: null,
  },
  {
    id: 'cob-009', lancamentoId: 'lan-035', clienteId: 'cli-021',
    clienteNome: 'Escola Crescer', clienteTelefone: '11909876543', clienteEmail: 'tesouraria@crescer.edu.br',
    descricao: 'Material didático 1º semestre', valor: 6750.00, dataVencimento: '2026-02-01',
    diasAtraso: 66, status: 'PAGO', prioridade: 'ALTA', tentativas: 3,
    ultimaAcaoEm: '2026-04-02T10:00:00Z', canalUltimaAcao: 'WHATSAPP', observacao: 'Pago via PIX em 02/04',
  },
  {
    id: 'cob-010', lancamentoId: 'lan-036', clienteId: 'cli-011',
    clienteNome: 'Pet Shop Amigo Fiel', clienteTelefone: '11998765432', clienteEmail: 'admin@amigofiel.com.br',
    descricao: 'Produtos veterinários — Fatura 01/2026', valor: 1850.00, dataVencimento: '2026-01-20',
    diasAtraso: 78, status: 'PERDIDO', prioridade: 'MEDIA', tentativas: 8,
    ultimaAcaoEm: '2026-03-15T09:00:00Z', canalUltimaAcao: 'LIGACAO', observacao: 'Empresa encerrada — título baixado',
  },
];

// Initial actions
const INITIAL_ACOES: AcaoCobrancaMock[] = [
  { id: 'aco-001', tituloId: 'cob-001', clienteNome: 'Supermercados Bom Preço', tipo: 'EMAIL',    mensagem: 'Seu título de R$ 8.750,00 venceu em 15/02. Por favor, regularize.', status: 'LIDO',       automatica: true,  criadoEm: '2026-02-16T08:00:00Z' },
  { id: 'aco-002', tituloId: 'cob-001', clienteNome: 'Supermercados Bom Preço', tipo: 'WHATSAPP', mensagem: 'Olá, seu boleto de R$ 8.750,00 está em atraso há 7 dias. Evite juros!', status: 'RESPONDIDO', automatica: true,  criadoEm: '2026-02-22T09:00:00Z' },
  { id: 'aco-003', tituloId: 'cob-001', clienteNome: 'Supermercados Bom Preço', tipo: 'WHATSAPP', mensagem: 'Última chance com 20% de desconto. Responda SIM para proposta.',        status: 'ENTREGUE',   automatica: true,  criadoEm: '2026-03-17T10:00:00Z' },
  { id: 'aco-004', tituloId: 'cob-001', clienteNome: 'Supermercados Bom Preço', tipo: 'LIGACAO',  mensagem: 'Ligação realizada — cliente prometeu pagar até 10/04',                  status: 'RESPONDIDO', automatica: false, criadoEm: '2026-04-05T10:00:00Z' },
  { id: 'aco-005', tituloId: 'cob-002', clienteNome: 'Padaria Pão de Mel',      tipo: 'WHATSAPP', mensagem: 'Seu título de R$ 3.200,00 está em atraso. Podemos parcelar em até 3x?', status: 'RESPONDIDO', automatica: true,  criadoEm: '2026-03-08T08:00:00Z' },
  { id: 'aco-006', tituloId: 'cob-002', clienteNome: 'Padaria Pão de Mel',      tipo: 'WHATSAPP', mensagem: 'Proposta de parcelamento: 3x R$ 1.013,33 com 5% desconto.',              status: 'LIDO',       automatica: false, criadoEm: '2026-04-03T14:30:00Z' },
  { id: 'aco-007', tituloId: 'cob-003', clienteNome: 'Restaurante Sabor & Arte', tipo: 'EMAIL',   mensagem: 'Título R$ 15.400,00 — 1ª notificação de cobrança.',                    status: 'ENVIADO',    automatica: true,  criadoEm: '2026-02-01T08:00:00Z' },
  { id: 'aco-008', tituloId: 'cob-003', clienteNome: 'Restaurante Sabor & Arte', tipo: 'WHATSAPP',mensagem: 'Aviso: débito de R$ 15.400,00 com 30 dias de atraso.',                  status: 'ENTREGUE',   automatica: true,  criadoEm: '2026-03-02T09:00:00Z' },
  { id: 'aco-009', tituloId: 'cob-003', clienteNome: 'Restaurante Sabor & Arte', tipo: 'WHATSAPP',mensagem: 'Último aviso antes de protesto. Regularize em 48h.',                    status: 'LIDO',       automatica: true,  criadoEm: '2026-04-01T10:00:00Z' },
  { id: 'aco-010', tituloId: 'cob-003', clienteNome: 'Restaurante Sabor & Arte', tipo: 'EMAIL',   mensagem: 'Notificação formal: título será protestado se não houver pagamento.',    status: 'ENVIADO',    automatica: false, criadoEm: '2026-04-06T09:15:00Z' },
  { id: 'aco-011', tituloId: 'cob-004', clienteNome: 'Tech Solutions ME',        tipo: 'EMAIL',   mensagem: 'Lembrete: sua licença de R$ 2.100,00 venceu há 1 dia.',                 status: 'LIDO',       automatica: true,  criadoEm: '2026-03-22T08:00:00Z' },
  { id: 'aco-012', tituloId: 'cob-007', clienteNome: 'Loja de Roupas Moda Atual',tipo: 'LIGACAO', mensagem: 'Acordo firmado: 6x R$ 1.968,00 com 4% desconto.',                       status: 'RESPONDIDO', automatica: false, criadoEm: '2026-03-01T11:00:00Z' },
  { id: 'aco-013', tituloId: 'cob-008', clienteNome: 'Mecânica Rápida Ltda',     tipo: 'WHATSAPP',mensagem: 'Olá! Seu boleto de R$ 4.200,00 está em atraso há 7 dias.',              status: 'RESPONDIDO', automatica: true,  criadoEm: '2026-03-18T09:00:00Z' },
  { id: 'aco-014', tituloId: 'cob-008', clienteNome: 'Mecânica Rápida Ltda',     tipo: 'WHATSAPP',mensagem: 'Proposta: pague até 15/04 e ganhe 10% de desconto.',                    status: 'ENTREGUE',   automatica: false, criadoEm: '2026-04-01T16:00:00Z' },
  { id: 'aco-015', tituloId: 'cob-009', clienteNome: 'Escola Crescer',            tipo: 'WHATSAPP',mensagem: 'Pagamento de R$ 6.750,00 confirmado! Obrigado.',                        status: 'RESPONDIDO', automatica: false, criadoEm: '2026-04-02T10:00:00Z' },
];

// Initial agreements
const INITIAL_ACORDOS: AcordoMock[] = [
  {
    id: 'acr-001', tituloId: 'cob-007', clienteId: 'cli-004', clienteNome: 'Loja de Roupas Moda Atual',
    valorOriginal: 12300.00, descontoAplicado: 4, valorFinal: 11808.00,
    numeroParcelas: 6, status: 'ATIVO', criadoEm: '2026-03-01T11:00:00Z', observacao: 'Acordo telefônico — 6 parcelas mensais',
    parcelas: [
      { numero: 1, valor: 1968.00, vencimento: '2026-04-01', pago: true,  pagoEm: '2026-04-01T15:00:00Z' },
      { numero: 2, valor: 1968.00, vencimento: '2026-05-01', pago: false, pagoEm: null },
      { numero: 3, valor: 1968.00, vencimento: '2026-06-01', pago: false, pagoEm: null },
      { numero: 4, valor: 1968.00, vencimento: '2026-07-01', pago: false, pagoEm: null },
      { numero: 5, valor: 1968.00, vencimento: '2026-08-01', pago: false, pagoEm: null },
      { numero: 6, valor: 1968.00, vencimento: '2026-09-01', pago: false, pagoEm: null },
    ],
  },
  {
    id: 'acr-002', tituloId: 'cob-009', clienteId: 'cli-021', clienteNome: 'Escola Crescer',
    valorOriginal: 6750.00, descontoAplicado: 10, valorFinal: 6075.00,
    numeroParcelas: 1, status: 'CUMPRIDO', criadoEm: '2026-03-20T10:00:00Z', observacao: 'Pagamento único com 10% desconto',
    parcelas: [
      { numero: 1, valor: 6075.00, vencimento: '2026-04-02', pago: true, pagoEm: '2026-04-02T10:00:00Z' },
    ],
  },
  {
    id: 'acr-003', tituloId: 'cob-010', clienteId: 'cli-011', clienteNome: 'Pet Shop Amigo Fiel',
    valorOriginal: 1850.00, descontoAplicado: 20, valorFinal: 1480.00,
    numeroParcelas: 3, status: 'QUEBRADO', criadoEm: '2026-02-15T09:00:00Z', observacao: 'Acordo não cumprido — empresa encerrada',
    parcelas: [
      { numero: 1, valor: 493.33, vencimento: '2026-03-01', pago: true,  pagoEm: '2026-03-01T00:00:00Z' },
      { numero: 2, valor: 493.33, vencimento: '2026-04-01', pago: false, pagoEm: null },
      { numero: 3, valor: 493.34, vencimento: '2026-05-01', pago: false, pagoEm: null },
    ],
  },
];

// Persistence
if (!globalThis.__titulosCobrancaMock) globalThis.__titulosCobrancaMock = INITIAL_TITULOS.map(t => ({...t}));
if (!globalThis.__acoesCobrancaMock)   globalThis.__acoesCobrancaMock   = INITIAL_ACOES.map(a => ({...a}));
if (!globalThis.__acordosMock)         globalThis.__acordosMock         = INITIAL_ACORDOS.map(a => ({ ...a, parcelas: a.parcelas.map(p => ({...p})) }));
if (!globalThis.__configuracaoCobrancaMock) globalThis.__configuracaoCobrancaMock = { ...DEFAULT_CONFIG, regras: DEFAULT_CONFIG.regras.map(r => ({...r})) };
if (!globalThis.__titulosCobrancaSeq)  globalThis.__titulosCobrancaSeq  = 11;
if (!globalThis.__acoesCobrancaSeq)    globalThis.__acoesCobrancaSeq    = 16;
if (!globalThis.__acordosSeq)          globalThis.__acordosSeq          = 4;

export const TITULOS_COBRANCA_MOCK: TituloCobrancaMock[] = globalThis.__titulosCobrancaMock;
export const ACOES_COBRANCA_MOCK: AcaoCobrancaMock[]     = globalThis.__acoesCobrancaMock;
export const ACORDOS_MOCK: AcordoMock[]                  = globalThis.__acordosMock;

export function getConfiguracao(): ConfiguracaoCobrancaMock {
  return globalThis.__configuracaoCobrancaMock!;
}

export function nextIdTitulo(): string {
  return `cob-${String(globalThis.__titulosCobrancaSeq!++).padStart(3, '0')}`;
}
export function nextIdAcao(): string {
  return `aco-${String(globalThis.__acoesCobrancaSeq!++).padStart(3, '0')}`;
}
export function nextIdAcordo(): string {
  return `acr-${String(globalThis.__acordosSeq!++).padStart(3, '0')}`;
}

export function calcularScoreIA(titulo: TituloCobrancaMock): number {
  const diasFator   = Math.min(titulo.diasAtraso / 90, 1) * 40;
  const valorFator  = Math.min(titulo.valor / 20000, 1) * 40;
  const tentFator   = titulo.tentativas < 3 ? 20 : titulo.tentativas < 6 ? 10 : 5;
  return Math.round(diasFator + valorFator + tentFator);
}

export function getMensagemTom(diasAtraso: number, nomeCliente: string, valor: number, telefone: string): {
  tom: string; mensagem: string; canal: 'WHATSAPP' | 'EMAIL' | 'SMS' | 'LIGACAO';
} {
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  if (diasAtraso <= 7) return {
    tom: 'Lembrete Gentil',
    canal: 'WHATSAPP',
    mensagem: `Olá ${nomeCliente}! 😊 Identificamos que seu título de ${fmt(valor)} venceu há ${diasAtraso} dia(s). Sem estresse — regularize quando puder. Link de pagamento: {link}`,
  };
  if (diasAtraso <= 30) return {
    tom: 'Aviso Formal',
    canal: 'WHATSAPP',
    mensagem: `Olá ${nomeCliente}, seu débito de ${fmt(valor)} está em atraso há ${diasAtraso} dias. Para evitar juros e restrições, regularize o quanto antes. Acesse: {link}`,
  };
  if (diasAtraso <= 60) return {
    tom: 'Cobrança Assertiva',
    canal: 'WHATSAPP',
    mensagem: `${nomeCliente}, seu título de ${fmt(valor)} está em atraso há ${diasAtraso} dias. Oferecemos até 20% de desconto para pagamento até amanhã. Responda SIM para receber a proposta personalizada.`,
  };
  return {
    tom: 'Último Aviso',
    canal: 'LIGACAO',
    mensagem: `URGENTE ${nomeCliente}: débito de ${fmt(valor)} em atraso há ${diasAtraso} dias. Esta é a última notificação antes do encaminhamento para protesto/SERASA. Regularize agora: {link}`,
  };
}
