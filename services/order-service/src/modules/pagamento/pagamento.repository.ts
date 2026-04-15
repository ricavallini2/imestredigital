/**
 * ═══════════════════════════════════════════════════════════════
 * Repositório de Pagamentos - Prisma
 * ═══════════════════════════════════════════════════════════════
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PagamentoRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar novo registro de pagamento.
   */
  async criar(tenantId: string, pedidoId: string, dados: any) {
    return this.prisma.pagamento.create({
      data: {
        ...dados,
        tenantId,
        pedidoId,
        valor: new Decimal(dados.valor),
      },
    });
  }

  /**
   * Buscar pagamentos de um pedido.
   */
  async buscarPorPedido(tenantId: string, pedidoId: string) {
    return this.prisma.pagamento.findMany({
      where: {
        pedidoId,
        tenantId,
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  /**
   * Buscar pagamento por ID.
   */
  async buscarPorId(tenantId: string, pagamentoId: string) {
    return this.prisma.pagamento.findFirst({
      where: {
        id: pagamentoId,
        tenantId,
      },
    });
  }

  /**
   * Atualizar status de pagamento.
   */
  async atualizarStatus(
    tenantId: string,
    pagamentoId: string,
    novoStatus: string,
  ) {
    return this.prisma.pagamento.update({
      where: { id: pagamentoId },
      data: {
        status: novoStatus,
        dataPagamento: novoStatus === 'PAGO' ? new Date() : undefined,
        atualizadoEm: new Date(),
      },
    });
  }

  /**
   * Listar pagamentos do tenant.
   */
  async listar(tenantId: string, filtros: any) {
    const { status, dataInicio, dataFim, pagina = 1, limite = 20 } = filtros;

    const skip = (pagina - 1) * limite;

    const where: any = { tenantId };

    if (status) where.status = status;

    if (dataInicio || dataFim) {
      where.criadoEm = {};
      if (dataInicio) where.criadoEm.gte = new Date(dataInicio);
      if (dataFim) where.criadoEm.lte = new Date(dataFim);
    }

    const [pagamentos, total] = await Promise.all([
      this.prisma.pagamento.findMany({
        where,
        skip,
        take: limite,
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.pagamento.count({ where }),
    ]);

    return {
      pagamentos,
      paginacao: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }
}
