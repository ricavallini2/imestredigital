/**
 * Testes unitários do PedidoService.
 *
 * Cobrem os dois pontos críticos desta fase:
 * 1. Precisão monetária (Decimal) no cálculo de totais — sem acúmulo de erro
 *    de ponto flutuante.
 * 2. Reações da SAGA a eventos de estoque respeitando a máquina de estados
 *    (avanço para EM_SEPARACAO; pendência em estoque insuficiente; idempotência
 *    por estado).
 *
 * O repositório, o produtor Kafka e o cache são mockados: testamos a lógica de
 * negócio do service, não a persistência.
 */

import { Decimal } from '@prisma/client/runtime/library';
import { BadRequestException } from '@nestjs/common';

import { PedidoService } from './pedido.service';
import { PedidoRepository } from './pedido.repository';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { CacheService } from '../cache/cache.service';

const TENANT = '10000000-0000-0000-0000-000000000001';
const PEDIDO_ID = 'ped-0001';

/**
 * mockImplementation para repo.criar que ecoa os valores calculados de volta
 * (id/numero fixos), permitindo inspecionar valorProdutos/valorTotal gravados.
 * Castado para `any` para não precisar preencher o tipo completo do Prisma.
 */
const fakeCriar = ((_tenant: string, dados: any) =>
  Promise.resolve({
    id: PEDIDO_ID,
    numero: 1,
    clienteId: dados.clienteId ?? null,
    clienteNome: dados.clienteNome,
    clienteCpfCnpj: dados.clienteCpfCnpj ?? null,
    valorTotal: dados.valorTotal,
    valorProdutos: dados.valorProdutos,
    itens: [],
  })) as any;

function criarMocks() {
  const repo = {
    criar: jest.fn(),
    adicionarItens: jest.fn().mockResolvedValue(undefined),
    adicionarHistorico: jest.fn().mockResolvedValue(undefined),
    atualizarStatus: jest.fn(),
    buscarPorId: jest.fn(),
    registrarEventoProcessado: jest.fn(),
  } as unknown as jest.Mocked<PedidoRepository>;

  const producer = {
    publicarPedidoCriado: jest.fn().mockResolvedValue(undefined),
    publicarPedidoConfirmado: jest.fn().mockResolvedValue(undefined),
    publicarPedidoSeparando: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<KafkaProducerService>;

  const cache = {
    deleteByPattern: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    getJson: jest.fn(),
    setJson: jest.fn(),
  } as unknown as jest.Mocked<CacheService>;

  const service = new PedidoService(repo, producer, cache);
  return { service, repo, producer, cache };
}

describe('PedidoService — cálculo de totais (precisão Decimal)', () => {
  it('soma itens sem erro de ponto flutuante (0.10 + 0.20 = 0.30)', async () => {
    const { service, repo, producer } = criarMocks();

    // Captura os valores gravados (o repo devolve o pedido "persistido").
    repo.criar.mockImplementation(fakeCriar);

    await service.criarPedido(TENANT, {
      clienteNome: 'Cliente Teste',
      itens: [
        { produtoId: 'p1', sku: 'S1', titulo: 'A', quantidade: 1, valorUnitario: 0.1 },
        { produtoId: 'p2', sku: 'S2', titulo: 'B', quantidade: 1, valorUnitario: 0.2 },
      ],
    } as any);

    const dadosCriados = repo.criar.mock.calls[0][1] as any;
    // 0.1 + 0.2 deve ser EXATAMENTE 0.30 em Decimal (float daria 0.30000000000000004).
    expect(dadosCriados.valorProdutos.toString()).toBe('0.3');
    expect(dadosCriados.valorTotal.toString()).toBe('0.3');
    expect(dadosCriados.valorProdutos).toBeInstanceOf(Decimal);

    // O evento pedido.criado publica valores numéricos exatos.
    const payload = producer.publicarPedidoCriado.mock.calls[0][2] as any;
    expect(payload.valorTotal).toBe(0.3);
    expect(payload.itens[0]).toMatchObject({ produtoId: 'p1', precoUnitario: 0.1 });
  });

  it('calcula valorTotal do item líquido de desconto e multiplicado pela quantidade', async () => {
    const { service, repo } = criarMocks();
    repo.criar.mockImplementation(fakeCriar);

    await service.criarPedido(TENANT, {
      clienteNome: 'C',
      itens: [
        // (10.00 - 1.50) * 3 = 25.50
        {
          produtoId: 'p1',
          sku: 'S1',
          titulo: 'A',
          quantidade: 3,
          valorUnitario: 10,
          valorDesconto: 1.5,
        },
      ],
    } as any);

    const itens = repo.adicionarItens.mock.calls[0][1] as any[];
    expect(itens[0].valorTotal.toString()).toBe('25.5');

    const dadosCriados = repo.criar.mock.calls[0][1] as any;
    expect(dadosCriados.valorProdutos.toString()).toBe('25.5');
  });

  it('aplica desconto e frete do pedido: total = produtos - desconto + frete', async () => {
    const { service, repo } = criarMocks();
    repo.criar.mockImplementation(fakeCriar);

    await service.criarPedido(TENANT, {
      clienteNome: 'C',
      valorDesconto: 5,
      valorFrete: 12.34,
      itens: [{ produtoId: 'p1', sku: 'S1', titulo: 'A', quantidade: 2, valorUnitario: 50 }],
    } as any);

    const dados = repo.criar.mock.calls[0][1] as any;
    expect(dados.valorProdutos.toString()).toBe('100');
    // 100 - 5 + 12.34 = 107.34
    expect(dados.valorTotal.toString()).toBe('107.34');
  });

  it('nunca deixa o total negativo: desconto do pedido é limitado a produtos + frete', async () => {
    const { service, repo } = criarMocks();
    repo.criar.mockImplementation(fakeCriar);

    await service.criarPedido(TENANT, {
      clienteNome: 'C',
      valorDesconto: 999, // maior que produtos + frete
      valorFrete: 0,
      itens: [{ produtoId: 'p1', sku: 'S1', titulo: 'A', quantidade: 1, valorUnitario: 30 }],
    } as any);

    const dados = repo.criar.mock.calls[0][1] as any;
    expect(dados.valorTotal.toString()).toBe('0');
  });
});

describe('PedidoService — SAGA: reagirEstoqueReservado (máquina de estados)', () => {
  it('avança RASCUNHO → PENDENTE → CONFIRMADO → EM_SEPARACAO (pedido recém-criado)', async () => {
    const { service, repo } = criarMocks();

    // Sequência de leituras: reagir(RASCUNHO) → submeter(RASCUNHO) →
    // confirmar(PENDENTE) → separar(CONFIRMADO).
    repo.buscarPorId
      .mockResolvedValueOnce({
        id: PEDIDO_ID,
        status: 'RASCUNHO',
        numero: 1,
        clienteNome: 'C',
      } as any)
      .mockResolvedValueOnce({
        id: PEDIDO_ID,
        status: 'RASCUNHO',
        numero: 1,
        clienteNome: 'C',
      } as any)
      .mockResolvedValueOnce({
        id: PEDIDO_ID,
        status: 'PENDENTE',
        numero: 1,
        clienteNome: 'C',
      } as any)
      .mockResolvedValueOnce({
        id: PEDIDO_ID,
        status: 'CONFIRMADO',
        numero: 1,
        clienteNome: 'C',
      } as any);
    repo.atualizarStatus.mockResolvedValue({ id: PEDIDO_ID } as any);

    await service.reagirEstoqueReservado(TENANT, PEDIDO_ID, 2);

    // Todos os passos passam pela cadeia VÁLIDA da máquina de estados.
    const statusAplicados = repo.atualizarStatus.mock.calls.map((c) => c[2]);
    expect(statusAplicados).toEqual(['PENDENTE', 'CONFIRMADO', 'EM_SEPARACAO']);
  });

  it('avança PENDENTE → CONFIRMADO → EM_SEPARACAO', async () => {
    const { service, repo } = criarMocks();

    // reagir(PENDENTE) → confirmar(PENDENTE) → separar(CONFIRMADO).
    repo.buscarPorId
      .mockResolvedValueOnce({
        id: PEDIDO_ID,
        status: 'PENDENTE',
        numero: 1,
        clienteNome: 'C',
      } as any)
      .mockResolvedValueOnce({
        id: PEDIDO_ID,
        status: 'PENDENTE',
        numero: 1,
        clienteNome: 'C',
      } as any)
      .mockResolvedValueOnce({
        id: PEDIDO_ID,
        status: 'CONFIRMADO',
        numero: 1,
        clienteNome: 'C',
      } as any);
    repo.atualizarStatus.mockResolvedValue({ id: PEDIDO_ID } as any);

    await service.reagirEstoqueReservado(TENANT, PEDIDO_ID, 2);

    const statusAplicados = repo.atualizarStatus.mock.calls.map((c) => c[2]);
    expect(statusAplicados).toEqual(['CONFIRMADO', 'EM_SEPARACAO']);
  });

  it('é no-op quando o pedido já está EM_SEPARACAO (idempotência por estado)', async () => {
    const { service, repo } = criarMocks();
    repo.buscarPorId.mockResolvedValue({
      id: PEDIDO_ID,
      status: 'EM_SEPARACAO',
      numero: 1,
      clienteNome: 'C',
    } as any);

    await service.reagirEstoqueReservado(TENANT, PEDIDO_ID, 2);

    expect(repo.atualizarStatus).not.toHaveBeenCalled();
  });

  it('é no-op quando o pedido está CANCELADO (não ressuscita pedido encerrado)', async () => {
    const { service, repo } = criarMocks();
    repo.buscarPorId.mockResolvedValue({
      id: PEDIDO_ID,
      status: 'CANCELADO',
      numero: 1,
      clienteNome: 'C',
    } as any);

    await service.reagirEstoqueReservado(TENANT, PEDIDO_ID, 1);

    expect(repo.atualizarStatus).not.toHaveBeenCalled();
  });
});

describe('PedidoService — SAGA: reagirEstoqueInsuficiente', () => {
  it('rebaixa CONFIRMADO → PENDENTE e registra o detalhe dos faltantes no histórico', async () => {
    const { service, repo } = criarMocks();
    repo.buscarPorId.mockResolvedValue({
      id: PEDIDO_ID,
      status: 'CONFIRMADO',
      numero: 1,
      clienteNome: 'C',
    } as any);
    repo.atualizarStatus.mockResolvedValue({ id: PEDIDO_ID } as any);

    await service.reagirEstoqueInsuficiente(TENANT, PEDIDO_ID, [
      { sku: 'S1', quantidadeFaltante: 3 },
    ]);

    expect(repo.atualizarStatus).toHaveBeenCalledWith(TENANT, PEDIDO_ID, 'PENDENTE');
    const histArgs = repo.adicionarHistorico.mock.calls[0];
    expect(histArgs[3]).toBe('PENDENTE'); // statusNovo
    expect(histArgs[4]).toContain('S1');
    expect(histArgs[4]).toContain('3 un');
  });

  it('não rebaixa o status em estados avançados (ex. FATURADO), apenas registra o motivo', async () => {
    const { service, repo } = criarMocks();
    repo.buscarPorId.mockResolvedValue({
      id: PEDIDO_ID,
      status: 'FATURADO',
      numero: 1,
      clienteNome: 'C',
    } as any);

    await service.reagirEstoqueInsuficiente(TENANT, PEDIDO_ID, [
      { produtoId: 'p1', quantidadeFaltante: 1 },
    ]);

    expect(repo.atualizarStatus).not.toHaveBeenCalled();
    // histórico registrado com mesmo status de origem/destino
    const histArgs = repo.adicionarHistorico.mock.calls[0];
    expect(histArgs[2]).toBe('FATURADO');
    expect(histArgs[3]).toBe('FATURADO');
  });
});

describe('PedidoService — máquina de estados (validarTransicao)', () => {
  it('rejeita transição inválida (RASCUNHO → ENVIADO) ao enviar pedido', async () => {
    const { service, repo } = criarMocks();
    repo.buscarPorId.mockResolvedValue({
      id: PEDIDO_ID,
      status: 'RASCUNHO',
      numero: 1,
      clienteNome: 'C',
    } as any);

    await expect(
      service.enviarPedido(TENANT, PEDIDO_ID, 'BR123', 'Correios'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
