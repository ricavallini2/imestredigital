/**
 * Tipos de domínio do provedor fiscal (ADR-001).
 *
 * Estes tipos são a fronteira entre o domínio fiscal do iMestreDigital e o
 * provedor de transmissão (Focus NFe, Fake, ou futuro adapter de emissão
 * própria). NENHUM shape específico de provedor pode vazar por aqui: o
 * `nota-fiscal.service` fala apenas com estes tipos, e cada adapter é
 * responsável por traduzir de/para o formato do provedor que implementa.
 *
 * Unidade monetária: todos os valores em REAIS (number, 2 casas na
 * serialização — a origem no serviço é Prisma.Decimal). Alíquotas são
 * frações decimais (0.18 = 18%), consistentes com o schema Decimal(5,4).
 */

/** Ambiente de transmissão fiscal. Espelha o enum AmbienteSefaz do schema. */
export type AmbienteFiscal = 'HOMOLOGACAO' | 'PRODUCAO';

/** Modelo do documento fiscal transmitido. */
export type ModeloDocumentoFiscal = 'NFE' | 'NFCE';

/**
 * Status normalizado do documento no domínio fiscal, independente do
 * provedor. Cada adapter mapeia os estados do provedor para um destes.
 */
export enum StatusProvedorFiscal {
  /** Recebido pelo provedor, ainda em processamento assíncrono na SEFAZ. */
  PROCESSANDO = 'PROCESSANDO',
  /** Autorizado o uso do documento pela SEFAZ. */
  AUTORIZADO = 'AUTORIZADO',
  /** Rejeitado pela SEFAZ (erro de validação / regra). */
  REJEITADO = 'REJEITADO',
  /** Denegado pela SEFAZ (irregularidade cadastral do emitente/destinatário). */
  DENEGADO = 'DENEGADO',
  /** Documento cancelado com sucesso. */
  CANCELADO = 'CANCELADO',
  /** Erro ao processar o cancelamento (rejeitado pela SEFAZ). */
  ERRO_CANCELAMENTO = 'ERRO_CANCELAMENTO',
  /** Erro genérico de comunicação/integração com o provedor. */
  ERRO = 'ERRO',
}

/** Endereço usado por emitente/destinatário na transmissão. */
export interface EnderecoFiscal {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  /** Código IBGE do município (7 dígitos). */
  codigoMunicipio?: string;
  municipio: string;
  uf: string;
  /** CEP apenas dígitos. */
  cep: string;
  /** Código do país (1058 = Brasil). */
  codigoPais?: string;
  pais?: string;
  telefone?: string;
}

/** Dados do emitente (a empresa do tenant). */
export interface EmitenteFiscal {
  cpfCnpj: string;
  nome: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  /**
   * Código de Regime Tributário (CRT): 1=Simples Nacional,
   * 2=Simples Nacional excesso de sublimite, 3=Regime Normal.
   */
  regimeTributario?: number;
  endereco: EnderecoFiscal;
}

/** Dados do destinatário do documento. */
export interface DestinatarioFiscal {
  cpfCnpj?: string;
  nome: string;
  inscricaoEstadual?: string;
  /**
   * Indicador da IE do destinatário: 1=Contribuinte ICMS,
   * 2=Isento, 9=Não contribuinte.
   */
  indicadorInscricaoEstadual?: number;
  email?: string;
  endereco?: EnderecoFiscal;
}

/** Item (produto) do documento fiscal. */
export interface ItemFiscal {
  /** Número sequencial do item na nota (1..N). */
  numero: number;
  codigoProduto: string;
  descricao: string;
  ncm: string;
  cfop: string;
  unidadeComercial: string;
  quantidadeComercial: number;
  valorUnitarioComercial: number;
  valorBruto: number;
  valorDesconto?: number;
  /** Origem da mercadoria (0=Nacional, 1=Estrangeira import. direta, ...). */
  icmsOrigem: string;
  /** CST (regime normal) ou CSOSN (Simples) do ICMS. */
  icmsSituacaoTributaria: string;
  icmsAliquota?: number;
  pisSituacaoTributaria: string;
  pisAliquota?: number;
  cofinsSituacaoTributaria: string;
  cofinsAliquota?: number;
  cstIpi?: string;
  ipiAliquota?: number;
}

/**
 * Documento fiscal pronto para transmissão, no formato do domínio. O
 * `nota-fiscal.service` monta este objeto a partir da NotaFiscal +
 * ConfiguracaoFiscal e o entrega ao port; o adapter traduz para o provedor.
 */
export interface DocumentoFiscalParaEmissao {
  /** Referência única no NOSSO domínio (id da NotaFiscal). */
  ref: string;
  modelo: ModeloDocumentoFiscal;
  ambiente: AmbienteFiscal;
  /** Chave de acesso de 44 dígitos gerada pelo domínio. */
  chaveAcesso: string;
  naturezaOperacao: string;
  serie: string;
  numero: number;
  dataEmissao: Date;
  dataSaida?: Date | null;
  /**
   * Finalidade de emissão: 1=Normal, 2=Complementar, 3=Ajuste,
   * 4=Devolução. Default 1 quando ausente.
   */
  finalidadeEmissao?: number;
  /**
   * Indicador de presença do comprador: 0=Não se aplica, 1=Presencial,
   * 2=Internet, ... Default depende do modelo (NFC-e = 1).
   */
  indicadorPresenca?: number;
  /** Indica se a operação é para consumidor final (true na NFC-e). */
  consumidorFinal?: boolean;
  emitente: EmitenteFiscal;
  destinatario?: DestinatarioFiscal;
  itens: ItemFiscal[];
  valorProdutos: number;
  valorTotal: number;
  valorDesconto?: number;
  valorFrete?: number;
  valorSeguro?: number;
  valorOutros?: number;
  informacoesAdicionais?: string;
  /** Token CSC (NFC-e). Obrigatório para modelo 65. */
  cscToken?: string;
  /** ID do CSC (NFC-e). */
  cscId?: string;
}

/**
 * Resultado normalizado de uma operação do provedor (emissão, consulta,
 * cancelamento, evento, inutilização). O adapter preenche apenas os campos
 * pertinentes à operação.
 */
export interface ResultadoProvedorFiscal {
  /** Status normalizado da operação. */
  status: StatusProvedorFiscal;
  /** Referência do documento no nosso domínio. */
  ref?: string;
  /**
   * Referência externa persistida por provedor. Na Focus NFe é a mesma `ref`
   * que enviamos; mantido explícito para não acoplar o domínio a essa
   * suposição (outro provedor pode devolver um id próprio).
   */
  refExterna?: string;
  /** Chave de acesso confirmada pela SEFAZ (44 dígitos). */
  chaveAcesso?: string;
  /** Protocolo de autorização/cancelamento retornado pela SEFAZ. */
  protocolo?: string;
  numero?: number;
  serie?: string;
  /** Código de status da SEFAZ (cStat), quando disponível. */
  codigoStatusSefaz?: string;
  /** Mensagem/motivo retornado pela SEFAZ (xMotivo). */
  mensagemSefaz?: string;
  /** Motivo consolidado de rejeição/erro (para persistir em motivoRejeicao). */
  motivo?: string;
  /** XML autorizado (nfeProc) ou de retorno, quando o provedor o fornece. */
  xml?: string;
  /** URL/caminho do DANFE/DANFCe (PDF) no provedor, quando disponível. */
  caminhoDanfe?: string;
  /** Lista de erros estruturados quando há rejeição de validação. */
  erros?: ErroProvedorFiscal[];
  /** Resposta bruta do provedor (para auditoria/log; nunca consumida pelo domínio). */
  bruto?: unknown;
}

/** Erro estruturado devolvido pelo provedor. */
export interface ErroProvedorFiscal {
  codigo?: string;
  mensagem: string;
  campo?: string;
}

/**
 * Evento genérico de webhook já normalizado para o domínio. O receiver de
 * webhook traduz o payload do provedor para este formato antes de atualizar
 * a nota.
 */
export interface EventoWebhookFiscal {
  ref: string;
  resultado: ResultadoProvedorFiscal;
}
