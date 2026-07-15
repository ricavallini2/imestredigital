/**
 * Testes do mapeamento Focus NFe → domínio fiscal.
 *
 * Cobre a tradução de status, a normalização de erros e a consolidação do
 * motivo — o ponto onde "o que o provedor devolveu" vira "o que o domínio
 * entende". Não faz rede: opera sobre payloads representativos da Focus NFe.
 */

import {
  mapearStatusFocus,
  mapearErrosFocus,
  consolidarMotivo,
  mapearRespostaFocus,
  resultadoErroIntegracao,
  RespostaFocusNFe,
} from './focus-nfe.mapper';
import { StatusProvedorFiscal } from '../tipos/provedor-fiscal.tipos';

describe('focus-nfe.mapper — mapeamento de status', () => {
  it('mapeia cada status conhecido da Focus para o status de domínio', () => {
    expect(mapearStatusFocus('autorizado')).toBe(StatusProvedorFiscal.AUTORIZADO);
    expect(mapearStatusFocus('processando_autorizacao')).toBe(StatusProvedorFiscal.PROCESSANDO);
    expect(mapearStatusFocus('erro_autorizacao')).toBe(StatusProvedorFiscal.REJEITADO);
    expect(mapearStatusFocus('denegado')).toBe(StatusProvedorFiscal.DENEGADO);
    expect(mapearStatusFocus('cancelado')).toBe(StatusProvedorFiscal.CANCELADO);
    expect(mapearStatusFocus('erro_cancelamento')).toBe(StatusProvedorFiscal.ERRO_CANCELAMENTO);
  });

  it('mapeia status ausente ou desconhecido para ERRO (conservador)', () => {
    expect(mapearStatusFocus(undefined)).toBe(StatusProvedorFiscal.ERRO);
    expect(mapearStatusFocus('')).toBe(StatusProvedorFiscal.ERRO);
    expect(mapearStatusFocus('status_que_nao_existe')).toBe(StatusProvedorFiscal.ERRO);
  });
});

describe('focus-nfe.mapper — normalização de erros', () => {
  it('extrai o array de erros com codigo/mensagem/campo', () => {
    const resposta: RespostaFocusNFe = {
      status: 'erro_autorizacao',
      erros: [
        { codigo: '215', mensagem: 'Falha no schema XML', campo: 'ncm' },
        { mensagem: 'CFOP invalido' },
      ],
    };
    const erros = mapearErrosFocus(resposta);
    expect(erros).toHaveLength(2);
    expect(erros[0]).toEqual({
      codigo: '215',
      mensagem: 'Falha no schema XML',
      campo: 'ncm',
    });
    expect(erros[1].mensagem).toBe('CFOP invalido');
  });

  it('cai para o par { codigo, mensagem } quando não há array de erros', () => {
    const resposta: RespostaFocusNFe = {
      codigo: 'requisicao_invalida',
      mensagem: 'CNPJ do emitente não habilitado',
    };
    const erros = mapearErrosFocus(resposta);
    expect(erros).toHaveLength(1);
    expect(erros[0].codigo).toBe('requisicao_invalida');
    expect(erros[0].mensagem).toBe('CNPJ do emitente não habilitado');
  });

  it('retorna lista vazia quando não há erro algum', () => {
    expect(mapearErrosFocus({ status: 'autorizado' })).toEqual([]);
  });
});

describe('focus-nfe.mapper — consolidação de motivo', () => {
  it('prioriza a mensagem da SEFAZ prefixada pelo status', () => {
    const resposta: RespostaFocusNFe = {
      status: 'erro_autorizacao',
      status_sefaz: '539',
      mensagem_sefaz: 'Rejeicao: Duplicidade de NF-e',
    };
    const motivo = consolidarMotivo(resposta, []);
    expect(motivo).toBe('539 - Rejeicao: Duplicidade de NF-e');
  });

  it('usa os erros de validação quando não há mensagem da SEFAZ', () => {
    const erros = [{ mensagem: 'NCM invalido' }, { mensagem: 'CFOP invalido' }];
    const motivo = consolidarMotivo({ status: 'erro_autorizacao' }, erros);
    expect(motivo).toBe('NCM invalido; CFOP invalido');
  });
});

describe('focus-nfe.mapper — mapeamento de resposta completa', () => {
  it('mapeia uma autorização com todos os campos relevantes', () => {
    const resposta: RespostaFocusNFe = {
      status: 'autorizado',
      status_sefaz: '100',
      mensagem_sefaz: 'Autorizado o uso da NF-e',
      chave_nfe: '35240100000000000000550010000000011000000017',
      numero: '1',
      serie: '1',
      protocolo: '135240000000001',
      ref: 'nota-123',
      caminho_danfe: '/notas_fiscais/abc/danfe',
    };
    const resultado = mapearRespostaFocus(resposta);

    expect(resultado.status).toBe(StatusProvedorFiscal.AUTORIZADO);
    expect(resultado.ref).toBe('nota-123');
    expect(resultado.refExterna).toBe('nota-123');
    expect(resultado.chaveAcesso).toBe('35240100000000000000550010000000011000000017');
    expect(resultado.protocolo).toBe('135240000000001');
    expect(resultado.numero).toBe(1);
    expect(resultado.serie).toBe('1');
    expect(resultado.codigoStatusSefaz).toBe('100');
    expect(resultado.caminhoDanfe).toBe('/notas_fiscais/abc/danfe');
    expect(resultado.erros).toBeUndefined();
  });

  it('mapeia uma rejeição preservando erros e motivo', () => {
    const resposta: RespostaFocusNFe = {
      status: 'erro_autorizacao',
      status_sefaz: '215',
      mensagem_sefaz: 'Rejeicao: Falha no schema XML',
      erros: [{ codigo: '215', mensagem: 'Falha no schema XML', campo: 'det' }],
    };
    const resultado = mapearRespostaFocus(resposta, 'nota-999');

    expect(resultado.status).toBe(StatusProvedorFiscal.REJEITADO);
    expect(resultado.ref).toBe('nota-999');
    expect(resultado.motivo).toBe('215 - Rejeicao: Falha no schema XML');
    expect(resultado.erros).toHaveLength(1);
    expect(resultado.erros?.[0].campo).toBe('det');
  });

  it('usa a ref fornecida quando a resposta não a inclui', () => {
    const resultado = mapearRespostaFocus({ status: 'autorizado' }, 'ref-fallback');
    expect(resultado.ref).toBe('ref-fallback');
    expect(resultado.refExterna).toBe('ref-fallback');
  });

  it('mapeia o protocolo de inutilização (protocolo_sefaz/numero_protocolo)', () => {
    const porProtocoloSefaz = mapearRespostaFocus({
      status: 'autorizado',
      protocolo_sefaz: '999999',
    });
    expect(porProtocoloSefaz.protocolo).toBe('999999');

    const porNumeroProtocolo = mapearRespostaFocus({
      status: 'autorizado',
      numero_protocolo: '888888',
    });
    expect(porNumeroProtocolo.protocolo).toBe('888888');
  });
});

describe('focus-nfe.mapper — erro de integração', () => {
  it('constrói um resultado de ERRO sem depender de status do provedor', () => {
    const resultado = resultadoErroIntegracao('Timeout na comunicação', 'nota-1');
    expect(resultado.status).toBe(StatusProvedorFiscal.ERRO);
    expect(resultado.ref).toBe('nota-1');
    expect(resultado.motivo).toBe('Timeout na comunicação');
    expect(resultado.erros?.[0].mensagem).toBe('Timeout na comunicação');
  });
});
