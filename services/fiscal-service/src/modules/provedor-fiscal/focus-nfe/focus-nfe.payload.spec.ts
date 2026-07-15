/**
 * Testes da construção do payload de emissão da Focus NFe.
 *
 * Verifica o mapeamento domínio → formato-do-provedor nos pontos sensíveis:
 * emitente por CNPJ vs CPF, destinatário CPF vs CNPJ, conversão de alíquota
 * (fração → percentual), serialização monetária em reais, e a regra de
 * homologação (nome do destinatário forçado para a frase legal da SEFAZ).
 */

import { construirPayloadFocus } from './focus-nfe.payload';
import { DocumentoFiscalParaEmissao } from '../tipos/provedor-fiscal.tipos';

function documento(
  overrides: Partial<DocumentoFiscalParaEmissao> = {},
): DocumentoFiscalParaEmissao {
  return {
    ref: 'nota-1',
    modelo: 'NFE',
    ambiente: 'PRODUCAO',
    chaveAcesso: '35240100000000000000550010000000011000000017',
    naturezaOperacao: 'VENDA',
    serie: '1',
    numero: 1,
    dataEmissao: new Date('2026-01-15T10:00:00.000Z'),
    emitente: {
      cpfCnpj: '11222333000181',
      nome: 'Empresa Teste LTDA',
      regimeTributario: 3,
      endereco: {
        logradouro: 'Rua Exemplo',
        numero: '100',
        bairro: 'Centro',
        municipio: 'Sao Paulo',
        uf: 'SP',
        cep: '01000-000',
      },
    },
    destinatario: {
      cpfCnpj: '52.998.224/725-00'.replace(/\D/g, '').slice(0, 11) || '52998224725',
      nome: 'Cliente Real',
    },
    itens: [
      {
        numero: 1,
        codigoProduto: 'prod-1',
        descricao: 'Produto',
        ncm: '61091000',
        cfop: '5102',
        unidadeComercial: 'UN',
        quantidadeComercial: 2,
        valorUnitarioComercial: 50,
        valorBruto: 100,
        icmsOrigem: '0',
        icmsSituacaoTributaria: '00',
        icmsAliquota: 0.18,
        pisSituacaoTributaria: '01',
        pisAliquota: 0.0165,
        cofinsSituacaoTributaria: '01',
        cofinsAliquota: 0.076,
      },
    ],
    valorProdutos: 100,
    valorTotal: 100,
    ...overrides,
  };
}

describe('construirPayloadFocus — emitente e destinatário', () => {
  it('define cnpj_emitente quando o documento do emitente tem 14 dígitos', () => {
    const payload = construirPayloadFocus(documento());
    expect(payload.cnpj_emitente).toBe('11222333000181');
    expect(payload.cpf_emitente).toBeUndefined();
    expect(payload.regime_tributario_emitente).toBe(3);
  });

  it('define cpf_emitente quando o documento do emitente tem 11 dígitos', () => {
    const payload = construirPayloadFocus(
      documento({
        emitente: {
          cpfCnpj: '52998224725',
          nome: 'Produtor Rural',
          endereco: {
            logradouro: 'Sitio',
            numero: 'S/N',
            bairro: 'Zona Rural',
            municipio: 'Interior',
            uf: 'SP',
            cep: '18000000',
          },
        },
      }),
    );
    expect(payload.cpf_emitente).toBe('52998224725');
    expect(payload.cnpj_emitente).toBeUndefined();
  });

  it('escolhe cpf_destinatario para documento de 11 dígitos', () => {
    const payload = construirPayloadFocus(documento());
    expect(payload.cpf_destinatario).toBe('52998224725');
    expect(payload.cnpj_destinatario).toBeUndefined();
  });

  it('escolhe cnpj_destinatario para documento de 14 dígitos', () => {
    const payload = construirPayloadFocus(
      documento({ destinatario: { cpfCnpj: '11222333000181', nome: 'Empresa Cliente' } }),
    );
    expect(payload.cnpj_destinatario).toBe('11222333000181');
    expect(payload.cpf_destinatario).toBeUndefined();
  });

  it('remove máscara do CEP do emitente', () => {
    const payload = construirPayloadFocus(documento());
    expect(payload.cep_emitente).toBe('01000000');
  });
});

describe('construirPayloadFocus — homologação', () => {
  it('força o nome do destinatário para a frase legal em homologação', () => {
    const payload = construirPayloadFocus(documento({ ambiente: 'HOMOLOGACAO' }));
    expect(payload.nome_destinatario).toBe(
      'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL',
    );
  });

  it('mantém o nome real do destinatário em produção', () => {
    const payload = construirPayloadFocus(documento({ ambiente: 'PRODUCAO' }));
    expect(payload.nome_destinatario).toBe('Cliente Real');
  });
});

describe('construirPayloadFocus — itens e valores', () => {
  it('converte alíquotas de fração decimal para percentual', () => {
    const payload = construirPayloadFocus(documento());
    const item = payload.items[0];
    // 0.18 → "18.00", 0.0165 → "1.65", 0.076 → "7.60"
    expect(item.icms_aliquota).toBe('18.00');
    expect(item.pis_aliquota).toBe('1.65');
    expect(item.cofins_aliquota).toBe('7.60');
  });

  it('serializa quantidade (4 casas) e valores (2 casas) em reais', () => {
    const payload = construirPayloadFocus(documento());
    const item = payload.items[0];
    expect(item.quantidade_comercial).toBe('2.0000');
    expect(item.valor_unitario_comercial).toBe('50.00');
    expect(item.valor_bruto).toBe('100.00');
    expect(payload.valor_produtos).toBe('100.00');
    expect(payload.valor_total).toBe('100.00');
  });

  it('espelha unidade/quantidade/valor comercial em tributável', () => {
    const payload = construirPayloadFocus(documento());
    const item = payload.items[0];
    expect(item.unidade_tributavel).toBe(item.unidade_comercial);
    expect(item.quantidade_tributavel).toBe(item.quantidade_comercial);
    expect(item.valor_unitario_tributavel).toBe(item.valor_unitario_comercial);
  });

  it('define modelo 65 para NFC-e e 55 para NF-e', () => {
    expect(construirPayloadFocus(documento({ modelo: 'NFE' })).modelo).toBe(55);
    expect(construirPayloadFocus(documento({ modelo: 'NFCE' })).modelo).toBe(65);
  });

  it('omite alíquotas ausentes/zero do item', () => {
    const payload = construirPayloadFocus(
      documento({
        itens: [
          {
            numero: 1,
            codigoProduto: 'p',
            descricao: 'Item sem aliquota',
            ncm: '00000000',
            cfop: '5102',
            unidadeComercial: 'UN',
            quantidadeComercial: 1,
            valorUnitarioComercial: 10,
            valorBruto: 10,
            icmsOrigem: '0',
            icmsSituacaoTributaria: '102',
            pisSituacaoTributaria: '07',
            cofinsSituacaoTributaria: '07',
          },
        ],
      }),
    );
    const item = payload.items[0];
    expect(item.icms_aliquota).toBeUndefined();
    expect(item.pis_aliquota).toBeUndefined();
    expect(item.cofins_aliquota).toBeUndefined();
  });
});
