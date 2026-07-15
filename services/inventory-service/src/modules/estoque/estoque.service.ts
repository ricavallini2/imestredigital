/**
 * Serviço de Estoque (COMPLETO).
 *
 * Lógica de negócio para gerenciamento de estoque:
 * - Entrada e saída de produtos
 * - Reservas para pedidos (impede venda duplicada)
 * - Transferências entre depósitos
 * - Alertas de estoque mínimo
 * - Publicação de eventos no Kafka
 */

import { Injectable, BadRequestException, Logger } from '@nestjs/common';

import { EstoqueRepository } from './estoque.repository';
import { CatalogClient, ProdutoResumo } from './catalog.client';
import { ProducerService } from '../../events/producer.service';
import { TOPICOS_ESTOQUE, TOPICOS_SAGA } from '../../config/kafka.config';
import {
  MotivoMovimentacao,
  TipoMovimentacao,
} from '../../enums/estoque.enums';

/** Item de um pedido recebido pela saga (payload plano do order-service). */
export interface ItemPedidoEvento {
  produtoId: string;
  sku?: string;
  quantidade: number;
}
import { EntradaEstoqueDto } from '../../dtos/estoque/entrada-estoque.dto';
import { SaidaEstoqueDto } from '../../dtos/estoque/saida-estoque.dto';
import { TransferenciaEstoqueDto } from '../../dtos/estoque/transferencia-estoque.dto';
import { AjusteEstoqueDto } from '../../dtos/estoque/ajuste-estoque.dto';

/**
 * Normaliza um motivo livre (string do cliente, possivelmente minúsculo ou
 * sinônimo) para um valor canônico UPPERCASE do enum MotivoMovimentacao.
 * Sinônimos são mapeados para o valor canônico do Prisma; motivos
 * desconhecidos caem em OUTRO (nunca gravamos string arbitrária no enum).
 */
const MAPA_MOTIVO: Record<string, MotivoMovimentacao> = {
  compra: MotivoMovimentacao.COMPRA,
  venda: MotivoMovimentacao.VENDA,
  inventario: MotivoMovimentacao.AJUSTE_INVENTARIO,
  ajuste: MotivoMovimentacao.AJUSTE_INVENTARIO,
  ajuste_inventario: MotivoMovimentacao.AJUSTE_INVENTARIO,
  transferencia: MotivoMovimentacao.TRANSFERENCIA_DEPOSITO,
  transferencia_deposito: MotivoMovimentacao.TRANSFERENCIA_DEPOSITO,
  devolucao: MotivoMovimentacao.DEVOLUCAO,
  devolucao_cliente: MotivoMovimentacao.DEVOLUCAO_CLIENTE,
  devolucao_fornecedor: MotivoMovimentacao.DEVOLUCAO_FORNECEDOR,
  perda: MotivoMovimentacao.PERDA,
  avaria: MotivoMovimentacao.AVARIA,
  consumo: MotivoMovimentacao.CONSUMO,
  producao: MotivoMovimentacao.PRODUCAO,
  outro: MotivoMovimentacao.OUTRO,
};

function normalizarMotivo(
  motivo: string | undefined,
  padrao: MotivoMovimentacao,
): MotivoMovimentacao {
  if (!motivo) return padrao;
  return MAPA_MOTIVO[motivo.trim().toLowerCase()] ?? MotivoMovimentacao.OUTRO;
}

@Injectable()
export class EstoqueService {
  private readonly logger = new Logger(EstoqueService.name);

  constructor(
    private readonly estoqueRepo: EstoqueRepository,
    private readonly producer: ProducerService,
    private readonly catalog: CatalogClient,
  ) {}

  /** Consulta saldo de um produto em todos os depósitos */
  async consultarSaldo(tenantId: string, produtoId: string) {
    const saldos = await this.estoqueRepo.consultarSaldo(tenantId, produtoId);

    // Calcula totais consolidados
    const totalDisponivel = saldos.reduce((acc, s) => acc + s.disponivel, 0);
    const totalReservado = saldos.reduce((acc, s) => acc + s.reservado, 0);
    const totalFisico = saldos.reduce((acc, s) => acc + s.quantidadeFisica, 0);

    return {
      produtoId,
      totalDisponivel,
      totalReservado,
      totalFisico,
      porDeposito: saldos,
    };
  }

  /**
   * Resumo geral de estoque do tenant, no shape consumido pelo front
   * (apps/web · ResumoEstoque):
   *
   * {
   *   totalProdutos, totalUnidades, estoqueBaixo, semEstoque, valorEmEstoque,
   *   itens: [{ id, produtoId, produto, sku, depositoId, deposito, fisico,
   *             reservado, disponivel, minimo, maximo, giro30d, status }]
   * }
   *
   * Enriquece cada saldo com nome/sku/preço do catalog-service. Se o catálogo
   * estiver indisponível, mantém fallback (produto = produtoId curto) e o
   * resumo ainda renderiza.
   *
   * @param authorization Header Authorization do request (para chamar o catálogo).
   */
  async resumo(tenantId: string, depositoId: string | undefined, authorization?: string) {
    const [saldos, mapaProdutos] = await Promise.all([
      this.estoqueRepo.listarSaldos(tenantId, depositoId),
      this.catalog.mapaProdutos(authorization),
    ]);

    const itens = saldos.map((s) =>
      this.montarItemResumo(s, mapaProdutos.get(s.produtoId)),
    );

    // KPIs agregados (contabiliza por linha de saldo produto×depósito).
    const totalUnidades = itens.reduce((acc, i) => acc + i.fisico, 0);
    const estoqueBaixo = itens.filter(
      (i) => i.status === 'BAIXO' || i.status === 'CRITICO',
    ).length;
    const semEstoque = itens.filter((i) => i.status === 'SEM_ESTOQUE').length;
    const valorEmEstoque = itens.reduce(
      (acc, i) => acc + i.fisico * (i.precoVenda ?? 0),
      0,
    );

    // SKUs distintos cadastrados (produtos únicos com saldo).
    const totalProdutos = new Set(itens.map((i) => i.produtoId)).size;

    return {
      totalProdutos,
      totalUnidades,
      estoqueBaixo,
      semEstoque,
      valorEmEstoque,
      itens,
    };
  }

  /**
   * Monta um item do resumo a partir do saldo (fonte de quantidades) e dos
   * metadados de produto do catálogo (nome/sku/preço/mínimo).
   */
  private montarItemResumo(
    saldo: {
      id: string;
      produtoId: string;
      depositoId: string;
      quantidadeFisica: number;
      reservado: number;
      estoqueMinimo: number;
      deposito?: { nome?: string } | null;
    },
    produto: ProdutoResumo | undefined,
  ) {
    const fisico = saldo.quantidadeFisica;
    const reservado = saldo.reservado;
    const disponivel = fisico - reservado;

    // Mínimo: prioriza o do saldo (por depósito); cai no do catálogo.
    const minimo =
      saldo.estoqueMinimo > 0
        ? saldo.estoqueMinimo
        : produto?.estoqueMinimo ?? 0;

    return {
      id: saldo.id,
      produtoId: saldo.produtoId,
      produto: produto?.nome ?? `Produto ${saldo.produtoId.slice(0, 8)}`,
      sku: produto?.sku ?? '—',
      depositoId: saldo.depositoId,
      deposito: saldo.deposito?.nome ?? '—',
      fisico,
      reservado,
      disponivel,
      minimo,
      // maximo/giro30d: não rastreados ainda; enviados para a UI calcular
      // barra de nível e cobertura sem quebrar (maximo>=fisico evita >100%).
      maximo: Math.max(minimo * 3, fisico, 1),
      giro30d: 0,
      precoVenda: produto?.precoVenda ?? 0,
      status: this.calcularStatusEstoque(disponivel, minimo),
    };
  }

  /**
   * Classifica o status do item conforme disponibilidade × estoque mínimo.
   * Alinhado ao enum do front: NORMAL | BAIXO | CRITICO | SEM_ESTOQUE.
   */
  private calcularStatusEstoque(
    disponivel: number,
    minimo: number,
  ): 'NORMAL' | 'BAIXO' | 'CRITICO' | 'SEM_ESTOQUE' {
    if (disponivel <= 0) return 'SEM_ESTOQUE';
    if (minimo <= 0) return 'NORMAL';
    if (disponivel <= minimo) return 'CRITICO';
    if (disponivel <= minimo * 2) return 'BAIXO';
    return 'NORMAL';
  }

  /** Lista produtos com estoque abaixo do mínimo */
  async listarAlertas(tenantId: string) {
    return this.estoqueRepo.listarAbaixoMinimo(tenantId);
  }

  /**
   * Registra entrada de estoque.
   * Motivos: compra, devolução, ajuste positivo, produção.
   */
  async entrada(tenantId: string, dto: EntradaEstoqueDto, usuarioId?: string) {
    // Valida que a quantidade é positiva
    if (dto.quantidade <= 0) {
      throw new BadRequestException('Quantidade deve ser maior que zero');
    }

    // Atualiza saldo
    const saldo = await this.estoqueRepo.adicionarEstoque(
      tenantId,
      dto.produtoId,
      dto.depositoId,
      dto.quantidade,
    );

    // Registra movimentação
    await this.estoqueRepo.registrarMovimentacao(tenantId, {
      produtoId: dto.produtoId,
      depositoId: dto.depositoId,
      tipo: TipoMovimentacao.ENTRADA,
      motivo: normalizarMotivo(dto.motivo, MotivoMovimentacao.COMPRA),
      quantidade: dto.quantidade,
      custoUnitario: dto.custoUnitario,
      observacao: dto.observacao,
      usuarioId,
    });

    // Publica evento
    await this.producer.publicar(
      TOPICOS_ESTOQUE.ESTOQUE_ATUALIZADO,
      tenantId,
      TOPICOS_ESTOQUE.ESTOQUE_ATUALIZADO,
      { produtoId: dto.produtoId, novoSaldo: saldo.quantidadeFisica, tipo: 'entrada' },
    );

    console.log(`📥 Entrada: +${dto.quantidade} un. do produto ${dto.produtoId}`);
    return saldo;
  }

  /**
   * Registra saída de estoque.
   * Motivos: venda, perda, avaria, consumo.
   */
  async saida(tenantId: string, dto: SaidaEstoqueDto, usuarioId?: string) {
    if (dto.quantidade <= 0) {
      throw new BadRequestException('Quantidade deve ser maior que zero');
    }

    // Verifica disponibilidade
    const saldoAtual = await this.estoqueRepo.obterSaldo(tenantId, dto.produtoId, dto.depositoId);
    if (!saldoAtual || saldoAtual.disponivel < dto.quantidade) {
      throw new BadRequestException(
        `Estoque insuficiente. Disponível: ${saldoAtual?.disponivel || 0}, Solicitado: ${dto.quantidade}`,
      );
    }

    // Subtrai do saldo
    const saldo = await this.estoqueRepo.removerEstoque(
      tenantId,
      dto.produtoId,
      dto.depositoId,
      dto.quantidade,
    );

    // Registra movimentação
    await this.estoqueRepo.registrarMovimentacao(tenantId, {
      produtoId: dto.produtoId,
      depositoId: dto.depositoId,
      tipo: TipoMovimentacao.SAIDA,
      motivo: normalizarMotivo(dto.motivo, MotivoMovimentacao.VENDA),
      quantidade: dto.quantidade,
      observacao: dto.observacao,
      usuarioId,
    });

    // Verifica se estoque ficou abaixo do mínimo
    await this.verificarEstoqueMinimo(tenantId, dto.produtoId, saldo);

    // Publica evento
    await this.producer.publicar(
      TOPICOS_ESTOQUE.ESTOQUE_ATUALIZADO,
      tenantId,
      TOPICOS_ESTOQUE.ESTOQUE_ATUALIZADO,
      { produtoId: dto.produtoId, novoSaldo: saldo.quantidadeFisica, tipo: 'saida' },
    );

    return saldo;
  }

  /**
   * Transfere estoque entre depósitos.
   * Cria saída no origem e entrada no destino atomicamente.
   */
  async transferencia(tenantId: string, dto: TransferenciaEstoqueDto, usuarioId?: string) {
    if (dto.depositoOrigemId === dto.depositoDestinoId) {
      throw new BadRequestException('Depósito de origem e destino devem ser diferentes');
    }

    // Verifica disponibilidade na origem
    const saldoOrigem = await this.estoqueRepo.obterSaldo(tenantId, dto.produtoId, dto.depositoOrigemId);
    if (!saldoOrigem || saldoOrigem.disponivel < dto.quantidade) {
      throw new BadRequestException('Estoque insuficiente no depósito de origem');
    }

    // Executa transferência atômica
    const resultado = await this.estoqueRepo.transferir(
      tenantId,
      dto.produtoId,
      dto.depositoOrigemId,
      dto.depositoDestinoId,
      dto.quantidade,
    );

    // Registra movimentações (saída da origem + entrada no destino)
    await this.estoqueRepo.registrarMovimentacao(tenantId, {
      produtoId: dto.produtoId,
      depositoId: dto.depositoOrigemId,
      tipo: TipoMovimentacao.TRANSFERENCIA,
      motivo: MotivoMovimentacao.TRANSFERENCIA_DEPOSITO,
      quantidade: dto.quantidade,
      observacao: `Transferência para depósito ${dto.depositoDestinoId}`,
      usuarioId,
    });

    await this.estoqueRepo.registrarMovimentacao(tenantId, {
      produtoId: dto.produtoId,
      depositoId: dto.depositoDestinoId,
      tipo: TipoMovimentacao.TRANSFERENCIA,
      motivo: MotivoMovimentacao.TRANSFERENCIA_DEPOSITO,
      quantidade: dto.quantidade,
      observacao: `Transferência do depósito ${dto.depositoOrigemId}`,
      usuarioId,
    });

    // Publica evento
    await this.producer.publicar(
      TOPICOS_ESTOQUE.TRANSFERENCIA_REALIZADA,
      tenantId,
      TOPICOS_ESTOQUE.TRANSFERENCIA_REALIZADA,
      { produtoId: dto.produtoId, origem: dto.depositoOrigemId, destino: dto.depositoDestinoId, quantidade: dto.quantidade },
    );

    console.log(`🔄 Transferência: ${dto.quantidade} un. de ${dto.depositoOrigemId} → ${dto.depositoDestinoId}`);
    return resultado;
  }

  /** Ajuste manual de estoque (inventário) */
  async ajuste(tenantId: string, dto: AjusteEstoqueDto, usuarioId?: string) {
    const resultado = await this.estoqueRepo.ajustarEstoque(
      tenantId,
      dto.produtoId,
      dto.depositoId,
      dto.novaQuantidade,
    );

    await this.estoqueRepo.registrarMovimentacao(tenantId, {
      produtoId: dto.produtoId,
      depositoId: dto.depositoId,
      tipo: TipoMovimentacao.AJUSTE,
      motivo: MotivoMovimentacao.AJUSTE_INVENTARIO,
      quantidade: dto.novaQuantidade - (resultado.quantidadeAnterior || 0),
      observacao: dto.observacao || 'Ajuste de inventário',
      usuarioId,
    });

    return resultado;
  }

  /**
   * SAGA — reação a `pedido.criado`.
   *
   * Reserva o estoque de TODOS os itens do pedido de forma tudo-ou-nada:
   * se qualquer item não tiver saldo suficiente, NENHUMA reserva é mantida
   * (as que já foram criadas são revertidas) e publicamos `estoque.insuficiente`
   * com os itens faltantes. Se todos forem reservados, publicamos
   * `estoque.reservado` com os itens reservados.
   *
   * Contrato dos eventos (payload PLANO, consumido pelo order-service):
   * - estoque.reservado    → { tenantId, pedidoId, itensReservados: [{ produtoId, sku, quantidade, depositoId }] }
   * - estoque.insuficiente → { tenantId, pedidoId, itensFaltantes: [{ produtoId, sku, quantidadeSolicitada, disponivel, quantidadeFaltante }] }
   */
  async reservarPedido(
    tenantId: string,
    pedidoId: string,
    itens: ItemPedidoEvento[],
  ): Promise<void> {
    const reservados: Array<{
      produtoId: string;
      sku?: string;
      quantidade: number;
      depositoId?: string;
    }> = [];
    const faltantes: Array<{
      produtoId: string;
      sku?: string;
      quantidadeSolicitada: number;
      disponivel: number;
      quantidadeFaltante: number;
    }> = [];

    // Consolida itens repetidos do mesmo produto (soma quantidades).
    const consolidados = this.consolidarItens(itens);

    for (const item of consolidados) {
      const resultado = await this.estoqueRepo.reservarItem(
        tenantId,
        item.produtoId,
        item.quantidade,
        pedidoId,
      );

      if (resultado.reservado) {
        reservados.push({
          produtoId: item.produtoId,
          sku: item.sku,
          quantidade: item.quantidade,
          depositoId: resultado.depositoId,
        });
      } else {
        faltantes.push({
          produtoId: item.produtoId,
          sku: item.sku,
          quantidadeSolicitada: item.quantidade,
          disponivel: resultado.disponivel,
          quantidadeFaltante: Math.max(item.quantidade - resultado.disponivel, 0),
        });
      }
    }

    // Tudo-ou-nada: se faltou algum, reverte as reservas já feitas e avisa.
    if (faltantes.length > 0) {
      if (reservados.length > 0) {
        await this.estoqueRepo.cancelarReservas(tenantId, pedidoId);
      }

      await this.producer.publicarPlano(TOPICOS_SAGA.ESTOQUE_INSUFICIENTE, tenantId, {
        pedidoId,
        itensFaltantes: faltantes,
      });

      this.logger.warn(
        `pedido.criado [${pedidoId}]: estoque insuficiente para ${faltantes.length} item(ns) → estoque.insuficiente`,
      );
      return;
    }

    await this.producer.publicarPlano(TOPICOS_SAGA.ESTOQUE_RESERVADO, tenantId, {
      pedidoId,
      itensReservados: reservados,
    });

    this.logger.log(
      `pedido.criado [${pedidoId}]: ${reservados.length} item(ns) reservados → estoque.reservado`,
    );
  }

  /**
   * SAGA — reação a `pedido.pago`.
   *
   * Confirma as reservas do pedido: baixa definitiva do saldo físico e
   * registro de movimentação SAIDA/VENDA por item (feito no repositório).
   * Se não havia reservas ATIVAS (ex. pedido pago sem reserva prévia),
   * é no-op seguro.
   */
  async confirmarReservas(tenantId: string, pedidoId: string): Promise<void> {
    const confirmadas = await this.estoqueRepo.confirmarReservas(tenantId, pedidoId);
    this.logger.log(
      `pedido.pago [${pedidoId}]: ${confirmadas.length} reserva(s) confirmada(s) (baixa definitiva)`,
    );
  }

  /**
   * SAGA — reação a `pedido.cancelado`.
   *
   * Libera as reservas ATIVAS do pedido (devolve o `reservado` ao disponível)
   * e publica `estoque.liberado` (payload plano) para o order-service.
   */
  async cancelarReservas(tenantId: string, pedidoId: string): Promise<void> {
    const liberadas = await this.estoqueRepo.cancelarReservas(tenantId, pedidoId);

    await this.producer.publicarPlano(TOPICOS_SAGA.ESTOQUE_LIBERADO, tenantId, {
      pedidoId,
      itens: liberadas.map((r) => ({
        produtoId: r.produtoId,
        quantidade: r.quantidade,
        depositoId: r.depositoId,
      })),
    });

    this.logger.log(
      `pedido.cancelado [${pedidoId}]: ${liberadas.length} reserva(s) liberada(s) → estoque.liberado`,
    );
  }

  /**
   * Idempotência do consumo: registra que um evento (por referenciaId, ex.
   * pedidoId) foi processado. Retorna `true` se é a primeira vez (deve aplicar
   * o efeito) ou `false` se já havia sido processado (deve ignorar).
   */
  async registrarEvento(
    tenantId: string,
    evento: string,
    referenciaId: string,
  ): Promise<boolean> {
    return this.estoqueRepo.registrarEventoProcessado(tenantId, evento, referenciaId);
  }

  /** Soma quantidades de itens que apontam para o mesmo produto. */
  private consolidarItens(itens: ItemPedidoEvento[]): ItemPedidoEvento[] {
    const mapa = new Map<string, ItemPedidoEvento>();
    for (const item of itens) {
      if (!item?.produtoId || !(item.quantidade > 0)) continue;
      const existente = mapa.get(item.produtoId);
      if (existente) {
        existente.quantidade += item.quantidade;
        existente.sku = existente.sku ?? item.sku;
      } else {
        mapa.set(item.produtoId, { ...item });
      }
    }
    return Array.from(mapa.values());
  }

  /** Inicializa estoque zerado para um novo produto */
  async inicializarEstoque(tenantId: string, produtoId: string, sku: string) {
    const depositoPadrao = await this.estoqueRepo.obterDepositoPadrao(tenantId);
    if (depositoPadrao) {
      await this.estoqueRepo.inicializarSaldo(tenantId, produtoId, depositoPadrao.id);
      console.log(`📦 Estoque inicializado: ${sku} no depósito ${depositoPadrao.nome}`);
    }
  }

  /** Verifica se estoque está abaixo do mínimo e emite alerta */
  private async verificarEstoqueMinimo(tenantId: string, produtoId: string, saldo: any) {
    if (saldo.quantidadeFisica <= 0) {
      await this.producer.publicar(
        TOPICOS_ESTOQUE.ESTOQUE_ZERADO,
        tenantId,
        TOPICOS_ESTOQUE.ESTOQUE_ZERADO,
        { produtoId, deposito: saldo.depositoId },
      );
    } else if (saldo.quantidadeFisica <= saldo.estoqueMinimo) {
      await this.producer.publicar(
        TOPICOS_ESTOQUE.ESTOQUE_BAIXO,
        tenantId,
        TOPICOS_ESTOQUE.ESTOQUE_BAIXO,
        { produtoId, saldoAtual: saldo.quantidadeFisica, estoqueMinimo: saldo.estoqueMinimo },
      );
    }
  }
}
