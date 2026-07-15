/**
 * Repositório de Estoque.
 * Acesso a dados com isolamento por tenant.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  StatusReserva,
  TipoMovimentacao,
  MotivoMovimentacao,
} from '../../enums/estoque.enums';

@Injectable()
export class EstoqueRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Consulta saldos de um produto em todos os depósitos */
  async consultarSaldo(tenantId: string, produtoId: string) {
    const saldos = await this.prisma.saldoEstoque.findMany({
      where: { tenantId, produtoId },
      include: { deposito: { select: { id: true, nome: true, cidade: true } } },
    });

    // Calcula disponível para cada saldo
    return saldos.map((s) => ({
      ...s,
      disponivel: s.quantidadeFisica - s.reservado,
    }));
  }

  /** Obtém saldo em um depósito específico */
  async obterSaldo(tenantId: string, produtoId: string, depositoId: string) {
    const saldo = await this.prisma.saldoEstoque.findFirst({
      where: { tenantId, produtoId, depositoId },
    });

    if (saldo) {
      return {
        ...saldo,
        disponivel: saldo.quantidadeFisica - saldo.reservado,
      };
    }
    return null;
  }

  /** Obtém saldo consolidado (soma de todos os depósitos) */
  async obterSaldoConsolidado(tenantId: string, produtoId: string) {
    const resultado = await this.prisma.saldoEstoque.aggregate({
      where: { tenantId, produtoId },
      _sum: { quantidadeFisica: true, reservado: true },
    });

    const totalFisico = resultado._sum.quantidadeFisica || 0;
    const totalReservado = resultado._sum.reservado || 0;

    return {
      disponivel: totalFisico - totalReservado,
      fisico: totalFisico,
      reservado: totalReservado,
    };
  }

  /**
   * Lista os saldos do tenant (opcionalmente filtrados por depósito),
   * já com o nome do depósito incluído. O enriquecimento com dados do
   * produto (nome/sku/preço) e o cálculo de KPIs ficam no service.
   */
  async listarSaldos(tenantId: string, depositoId?: string) {
    const where: { tenantId: string; depositoId?: string } = { tenantId };
    if (depositoId) where.depositoId = depositoId;

    return this.prisma.saldoEstoque.findMany({
      where,
      include: {
        deposito: { select: { nome: true } },
      },
      orderBy: { quantidadeFisica: 'asc' },
    });
  }

  /** Lista produtos com estoque abaixo do mínimo */
  async listarAbaixoMinimo(tenantId: string) {
    return this.prisma.$queryRaw`
      SELECT se.*, d.nome as deposito_nome
      FROM saldos_estoque se
      JOIN depositos d ON d.id = se.deposito_id
      WHERE se.tenant_id = ${tenantId}::uuid
        AND se.quantidade_fisica <= se.estoque_minimo
        AND se.estoque_minimo > 0
      ORDER BY se.quantidade_fisica ASC
    `;
  }

  /** Adiciona quantidade ao saldo */
  async adicionarEstoque(tenantId: string, produtoId: string, depositoId: string, quantidade: number) {
    return this.prisma.saldoEstoque.upsert({
      where: { tenantId_produtoId_depositoId: { tenantId, produtoId, depositoId } },
      update: { quantidadeFisica: { increment: quantidade } },
      create: { tenantId, produtoId, depositoId, quantidadeFisica: quantidade, reservado: 0, estoqueMinimo: 0 },
    });
  }

  /** Remove quantidade do saldo */
  async removerEstoque(tenantId: string, produtoId: string, depositoId: string, quantidade: number) {
    return this.prisma.saldoEstoque.update({
      where: { tenantId_produtoId_depositoId: { tenantId, produtoId, depositoId } },
      data: { quantidadeFisica: { decrement: quantidade } },
    });
  }

  /** Transferência atômica entre depósitos */
  async transferir(tenantId: string, produtoId: string, origemId: string, destinoId: string, quantidade: number) {
    return this.prisma.$transaction([
      this.prisma.saldoEstoque.update({
        where: { tenantId_produtoId_depositoId: { tenantId, produtoId, depositoId: origemId } },
        data: { quantidadeFisica: { decrement: quantidade } },
      }),
      this.prisma.saldoEstoque.upsert({
        where: { tenantId_produtoId_depositoId: { tenantId, produtoId, depositoId: destinoId } },
        update: { quantidadeFisica: { increment: quantidade } },
        create: { tenantId, produtoId, depositoId: destinoId, quantidadeFisica: quantidade, reservado: 0, estoqueMinimo: 0 },
      }),
    ]);
  }

  /** Ajusta estoque para quantidade exata */
  async ajustarEstoque(tenantId: string, produtoId: string, depositoId: string, novaQuantidade: number) {
    const atual = await this.obterSaldo(tenantId, produtoId, depositoId);

    const resultado = await this.prisma.saldoEstoque.upsert({
      where: { tenantId_produtoId_depositoId: { tenantId, produtoId, depositoId } },
      update: { quantidadeFisica: novaQuantidade },
      create: { tenantId, produtoId, depositoId, quantidadeFisica: novaQuantidade, reservado: 0, estoqueMinimo: 0 },
    });

    return { ...resultado, quantidadeAnterior: atual?.quantidadeFisica || 0 };
  }

  /**
   * Seleciona o depósito de onde reservar/baixar um produto.
   *
   * Preferência: depósito PADRÃO do tenant (se tiver saldo suficiente),
   * senão o primeiro depósito com `disponivel >= quantidade`.
   * Retorna null se nenhum depósito isolado comporta a quantidade.
   */
  private async selecionarDepositoParaReserva(
    tenantId: string,
    produtoId: string,
    quantidade: number,
  ): Promise<string | null> {
    const saldos = await this.prisma.saldoEstoque.findMany({
      where: { tenantId, produtoId },
      include: { deposito: { select: { padrao: true, ativo: true } } },
    });

    const comDisponivel = saldos
      .map((s) => ({
        depositoId: s.depositoId,
        disponivel: s.quantidadeFisica - s.reservado,
        padrao: s.deposito?.padrao ?? false,
        ativo: s.deposito?.ativo ?? true,
      }))
      .filter((s) => s.ativo && s.disponivel >= quantidade);

    if (comDisponivel.length === 0) return null;

    // Prioriza o depósito padrão; senão o de maior disponibilidade.
    comDisponivel.sort((a, b) => {
      if (a.padrao !== b.padrao) return a.padrao ? -1 : 1;
      return b.disponivel - a.disponivel;
    });

    return comDisponivel[0].depositoId;
  }

  /**
   * Reserva um item de um pedido de forma ATÔMICA num depósito específico.
   *
   * Cria a ReservaEstoque (com depósito escolhido) e incrementa `reservado`
   * apenas naquele saldo. Idempotente por (pedidoId, produtoId): se já existe
   * reserva ATIVA/CONFIRMADA para o par, não duplica.
   *
   * @returns objeto com o resultado da tentativa de reserva.
   */
  async reservarItem(
    tenantId: string,
    produtoId: string,
    quantidade: number,
    pedidoId: string,
  ): Promise<{
    reservado: boolean;
    depositoId?: string;
    disponivel: number;
    motivo?: 'JA_RESERVADO' | 'SEM_SALDO';
  }> {
    // Idempotência: reserva já existente para este pedido+produto.
    const existente = await this.prisma.reservaEstoque.findFirst({
      where: {
        tenantId,
        pedidoId,
        produtoId,
        status: { in: [StatusReserva.ATIVA, StatusReserva.CONFIRMADA] },
      },
    });
    if (existente) {
      const consolidado = await this.obterSaldoConsolidado(tenantId, produtoId);
      return {
        reservado: true,
        depositoId: existente.depositoId ?? undefined,
        disponivel: consolidado.disponivel,
        motivo: 'JA_RESERVADO',
      };
    }

    const depositoId = await this.selecionarDepositoParaReserva(
      tenantId,
      produtoId,
      quantidade,
    );

    if (!depositoId) {
      const consolidado = await this.obterSaldoConsolidado(tenantId, produtoId);
      return { reservado: false, disponivel: consolidado.disponivel, motivo: 'SEM_SALDO' };
    }

    await this.prisma.$transaction([
      this.prisma.reservaEstoque.create({
        data: {
          tenantId,
          produtoId,
          depositoId,
          quantidade,
          pedidoId,
          status: StatusReserva.ATIVA,
        },
      }),
      this.prisma.saldoEstoque.update({
        where: { tenantId_produtoId_depositoId: { tenantId, produtoId, depositoId } },
        data: { reservado: { increment: quantidade } },
      }),
    ]);

    const consolidado = await this.obterSaldoConsolidado(tenantId, produtoId);
    return { reservado: true, depositoId, disponivel: consolidado.disponivel };
  }

  /**
   * Confirma reservas de um pedido (baixa definitiva).
   *
   * Para cada reserva ATIVA: marca CONFIRMADA, decrementa `quantidadeFisica`
   * e `reservado` no depósito da reserva e registra a movimentação SAIDA/VENDA
   * (auditoria). Tudo numa transação por reserva.
   *
   * @returns lista das reservas confirmadas (para publicar evento / logging).
   */
  async confirmarReservas(tenantId: string, pedidoId: string) {
    const reservas = await this.prisma.reservaEstoque.findMany({
      where: { tenantId, pedidoId, status: StatusReserva.ATIVA },
    });

    const confirmadas: Array<{
      produtoId: string;
      depositoId: string;
      quantidade: number;
    }> = [];

    for (const reserva of reservas) {
      // Fallback de depósito para reservas legadas sem depositoId gravado.
      const depositoId =
        reserva.depositoId ??
        (await this.selecionarDepositoParaBaixa(tenantId, reserva.produtoId, reserva.quantidade));

      if (!depositoId) {
        // Sem depósito resolvível: apenas confirma a reserva para não travar a saga.
        await this.prisma.reservaEstoque.updateMany({
          where: { id: reserva.id, tenantId },
          data: { status: StatusReserva.CONFIRMADA },
        });
        continue;
      }

      await this.prisma.$transaction([
        this.prisma.reservaEstoque.updateMany({
          where: { id: reserva.id, tenantId },
          data: { status: StatusReserva.CONFIRMADA },
        }),
        this.prisma.saldoEstoque.update({
          where: {
            tenantId_produtoId_depositoId: {
              tenantId,
              produtoId: reserva.produtoId,
              depositoId,
            },
          },
          data: {
            quantidadeFisica: { decrement: reserva.quantidade },
            reservado: { decrement: reserva.quantidade },
          },
        }),
        this.prisma.movimentacao.create({
          data: {
            tenantId,
            produtoId: reserva.produtoId,
            depositoId,
            tipo: TipoMovimentacao.SAIDA,
            motivo: MotivoMovimentacao.VENDA,
            quantidade: reserva.quantidade,
            observacao: `Baixa por venda — pedido ${pedidoId}`,
          },
        }),
      ]);

      confirmadas.push({
        produtoId: reserva.produtoId,
        depositoId,
        quantidade: reserva.quantidade,
      });
    }

    return confirmadas;
  }

  /**
   * Cancela reservas ATIVAS de um pedido e libera o estoque reservado.
   *
   * @returns lista das reservas liberadas (para publicar evento / logging).
   */
  async cancelarReservas(tenantId: string, pedidoId: string) {
    const reservas = await this.prisma.reservaEstoque.findMany({
      where: { tenantId, pedidoId, status: StatusReserva.ATIVA },
    });

    const liberadas: Array<{
      produtoId: string;
      depositoId: string | null;
      quantidade: number;
    }> = [];

    for (const reserva of reservas) {
      const operacoes: any[] = [
        this.prisma.reservaEstoque.updateMany({
          where: { id: reserva.id, tenantId },
          data: { status: StatusReserva.CANCELADA },
        }),
      ];

      // Libera o reservado no depósito da reserva (quando conhecido).
      if (reserva.depositoId) {
        operacoes.push(
          this.prisma.saldoEstoque.update({
            where: {
              tenantId_produtoId_depositoId: {
                tenantId,
                produtoId: reserva.produtoId,
                depositoId: reserva.depositoId,
              },
            },
            data: { reservado: { decrement: reserva.quantidade } },
          }),
        );
      } else {
        // Reserva legada sem depósito: libera no consolidado do produto.
        operacoes.push(
          this.prisma.saldoEstoque.updateMany({
            where: { tenantId, produtoId: reserva.produtoId },
            data: { reservado: { decrement: reserva.quantidade } },
          }),
        );
      }

      await this.prisma.$transaction(operacoes);

      liberadas.push({
        produtoId: reserva.produtoId,
        depositoId: reserva.depositoId,
        quantidade: reserva.quantidade,
      });
    }

    return liberadas;
  }

  /**
   * Seleciona um depósito com saldo FÍSICO suficiente para dar baixa.
   * Usado como fallback para reservas legadas (sem depositoId).
   */
  private async selecionarDepositoParaBaixa(
    tenantId: string,
    produtoId: string,
    quantidade: number,
  ): Promise<string | null> {
    const saldos = await this.prisma.saldoEstoque.findMany({
      where: { tenantId, produtoId },
      include: { deposito: { select: { padrao: true } } },
    });

    const candidatos = saldos
      .filter((s) => s.quantidadeFisica >= quantidade)
      .sort((a, b) => {
        const pa = a.deposito?.padrao ? 1 : 0;
        const pb = b.deposito?.padrao ? 1 : 0;
        if (pa !== pb) return pb - pa;
        return b.quantidadeFisica - a.quantidadeFisica;
      });

    return candidatos[0]?.depositoId ?? null;
  }

  /** Inicializa saldo zerado para novo produto */
  async inicializarSaldo(tenantId: string, produtoId: string, depositoId: string) {
    return this.prisma.saldoEstoque.upsert({
      where: { tenantId_produtoId_depositoId: { tenantId, produtoId, depositoId } },
      update: {},
      create: { tenantId, produtoId, depositoId, quantidadeFisica: 0, reservado: 0, estoqueMinimo: 0 },
    });
  }

  /** Obtém depósito padrão do tenant */
  async obterDepositoPadrao(tenantId: string) {
    return this.prisma.deposito.findFirst({
      where: { tenantId, padrao: true, ativo: true },
    });
  }

  /** Registra movimentação no histórico */
  async registrarMovimentacao(tenantId: string, dados: {
    produtoId: string;
    depositoId: string;
    tipo: TipoMovimentacao;
    motivo: MotivoMovimentacao;
    quantidade: number;
    custoUnitario?: number;
    observacao?: string;
    usuarioId?: string;
  }) {
    return this.prisma.movimentacao.create({
      data: { tenantId, ...dados },
    });
  }

  /**
   * Marca um evento como processado (idempotência do consumo Kafka).
   *
   * Usa o índice único (evento, referenciaId): se o evento já foi processado,
   * a criação falha com P2002 e devolvemos `false` (ignorar reprocessamento).
   * Se registrou agora, devolve `true` (deve aplicar o efeito colateral).
   */
  async registrarEventoProcessado(
    tenantId: string,
    evento: string,
    referenciaId: string,
  ): Promise<boolean> {
    try {
      await this.prisma.eventoProcessado.create({
        data: { tenantId, evento, referenciaId },
      });
      return true;
    } catch (erro: unknown) {
      // P2002 = violação de unique → evento já processado.
      if (
        typeof erro === 'object' &&
        erro !== null &&
        'code' in erro &&
        (erro as { code?: string }).code === 'P2002'
      ) {
        return false;
      }
      throw erro;
    }
  }

  /** Lista reservas ATIVAS de um pedido (para inspeção/eventos). */
  async listarReservasAtivas(tenantId: string, pedidoId: string) {
    return this.prisma.reservaEstoque.findMany({
      where: { tenantId, pedidoId, status: StatusReserva.ATIVA },
    });
  }
}
