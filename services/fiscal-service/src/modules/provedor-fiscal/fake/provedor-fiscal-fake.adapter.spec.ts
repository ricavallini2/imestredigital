/**
 * Testes do ProvedorFiscalFakeAdapter.
 *
 * Garante o comportamento determinístico do provedor de dev/testes:
 * - Autoriza reaproveitando a chave de acesso real do domínio, com protocolo
 *   e XML mínimo.
 * - Rejeita cenários determinísticos (destinatário com documento zerado;
 *   chave de acesso com DV inválido).
 * - Cancelamento/CC-e/inutilização com validação de justificativa/texto.
 *
 * A chave de acesso usada nos testes é gerada pelo MESMO util do domínio
 * (`gerarChaveAcesso`), então o DV é sempre correto e independente de
 * hardcode.
 */

import { ProvedorFiscalFakeAdapter } from './provedor-fiscal-fake.adapter';
import { gerarChaveAcesso, validarChaveAcesso } from '../../../utils/chave-acesso.util';
import { DocumentoFiscalParaEmissao, StatusProvedorFiscal } from '../tipos/provedor-fiscal.tipos';
import { ContextoOperacaoFiscal } from '../provedor-fiscal.port';

/** Contexto de homologação para as operações por referência. */
const CONTEXTO: ContextoOperacaoFiscal = {
  ambiente: 'HOMOLOGACAO',
  modelo: 'NFE',
};

/** Monta um documento de emissão válido, com chave de acesso real. */
function documentoValido(
  overrides: Partial<DocumentoFiscalParaEmissao> = {},
): DocumentoFiscalParaEmissao {
  const chaveAcesso = gerarChaveAcesso({
    uf: 'SP',
    ano: 2026,
    mes: 1,
    cnpj: '11222333000181',
    tipo: 'NFE',
    serie: '1',
    numero: 1,
  });

  return {
    ref: 'nota-abc-123',
    modelo: 'NFE',
    ambiente: 'HOMOLOGACAO',
    chaveAcesso,
    naturezaOperacao: 'VENDA',
    serie: '1',
    numero: 1,
    dataEmissao: new Date('2026-01-15T10:00:00.000Z'),
    emitente: {
      cpfCnpj: '11222333000181',
      nome: 'Empresa Teste LTDA',
      endereco: {
        logradouro: 'Rua Exemplo',
        numero: '100',
        bairro: 'Centro',
        municipio: 'Sao Paulo',
        uf: 'SP',
        cep: '01000000',
      },
    },
    destinatario: {
      cpfCnpj: '52998224725',
      nome: 'Cliente Teste',
    },
    itens: [
      {
        numero: 1,
        codigoProduto: 'prod-1',
        descricao: 'Produto de teste',
        ncm: '61091000',
        cfop: '5102',
        unidadeComercial: 'UN',
        quantidadeComercial: 1,
        valorUnitarioComercial: 100,
        valorBruto: 100,
        icmsOrigem: '0',
        icmsSituacaoTributaria: '102',
        pisSituacaoTributaria: '07',
        cofinsSituacaoTributaria: '07',
      },
    ],
    valorProdutos: 100,
    valorTotal: 100,
    ...overrides,
  };
}

describe('ProvedorFiscalFakeAdapter — emissão', () => {
  let adapter: ProvedorFiscalFakeAdapter;

  beforeEach(() => {
    adapter = new ProvedorFiscalFakeAdapter();
  });

  it('autoriza a NF-e reaproveitando a chave de acesso do domínio', async () => {
    const documento = documentoValido();
    const resultado = await adapter.emitirNfe(documento);

    expect(resultado.status).toBe(StatusProvedorFiscal.AUTORIZADO);
    expect(resultado.ref).toBe('nota-abc-123');
    expect(resultado.chaveAcesso).toBe(documento.chaveAcesso);
    expect(validarChaveAcesso(resultado.chaveAcesso!)).toBe(true);
    expect(resultado.protocolo).toBeDefined();
    expect(resultado.protocolo).toHaveLength(15);
    expect(resultado.codigoStatusSefaz).toBe('100');
    expect(resultado.xml).toContain('<nfeProc');
    expect(resultado.xml).toContain(documento.chaveAcesso);
    expect(resultado.xml).toContain('<cStat>100</cStat>');
  });

  it('autoriza NFC-e pelo mesmo caminho determinístico', async () => {
    const documento = documentoValido({ modelo: 'NFCE', consumidorFinal: true });
    const resultado = await adapter.emitirNfce(documento);
    expect(resultado.status).toBe(StatusProvedorFiscal.AUTORIZADO);
    expect(resultado.chaveAcesso).toBe(documento.chaveAcesso);
  });

  it('rejeita determinísticamente quando o destinatário tem CNPJ zerado', async () => {
    const documento = documentoValido({
      destinatario: { cpfCnpj: '00000000000000', nome: 'Invalido' },
    });
    const resultado = await adapter.emitirNfe(documento);

    expect(resultado.status).toBe(StatusProvedorFiscal.REJEITADO);
    expect(resultado.codigoStatusSefaz).toBe('207');
    expect(resultado.motivo).toContain('CNPJ do destinatario invalido');
    expect(resultado.erros?.[0].campo).toBe('cnpj_destinatario');
    // Não deve produzir chave/protocolo de autorização.
    expect(resultado.protocolo).toBeUndefined();
  });

  it('rejeita determinísticamente quando o destinatário tem CPF zerado', async () => {
    const documento = documentoValido({
      destinatario: { cpfCnpj: '00000000000', nome: 'Invalido' },
    });
    const resultado = await adapter.emitirNfe(documento);
    expect(resultado.status).toBe(StatusProvedorFiscal.REJEITADO);
    expect(resultado.codigoStatusSefaz).toBe('207');
  });

  it('rejeita quando a chave de acesso tem dígito verificador inválido', async () => {
    // Corrompe o último dígito (DV) para forçar chave inválida.
    const chaveValida = documentoValido().chaveAcesso;
    const dvErrado = chaveValida.slice(0, 43) + (chaveValida.endsWith('0') ? '1' : '0');
    const documento = documentoValido({ chaveAcesso: dvErrado });

    const resultado = await adapter.emitirNfe(documento);
    expect(resultado.status).toBe(StatusProvedorFiscal.REJEITADO);
    expect(resultado.codigoStatusSefaz).toBe('236');
  });

  it('gera XML com tpAmb=1 em produção e tpAmb=2 em homologação', async () => {
    const homolog = await adapter.emitirNfe(documentoValido({ ambiente: 'HOMOLOGACAO' }));
    expect(homolog.xml).toContain('<tpAmb>2</tpAmb>');

    const producao = await adapter.emitirNfe(documentoValido({ ambiente: 'PRODUCAO' }));
    expect(producao.xml).toContain('<tpAmb>1</tpAmb>');
  });
});

describe('ProvedorFiscalFakeAdapter — eventos', () => {
  let adapter: ProvedorFiscalFakeAdapter;

  beforeEach(() => {
    adapter = new ProvedorFiscalFakeAdapter();
  });

  it('cancela com justificativa válida', async () => {
    const resultado = await adapter.cancelar(
      'nota-1',
      'Cancelamento por erro de digitacao no valor',
      CONTEXTO,
    );
    expect(resultado.status).toBe(StatusProvedorFiscal.CANCELADO);
    expect(resultado.protocolo).toBeDefined();
    expect(resultado.codigoStatusSefaz).toBe('135');
  });

  it('recusa cancelamento com justificativa curta (< 15 chars)', async () => {
    const resultado = await adapter.cancelar('nota-1', 'curto', CONTEXTO);
    expect(resultado.status).toBe(StatusProvedorFiscal.ERRO_CANCELAMENTO);
    expect(resultado.erros?.[0].campo).toBe('justificativa');
  });

  it('autoriza carta de correção com texto válido', async () => {
    const resultado = await adapter.cartaCorrecao(
      'nota-1',
      'Correcao do endereco de entrega do destinatario',
      CONTEXTO,
    );
    expect(resultado.status).toBe(StatusProvedorFiscal.AUTORIZADO);
    expect(resultado.protocolo).toBeDefined();
  });

  it('recusa carta de correção com texto curto', async () => {
    const resultado = await adapter.cartaCorrecao('nota-1', 'curto', CONTEXTO);
    expect(resultado.status).toBe(StatusProvedorFiscal.ERRO);
    expect(resultado.erros?.[0].campo).toBe('correcao');
  });

  it('autoriza inutilização de faixa com justificativa válida', async () => {
    const resultado = await adapter.inutilizar(
      '1',
      { inicial: 10, final: 20 },
      'Inutilizacao por salto de numeracao no sistema',
      { ...CONTEXTO, cnpjEmitente: '11222333000181' },
    );
    expect(resultado.status).toBe(StatusProvedorFiscal.AUTORIZADO);
    expect(resultado.protocolo).toBeDefined();
    expect(resultado.serie).toBe('1');
    expect(resultado.codigoStatusSefaz).toBe('102');
  });

  it('recusa inutilização com justificativa curta', async () => {
    const resultado = await adapter.inutilizar('1', { inicial: 10, final: 20 }, 'curto', {
      ...CONTEXTO,
      cnpjEmitente: '11222333000181',
    });
    expect(resultado.status).toBe(StatusProvedorFiscal.ERRO);
  });
});

describe('ProvedorFiscalFakeAdapter — consulta e artefatos', () => {
  let adapter: ProvedorFiscalFakeAdapter;

  beforeEach(() => {
    adapter = new ProvedorFiscalFakeAdapter();
  });

  it('consulta retorna autorizado (otimista) para exercitar o fluxo', async () => {
    const resultado = await adapter.consultar('nota-1', CONTEXTO);
    expect(resultado.status).toBe(StatusProvedorFiscal.AUTORIZADO);
    expect(resultado.ref).toBe('nota-1');
  });

  it('não fornece XML persistido (retorna null)', async () => {
    expect(await adapter.obterXml('nota-1', CONTEXTO)).toBeNull();
  });

  it('gera um DANFE em PDF mínimo VÁLIDO (application/pdf) para NF-e', async () => {
    const pdf = await adapter.obterDanfePdf('nota-1', CONTEXTO);
    expect(pdf).toBeInstanceOf(Buffer);
    expect(pdf!.length).toBeGreaterThan(0);
    // Assinatura de PDF + marcador de fim de arquivo → arquivo abrível.
    expect(pdf!.subarray(0, 5).toString('latin1')).toBe('%PDF-');
    expect(pdf!.toString('latin1')).toContain('%%EOF');
    // Traz a referência (id da nota) no corpo do documento.
    expect(pdf!.toString('latin1')).toContain('nota-1');
  });

  it('gera DANFCE (título NFC-e) quando o contexto é modelo NFCE', async () => {
    const pdf = await adapter.obterDanfePdf('nota-65', { ...CONTEXTO, modelo: 'NFCE' });
    expect(pdf).toBeInstanceOf(Buffer);
    expect(pdf!.toString('latin1')).toContain('DANFCE');
  });
});
