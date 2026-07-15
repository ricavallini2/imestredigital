/**
 * Testes de unidade do EstoqueService — foco na SAGA de pedidos e no resumo.
 *
 * Repositório, producer e catalog-client são mockados: validamos a LÓGICA de
 * orquestração (tudo-ou-nada da reserva, publicação dos eventos planos corretos,
 * baixa/liberação) e o cálculo do resumo (status + KPIs) sem tocar banco/Kafka.
 */

import { EstoqueService, ItemPedidoEvento } from './estoque.service';
import { TOPICOS_SAGA } from '../../config/kafka.config';

type Mocked<T> = { [K in keyof T]: jest.Mock };

function criarServico() {
  const repo = {
    reservarItem: jest.fn(),
    confirmarReservas: jest.fn(),
    cancelarReservas: jest.fn(),
    registrarEventoProcessado: jest.fn(),
    listarSaldos: jest.fn(),
  } as unknown as Mocked<any>;

  const producer = {
    publicar: jest.fn(),
    publicarPlano: jest.fn().mockResolvedValue(undefined),
  } as unknown as Mocked<any>;

  const catalog = {
    mapaProdutos: jest.fn().mockResolvedValue(new Map()),
  } as unknown as Mocked<any>;

  const service = new EstoqueService(repo as any, producer as any, catalog as any);
  return { service, repo, producer, catalog };
}

const TENANT = '10000000-0000-0000-0000-000000000001';
const PEDIDO = 'aaaaaaaa-0000-0000-0000-000000000001';
const PROD_A = '50000000-0000-0000-0000-00000000000a';
const PROD_B = '50000000-0000-0000-0000-00000000000b';

describe('EstoqueService — SAGA reservarPedido (pedido.criado)', () => {
  it('reserva todos os itens e publica estoque.reservado com itensReservados', async () => {
    const { service, repo, producer } = criarServico();
    repo.reservarItem
      .mockResolvedValueOnce({ reservado: true, depositoId: 'dep-1', disponivel: 8 })
      .mockResolvedValueOnce({ reservado: true, depositoId: 'dep-1', disponivel: 3 });

    const itens: ItemPedidoEvento[] = [
      { produtoId: PROD_A, sku: 'SKU-A', quantidade: 2 },
      { produtoId: PROD_B, sku: 'SKU-B', quantidade: 1 },
    ];

    await service.reservarPedido(TENANT, PEDIDO, itens);

    expect(repo.reservarItem).toHaveBeenCalledTimes(2);
    expect(repo.cancelarReservas).not.toHaveBeenCalled();
    expect(producer.publicarPlano).toHaveBeenCalledTimes(1);

    const [topico, tenant, payload] = producer.publicarPlano.mock.calls[0];
    expect(topico).toBe(TOPICOS_SAGA.ESTOQUE_RESERVADO);
    expect(tenant).toBe(TENANT);
    expect(payload.pedidoId).toBe(PEDIDO);
    expect(payload.itensReservados).toHaveLength(2);
    expect(payload.itensReservados[0]).toMatchObject({
      produtoId: PROD_A,
      sku: 'SKU-A',
      quantidade: 2,
      depositoId: 'dep-1',
    });
  });

  it('quando falta 1 item: reverte reservas e publica estoque.insuficiente (não reservado)', async () => {
    const { service, repo, producer } = criarServico();
    // 1º item reserva ok, 2º item sem saldo.
    repo.reservarItem
      .mockResolvedValueOnce({ reservado: true, depositoId: 'dep-1', disponivel: 5 })
      .mockResolvedValueOnce({ reservado: false, disponivel: 1, motivo: 'SEM_SALDO' });

    const itens: ItemPedidoEvento[] = [
      { produtoId: PROD_A, sku: 'SKU-A', quantidade: 2 },
      { produtoId: PROD_B, sku: 'SKU-B', quantidade: 4 },
    ];

    await service.reservarPedido(TENANT, PEDIDO, itens);

    // Reserva parcial deve ser revertida (tudo-ou-nada).
    expect(repo.cancelarReservas).toHaveBeenCalledWith(TENANT, PEDIDO);

    expect(producer.publicarPlano).toHaveBeenCalledTimes(1);
    const [topico, , payload] = producer.publicarPlano.mock.calls[0];
    expect(topico).toBe(TOPICOS_SAGA.ESTOQUE_INSUFICIENTE);
    expect(payload.pedidoId).toBe(PEDIDO);
    expect(payload.itensFaltantes).toEqual([
      {
        produtoId: PROD_B,
        sku: 'SKU-B',
        quantidadeSolicitada: 4,
        disponivel: 1,
        quantidadeFaltante: 3,
      },
    ]);
  });

  it('consolida itens repetidos do mesmo produto antes de reservar', async () => {
    const { service, repo } = criarServico();
    repo.reservarItem.mockResolvedValue({ reservado: true, depositoId: 'dep-1', disponivel: 10 });

    const itens: ItemPedidoEvento[] = [
      { produtoId: PROD_A, sku: 'SKU-A', quantidade: 2 },
      { produtoId: PROD_A, sku: 'SKU-A', quantidade: 3 },
    ];

    await service.reservarPedido(TENANT, PEDIDO, itens);

    // Deve reservar UMA vez, com a soma (5).
    expect(repo.reservarItem).toHaveBeenCalledTimes(1);
    expect(repo.reservarItem).toHaveBeenCalledWith(TENANT, PROD_A, 5, PEDIDO);
  });
});

describe('EstoqueService — SAGA confirmar/cancelar', () => {
  it('confirmarReservas delega a baixa ao repositório (pedido.pago)', async () => {
    const { service, repo, producer } = criarServico();
    repo.confirmarReservas.mockResolvedValue([
      { produtoId: PROD_A, depositoId: 'dep-1', quantidade: 2 },
    ]);

    await service.confirmarReservas(TENANT, PEDIDO);

    expect(repo.confirmarReservas).toHaveBeenCalledWith(TENANT, PEDIDO);
    // pedido.pago não republica evento de saga para o order (order marca PAGO).
    expect(producer.publicarPlano).not.toHaveBeenCalled();
  });

  it('cancelarReservas libera e publica estoque.liberado (pedido.cancelado)', async () => {
    const { service, repo, producer } = criarServico();
    repo.cancelarReservas.mockResolvedValue([
      { produtoId: PROD_A, depositoId: 'dep-1', quantidade: 2 },
      { produtoId: PROD_B, depositoId: null, quantidade: 1 },
    ]);

    await service.cancelarReservas(TENANT, PEDIDO);

    expect(repo.cancelarReservas).toHaveBeenCalledWith(TENANT, PEDIDO);
    const [topico, tenant, payload] = producer.publicarPlano.mock.calls[0];
    expect(topico).toBe(TOPICOS_SAGA.ESTOQUE_LIBERADO);
    expect(tenant).toBe(TENANT);
    expect(payload.pedidoId).toBe(PEDIDO);
    expect(payload.itens).toHaveLength(2);
    expect(payload.itens[0]).toMatchObject({ produtoId: PROD_A, quantidade: 2 });
  });
});

describe('EstoqueService — idempotência', () => {
  it('registrarEvento repassa o resultado do repositório', async () => {
    const { service, repo } = criarServico();
    repo.registrarEventoProcessado.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

    await expect(service.registrarEvento(TENANT, 'pedido.pago', PEDIDO)).resolves.toBe(true);
    await expect(service.registrarEvento(TENANT, 'pedido.pago', PEDIDO)).resolves.toBe(false);
    expect(repo.registrarEventoProcessado).toHaveBeenCalledWith(TENANT, 'pedido.pago', PEDIDO);
  });
});

describe('EstoqueService — resumo (shape do front + status)', () => {
  it('monta itens com produto/sku/deposito/status e agrega KPIs', async () => {
    const { service, repo, catalog } = criarServico();

    repo.listarSaldos.mockResolvedValue([
      // disponível 100 (>2*min) → NORMAL
      {
        id: 's1',
        produtoId: PROD_A,
        depositoId: 'dep-1',
        quantidadeFisica: 105,
        reservado: 5,
        estoqueMinimo: 10,
        deposito: { nome: 'Depósito Principal' },
      },
      // disponível 8 (<= min 10) → CRITICO
      {
        id: 's2',
        produtoId: PROD_B,
        depositoId: 'dep-1',
        quantidadeFisica: 9,
        reservado: 1,
        estoqueMinimo: 10,
        deposito: { nome: 'Depósito Principal' },
      },
      // disponível 0 → SEM_ESTOQUE
      {
        id: 's3',
        produtoId: PROD_B,
        depositoId: 'dep-2',
        quantidadeFisica: 2,
        reservado: 2,
        estoqueMinimo: 10,
        deposito: { nome: 'Loja' },
      },
    ]);

    catalog.mapaProdutos.mockResolvedValue(
      new Map([
        [PROD_A, { id: PROD_A, nome: 'Produto A', sku: 'SKU-A', precoVenda: 10, estoqueMinimo: 10 }],
        [PROD_B, { id: PROD_B, nome: 'Produto B', sku: 'SKU-B', precoVenda: 20, estoqueMinimo: 10 }],
      ]),
    );

    const resumo = await service.resumo(TENANT, undefined, 'Bearer x');

    expect(resumo.itens).toHaveLength(3);
    expect(resumo.itens[0]).toMatchObject({
      produtoId: PROD_A,
      produto: 'Produto A',
      sku: 'SKU-A',
      deposito: 'Depósito Principal',
      fisico: 105,
      reservado: 5,
      disponivel: 100,
      status: 'NORMAL',
    });
    expect(resumo.itens[1].status).toBe('CRITICO');
    expect(resumo.itens[2].status).toBe('SEM_ESTOQUE');

    // KPIs
    expect(resumo.totalProdutos).toBe(2); // PROD_A + PROD_B distintos
    expect(resumo.totalUnidades).toBe(105 + 9 + 2);
    expect(resumo.estoqueBaixo).toBe(1); // 1 CRITICO
    expect(resumo.semEstoque).toBe(1);
    // valor = 105*10 + 9*20 + 2*20 = 1050 + 180 + 40 = 1270
    expect(resumo.valorEmEstoque).toBe(1270);
  });

  it('degrada com fallback quando o catálogo não retorna o produto', async () => {
    const { service, repo, catalog } = criarServico();
    repo.listarSaldos.mockResolvedValue([
      {
        id: 's1',
        produtoId: PROD_A,
        depositoId: 'dep-1',
        quantidadeFisica: 5,
        reservado: 0,
        estoqueMinimo: 0,
        deposito: { nome: 'Depósito Principal' },
      },
    ]);
    catalog.mapaProdutos.mockResolvedValue(new Map());

    const resumo = await service.resumo(TENANT, undefined, 'Bearer x');
    expect(resumo.itens[0].produto).toContain('Produto ');
    expect(resumo.itens[0].sku).toBe('—');
    expect(resumo.itens[0].status).toBe('NORMAL'); // min 0 → sempre normal se disponível>0
  });
});
