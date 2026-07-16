/**
 * Testes unitários do PedidoRepository — semântica de `obterEstatisticas`.
 *
 * Estes KPIs vão direto para o Dashboard e para a tela de Pedidos, lado a lado
 * ("Receita do Mês" ao lado de "Pedidos do Mês"). O que estes testes travam:
 *
 * 1. CANCELADO/DEVOLVIDO não inflam a receita, o ticket médio nem o ranking de
 *    produtos — mas continuam contando como pedidos que aconteceram.
 * 2. RASCUNHO não existe para as estatísticas (é filtrado já na query).
 * 3. Receita é por competência: pedido não pago ainda é venda.
 * 4. Ticket médio usa a MESMA base da receita.
 * 5. Dinheiro em Decimal — sem erro de acúmulo de ponto flutuante.
 *
 * O PrismaService é mockado: testamos a regra de negócio, não a persistência.
 */

import { Decimal } from '@prisma/client/runtime/library';

import { PedidoRepository } from './pedido.repository';
import { PrismaService } from '../prisma/prisma.service';

const TENANT = '10000000-0000-0000-0000-000000000001';
const INICIO = new Date('2026-07-01T00:00:00.000Z');
const FIM = new Date('2026-07-31T23:59:59.999Z');

interface ItemFake {
  sku: string;
  titulo: string;
  quantidade: number;
  valorTotal: string;
}

interface PedidoFake {
  status: string;
  statusPagamento?: string;
  canalOrigem?: string | null;
  valorTotal: string;
  itens?: ItemFake[];
}

/** Monta o registro como o Prisma devolveria (Decimal nos campos de dinheiro). */
function pedido(dados: PedidoFake) {
  return {
    status: dados.status,
    statusPagamento: dados.statusPagamento ?? 'PENDENTE',
    // `null` explícito precisa chegar ao repo (é o caso do fallback 'manual'),
    // então só aplica o default quando a chave foi omitida.
    canalOrigem: 'canalOrigem' in dados ? dados.canalOrigem : 'MANUAL',
    valorTotal: new Decimal(dados.valorTotal),
    itens: (dados.itens ?? []).map((item) => ({
      sku: item.sku,
      titulo: item.titulo,
      quantidade: item.quantidade,
      valorTotal: new Decimal(item.valorTotal),
    })),
    pagamentos: [],
  };
}

function criarRepo(pedidos: ReturnType<typeof pedido>[]) {
  const findMany = jest.fn().mockResolvedValue(pedidos);
  const prisma = { pedido: { findMany } } as unknown as PrismaService;
  return { repo: new PedidoRepository(prisma), findMany };
}

describe('PedidoRepository.obterEstatisticas — o que entra na receita', () => {
  it('não soma CANCELADO nem DEVOLVIDO na receita, mas conta os dois como pedidos', async () => {
    const { repo } = criarRepo([
      pedido({ status: 'ENTREGUE', valorTotal: '100.00' }),
      pedido({ status: 'CONFIRMADO', valorTotal: '50.00' }),
      pedido({ status: 'CANCELADO', valorTotal: '999.00' }),
      pedido({ status: 'DEVOLVIDO', valorTotal: '777.00' }),
    ]);

    const stats = await repo.obterEstatisticas(TENANT, INICIO, FIM);

    // Receita = só ENTREGUE + CONFIRMADO. O cancelado de R$ 999 inflaria para 1926.
    expect(stats.totalVendas).toBe(150);
    // Mas os 4 pedidos existiram: a contagem e o censo por status não escondem isso.
    expect(stats.totalPedidos).toBe(4);
    expect(stats.porStatus).toEqual({
      ENTREGUE: 1,
      CONFIRMADO: 1,
      CANCELADO: 1,
      DEVOLVIDO: 1,
    });
  });

  it('conta pedido ainda não pago como receita (competência, não caixa)', async () => {
    const { repo } = criarRepo([
      pedido({ status: 'FATURADO', statusPagamento: 'PENDENTE', valorTotal: '200.00' }),
      pedido({ status: 'ENTREGUE', statusPagamento: 'PAGO', valorTotal: '300.00' }),
    ]);

    const stats = await repo.obterEstatisticas(TENANT, INICIO, FIM);

    // Venda a prazo (boleto/marketplace) é venda do mês: 200 + 300.
    expect(stats.totalVendas).toBe(500);
    expect(stats.porStatusPagamento).toEqual({ PENDENTE: 1, PAGO: 1 });
  });

  it('filtra RASCUNHO já na query e sempre por tenantId', async () => {
    const { repo, findMany } = criarRepo([]);

    await repo.obterEstatisticas(TENANT, INICIO, FIM);

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenantId: TENANT,
          criadoEm: { gte: INICIO, lte: FIM },
          status: { notIn: ['RASCUNHO'] },
        },
      }),
    );
  });
});

describe('PedidoRepository.obterEstatisticas — ticket médio', () => {
  it('divide pela mesma base da receita, ignorando os cancelados', async () => {
    const { repo } = criarRepo([
      pedido({ status: 'ENTREGUE', valorTotal: '100.00' }),
      pedido({ status: 'ENTREGUE', valorTotal: '200.00' }),
      pedido({ status: 'CANCELADO', valorTotal: '500.00' }),
      pedido({ status: 'CANCELADO', valorTotal: '500.00' }),
    ]);

    const stats = await repo.obterEstatisticas(TENANT, INICIO, FIM);

    // 300 / 2 pedidos com receita = 150. Dividir por totalPedidos (4) daria 75,
    // um "ticket médio" menor que qualquer venda real da lista.
    expect(stats.ticketMedio).toBe(150);
    expect(stats.totalPedidos).toBe(4);
  });

  it('devolve zero (não NaN) quando nenhum pedido gerou receita', async () => {
    const { repo } = criarRepo([pedido({ status: 'CANCELADO', valorTotal: '500.00' })]);

    const stats = await repo.obterEstatisticas(TENANT, INICIO, FIM);

    // Zero é um FATO: não houve venda. Nunca NaN, nunca número inventado.
    expect(stats.totalVendas).toBe(0);
    expect(stats.ticketMedio).toBe(0);
  });
});

describe('PedidoRepository.obterEstatisticas — topProdutos', () => {
  it('não considera vendido o produto de um pedido cancelado', async () => {
    const { repo } = criarRepo([
      pedido({
        status: 'ENTREGUE',
        valorTotal: '100.00',
        itens: [{ sku: 'SKU-REAL', titulo: 'Vendido', quantidade: 2, valorTotal: '100.00' }],
      }),
      pedido({
        status: 'CANCELADO',
        valorTotal: '900.00',
        itens: [
          { sku: 'SKU-CANCELADO', titulo: 'Cancelado', quantidade: 99, valorTotal: '900.00' },
        ],
      }),
    ]);

    const stats = await repo.obterEstatisticas(TENANT, INICIO, FIM);

    // O item cancelado tem 99 unidades: se entrasse, lideraria o ranking de
    // "mais vendidos" sem ter sido vendido nenhuma vez.
    expect(stats.topProdutos).toEqual([
      { sku: 'SKU-REAL', titulo: 'Vendido', quantidade: 2, valorTotal: 100 },
    ]);
  });

  it('agrupa por sku somando quantidade e valor', async () => {
    const { repo } = criarRepo([
      pedido({
        status: 'ENTREGUE',
        valorTotal: '30.00',
        itens: [{ sku: 'SKU-A', titulo: 'Produto A', quantidade: 3, valorTotal: '30.00' }],
      }),
      pedido({
        status: 'CONFIRMADO',
        valorTotal: '20.00',
        itens: [{ sku: 'SKU-A', titulo: 'Produto A', quantidade: 2, valorTotal: '20.00' }],
      }),
    ]);

    const stats = await repo.obterEstatisticas(TENANT, INICIO, FIM);

    expect(stats.topProdutos).toEqual([
      { sku: 'SKU-A', titulo: 'Produto A', quantidade: 5, valorTotal: 50 },
    ]);
  });
});

describe('PedidoRepository.obterEstatisticas — precisão monetária', () => {
  it('soma centavos em Decimal sem erro de ponto flutuante', async () => {
    // 0.1 + 0.2 em float = 0.30000000000000004. Com Decimal, fecha em 0.30.
    const { repo } = criarRepo([
      pedido({ status: 'ENTREGUE', valorTotal: '0.10' }),
      pedido({ status: 'ENTREGUE', valorTotal: '0.20' }),
    ]);

    const stats = await repo.obterEstatisticas(TENANT, INICIO, FIM);

    expect(stats.totalVendas).toBe(0.3);
    expect(stats.ticketMedio).toBe(0.15);
  });
});

describe('PedidoRepository.obterEstatisticas — porCanal', () => {
  it('faz o censo por canal e usa "manual" quando o canal é nulo', async () => {
    const { repo } = criarRepo([
      pedido({ status: 'ENTREGUE', canalOrigem: 'MERCADOLIVRE', valorTotal: '10.00' }),
      pedido({ status: 'CANCELADO', canalOrigem: 'MERCADOLIVRE', valorTotal: '10.00' }),
      pedido({ status: 'ENTREGUE', canalOrigem: null, valorTotal: '10.00' }),
    ]);

    const stats = await repo.obterEstatisticas(TENANT, INICIO, FIM);

    // Censo inclui cancelado: soma de porCanal === totalPedidos.
    expect(stats.porCanal).toEqual({ MERCADOLIVRE: 2, manual: 1 });
    expect(stats.totalPedidos).toBe(3);
  });
});
