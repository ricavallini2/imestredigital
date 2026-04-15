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

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { EstoqueRepository } from './estoque.repository';
import { ProducerService } from '../../events/producer.service';
import { TOPICOS_ESTOQUE } from '../../config/kafka.config';
import { EntradaEstoqueDto } from '../../dtos/estoque/entrada-estoque.dto';
import { SaidaEstoqueDto } from '../../dtos/estoque/saida-estoque.dto';
import { TransferenciaEstoqueDto } from '../../dtos/estoque/transferencia-estoque.dto';
import { AjusteEstoqueDto } from '../../dtos/estoque/ajuste-estoque.dto';

@Injectable()
export class EstoqueService {
  constructor(
    private readonly estoqueRepo: EstoqueRepository,
    private readonly producer: ProducerService,
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

  /** Resumo geral de estoque do tenant */
  async resumo(tenantId: string, depositoId?: string) {
    return this.estoqueRepo.resumo(tenantId, depositoId);
  }

  /** Lista produtos com estoque abaixo do mínimo */
  async listarAlertas(tenantId: string) {
    return this.estoqueRepo.listarAbaixoMinimo(tenantId);
  }

  /**
   * Registra entrada de estoque.
   * Motivos: compra, devolução, ajuste positivo, produção.
   */
  async entrada(tenantId: string, dto: EntradaEstoqueDto) {
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
      tipo: 'entrada',
      motivo: dto.motivo || 'compra',
      quantidade: dto.quantidade,
      custoUnitario: dto.custoUnitario,
      observacao: dto.observacao,
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
  async saida(tenantId: string, dto: SaidaEstoqueDto) {
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
      tipo: 'saida',
      motivo: dto.motivo || 'venda',
      quantidade: dto.quantidade,
      observacao: dto.observacao,
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
  async transferencia(tenantId: string, dto: TransferenciaEstoqueDto) {
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
      tipo: 'saida',
      motivo: 'transferencia',
      quantidade: dto.quantidade,
      observacao: `Transferência para depósito ${dto.depositoDestinoId}`,
    });

    await this.estoqueRepo.registrarMovimentacao(tenantId, {
      produtoId: dto.produtoId,
      depositoId: dto.depositoDestinoId,
      tipo: 'entrada',
      motivo: 'transferencia',
      quantidade: dto.quantidade,
      observacao: `Transferência do depósito ${dto.depositoOrigemId}`,
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
  async ajuste(tenantId: string, dto: AjusteEstoqueDto) {
    const resultado = await this.estoqueRepo.ajustarEstoque(
      tenantId,
      dto.produtoId,
      dto.depositoId,
      dto.novaQuantidade,
    );

    await this.estoqueRepo.registrarMovimentacao(tenantId, {
      produtoId: dto.produtoId,
      depositoId: dto.depositoId,
      tipo: 'ajuste',
      motivo: 'inventario',
      quantidade: dto.novaQuantidade - (resultado.quantidadeAnterior || 0),
      observacao: dto.observacao || 'Ajuste de inventário',
    });

    return resultado;
  }

  /** Reserva estoque para um pedido */
  async reservar(tenantId: string, produtoId: string, quantidade: number, pedidoId: string) {
    const saldo = await this.estoqueRepo.obterSaldoConsolidado(tenantId, produtoId);
    if (!saldo || saldo.disponivel < quantidade) {
      throw new BadRequestException(`Estoque insuficiente para o produto ${produtoId}`);
    }

    await this.estoqueRepo.criarReserva(tenantId, produtoId, quantidade, pedidoId);

    await this.producer.publicar(
      TOPICOS_ESTOQUE.ESTOQUE_RESERVADO,
      tenantId,
      TOPICOS_ESTOQUE.ESTOQUE_RESERVADO,
      { produtoId, quantidade, pedidoId },
    );
  }

  /** Confirma reservas de um pedido (baixa definitiva) */
  async confirmarReservas(tenantId: string, pedidoId: string) {
    await this.estoqueRepo.confirmarReservas(tenantId, pedidoId);
  }

  /** Cancela reservas de um pedido (libera estoque) */
  async cancelarReservas(tenantId: string, pedidoId: string) {
    await this.estoqueRepo.cancelarReservas(tenantId, pedidoId);
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
