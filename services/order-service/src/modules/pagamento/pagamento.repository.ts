/**
 * ═══════════════════════════════════════════════════════════════
 * Repositório de Pagamentos - Prisma
 * ═══════════════════════════════════════════════════════════════
 */

import { Injectable } from '@nestjs/common';
import { PrismaService, ClientePrisma } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { StatusPagamentoDetalhado } from '../../../generated/client';

@Injectable()
export class PagamentoRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar novo registro de pagamento.
   *
   * Aceita um `cliente` alternativo (o tx de um $transaction) para que o
   * pagamento e a movimentação de caixa sejam gravados atomicamente.
   */
  async criar(tenantId: string, pedidoId: string, dados: any, cliente: ClientePrisma = this.prisma) {
    return cliente.pagamento.create({
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
   *
   * Write multi-tenant seguro: filtra por { id, tenantId } via updateMany
   * e retorna o pagamento atualizado (buscado com o mesmo filtro de tenant).
   *
   * Aceita um `cliente` alternativo (o tx de um $transaction) para que o estorno
   * e o reembolso no caixa sejam gravados atomicamente.
   */
  async atualizarStatus(
    tenantId: string,
    pagamentoId: string,
    novoStatus: string,
    cliente: ClientePrisma = this.prisma,
  ) {
    await cliente.pagamento.updateMany({
      where: { id: pagamentoId, tenantId },
      data: {
        status: novoStatus as StatusPagamentoDetalhado,
        dataPagamento: novoStatus === 'PAGO' ? new Date() : undefined,
        atualizadoEm: new Date(),
      },
    });

    return cliente.pagamento.findFirst({
      where: { id: pagamentoId, tenantId },
    });
  }

  /**
   * Listar pagamentos do tenant.
   */
  async listar(tenantId: string, filtros: any) {
    const { status, dataInicio, dataFim } = filtros;

    // O controller usa `@Query() filtros: any`: com metatype Object o
    // ValidationPipe NÃO transforma nada, então pagina/limite chegam como
    // STRING quando enviados (e o default do destructuring não dispara, pois a
    // chave existe). `take: '10'` derruba o Prisma com ValidationError → 500.
    const pagina = Math.max(1, Number(filtros?.pagina) || 1);
    const limite = Math.min(200, Math.max(1, Number(filtros?.limite) || 20));

    const skip = (pagina - 1) * limite;

    const where: any = { tenantId };

    if (status) where.status = status;

    if (dataInicio || dataFim) {
      where.criadoEm = {};
      if (dataInicio) where.criadoEm.gte = new Date(dataInicio);
      if (dataFim) where.criadoEm.lte = new Date(dataFim);
    }

    const [dados, total] = await Promise.all([
      this.prisma.pagamento.findMany({
        where,
        skip,
        take: limite,
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.pagamento.count({ where }),
    ]);

    // Envelope paginado canônico (Fase 0): { dados, total, pagina, limite, totalPaginas }
    return {
      dados,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }
}
