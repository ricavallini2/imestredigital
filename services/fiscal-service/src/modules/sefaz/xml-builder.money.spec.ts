/**
 * Teste de unidade monetária (Etapa 0 fiscal).
 *
 * Prova que um valor em REAIS entra e sai idêntico ao longo da cadeia
 * DTO → "DB" (Prisma.Decimal, escala 19,2) → XML, sem nenhuma conversão de
 * centavos (÷100/×100) que antes reduzia os valores em 100×.
 *
 * Não depende de banco: o armazenamento é representado por Prisma.Decimal,
 * que é exatamente o tipo que o repositório grava e que o Prisma devolve na
 * leitura das colunas Decimal(19,2).
 */

import { Prisma } from '../../../generated/client';
import { XmlBuilderService } from './xml-builder.service';

describe('Unidade monetária — reais ponta a ponta (DTO → DB → XML)', () => {
  const builder = new XmlBuilderService();

  // Valor de referência: R$ 1.234,56
  const VALOR_DTO_REAIS = 1234.56;

  it('Prisma.Decimal preserva R$ 1.234,56 na escala do banco (19,2)', () => {
    // Simula a gravação: o repositório passa o número em reais para a coluna
    // Decimal(19,2). Prisma.Decimal representa isso sem perda.
    const valorNoBanco = new Prisma.Decimal(VALOR_DTO_REAIS);

    expect(valorNoBanco.toFixed(2)).toBe('1234.56');
    // Não pode ter virado centavos nem sido dividido por 100.
    expect(valorNoBanco.toNumber()).toBe(1234.56);
    expect(valorNoBanco.toNumber()).not.toBe(12.35);
    expect(valorNoBanco.toNumber()).not.toBe(123456);
  });

  it('o XML da NF-e emite o mesmo valor em reais (vProd/vNF), sem ÷100', async () => {
    const valorNoBanco = new Prisma.Decimal(VALOR_DTO_REAIS);

    const nota: any = {
      chaveAcesso: '35240100000000000000550010000000011000000017',
      naturezaOperacao: 'VENDA',
      serie: '1',
      numero: 1,
      dataEmissao: new Date('2026-01-15T10:00:00.000Z'),
      dataSaida: null,
      valorProdutos: valorNoBanco,
      valorTotal: valorNoBanco,
      valorDesconto: new Prisma.Decimal(0),
      valorFrete: new Prisma.Decimal(0),
      valorSeguro: new Prisma.Decimal(0),
      valorOutros: new Prisma.Decimal(0),
      valorIcms: new Prisma.Decimal(0),
      valorPis: new Prisma.Decimal(0),
      valorCofins: new Prisma.Decimal(0),
      valorIpi: new Prisma.Decimal(0),
      informacoesAdicionais: '',
    };

    const itens: any[] = [
      {
        produtoId: 'produto-1',
        descricao: 'Produto de teste',
        ncm: '61091000',
        cfop: '5102',
        unidade: 'UN',
        quantidade: new Prisma.Decimal(1),
        valorUnitario: valorNoBanco,
        valorTotal: valorNoBanco,
        valorDesconto: new Prisma.Decimal(0),
        origemMercadoria: '0',
        cstIcms: '00',
        aliquotaIcms: new Prisma.Decimal('0.18'),
        baseIcms: valorNoBanco,
        valorIcms: new Prisma.Decimal(0),
        cstPis: '01',
        cstCofins: '01',
      },
    ];

    const config: any = { ambienteSefaz: 'HOMOLOGACAO', inscricaoEstadual: '' };

    const xml = await builder.gerarXmlNfe(nota, itens, {}, {}, config);

    // O valor em reais aparece intacto no XML.
    expect(xml).toContain('<vProd>1234.56</vProd>');
    expect(xml).toContain('<vNF>1234.56</vNF>');
    expect(xml).toContain('<vUnCom>1234.56</vUnCom>');

    // Garante que a regressão do bug de centavos não voltou.
    expect(xml).not.toContain('12.35');
    expect(xml).not.toContain('123456.00');
  });
});
