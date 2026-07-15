/**
 * Construção do payload de emissão da Focus NFe v2 a partir do documento de
 * domínio (`DocumentoFiscalParaEmissao`).
 *
 * Isola o mapeamento domínio → formato-do-provedor para que o adapter fique
 * enxuto e o mapeamento seja testável isoladamente. Nenhum tipo deste
 * arquivo é exportado do módulo (o formato do provedor não vaza).
 *
 * Unidade monetária: valores em REAIS, serializados com toFixed onde a Focus
 * espera string decimal com ponto. Alíquotas em fração decimal são
 * convertidas para percentual (0.18 → 18) porque a Focus NFe espera o
 * percentual no campo `*_aliquota`.
 */

import {
  DocumentoFiscalParaEmissao,
  ItemFiscal,
  DestinatarioFiscal,
} from '../tipos/provedor-fiscal.tipos';

/** Item no formato Focus NFe. */
interface ItemFocusNFe {
  numero_item: number;
  codigo_produto: string;
  descricao: string;
  cfop: string;
  codigo_ncm: string;
  unidade_comercial: string;
  quantidade_comercial: string;
  valor_unitario_comercial: string;
  valor_bruto: string;
  unidade_tributavel: string;
  quantidade_tributavel: string;
  valor_unitario_tributavel: string;
  icms_origem: string;
  icms_situacao_tributaria: string;
  icms_aliquota?: string;
  pis_situacao_tributaria: string;
  pis_aliquota?: string;
  cofins_situacao_tributaria: string;
  cofins_aliquota?: string;
  valor_desconto?: string;
}

/** Payload de emissão no formato Focus NFe (campos que preenchemos). */
export interface PayloadFocusNFe {
  natureza_operacao: string;
  data_emissao: string;
  tipo_documento: number;
  finalidade_emissao: number;
  consumidor_final?: number;
  indicador_presenca?: number;
  modelo?: number;

  // Emitente
  cnpj_emitente?: string;
  cpf_emitente?: string;
  nome_emitente: string;
  nome_fantasia_emitente?: string;
  inscricao_estadual_emitente?: string;
  regime_tributario_emitente?: number;
  logradouro_emitente: string;
  numero_emitente: string;
  complemento_emitente?: string;
  bairro_emitente: string;
  municipio_emitente: string;
  uf_emitente: string;
  cep_emitente: string;
  telefone_emitente?: string;

  // Destinatário
  nome_destinatario?: string;
  cnpj_destinatario?: string;
  cpf_destinatario?: string;
  inscricao_estadual_destinatario?: string;
  indicador_inscricao_estadual_destinatario?: number;
  email_destinatario?: string;
  logradouro_destinatario?: string;
  numero_destinatario?: string;
  complemento_destinatario?: string;
  bairro_destinatario?: string;
  municipio_destinatario?: string;
  uf_destinatario?: string;
  cep_destinatario?: string;
  telefone_destinatario?: string;

  // Totais
  valor_produtos?: string;
  valor_total?: string;
  valor_desconto?: string;
  valor_frete?: string;
  valor_seguro?: string;
  valor_outras_despesas?: string;

  informacoes_adicionais_contribuinte?: string;

  items: ItemFocusNFe[];
}

/** Serializa valor monetário/quantidade em string decimal com N casas. */
function decimal(valor: number | undefined, casas = 2): string {
  const n = typeof valor === 'number' && !Number.isNaN(valor) ? valor : 0;
  return n.toFixed(casas);
}

/**
 * Converte fração decimal de alíquota (0.18) para percentual (18), no
 * formato string que a Focus NFe espera. Retorna undefined quando a alíquota
 * é ausente/zero e não precisa ser enviada.
 */
function aliquotaPercentual(fracao?: number): string | undefined {
  if (fracao === undefined || fracao === null || fracao === 0) {
    return undefined;
  }
  return (fracao * 100).toFixed(2);
}

/** Só define CPF ou CNPJ conforme o tamanho (11 = CPF, 14 = CNPJ). */
function documentoDestinatario(cpfCnpj?: string): {
  cnpj_destinatario?: string;
  cpf_destinatario?: string;
} {
  if (!cpfCnpj) {
    return {};
  }
  const doc = cpfCnpj.replace(/\D/g, '');
  if (doc.length === 11) {
    return { cpf_destinatario: doc };
  }
  return { cnpj_destinatario: doc };
}

/** Constrói o bloco do destinatário quando presente. */
function mapearDestinatario(dest?: DestinatarioFiscal): Partial<PayloadFocusNFe> {
  if (!dest) {
    return {};
  }
  const bloco: Partial<PayloadFocusNFe> = {
    nome_destinatario: dest.nome,
    ...documentoDestinatario(dest.cpfCnpj),
    inscricao_estadual_destinatario: dest.inscricaoEstadual,
    indicador_inscricao_estadual_destinatario: dest.indicadorInscricaoEstadual,
    email_destinatario: dest.email,
  };
  if (dest.endereco) {
    bloco.logradouro_destinatario = dest.endereco.logradouro;
    bloco.numero_destinatario = dest.endereco.numero;
    bloco.complemento_destinatario = dest.endereco.complemento;
    bloco.bairro_destinatario = dest.endereco.bairro;
    bloco.municipio_destinatario = dest.endereco.municipio;
    bloco.uf_destinatario = dest.endereco.uf;
    bloco.cep_destinatario = dest.endereco.cep?.replace(/\D/g, '');
    bloco.telefone_destinatario = dest.endereco.telefone;
  }
  return bloco;
}

/** Mapeia um item de domínio para o formato Focus NFe. */
function mapearItem(item: ItemFiscal): ItemFocusNFe {
  const quantidade = decimal(item.quantidadeComercial, 4);
  const valorUnitario = decimal(item.valorUnitarioComercial, 2);

  const focusItem: ItemFocusNFe = {
    numero_item: item.numero,
    codigo_produto: item.codigoProduto,
    descricao: item.descricao,
    cfop: item.cfop,
    codigo_ncm: item.ncm,
    unidade_comercial: item.unidadeComercial,
    quantidade_comercial: quantidade,
    valor_unitario_comercial: valorUnitario,
    valor_bruto: decimal(item.valorBruto, 2),
    // Espelha comercial ↔ tributável (caso comum: mesma unidade).
    unidade_tributavel: item.unidadeComercial,
    quantidade_tributavel: quantidade,
    valor_unitario_tributavel: valorUnitario,
    icms_origem: item.icmsOrigem,
    icms_situacao_tributaria: item.icmsSituacaoTributaria,
    pis_situacao_tributaria: item.pisSituacaoTributaria,
    cofins_situacao_tributaria: item.cofinsSituacaoTributaria,
  };

  const icmsAliq = aliquotaPercentual(item.icmsAliquota);
  if (icmsAliq !== undefined) {
    focusItem.icms_aliquota = icmsAliq;
  }
  const pisAliq = aliquotaPercentual(item.pisAliquota);
  if (pisAliq !== undefined) {
    focusItem.pis_aliquota = pisAliq;
  }
  const cofinsAliq = aliquotaPercentual(item.cofinsAliquota);
  if (cofinsAliq !== undefined) {
    focusItem.cofins_aliquota = cofinsAliq;
  }
  const desconto = item.valorDesconto;
  if (desconto !== undefined && desconto > 0) {
    focusItem.valor_desconto = decimal(desconto, 2);
  }

  return focusItem;
}

/**
 * Monta o payload completo de emissão (NF-e ou NFC-e) para a Focus NFe.
 *
 * Em homologação, força o nome do destinatário para a frase legal exigida
 * pela SEFAZ ("NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL"),
 * exatamente como o checklist de homologação do plano fiscal determina.
 */
export function construirPayloadFocus(nota: DocumentoFiscalParaEmissao): PayloadFocusNFe {
  const emit = nota.emitente;
  const docEmitente = emit.cpfCnpj.replace(/\D/g, '');
  const emitentePorCnpj = docEmitente.length === 14;

  const destinatario = mapearDestinatario(nota.destinatario);

  // Homologação: sobrescreve o nome do destinatário com a frase legal.
  if (nota.ambiente === 'HOMOLOGACAO') {
    destinatario.nome_destinatario = 'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL';
  }

  const payload: PayloadFocusNFe = {
    natureza_operacao: nota.naturezaOperacao,
    data_emissao: nota.dataEmissao.toISOString(),
    // 1 = saída (venda). O domínio ainda não distingue entrada; default saída.
    tipo_documento: 1,
    finalidade_emissao: nota.finalidadeEmissao ?? 1,
    modelo: nota.modelo === 'NFCE' ? 65 : 55,

    nome_emitente: emit.nome,
    nome_fantasia_emitente: emit.nomeFantasia,
    inscricao_estadual_emitente: emit.inscricaoEstadual,
    regime_tributario_emitente: emit.regimeTributario,
    logradouro_emitente: emit.endereco.logradouro,
    numero_emitente: emit.endereco.numero,
    complemento_emitente: emit.endereco.complemento,
    bairro_emitente: emit.endereco.bairro,
    municipio_emitente: emit.endereco.municipio,
    uf_emitente: emit.endereco.uf,
    cep_emitente: emit.endereco.cep?.replace(/\D/g, ''),
    telefone_emitente: emit.endereco.telefone,

    ...destinatario,

    valor_produtos: decimal(nota.valorProdutos, 2),
    valor_total: decimal(nota.valorTotal, 2),

    informacoes_adicionais_contribuinte: nota.informacoesAdicionais,

    items: nota.itens.map(mapearItem),
  };

  if (emitentePorCnpj) {
    payload.cnpj_emitente = docEmitente;
  } else {
    payload.cpf_emitente = docEmitente;
  }

  if (nota.consumidorFinal !== undefined) {
    payload.consumidor_final = nota.consumidorFinal ? 1 : 0;
  }
  if (nota.indicadorPresenca !== undefined) {
    payload.indicador_presenca = nota.indicadorPresenca;
  }
  if (nota.valorDesconto !== undefined && nota.valorDesconto > 0) {
    payload.valor_desconto = decimal(nota.valorDesconto, 2);
  }
  if (nota.valorFrete !== undefined && nota.valorFrete > 0) {
    payload.valor_frete = decimal(nota.valorFrete, 2);
  }
  if (nota.valorSeguro !== undefined && nota.valorSeguro > 0) {
    payload.valor_seguro = decimal(nota.valorSeguro, 2);
  }
  if (nota.valorOutros !== undefined && nota.valorOutros > 0) {
    payload.valor_outras_despesas = decimal(nota.valorOutros, 2);
  }

  return payload;
}
