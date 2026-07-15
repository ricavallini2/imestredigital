/**
 * Montagem do documento de domínio (`DocumentoFiscalParaEmissao`) a partir da
 * NotaFiscal persistida + ConfiguracaoFiscal do tenant.
 *
 * É a fronteira de entrada do port: o nota-fiscal.service usa esta função
 * para converter o registro do banco no contrato de domínio que o provedor
 * consome. Fica no módulo provedor-fiscal por ser puramente de mapeamento
 * (não toca banco, não injeta nada) e para o serviço permanecer enxuto.
 *
 * Regras de negócio fiscal (CRT, indicadores, consumidor final) ficam
 * concentradas aqui, não espalhadas no serviço.
 *
 * Unidade monetária: converte Prisma.Decimal → number (reais) sem divisão por
 * 100 (Etapa 0 já padronizou reais ponta a ponta).
 */

import {
  DocumentoFiscalParaEmissao,
  ItemFiscal,
  DestinatarioFiscal,
  EmitenteFiscal,
  AmbienteFiscal,
  ModeloDocumentoFiscal,
} from './tipos/provedor-fiscal.tipos';

/** Converte Prisma.Decimal | number | string | null → number (reais). */
function paraReais(valor: unknown): number {
  if (valor === null || valor === undefined) {
    return 0;
  }
  if (typeof valor === 'number') {
    return valor;
  }
  // Prisma.Decimal expõe toNumber(); string cai no Number(...).
  if (
    typeof valor === 'object' &&
    typeof (valor as { toNumber?: unknown }).toNumber === 'function'
  ) {
    return (valor as { toNumber: () => number }).toNumber();
  }
  const n = Number(valor);
  return Number.isNaN(n) ? 0 : n;
}

/**
 * Mapeia o CRT (Código de Regime Tributário) a partir do regime tributário do
 * schema. CRT: 1=Simples Nacional, 2=Simples excesso sublimite, 3=Regime
 * Normal (Lucro Presumido/Real). Preferimos o campo `crt` explícito da config
 * quando presente; senão derivamos do regime.
 */
function resolverRegimeTributario(config: {
  crt?: string | null;
  regimeTributario?: string | null;
}): number | undefined {
  if (config.crt) {
    const crt = Number(config.crt);
    if (!Number.isNaN(crt)) {
      return crt;
    }
  }
  switch (config.regimeTributario) {
    case 'SIMPLES_NACIONAL':
    case 'MEI':
      return 1;
    case 'LUCRO_PRESUMIDO':
    case 'LUCRO_REAL':
      return 3;
    default:
      return undefined;
  }
}

/** Extrai o destinatário do JSON persistido na nota, no shape de domínio. */
function montarDestinatario(dest: unknown): DestinatarioFiscal | undefined {
  if (!dest || typeof dest !== 'object') {
    return undefined;
  }
  const d = dest as Record<string, unknown>;
  const cpfCnpj =
    typeof d.cpfCnpj === 'string'
      ? d.cpfCnpj
      : typeof d.cpf_cnpj === 'string'
        ? d.cpf_cnpj
        : undefined;

  const destinatario: DestinatarioFiscal = {
    cpfCnpj,
    nome: typeof d.nome === 'string' ? d.nome : 'Consumidor',
    inscricaoEstadual: typeof d.inscricaoEstadual === 'string' ? d.inscricaoEstadual : undefined,
    email: typeof d.email === 'string' ? d.email : undefined,
  };

  // Indicador de IE: 1=Contribuinte, 9=Não contribuinte (default sem IE).
  destinatario.indicadorInscricaoEstadual = destinatario.inscricaoEstadual ? 1 : 9;

  const temEndereco = d.endereco || d.logradouro || d.bairro || d.cidade || d.estado || d.uf;
  if (temEndereco) {
    destinatario.endereco = {
      logradouro: (d.endereco as string) ?? (d.logradouro as string) ?? '',
      numero: (d.numero as string) ?? 'S/N',
      complemento: d.complemento as string | undefined,
      bairro: (d.bairro as string) ?? '',
      municipio: (d.cidade as string) ?? (d.municipio as string) ?? '',
      uf: (d.estado as string) ?? (d.uf as string) ?? '',
      cep: typeof d.cep === 'string' ? d.cep.replace(/\D/g, '') : '',
      telefone: d.telefone as string | undefined,
    };
  }

  return destinatario;
}

/** Monta o emitente a partir da ConfiguracaoFiscal do tenant. */
function montarEmitente(config: Record<string, unknown>): EmitenteFiscal {
  return {
    cpfCnpj: (config.cnpj as string) ?? '',
    nome: (config.razaoSocial as string) ?? (config.nomeFantasia as string) ?? 'Emitente',
    nomeFantasia: config.nomeFantasia as string | undefined,
    inscricaoEstadual: config.inscricaoEstadual as string | undefined,
    inscricaoMunicipal: config.inscricaoMunicipal as string | undefined,
    regimeTributario: resolverRegimeTributario({
      crt: config.crt as string | null | undefined,
      regimeTributario: config.regimeTributario as string | null | undefined,
    }),
    endereco: {
      logradouro: (config.endereco as string) ?? '',
      numero: (config.numero as string) ?? 'S/N',
      complemento: config.complemento as string | undefined,
      bairro: (config.bairro as string) ?? '',
      codigoMunicipio: config.codigoMunicipio as string | undefined,
      municipio: (config.municipio as string) ?? '',
      uf: (config.uf as string) ?? '',
      cep: typeof config.cep === 'string' ? config.cep.replace(/\D/g, '') : '',
      telefone: config.telefone as string | undefined,
    },
  };
}

/** Mapeia um item persistido (ItemNotaFiscal) para o item de domínio. */
function montarItem(item: Record<string, unknown>, indice: number): ItemFiscal {
  return {
    numero: indice + 1,
    codigoProduto: (item.produtoId as string) ?? String(indice + 1),
    descricao: (item.descricao as string) ?? '',
    ncm: (item.ncm as string) ?? '',
    cfop: (item.cfop as string) ?? '',
    unidadeComercial: (item.unidade as string) ?? 'UN',
    quantidadeComercial: paraReais(item.quantidade),
    valorUnitarioComercial: paraReais(item.valorUnitario),
    valorBruto: paraReais(item.valorTotal),
    valorDesconto: paraReais(item.valorDesconto),
    icmsOrigem: (item.origemMercadoria as string) ?? '0',
    icmsSituacaoTributaria: (item.cstIcms as string) ?? '00',
    icmsAliquota: paraReais(item.aliquotaIcms),
    pisSituacaoTributaria: (item.cstPis as string) ?? '01',
    pisAliquota: paraReais(item.aliquotaPis),
    cofinsSituacaoTributaria: (item.cstCofins as string) ?? '01',
    cofinsAliquota: paraReais(item.aliquotaCofins),
    cstIpi: item.cstIpi as string | undefined,
    ipiAliquota: paraReais(item.aliquotaIpi),
  };
}

/**
 * Constrói o documento de domínio pronto para o port a partir da nota e da
 * config. `nota` e `config` são os registros do Prisma (tipados como
 * estruturas indexáveis para não acoplar este mapeamento ao client gerado).
 */
export function montarDocumentoFiscal(
  nota: Record<string, unknown>,
  config: Record<string, unknown>,
): DocumentoFiscalParaEmissao {
  const modelo: ModeloDocumentoFiscal = nota.tipo === 'NFCE' ? 'NFCE' : 'NFE';
  const ambiente: AmbienteFiscal = config.ambienteSefaz === 'PRODUCAO' ? 'PRODUCAO' : 'HOMOLOGACAO';

  const itensBrutos = Array.isArray(nota.itens) ? (nota.itens as Record<string, unknown>[]) : [];

  const ehNfce = modelo === 'NFCE';

  return {
    ref: nota.id as string,
    modelo,
    ambiente,
    chaveAcesso: nota.chaveAcesso as string,
    naturezaOperacao: (nota.naturezaOperacao as string) ?? 'VENDA',
    serie: (nota.serie as string) ?? '1',
    numero: Number(nota.numero ?? 1),
    dataEmissao:
      nota.dataEmissao instanceof Date
        ? nota.dataEmissao
        : new Date((nota.dataEmissao as string) ?? Date.now()),
    dataSaida:
      nota.dataSaida instanceof Date
        ? nota.dataSaida
        : nota.dataSaida
          ? new Date(nota.dataSaida as string)
          : null,
    finalidadeEmissao: 1,
    // NFC-e é sempre presencial (1) e para consumidor final; NF-e default 0/false.
    indicadorPresenca: ehNfce ? 1 : 0,
    consumidorFinal: ehNfce ? true : undefined,
    emitente: montarEmitente(config),
    destinatario: montarDestinatario(nota.destinatario),
    itens: itensBrutos.map(montarItem),
    valorProdutos: paraReais(nota.valorProdutos),
    valorTotal: paraReais(nota.valorTotal),
    valorDesconto: paraReais(nota.valorDesconto),
    valorFrete: paraReais(nota.valorFrete),
    valorSeguro: paraReais(nota.valorSeguro),
    valorOutros: paraReais(nota.valorOutros),
    informacoesAdicionais: nota.informacoesAdicionais as string | undefined,
    cscToken: config.tokenCsc as string | undefined,
    cscId: config.idCsc as string | undefined,
  };
}
