/**
 * ProvedorFiscalPort — contrato de transmissão fiscal do ADR-001.
 *
 * O domínio fiscal (configuração por tenant, engine de tributos, numeração,
 * ciclo de vida da nota, guarda de XML) é NOSSO; a transmissão à SEFAZ vai
 * por um provedor terceirizado (Focus NFe na v1) atrás desta interface.
 *
 * `ref` é sempre o id da NotaFiscal no nosso domínio. Cada adapter persiste
 * internamente a referência externa por provedor, se necessário, mas o
 * domínio só conhece a `ref` própria.
 *
 * Nenhum método vaza shape do provedor: entradas e saídas usam os tipos de
 * domínio em `tipos/provedor-fiscal.tipos.ts`.
 */

import {
  DocumentoFiscalParaEmissao,
  ResultadoProvedorFiscal,
  AmbienteFiscal,
  ModeloDocumentoFiscal,
} from './tipos/provedor-fiscal.tipos';

/**
 * Token de injeção do provedor fiscal. Resolvido no módulo por uma factory
 * que escolhe o adapter conforme a env `PROVEDOR_FISCAL` (fake | focusnfe).
 */
export const PROVEDOR_FISCAL_PORT = Symbol('PROVEDOR_FISCAL_PORT');

/** Parâmetros de contexto comuns às operações por referência. */
export interface ContextoOperacaoFiscal {
  ambiente: AmbienteFiscal;
  modelo: ModeloDocumentoFiscal;
  /**
   * Token do provedor específico do tenant, quando a ConfiguracaoFiscal o
   * fornecer. Quando ausente, o adapter usa o token global de ambiente
   * (env). Ignorado pelo adapter fake.
   */
  tokenProvedor?: string;
}

/**
 * Porta de transmissão fiscal. Implementada por FocusNFeAdapter (real) e
 * ProvedorFiscalFakeAdapter (dev/testes sem conta).
 */
export interface ProvedorFiscalPort {
  /**
   * Emite uma NF-e (modelo 55). Retorna o resultado normalizado —
   * possivelmente ainda em PROCESSANDO, quando o provedor confirma a
   * autorização de forma assíncrona (via webhook).
   */
  emitirNfe(nota: DocumentoFiscalParaEmissao): Promise<ResultadoProvedorFiscal>;

  /**
   * Emite uma NFC-e (modelo 65). Exige CSC/idCSC no documento.
   */
  emitirNfce(nota: DocumentoFiscalParaEmissao): Promise<ResultadoProvedorFiscal>;

  /**
   * Consulta a situação atual de um documento pela referência do domínio.
   */
  consultar(ref: string, contexto: ContextoOperacaoFiscal): Promise<ResultadoProvedorFiscal>;

  /**
   * Cancela um documento autorizado.
   *
   * @param justificativa Motivo do cancelamento (15–255 caracteres).
   */
  cancelar(
    ref: string,
    justificativa: string,
    contexto: ContextoOperacaoFiscal,
  ): Promise<ResultadoProvedorFiscal>;

  /**
   * Emite uma Carta de Correção Eletrônica (CC-e) para a NF-e.
   *
   * @param texto Texto da correção (15–1000 caracteres).
   */
  cartaCorrecao(
    ref: string,
    texto: string,
    contexto: ContextoOperacaoFiscal,
  ): Promise<ResultadoProvedorFiscal>;

  /**
   * Inutiliza uma faixa de numeração não utilizada.
   *
   * @param serie Série da numeração.
   * @param faixa Números inicial e final (inclusivos).
   * @param justificativa Motivo da inutilização (15–255 caracteres).
   */
  inutilizar(
    serie: string,
    faixa: { inicial: number; final: number },
    justificativa: string,
    contexto: ContextoOperacaoFiscal & { cnpjEmitente: string },
  ): Promise<ResultadoProvedorFiscal>;

  /**
   * Obtém o PDF do DANFE/DANFCe do documento autorizado.
   *
   * @returns Buffer do PDF, ou null quando o provedor não o disponibiliza.
   */
  obterDanfePdf(ref: string, contexto: ContextoOperacaoFiscal): Promise<Buffer | null>;

  /**
   * Obtém o XML autorizado (nfeProc) do documento.
   *
   * @returns String do XML, ou null quando indisponível.
   */
  obterXml(ref: string, contexto: ContextoOperacaoFiscal): Promise<string | null>;
}
