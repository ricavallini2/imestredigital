/**
 * Mapeamento Focus NFe → domínio fiscal.
 *
 * Concentra a tradução dos estados e do payload da API Focus NFe v2 para os
 * tipos de domínio (`ResultadoProvedorFiscal`, `StatusProvedorFiscal`). Fica
 * separado do adapter para ser testável isoladamente e para que a lógica de
 * "o que cada status do provedor significa para nós" tenha um único lugar.
 *
 * Referência de status Focus NFe (campo `status` das respostas):
 * - `autorizado`               → AUTORIZADO
 * - `processando_autorizacao`  → PROCESSANDO
 * - `erro_autorizacao`         → REJEITADO
 * - `denegado`                 → DENEGADO
 * - `cancelado`                → CANCELADO
 * - `erro_cancelamento`        → ERRO_CANCELAMENTO
 * Qualquer outro valor conhecido/desconhecido → ERRO (conservador).
 */

import {
  ResultadoProvedorFiscal,
  StatusProvedorFiscal,
  ErroProvedorFiscal,
} from '../tipos/provedor-fiscal.tipos';

/**
 * Shape (parcial) da resposta da Focus NFe. Modelado apenas nos campos que
 * consumimos; declarado aqui e NÃO exportado do módulo para não vazar o
 * formato do provedor para o domínio.
 */
export interface RespostaFocusNFe {
  status?: string;
  status_sefaz?: string;
  mensagem_sefaz?: string;
  chave_nfe?: string;
  numero?: string | number;
  serie?: string | number;
  protocolo?: string;
  protocolo_sefaz?: string;
  numero_protocolo?: string;
  ref?: string;
  cnpj_emitente?: string;
  caminho_xml_nota_fiscal?: string;
  caminho_danfe?: string;
  caminho_xml_carta_correcao?: string;
  caminho_pdf_carta_correcao?: string;
  caminho_xml_cancelamento?: string;
  caminho_xml?: string;
  /** Alguns endpoints devolvem erro como { codigo, mensagem }. */
  codigo?: string;
  mensagem?: string;
  /** Erros de validação: array de { mensagem, campo } (ou { codigo }). */
  erros?: Array<{ codigo?: string; mensagem?: string; campo?: string }>;
}

/**
 * Traduz o valor de `status` da Focus NFe para o status normalizado do
 * domínio.
 */
export function mapearStatusFocus(status?: string): StatusProvedorFiscal {
  switch (status) {
    case 'autorizado':
      return StatusProvedorFiscal.AUTORIZADO;
    case 'processando_autorizacao':
      return StatusProvedorFiscal.PROCESSANDO;
    case 'erro_autorizacao':
      return StatusProvedorFiscal.REJEITADO;
    case 'denegado':
      return StatusProvedorFiscal.DENEGADO;
    case 'cancelado':
      return StatusProvedorFiscal.CANCELADO;
    case 'erro_cancelamento':
      return StatusProvedorFiscal.ERRO_CANCELAMENTO;
    default:
      // Estado ausente ou não reconhecido: trata como erro de integração
      // para nunca marcar uma nota como autorizada por engano.
      return StatusProvedorFiscal.ERRO;
  }
}

/**
 * Normaliza os erros da Focus NFe para `ErroProvedorFiscal[]`. Cobre tanto o
 * array `erros` quanto o par `{ codigo, mensagem }` de erros simples.
 */
export function mapearErrosFocus(resposta: RespostaFocusNFe): ErroProvedorFiscal[] {
  const erros: ErroProvedorFiscal[] = [];

  if (Array.isArray(resposta.erros)) {
    for (const erro of resposta.erros) {
      if (erro && (erro.mensagem || erro.campo || erro.codigo)) {
        erros.push({
          codigo: erro.codigo,
          mensagem: erro.mensagem ?? 'Erro de validação sem descrição',
          campo: erro.campo,
        });
      }
    }
  }

  // Erro simples fora do array (ex.: 400 com { codigo, mensagem }).
  if (erros.length === 0 && (resposta.codigo || resposta.mensagem)) {
    erros.push({
      codigo: resposta.codigo,
      mensagem: resposta.mensagem ?? 'Erro sem descrição',
    });
  }

  return erros;
}

/**
 * Consolida um motivo textual único a partir da resposta, para persistir em
 * `motivoRejeicao`. Prioriza a mensagem da SEFAZ; cai para o primeiro erro
 * de validação; por fim, para a mensagem genérica.
 */
export function consolidarMotivo(
  resposta: RespostaFocusNFe,
  erros: ErroProvedorFiscal[],
): string | undefined {
  if (resposta.mensagem_sefaz) {
    return resposta.status_sefaz
      ? `${resposta.status_sefaz} - ${resposta.mensagem_sefaz}`
      : resposta.mensagem_sefaz;
  }
  if (erros.length > 0) {
    return erros.map((e) => e.mensagem).join('; ');
  }
  return resposta.mensagem;
}

/**
 * Extrai o protocolo da resposta considerando os diferentes nomes de campo
 * que a Focus NFe usa conforme o endpoint (emissão/consulta usam
 * `protocolo`; inutilização usa `protocolo_sefaz`/`numero_protocolo`).
 */
function extrairProtocolo(resposta: RespostaFocusNFe): string | undefined {
  return resposta.protocolo ?? resposta.protocolo_sefaz ?? resposta.numero_protocolo ?? undefined;
}

/** Converte number|string → number, preservando undefined. */
function paraNumero(valor?: string | number): number | undefined {
  if (valor === undefined || valor === null || valor === '') {
    return undefined;
  }
  const n = typeof valor === 'number' ? valor : Number(valor);
  return Number.isNaN(n) ? undefined : n;
}

/** Converte number|string → string, preservando undefined. */
function paraTexto(valor?: string | number): string | undefined {
  if (valor === undefined || valor === null) {
    return undefined;
  }
  return String(valor);
}

/**
 * Mapeia uma resposta genérica da Focus NFe (emissão, consulta, webhook)
 * para o resultado de domínio.
 *
 * @param ref Referência do domínio; usada quando a resposta não a inclui.
 */
export function mapearRespostaFocus(
  resposta: RespostaFocusNFe,
  ref?: string,
): ResultadoProvedorFiscal {
  const status = mapearStatusFocus(resposta.status);
  const erros = mapearErrosFocus(resposta);

  return {
    status,
    ref: resposta.ref ?? ref,
    refExterna: resposta.ref ?? ref,
    chaveAcesso: resposta.chave_nfe,
    protocolo: extrairProtocolo(resposta),
    numero: paraNumero(resposta.numero),
    serie: paraTexto(resposta.serie),
    codigoStatusSefaz: resposta.status_sefaz,
    mensagemSefaz: resposta.mensagem_sefaz,
    motivo: consolidarMotivo(resposta, erros),
    caminhoDanfe: resposta.caminho_danfe,
    erros: erros.length > 0 ? erros : undefined,
    bruto: resposta,
  };
}

/**
 * Mapeia a resposta de cancelamento da Focus NFe. Usa o XML de cancelamento
 * como referência de sucesso e reaproveita o mapeamento de status.
 */
export function mapearCancelamentoFocus(
  resposta: RespostaFocusNFe,
  ref?: string,
): ResultadoProvedorFiscal {
  const base = mapearRespostaFocus(resposta, ref);
  return base;
}

/**
 * Constrói um resultado de ERRO de integração/transporte (ex.: timeout,
 * 5xx, resposta ilegível) sem depender de um status válido do provedor.
 */
export function resultadoErroIntegracao(
  mensagem: string,
  ref?: string,
  bruto?: unknown,
): ResultadoProvedorFiscal {
  return {
    status: StatusProvedorFiscal.ERRO,
    ref,
    motivo: mensagem,
    erros: [{ mensagem }],
    bruto,
  };
}
