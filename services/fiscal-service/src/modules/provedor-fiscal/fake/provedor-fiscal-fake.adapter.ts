/**
 * ProvedorFiscalFakeAdapter — implementação de desenvolvimento/testes do
 * ProvedorFiscalPort, SEM conta em provedor real (ADR-001, item 3 do escopo).
 *
 * Simula o comportamento da SEFAZ de forma determinística:
 * - Autorização: reaproveita a chave de acesso do domínio (44 dígitos, DV
 *   correto via `chave-acesso.util`), gera protocolo fake e um XML mínimo de
 *   nfeProc para exercitar o fluxo de guarda de XML.
 * - Rejeições determinísticas para permitir testar o caminho de erro sem
 *   depender de rede (ex.: CNPJ/CPF do destinatário zerado → rejeição 207).
 * - Cancelamento/CC-e/inutilização retornam sucesso determinístico.
 *
 * É o provedor default em dev (PROVEDOR_FISCAL ausente ou "fake").
 */

import { Injectable, Logger } from '@nestjs/common';

import { ProvedorFiscalPort, ContextoOperacaoFiscal } from '../provedor-fiscal.port';
import {
  DocumentoFiscalParaEmissao,
  ResultadoProvedorFiscal,
  StatusProvedorFiscal,
} from '../tipos/provedor-fiscal.tipos';
import { validarChaveAcesso } from '../../../utils/chave-acesso.util';
import { gerarDanfePdfMinimo } from '../../../utils/danfe-pdf.util';

/**
 * Documento de destinatário que dispara rejeição determinística no fake.
 * Espelha um cenário clássico de rejeição por dados inválidos.
 */
const DOC_DESTINATARIO_REJEITADO = '00000000000000';
const DOC_DESTINATARIO_REJEITADO_CPF = '00000000000';

@Injectable()
export class ProvedorFiscalFakeAdapter implements ProvedorFiscalPort {
  private readonly logger = new Logger(ProvedorFiscalFakeAdapter.name);

  async emitirNfe(nota: DocumentoFiscalParaEmissao): Promise<ResultadoProvedorFiscal> {
    return this.simularEmissao(nota);
  }

  async emitirNfce(nota: DocumentoFiscalParaEmissao): Promise<ResultadoProvedorFiscal> {
    return this.simularEmissao(nota);
  }

  /**
   * Simula a emissão: rejeita cenários determinísticos, senão autoriza com
   * chave real do domínio, protocolo fake e XML mínimo.
   */
  private simularEmissao(nota: DocumentoFiscalParaEmissao): ResultadoProvedorFiscal {
    const docDest = nota.destinatario?.cpfCnpj?.replace(/\D/g, '');

    // Rejeição determinística: destinatário com documento zerado.
    if (docDest === DOC_DESTINATARIO_REJEITADO || docDest === DOC_DESTINATARIO_REJEITADO_CPF) {
      this.logger.warn(
        `[FAKE] Rejeitando ${nota.modelo} ref=${nota.ref}: documento do destinatário inválido`,
      );
      return {
        status: StatusProvedorFiscal.REJEITADO,
        ref: nota.ref,
        refExterna: nota.ref,
        codigoStatusSefaz: '207',
        mensagemSefaz: 'Rejeicao: CNPJ do destinatario invalido',
        motivo: '207 - Rejeicao: CNPJ do destinatario invalido',
        erros: [
          {
            codigo: '207',
            mensagem: 'Rejeicao: CNPJ do destinatario invalido',
            campo: 'cnpj_destinatario',
          },
        ],
      };
    }

    // A chave de acesso já vem calculada pelo domínio; validamos para garantir
    // que o fake não "autorize" uma chave malformada.
    if (!validarChaveAcesso(nota.chaveAcesso)) {
      this.logger.error(`[FAKE] Chave de acesso inválida ref=${nota.ref}: ${nota.chaveAcesso}`);
      return {
        status: StatusProvedorFiscal.REJEITADO,
        ref: nota.ref,
        refExterna: nota.ref,
        codigoStatusSefaz: '236',
        mensagemSefaz: 'Rejeicao: Chave de Acesso com digito verificador invalido',
        motivo: '236 - Rejeicao: Chave de Acesso com digito verificador invalido',
        erros: [
          {
            codigo: '236',
            mensagem: 'Rejeicao: Chave de Acesso com digito verificador invalido',
          },
        ],
      };
    }

    const protocolo = this.gerarProtocoloFake();
    const xml = this.gerarXmlAutorizadoFake(nota, protocolo);

    this.logger.log(
      `[FAKE] ${nota.modelo} autorizada ref=${nota.ref} chave=${nota.chaveAcesso} protocolo=${protocolo}`,
    );

    return {
      status: StatusProvedorFiscal.AUTORIZADO,
      ref: nota.ref,
      refExterna: nota.ref,
      chaveAcesso: nota.chaveAcesso,
      protocolo,
      numero: nota.numero,
      serie: nota.serie,
      codigoStatusSefaz: '100',
      mensagemSefaz: 'Autorizado o uso da NF-e',
      xml,
    };
  }

  async consultar(
    ref: string,
    _contexto: ContextoOperacaoFiscal,
  ): Promise<ResultadoProvedorFiscal> {
    // Sem estado persistido no fake: reporta autorizado de forma otimista.
    // Suficiente para exercitar o fluxo de consulta em dev.
    return {
      status: StatusProvedorFiscal.AUTORIZADO,
      ref,
      refExterna: ref,
      codigoStatusSefaz: '100',
      mensagemSefaz: 'Autorizado o uso da NF-e',
    };
  }

  async cancelar(
    ref: string,
    justificativa: string,
    _contexto: ContextoOperacaoFiscal,
  ): Promise<ResultadoProvedorFiscal> {
    if (!justificativa || justificativa.trim().length < 15) {
      return {
        status: StatusProvedorFiscal.ERRO_CANCELAMENTO,
        ref,
        motivo: 'Justificativa de cancelamento deve ter ao menos 15 caracteres',
        erros: [{ mensagem: 'Justificativa de cancelamento invalida', campo: 'justificativa' }],
      };
    }

    const protocolo = this.gerarProtocoloFake();
    this.logger.log(`[FAKE] Cancelamento autorizado ref=${ref} protocolo=${protocolo}`);

    return {
      status: StatusProvedorFiscal.CANCELADO,
      ref,
      refExterna: ref,
      protocolo,
      codigoStatusSefaz: '135',
      mensagemSefaz: 'Evento registrado e vinculado a NF-e',
    };
  }

  async cartaCorrecao(
    ref: string,
    texto: string,
    _contexto: ContextoOperacaoFiscal,
  ): Promise<ResultadoProvedorFiscal> {
    if (!texto || texto.trim().length < 15) {
      return {
        status: StatusProvedorFiscal.ERRO,
        ref,
        motivo: 'Texto da carta de correcao deve ter ao menos 15 caracteres',
        erros: [{ mensagem: 'Texto da correcao invalido', campo: 'correcao' }],
      };
    }

    const protocolo = this.gerarProtocoloFake();
    this.logger.log(`[FAKE] Carta de correcao autorizada ref=${ref} protocolo=${protocolo}`);

    return {
      status: StatusProvedorFiscal.AUTORIZADO,
      ref,
      refExterna: ref,
      protocolo,
      codigoStatusSefaz: '135',
      mensagemSefaz: 'Evento registrado e vinculado a NF-e',
    };
  }

  async inutilizar(
    serie: string,
    faixa: { inicial: number; final: number },
    justificativa: string,
    _contexto: ContextoOperacaoFiscal & { cnpjEmitente: string },
  ): Promise<ResultadoProvedorFiscal> {
    if (!justificativa || justificativa.trim().length < 15) {
      return {
        status: StatusProvedorFiscal.ERRO,
        motivo: 'Justificativa de inutilizacao deve ter ao menos 15 caracteres',
        erros: [{ mensagem: 'Justificativa invalida', campo: 'justificativa' }],
      };
    }

    const protocolo = this.gerarProtocoloFake();
    this.logger.log(
      `[FAKE] Inutilizacao autorizada serie=${serie} faixa=${faixa.inicial}-${faixa.final} protocolo=${protocolo}`,
    );

    return {
      status: StatusProvedorFiscal.AUTORIZADO,
      protocolo,
      serie,
      codigoStatusSefaz: '102',
      mensagemSefaz: 'Inutilizacao de numero homologado',
    };
  }

  async obterXml(_ref: string, _contexto: ContextoOperacaoFiscal): Promise<string | null> {
    // O fake não guarda o XML por ref; o XML é devolvido na emissão e o
    // domínio o persiste. Consultas posteriores por XML retornam null.
    return null;
  }

  async obterDanfePdf(ref: string, contexto: ContextoOperacaoFiscal): Promise<Buffer | null> {
    // Gera um PDF mínimo VÁLIDO montado à mão (sem lib), para o fluxo de dev
    // baixar o DANFE. O fake conhece apenas a `ref` (id da nota) e o contexto;
    // o serviço, que tem a nota completa, monta um DANFE mais rico via o mesmo
    // util quando o provedor não fornece PDF. Aqui devolvemos um documento
    // aberto por qualquer leitor, com a ref no lugar da chave.
    const titulo = contexto.modelo === 'NFCE' ? 'DANFCE (NFC-e) - DEV' : 'DANFE (NF-e) - DEV';
    return gerarDanfePdfMinimo({
      titulo,
      chaveAcesso: ref,
      numero: '-',
      serie: '-',
      modelo: contexto.modelo === 'NFCE' ? '65' : '55',
      ambiente: contexto.ambiente,
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Helpers de simulação
  // ─────────────────────────────────────────────────────────────

  /**
   * Gera um protocolo fake com 15 dígitos no formato aproximado da SEFAZ
   * (prefixo de ambiente + timestamp + sequencial). Determinístico o
   * suficiente para dev, não colidente na prática.
   */
  private gerarProtocoloFake(): string {
    const timestamp = Date.now().toString().slice(-11);
    const sequencial = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0');
    return `999${timestamp}${sequencial}`.slice(0, 15);
  }

  /**
   * Gera um XML mínimo de nfeProc autorizado para o fluxo de guarda de XML.
   * Não é um XML 4.00 completo — é um esqueleto suficiente para dev/testes,
   * com a chave e o protocolo reais do fluxo.
   */
  private gerarXmlAutorizadoFake(nota: DocumentoFiscalParaEmissao, protocolo: string): string {
    const tpAmb = nota.ambiente === 'PRODUCAO' ? '1' : '2';
    const dhRecbto = new Date().toISOString();
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">',
      `  <protNFe versao="4.00">`,
      '    <infProt>',
      `      <tpAmb>${tpAmb}</tpAmb>`,
      '      <verAplic>FAKE-PROVEDOR-DEV</verAplic>',
      `      <chNFe>${nota.chaveAcesso}</chNFe>`,
      `      <dhRecbto>${dhRecbto}</dhRecbto>`,
      `      <nProt>${protocolo}</nProt>`,
      '      <digVal>FAKE</digVal>',
      '      <cStat>100</cStat>',
      '      <xMotivo>Autorizado o uso da NF-e</xMotivo>',
      '    </infProt>',
      '  </protNFe>',
      '</nfeProc>',
    ].join('\n');
  }
}
