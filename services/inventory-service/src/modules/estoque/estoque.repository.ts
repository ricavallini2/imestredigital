/**
 * Repositório de Estoque.
 * Acesso a dados com isolamento por tenant.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  /** Resumo de estoque do tenant */
  async resumo(tenantId: string, depositoId?: string) {
    const where: any = { tenantId };
    if (depositoId) where.depositoId = depositoId;

    const saldos = await this.prisma.saldoEstoque.findMany({
      where,
      include: {
        deposito: { select: { nome: true } },
      },
      orderBy: { quantidadeFisica: 'asc' },
    });

    // Calcula disponível em cada saldo
    const saldosComDisponivel = saldos.map((s) => ({
      ...s,
      disponivel: s.quantidadeFisica - s.reservado,
    }));

    return {
      totalProdutos: saldos.length,
      totalUnidades: saldos.reduce((acc, s) => acc + s.quantidadeFisica, 0),
      totalReservado: saldos.reduce((acc, s) => acc + s.reservado, 0),
      items: saldosComDisponivel,
    };
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

  /** Cria reserva de estoque para um pedido */
  async criarReserva(tenantId: string, produtoId: string, quantidade: number, pedidoId: string) {
    return this.prisma.$transaction([
      this.prisma.reservaEstoque.create({
        data: { tenantId, produtoId, quantidade, pedidoId, status: 'pendente' },
      }),
      this.prisma.saldoEstoque.updateMany({
        where: { tenantId, produtoId },
        data: { reservado: { increment: quantidade } },
      }),
    ]);
  }

  /** Confirma reservas (baixa definitiva) */
  async confirmarReservas(tenantId: string, pedidoId: string) {
    const reservas = await this.prisma.reservaEstoque.findMany({
      where: { tenantId, pedidoId, status: 'pendente' },
    });

    for (const reserva of reservas) {
      await this.prisma.$transaction([
        this.prisma.reservaEstoque.update({
          where: { id: reserva.id },
          data: { status: 'confirmada' },
        }),
        this.prisma.saldoEstoque.updateMany({
          where: { tenantId, produtoId: reserva.produtoId },
          data: {
            quantidadeFisica: { decrement: reserva.quantidade },
            reservado: { decrement: reserva.quantidade },
          },
        }),
      ]);
    }
  }

  /** Cancela reservas e libera estoque */
  async cancelarReservas(tenantId: string, pedidoId: string) {
    const reservas = await this.prisma.reservaEstoque.findMany({
      where: { tenantId, pedidoId, status: 'pendente' },
    });

    for (const reserva of reservas) {
      await this.prisma.$transaction([
        this.prisma.reservaEstoque.update({
          where: { id: reserva.id },
          data: { status: 'cancelada' },
        }),
        this.prisma.saldoEstoque.updateMany({
          where: { tenantId, produtoId: reserva.produtoId },
          data: { reservado: { decrement: reserva.quantidade } },
        }),
      ]);
    }
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
    tipo: string;
    motivo: string;
    quantidade: number;
    custoUnitario?: number;
    observacao?: string;
  }) {
    return this.prisma.movimentacao.create({
      data: { tenantId, ...dados },
    });
  }
}
