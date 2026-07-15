/**
 * Gerador de PDF mínimo (mas VÁLIDO) para o DANFE/DANFCE em ambiente de
 * desenvolvimento.
 *
 * Não é um DANFE real conforme o layout da SEFAZ — é um documento auxiliar de
 * uma página, montado À MÃO (sem biblioteca de PDF), suficiente para o fluxo
 * de dev/testes funcionar ponta a ponta: o front baixa `application/pdf`, o
 * arquivo abre em qualquer leitor e traz os dados essenciais (chave de acesso,
 * número/série, emitente, valor).
 *
 * Na v1 real, o PDF vem do provedor (Focus NFe) via
 * `ProvedorFiscalPort.obterDanfePdf`; este util é o fallback do adapter fake e
 * do serviço quando o provedor não disponibiliza o PDF.
 *
 * Estrutura do PDF gerado (PDF 1.4):
 *   1 catalog → 2 pages → 3 page → 4 content stream (texto) + 5 fonte Helvetica
 * A tabela xref é construída com os offsets REAIS de cada objeto (calculados
 * enquanto os bytes são concatenados), então o arquivo passa em validadores.
 */

/** Dados exibidos no corpo do DANFE mínimo. */
export interface DadosDanfeMinimo {
  /** Título do documento (DANFE para NF-e, DANFCE para NFC-e). */
  titulo: string
  /** Chave de acesso de 44 dígitos. */
  chaveAcesso: string
  /** Número da nota. */
  numero: number | string
  /** Série da nota. */
  serie: number | string
  /** Modelo fiscal ("55" | "65") ou rótulo curto. */
  modelo?: string
  /** Nome/razão social do emitente. */
  emitente?: string
  /** CNPJ do emitente (apenas para exibição). */
  cnpjEmitente?: string
  /** Nome do destinatário (opcional — NFC-e a consumidor não identificado). */
  destinatario?: string
  /** Valor total do documento (número em reais ou string já formatada). */
  valorTotal?: number | string
  /** Protocolo de autorização, quando houver. */
  protocolo?: string
  /** Ambiente ("HOMOLOGACAO" | "PRODUCAO"). */
  ambiente?: string
}

/**
 * Escapa uma string para uso dentro de um literal de texto PDF `( ... )`.
 * Parênteses e barra invertida são metacaracteres em literais PDF.
 */
function escaparTextoPdf(texto: string): string {
  return texto.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

/** Quebra a chave de acesso em blocos de 4 para leitura (visual do DANFE). */
function formatarChave(chave: string): string {
  const limpa = (chave || '').replace(/\D/g, '')
  if (limpa.length !== 44) {
    return chave || '-'
  }
  return (limpa.match(/.{1,4}/g) ?? [limpa]).join(' ')
}

/** Formata um valor monetário em reais para exibição (R$ 1.234,56). */
function formatarValor(valor: number | string | undefined): string {
  if (valor === undefined || valor === null) {
    return '-'
  }
  const n = typeof valor === 'number' ? valor : Number(valor)
  if (Number.isNaN(n)) {
    return String(valor)
  }
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Monta as linhas de texto (operadores Tj/TL) do conteúdo do DANFE.
 * Cada linha é escapada e posicionada com espaçamento fixo.
 */
function montarLinhasConteudo(dados: DadosDanfeMinimo): string[] {
  const linhas: string[] = [
    dados.titulo,
    '',
    `Chave de acesso: ${formatarChave(dados.chaveAcesso)}`,
    `Numero: ${dados.numero}   Serie: ${dados.serie}${
      dados.modelo ? `   Modelo: ${dados.modelo}` : ''
    }`,
    '',
    `Emitente: ${dados.emitente ?? '-'}${
      dados.cnpjEmitente ? `   CNPJ: ${dados.cnpjEmitente}` : ''
    }`,
    `Destinatario: ${dados.destinatario ?? 'CONSUMIDOR NAO IDENTIFICADO'}`,
    `Valor total: ${formatarValor(dados.valorTotal)}`,
    '',
    `Protocolo: ${dados.protocolo ?? '-'}`,
    `Ambiente: ${dados.ambiente ?? 'HOMOLOGACAO'}`,
    '',
    'Documento auxiliar simplificado (ambiente de desenvolvimento).',
    'Sem valor fiscal.',
  ]
  return linhas
}

/**
 * Gera o stream de conteúdo (BT ... ET) com uma linha por `Tj`, usando a fonte
 * Helvetica (objeto 5) a 11pt e entrelinha de 16pt, começando no topo da
 * página A4 (595 x 842 pt).
 */
function montarStreamConteudo(dados: DadosDanfeMinimo): string {
  const linhas = montarLinhasConteudo(dados)
  const corpo = linhas
    .map((linha, indice) => {
      const texto = escaparTextoPdf(linha)
      // Primeira linha posiciona o cursor; as demais só avançam com T* (TL).
      return indice === 0 ? `(${texto}) Tj` : `T* (${texto}) Tj`
    })
    .join('\n')

  return ['BT', '/F1 11 Tf', '16 TL', '1 0 0 1 40 800 Tm', corpo, 'ET'].join('\n')
}

/**
 * Constrói um PDF de página única, válido, a partir dos dados do DANFE.
 *
 * @returns Buffer com os bytes do PDF (Content-Type application/pdf).
 */
export function gerarDanfePdfMinimo(dados: DadosDanfeMinimo): Buffer {
  const stream = montarStreamConteudo(dados)
  const streamBytes = Buffer.byteLength(stream, 'latin1')

  // Cada objeto é uma string; montamos o arquivo acumulando offsets reais.
  const objetos: string[] = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] ' +
      '/Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${streamBytes} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]

  const cabecalho = '%PDF-1.4\n'
  let corpo = cabecalho
  const offsets: number[] = []

  objetos.forEach((conteudo, indice) => {
    const numero = indice + 1
    offsets.push(Buffer.byteLength(corpo, 'latin1'))
    corpo += `${numero} 0 obj\n${conteudo}\nendobj\n`
  })

  // Tabela de referência cruzada (xref) com os offsets reais.
  const inicioXref = Buffer.byteLength(corpo, 'latin1')
  const totalObjetos = objetos.length + 1 // +1 do objeto livre 0
  const linhasXref = [
    'xref',
    `0 ${totalObjetos}`,
    '0000000000 65535 f ',
    ...offsets.map((offset) => `${offset.toString().padStart(10, '0')} 00000 n `),
  ].join('\n')

  const trailer = [
    'trailer',
    `<< /Size ${totalObjetos} /Root 1 0 R >>`,
    'startxref',
    `${inicioXref}`,
    '%%EOF',
  ].join('\n')

  corpo += `${linhasXref}\n${trailer}\n`

  return Buffer.from(corpo, 'latin1')
}
