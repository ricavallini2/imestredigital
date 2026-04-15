// Mock data para o módulo Fiscal — dev sem fiscal-service
// globalThis garante estado compartilhado entre rotas no Next.js dev

export type StatusNF =
  | 'RASCUNHO' | 'VALIDADA' | 'PROCESSANDO' | 'EMITIDA'
  | 'REJEITADA' | 'CANCELADA' | 'DENEGADA';

export type TipoNF = 'NFE' | 'NFCE' | 'NFSE';
export type RegimeTributario = 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';

export interface ItemNFMock {
  id: string;
  produtoId?: string;
  descricao: string;
  ncm: string;
  cfop: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  valorTotal: number;
  baseICMS: number;
  aliquotaICMS: number;
  valorICMS: number;
  aliquotaPIS: number;
  valorPIS: number;
  aliquotaCOFINS: number;
  valorCOFINS: number;
  cst?: string;   // Regime normal
  csosn?: string; // Simples Nacional
}

export interface NotaFiscalMock {
  id: string;
  numero: string;  // 9 digits
  serie: string;
  tipo: TipoNF;
  naturezaOperacao: string;
  finalidade: 'NORMAL' | 'COMPLEMENTAR' | 'AJUSTE' | 'DEVOLUCAO';
  status: StatusNF;
  regimeTributario: RegimeTributario;

  // Destinatário
  clienteId?: string;
  destinatario: string;
  destinatarioCnpjCpf: string;
  destinatarioUF: string;
  destinatarioEmail?: string;
  enderecoEntrega?: string;

  // Itens
  itens: ItemNFMock[];
  qtdItens: number;

  // Totais
  valorProdutos: number;
  valorDesconto: number;
  valorFrete: number;
  valorOutras: number;
  baseICMS: number;
  valorICMS: number;
  valorPIS: number;
  valorCOFINS: number;
  valorIPI: number;
  valorISS: number;
  valorTotal: number;

  // SEFAZ
  chaveAcesso?: string;
  protocolo?: string;
  dataAutorizacao?: string;
  motivoRejeicao?: string;
  codigoRejeicao?: string;
  motivoCancelamento?: string;
  protocoloCancelamento?: string;

  // Referências
  pedidoId?: string;
  pedidoNumero?: string;

  // Datas
  dataEmissao: string;
  dataCompetencia?: string; // NFSe
  criadoEm: string;
  atualizadoEm: string;

  observacoes?: string;
  informacoesAdicionais?: string;
}

// ─── Configuração Fiscal (empresa emitente) ────────────────────────────────────
export interface ConfiguracaoFiscalMock {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  ie: string;  // Inscrição Estadual
  im?: string; // Inscrição Municipal
  cnae: string;
  regimeTributario: RegimeTributario;
  uf: string;
  municipio: string;
  cMunicipio: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;

  // Certificado
  certificadoValidade?: string;
  certificadoStatus: 'VALIDO' | 'EXPIRADO' | 'NAO_CONFIGURADO';
  certificadoTitular?: string;

  // SEFAZ
  ambiente: 'PRODUCAO' | 'HOMOLOGACAO';
  sefazStatus: 'ONLINE' | 'OFFLINE' | 'INSTAVEL';
  ultimaConsulta?: string;

  // Séries e numeração
  serieNFe: string;
  proximoNumeroNFe: number;
  serieNFCe: string;
  proximoNumeroNFCe: number;

  // Alíquotas padrão (Lucro Presumido)
  aliquotaICMSPadrao: number;
  aliquotaPISPadrao: number;
  aliquotaCOFINSPadrao: number;
  cfopPadraoEstadual: string;
  cfopPadraoInterestadual: string;
}

// ─── Regras Fiscais ────────────────────────────────────────────────────────────
export interface RegraFiscalMock {
  id: string;
  ncm: string;
  descricaoNCM: string;
  cfopEstadual: string;
  cfopInterestadual: string;
  cst?: string;
  csosn?: string;
  aliquotaICMS: number;
  aliquotaPIS: number;
  aliquotaCOFINS: number;
  aliquotaIPI?: number;
  observacao?: string;
  ativo: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const d = (dias: number) => new Date(Date.now() - dias * 86400000).toISOString();

function chaveAcesso(n: number, mes: string): string {
  return `35${mes}12345678000190550010000${String(n).padStart(6, '0')}18765432${n % 10}`;
}

function calcTotais(itens: ItemNFMock[], frete = 0) {
  const valorProdutos = itens.reduce((s, i) => s + i.valorTotal, 0);
  const baseICMS      = itens.reduce((s, i) => s + i.baseICMS, 0);
  const valorICMS     = itens.reduce((s, i) => s + i.valorICMS, 0);
  const valorPIS      = itens.reduce((s, i) => s + i.valorPIS, 0);
  const valorCOFINS   = itens.reduce((s, i) => s + i.valorCOFINS, 0);
  return { valorProdutos, baseICMS, valorICMS, valorPIS, valorCOFINS,
    valorIPI: 0, valorISS: 0, valorDesconto: 0, valorFrete: frete, valorOutras: 0,
    valorTotal: valorProdutos + frete };
}

function item(
  id: string, desc: string, ncm: string, cfop: string, un: string,
  qty: number, preco: number, desc$: number, icms: number, pis: number, cofins: number,
  csosn = '400'
): ItemNFMock {
  const valorTotal = qty * preco - desc$;
  return {
    id, descricao: desc, ncm, cfop, unidade: un, quantidade: qty,
    valorUnitario: preco, desconto: desc$, valorTotal,
    baseICMS: valorTotal, aliquotaICMS: icms, valorICMS: +(valorTotal * icms / 100).toFixed(2),
    aliquotaPIS: pis,    valorPIS:    +(valorTotal * pis / 100).toFixed(2),
    aliquotaCOFINS: cofins, valorCOFINS: +(valorTotal * cofins / 100).toFixed(2),
    csosn,
  };
}

// ─── NFs Iniciais ─────────────────────────────────────────────────────────────
const INITIAL_NFS: NotaFiscalMock[] = [
  // 1 — EMITIDA — Tech Solutions — NFe — 2 itens — grande valor
  (() => {
    const itens = [
      item('i1-1','iPhone 15 Pro 256GB','8517.12.31','6102','UN',2,8999,0,12,0.65,3),
      item('i1-2','Notebook Dell Inspiron 15','8471.30.19','6102','UN',1,4299,200,12,0.65,3),
    ];
    return {
      id:'nf-001', numero:'000123456', serie:'1', tipo:'NFE' as TipoNF,
      naturezaOperacao:'Venda de Mercadoria', finalidade:'NORMAL' as const, status:'EMITIDA' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Tech Solutions Ltda', destinatarioCnpjCpf:'11.222.333/0001-44',
      destinatarioUF:'SP', destinatarioEmail:'compras@techsolutions.com',
      enderecoEntrega:'Rua Vergueiro, 2000 - Vila Mariana, São Paulo, SP',
      itens, qtdItens: 2,
      ...calcTotais(itens, 0),
      chaveAcesso: chaveAcesso(123456,'2603'),
      protocolo:'135260002643210', dataAutorizacao: d(15),
      pedidoNumero:'PED-2026-0001',
      dataEmissao: d(15), criadoEm: d(16), atualizadoEm: d(15),
      informacoesAdicionais:'Pedido PED-2026-0001 — Tech Solutions',
    };
  })(),

  // 2 — EMITIDA — balcão — NFCe
  (() => {
    const itens = [item('i2-1','Headphone Sony WH-1000XM5','8518.30.00','5102','UN',1,1899,0,12,0.65,3)];
    return {
      id:'nf-002', numero:'000000045', serie:'1', tipo:'NFCE' as TipoNF,
      naturezaOperacao:'Venda ao Consumidor', finalidade:'NORMAL' as const, status:'EMITIDA' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Consumidor Final', destinatarioCnpjCpf:'',
      destinatarioUF:'SP',
      itens, qtdItens: 1,
      ...calcTotais(itens),
      chaveAcesso: chaveAcesso(45,'2603'),
      protocolo:'135260008721340', dataAutorizacao: d(12),
      pedidoNumero:'PED-2026-0002',
      dataEmissao: d(12), criadoEm: d(12), atualizadoEm: d(12),
    };
  })(),

  // 3 — EMITIDA — interstate — Distribuidora ABC
  (() => {
    const itens = [
      item('i3-1','Tênis Nike Air Max 270','6402.99.39','6102','PAR',10,699,200,12,0.65,3),
      item('i3-2','Polo Ralph Lauren Branca M','6105.10.00','6102','UN',20,349,500,12,0.65,3),
      item('i3-3','Headphone Sony WH-1000XM5','8518.30.00','6102','UN',5,1899,0,12,0.65,3),
    ];
    return {
      id:'nf-003', numero:'000123457', serie:'1', tipo:'NFE' as TipoNF,
      naturezaOperacao:'Venda de Mercadoria', finalidade:'NORMAL' as const, status:'EMITIDA' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Distribuidora ABC', destinatarioCnpjCpf:'44.555.666/0001-77',
      destinatarioUF:'SP', destinatarioEmail:'compras@abc.com',
      enderecoEntrega:'Av. Industrial, 500 - Ribeirão Preto, SP',
      itens, qtdItens: 3,
      ...calcTotais(itens, 120),
      chaveAcesso: chaveAcesso(123457,'2603'),
      protocolo:'135260002643211', dataAutorizacao: d(10),
      pedidoNumero:'PED-2026-0010',
      dataEmissao: d(10), criadoEm: d(11), atualizadoEm: d(10),
    };
  })(),

  // 4 — EMITIDA — NFSe (serviço)
  (() => {
    const itens = [item('i4-1','Consultoria em TI — 10h','9999.99.99','5933','HRS',10,350,0,0,0.65,3,'500')];
    return {
      id:'nf-004', numero:'000000892', serie:'1', tipo:'NFSE' as TipoNF,
      naturezaOperacao:'Prestação de Serviços', finalidade:'NORMAL' as const, status:'EMITIDA' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Supermercado Central', destinatarioCnpjCpf:'33.444.555/0001-66',
      destinatarioUF:'SP', destinatarioEmail:'ti@central.com',
      itens, qtdItens: 1,
      ...calcTotais(itens),
      valorISS: +(3500 * 0.02).toFixed(2), // ISS 2%
      chaveAcesso: chaveAcesso(892,'2603'),
      protocolo:'SP20260123891234', dataAutorizacao: d(8),
      dataCompetencia: d(8),
      dataEmissao: d(8), criadoEm: d(9), atualizadoEm: d(8),
    };
  })(),

  // 5 — EMITIDA — balcão — NFCe
  (() => {
    const itens = [
      item('i5-1','Tênis Nike Air Max 270','6402.99.39','5102','PAR',1,699,50,12,0.65,3),
      item('i5-2','Polo Ralph Lauren Branca M','6105.10.00','5102','UN',2,349,0,12,0.65,3),
    ];
    return {
      id:'nf-005', numero:'000000046', serie:'1', tipo:'NFCE' as TipoNF,
      naturezaOperacao:'Venda ao Consumidor', finalidade:'NORMAL' as const, status:'EMITIDA' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Consumidor Final', destinatarioCnpjCpf:'',
      destinatarioUF:'SP',
      itens, qtdItens: 2,
      ...calcTotais(itens),
      chaveAcesso: chaveAcesso(46,'2603'),
      protocolo:'135260008721341', dataAutorizacao: d(7),
      pedidoNumero:'PED-2026-0006',
      dataEmissao: d(7), criadoEm: d(7), atualizadoEm: d(7),
    };
  })(),

  // 6 — EMITIDA
  (() => {
    const itens = [item('i6-1','GoPro HERO12 Black','9006.59.00','6102','UN',1,2199,0,12,0.65,3)];
    return {
      id:'nf-006', numero:'000123458', serie:'1', tipo:'NFE' as TipoNF,
      naturezaOperacao:'Venda de Mercadoria', finalidade:'NORMAL' as const, status:'EMITIDA' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Carlos Mendes', destinatarioCnpjCpf:'123.456.789-09',
      destinatarioUF:'SP',
      itens, qtdItens: 1,
      ...calcTotais(itens),
      chaveAcesso: chaveAcesso(123458,'2603'),
      protocolo:'135260002643212', dataAutorizacao: d(5),
      pedidoNumero:'PED-2026-0009',
      dataEmissao: d(5), criadoEm: d(5), atualizadoEm: d(5),
    };
  })(),

  // 7 — EMITIDA
  (() => {
    const itens = [item('i7-1','Samsung Galaxy S24 Ultra 256GB','8517.12.31','6102','UN',3,6499,300,12,0.65,3)];
    return {
      id:'nf-007', numero:'000123459', serie:'1', tipo:'NFE' as TipoNF,
      naturezaOperacao:'Venda de Mercadoria', finalidade:'NORMAL' as const, status:'EMITIDA' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Tech Solutions Ltda', destinatarioCnpjCpf:'11.222.333/0001-44',
      destinatarioUF:'SP', destinatarioEmail:'ti@techsolutions.com',
      itens, qtdItens: 1,
      ...calcTotais(itens),
      chaveAcesso: chaveAcesso(123459,'2603'),
      protocolo:'135260002643213', dataAutorizacao: d(3),
      pedidoNumero:'PED-2026-0005',
      dataEmissao: d(3), criadoEm: d(3), atualizadoEm: d(3),
    };
  })(),

  // 8 — EMITIDA — mochila
  (() => {
    const itens = [item('i8-1','Mochila Samsonite Pro-DLX 5','4202.92.20','5102','UN',2,899,0,12,0.65,3)];
    return {
      id:'nf-008', numero:'000000047', serie:'1', tipo:'NFCE' as TipoNF,
      naturezaOperacao:'Venda ao Consumidor', finalidade:'NORMAL' as const, status:'EMITIDA' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Consumidor Final', destinatarioCnpjCpf:'',
      destinatarioUF:'SP',
      itens, qtdItens: 1,
      ...calcTotais(itens),
      chaveAcesso: chaveAcesso(47,'2603'),
      protocolo:'135260008721342', dataAutorizacao: d(2),
      dataEmissao: d(2), criadoEm: d(2), atualizadoEm: d(2),
    };
  })(),

  // 9 — PROCESSANDO
  (() => {
    const itens = [item('i9-1','Notebook Dell Inspiron 15','8471.30.19','6102','UN',2,4299,0,12,0.65,3)];
    return {
      id:'nf-009', numero:'000123460', serie:'1', tipo:'NFE' as TipoNF,
      naturezaOperacao:'Venda de Mercadoria', finalidade:'NORMAL' as const, status:'PROCESSANDO' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Supermercado Central', destinatarioCnpjCpf:'33.444.555/0001-66',
      destinatarioUF:'SP',
      itens, qtdItens: 1,
      ...calcTotais(itens),
      pedidoNumero:'PED-2026-0015',
      dataEmissao: d(1), criadoEm: d(1), atualizadoEm: d(0),
    };
  })(),

  // 10 — PROCESSANDO — recente
  (() => {
    const itens = [item('i10-1','iPhone 15 Pro 256GB','8517.12.31','5102','UN',1,8999,500,12,0.65,3)];
    return {
      id:'nf-010', numero:'000123461', serie:'1', tipo:'NFE' as TipoNF,
      naturezaOperacao:'Venda de Mercadoria', finalidade:'NORMAL' as const, status:'PROCESSANDO' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Roberto Nunes', destinatarioCnpjCpf:'987.654.321-00',
      destinatarioUF:'SP',
      itens, qtdItens: 1,
      ...calcTotais(itens),
      dataEmissao: d(0), criadoEm: d(0), atualizadoEm: d(0),
    };
  })(),

  // 11 — REJEITADA — CNPJ inválido
  (() => {
    const itens = [item('i11-1','Samsung Galaxy S24 Ultra 256GB','8517.12.31','6102','UN',1,6499,0,12,0.65,3)];
    return {
      id:'nf-011', numero:'000123462', serie:'1', tipo:'NFE' as TipoNF,
      naturezaOperacao:'Venda de Mercadoria', finalidade:'NORMAL' as const, status:'REJEITADA' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Fernanda Lima', destinatarioCnpjCpf:'999.999.999-99',
      destinatarioUF:'SP',
      itens, qtdItens: 1,
      ...calcTotais(itens),
      codigoRejeicao:'205', motivoRejeicao:'Rejeição: NF-e já constava cancelada na Base de Dados da SEFAZ',
      pedidoNumero:'PED-2026-0011',
      dataEmissao: d(8), criadoEm: d(8), atualizadoEm: d(6),
    };
  })(),

  // 12 — REJEITADA — dados inconsistentes
  (() => {
    const itens = [item('i12-1','Polo Ralph Lauren Branca M','6105.10.00','6102','UN',30,349,1500,12,0.65,3)];
    return {
      id:'nf-012', numero:'000123463', serie:'1', tipo:'NFE' as TipoNF,
      naturezaOperacao:'Venda de Mercadoria', finalidade:'NORMAL' as const, status:'REJEITADA' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Loja de Varejo ME', destinatarioCnpjCpf:'12.345.678/0002-11',
      destinatarioUF:'SP',
      itens, qtdItens: 1,
      ...calcTotais(itens, 200),
      codigoRejeicao:'539', motivoRejeicao:'Rejeição: CFOP incompatível com operação interestadual',
      dataEmissao: d(4), criadoEm: d(4), atualizadoEm: d(4),
    };
  })(),

  // 13 — CANCELADA
  (() => {
    const itens = [item('i13-1','Samsung Galaxy S24 Ultra 256GB','8517.12.31','5102','UN',1,6499,0,12,0.65,3)];
    return {
      id:'nf-013', numero:'000123455', serie:'1', tipo:'NFE' as TipoNF,
      naturezaOperacao:'Venda de Mercadoria', finalidade:'NORMAL' as const, status:'CANCELADA' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Fernanda Lima', destinatarioCnpjCpf:'444.555.666-77',
      destinatarioUF:'SP',
      itens, qtdItens: 1,
      ...calcTotais(itens),
      chaveAcesso: chaveAcesso(123455,'2602'),
      protocolo:'135260002643200', dataAutorizacao: d(14),
      motivoCancelamento:'Cancelamento a pedido do cliente — cor indisponível',
      protocoloCancelamento:'135260002643201',
      pedidoNumero:'PED-2026-0011',
      dataEmissao: d(14), criadoEm: d(14), atualizadoEm: d(12),
    };
  })(),

  // 14 — VALIDADA (pronta p/ emitir)
  (() => {
    const itens = [item('i14-1','GoPro HERO12 Black','9006.59.00','6102','UN',2,2199,0,12,0.65,3)];
    return {
      id:'nf-014', numero:'000123464', serie:'1', tipo:'NFE' as TipoNF,
      naturezaOperacao:'Venda de Mercadoria', finalidade:'NORMAL' as const, status:'VALIDADA' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Patricia Souza', destinatarioCnpjCpf:'555.666.777-88',
      destinatarioUF:'RJ',
      itens, qtdItens: 1,
      ...calcTotais(itens),
      dataEmissao: d(0), criadoEm: d(0), atualizadoEm: d(0),
    };
  })(),

  // 15 — RASCUNHO
  (() => {
    const itens = [item('i15-1','Mochila Samsonite Pro-DLX 5','4202.92.20','5102','UN',5,899,100,12,0.65,3)];
    return {
      id:'nf-015', numero:'000123465', serie:'1', tipo:'NFE' as TipoNF,
      naturezaOperacao:'Venda de Mercadoria', finalidade:'NORMAL' as const, status:'RASCUNHO' as StatusNF,
      regimeTributario:'LUCRO_PRESUMIDO' as RegimeTributario,
      destinatario:'Maria Santos', destinatarioCnpjCpf:'111.222.333-44',
      destinatarioUF:'SP',
      itens, qtdItens: 1,
      ...calcTotais(itens),
      dataEmissao: d(0), criadoEm: d(0), atualizadoEm: d(0),
      observacoes:'Pedido aguardando confirmação financeira',
    };
  })(),
];

const INITIAL_CONFIG: ConfiguracaoFiscalMock = {
  cnpj: '12.345.678/0001-90',
  razaoSocial: 'Empresa Teste LTDA',
  nomeFantasia: 'iMestreDigital',
  ie: '111.222.333.444',
  im: '12345678',
  cnae: '4751-2/01',
  regimeTributario: 'LUCRO_PRESUMIDO',
  uf: 'SP',
  municipio: 'São Paulo',
  cMunicipio: '3550308',
  cep: '04101-300',
  logradouro: 'Rua das Flores',
  numero: '100',
  bairro: 'Vila Mariana',
  certificadoValidade: '2027-12-31',
  certificadoStatus: 'VALIDO',
  certificadoTitular: 'Empresa Teste LTDA',
  ambiente: 'HOMOLOGACAO',
  sefazStatus: 'ONLINE',
  ultimaConsulta: new Date().toISOString(),
  serieNFe: '1',
  proximoNumeroNFe: 123466,
  serieNFCe: '1',
  proximoNumeroNFCe: 48,
  aliquotaICMSPadrao: 12,
  aliquotaPISPadrao: 0.65,
  aliquotaCOFINSPadrao: 3,
  cfopPadraoEstadual: '5102',
  cfopPadraoInterestadual: '6102',
};

const INITIAL_REGRAS: RegraFiscalMock[] = [
  { id:'r-001', ncm:'8517.12.31', descricaoNCM:'Smartphones e aparelhos celulares', cfopEstadual:'5102', cfopInterestadual:'6102', csosn:'400', aliquotaICMS:12, aliquotaPIS:0.65, aliquotaCOFINS:3, ativo:true },
  { id:'r-002', ncm:'8471.30.19', descricaoNCM:'Computadores portáteis (notebooks)', cfopEstadual:'5102', cfopInterestadual:'6102', csosn:'400', aliquotaICMS:12, aliquotaPIS:0.65, aliquotaCOFINS:3, ativo:true },
  { id:'r-003', ncm:'8518.30.00', descricaoNCM:'Fones de ouvido e headphones',       cfopEstadual:'5102', cfopInterestadual:'6102', csosn:'400', aliquotaICMS:12, aliquotaPIS:0.65, aliquotaCOFINS:3, ativo:true },
  { id:'r-004', ncm:'6402.99.39', descricaoNCM:'Calçados com sola e parte exterior de borracha', cfopEstadual:'5102', cfopInterestadual:'6102', csosn:'400', aliquotaICMS:12, aliquotaPIS:0.65, aliquotaCOFINS:3, ativo:true },
  { id:'r-005', ncm:'6105.10.00', descricaoNCM:'Camisas e camisetas de algodão',     cfopEstadual:'5102', cfopInterestadual:'6102', csosn:'400', aliquotaICMS:12, aliquotaPIS:0.65, aliquotaCOFINS:3, ativo:true },
  { id:'r-006', ncm:'4202.92.20', descricaoNCM:'Bolsas e mochilas',                  cfopEstadual:'5102', cfopInterestadual:'6102', csosn:'400', aliquotaICMS:12, aliquotaPIS:0.65, aliquotaCOFINS:3, ativo:true },
  { id:'r-007', ncm:'9006.59.00', descricaoNCM:'Câmeras fotográficas e filmadoras',  cfopEstadual:'5102', cfopInterestadual:'6102', csosn:'400', aliquotaICMS:12, aliquotaPIS:0.65, aliquotaCOFINS:3, ativo:true },
  { id:'r-008', ncm:'9999.99.99', descricaoNCM:'Prestação de Serviços (ISS)',        cfopEstadual:'5933', cfopInterestadual:'5933', csosn:'500', aliquotaICMS:0,  aliquotaPIS:0.65, aliquotaCOFINS:3, ativo:true },
];

// ─── IA ───────────────────────────────────────────────────────────────────────
export function analisarFiscalIA(nfs: NotaFiscalMock[], config: ConfiguracaoFiscalMock) {
  const emitidas   = nfs.filter((n) => n.status === 'EMITIDA').length;
  const rejeitadas = nfs.filter((n) => n.status === 'REJEITADA').length;
  const canceladas = nfs.filter((n) => n.status === 'CANCELADA').length;
  const total      = nfs.filter((n) => n.status !== 'RASCUNHO').length;

  const taxaRejeicao   = total > 0 ? rejeitadas / total : 0;
  const taxaCancelamento = total > 0 ? canceladas / total : 0;
  const taxaEmissao    = total > 0 ? emitidas / total : 0;

  // Score componentes (0-100 cada)
  const scoreEmissao    = Math.round(taxaEmissao * 40);
  const scoreCFOP       = nfs.filter((n) => n.status === 'EMITIDA').length > 0 ? 30 : 15;
  const scoreCertificado = config.certificadoStatus === 'VALIDO' ? 20 : 0;
  const scoreAmbiente   = config.ambiente === 'PRODUCAO' ? 10 : 5;
  const scoreCompliance = scoreEmissao + scoreCFOP + scoreCertificado + scoreAmbiente;

  const saude = scoreCompliance >= 85 ? 'EXCELENTE' : scoreCompliance >= 70 ? 'BOA' : scoreCompliance >= 50 ? 'REGULAR' : 'CRITICA';

  // Totais de impostos das NFs emitidas
  const nfsEmitidas = nfs.filter((n) => n.status === 'EMITIDA');
  const totalFaturado  = nfsEmitidas.reduce((s, n) => s + n.valorTotal, 0);
  const totalICMS      = nfsEmitidas.reduce((s, n) => s + n.valorICMS, 0);
  const totalPIS       = nfsEmitidas.reduce((s, n) => s + n.valorPIS, 0);
  const totalCOFINS    = nfsEmitidas.reduce((s, n) => s + n.valorCOFINS, 0);
  const totalImpostos  = totalICMS + totalPIS + totalCOFINS;
  const cargaTributaria = totalFaturado > 0 ? (totalImpostos / totalFaturado) * 100 : 0;

  const alertas: { tipo: 'CRITICO'|'ATENCAO'|'INFO'; titulo: string; descricao: string }[] = [];
  if (rejeitadas > 0) alertas.push({ tipo: 'CRITICO', titulo: `${rejeitadas} NF-e${rejeitadas>1?'s':''} rejeitada${rejeitadas>1?'s':''}`, descricao: 'Verifique os códigos de rejeição e corrija os dados antes de retransmitir.' });
  if (config.ambiente === 'HOMOLOGACAO') alertas.push({ tipo: 'ATENCAO', titulo: 'Ambiente de Homologação ativo', descricao: 'As notas emitidas não têm validade fiscal. Configure o ambiente de Produção.' });
  if (config.certificadoStatus !== 'VALIDO') alertas.push({ tipo: 'CRITICO', titulo: 'Certificado digital inválido', descricao: 'O certificado A1 não está configurado ou expirou. A emissão de NF-e será bloqueada.' });
  if (canceladas > 0 && (canceladas / total) > 0.1) alertas.push({ tipo: 'ATENCAO', titulo: `Taxa de cancelamento elevada (${(taxaCancelamento*100).toFixed(1)}%)`, descricao: 'Revise o processo de emissão para reduzir cancelamentos desnecessários.' });
  if (nfs.filter((n) => n.status === 'PROCESSANDO').length > 0) alertas.push({ tipo: 'INFO', titulo: `${nfs.filter(n=>n.status==='PROCESSANDO').length} NF-e em processamento`, descricao: 'Aguardando resposta da SEFAZ. Verifique em alguns minutos.' });

  const oportunidades: { titulo: string; descricao: string; economia?: string }[] = [];
  if (config.regimeTributario === 'LUCRO_PRESUMIDO' && totalFaturado < 4800000) {
    oportunidades.push({ titulo: 'Simples Nacional pode ser mais vantajoso', descricao: `Faturamento anual abaixo de R$ 4,8M qualifica para Simples Nacional. Economia estimada de até 3,5% na carga tributária.`, economia: (totalImpostos * 0.035).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}) });
  }
  oportunidades.push({ titulo: 'Benefício fiscal para produtos de informática', descricao: 'NCMs 8517 e 8471 podem ter redução de ICMS com Decreto Estadual. Consulte seu contador.' });
  if (nfs.some((n) => n.destinatarioUF !== 'SP')) {
    oportunidades.push({ titulo: 'Operações interestaduais — alíquota diferenciada', descricao: 'Para NF-e interestaduais, verifique convênios ICMS que podem reduzir a base de cálculo em até 20%.' });
  }

  return {
    scoreCompliance,
    saude,
    alertas,
    oportunidades,
    metricas: {
      totalFaturado,
      totalImpostos,
      cargaTributaria: +cargaTributaria.toFixed(2),
      detalheImpostos: { icms: +totalICMS.toFixed(2), pis: +totalPIS.toFixed(2), cofins: +totalCOFINS.toFixed(2) },
      percentualICMS:  totalImpostos > 0 ? +((totalICMS/totalImpostos)*100).toFixed(1) : 0,
      percentualPIS:   totalImpostos > 0 ? +((totalPIS/totalImpostos)*100).toFixed(1) : 0,
      percentualCOFINS:totalImpostos > 0 ? +((totalCOFINS/totalImpostos)*100).toFixed(1) : 0,
      taxaRejeicao: +(taxaRejeicao*100).toFixed(1),
      taxaEmissao:  +(taxaEmissao*100).toFixed(1),
      nfsPorStatus: { emitidas, rejeitadas, canceladas,
        processando: nfs.filter(n=>n.status==='PROCESSANDO').length,
        rascunho:    nfs.filter(n=>n.status==='RASCUNHO').length,
        validada:    nfs.filter(n=>n.status==='VALIDADA').length,
      },
    },
  };
}

// ─── globalThis ───────────────────────────────────────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var __nfsMock: NotaFiscalMock[] | undefined;
  // eslint-disable-next-line no-var
  var __nfsSeq: number | undefined;
  // eslint-disable-next-line no-var
  var __configFiscal: ConfiguracaoFiscalMock | undefined;
  // eslint-disable-next-line no-var
  var __regrasFiscais: RegraFiscalMock[] | undefined;
}

if (!globalThis.__nfsMock)    globalThis.__nfsMock    = INITIAL_NFS;
if (!globalThis.__nfsSeq)     globalThis.__nfsSeq     = 123466;
if (!globalThis.__configFiscal)  globalThis.__configFiscal  = INITIAL_CONFIG;
if (!globalThis.__regrasFiscais) globalThis.__regrasFiscais = INITIAL_REGRAS;

export const NFS_MOCK:      NotaFiscalMock[]       = globalThis.__nfsMock;
export const CONFIG_FISCAL: ConfiguracaoFiscalMock = globalThis.__configFiscal;
export const REGRAS_MOCK:   RegraFiscalMock[]      = globalThis.__regrasFiscais;

export function nextNumeroNF(): string {
  const n = globalThis.__nfsSeq!;
  globalThis.__nfsSeq = n + 1;
  return String(n).padStart(9, '0');
}

export function findNF(id: string) {
  return NFS_MOCK.find((n) => n.id === id);
}

export function getNotasFiscais(): NotaFiscalMock[] {
  return globalThis.__nfsMock!;
}

export function getConfig(): ConfiguracaoFiscalMock {
  return globalThis.__configFiscal!;
}

export function getRegras(): RegraFiscalMock[] {
  return globalThis.__regrasFiscais!;
}

export function addNotaFiscal(nf: NotaFiscalMock): void {
  globalThis.__nfsMock!.push(nf);
}

export function updateNotaFiscal(id: string, patch: Partial<NotaFiscalMock>): NotaFiscalMock | null {
  const idx = globalThis.__nfsMock!.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  globalThis.__nfsMock![idx] = { ...globalThis.__nfsMock![idx], ...patch, atualizadoEm: new Date().toISOString() };
  return globalThis.__nfsMock![idx];
}

export function updateConfig(patch: Partial<ConfiguracaoFiscalMock>): ConfiguracaoFiscalMock {
  globalThis.__configFiscal = { ...globalThis.__configFiscal!, ...patch };
  return globalThis.__configFiscal!;
}

export function addRegra(regra: RegraFiscalMock): void {
  globalThis.__regrasFiscais!.push(regra);
}

export function updateRegra(id: string, patch: Partial<RegraFiscalMock>): RegraFiscalMock | null {
  const idx = globalThis.__regrasFiscais!.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  globalThis.__regrasFiscais![idx] = { ...globalThis.__regrasFiscais![idx], ...patch };
  return globalThis.__regrasFiscais![idx];
}
