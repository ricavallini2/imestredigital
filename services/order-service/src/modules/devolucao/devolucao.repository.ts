/**
 * ═══════════════════════════════════════════════════════════════
 * Repositório de Devoluções - Prisma
 * ═══════════════════════════════════════════════════════════════
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { StatusDevolucao } from '../../../generated/client';

@Injectable()
export class DevolucaoRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar nova devolução.
   */
  async criar(tenantId: string, pedidoId: string, dados: any) {
    return this.prisma.devolucao.create({
      data: {
        ...dados,
        tenantId,
        pedidoId,
        valorReembolso: new Decimal(dados.valorReembolso || 0),
      },
      include: {
        itens: true,
      },
    });
  }

  /**
   * Buscar devolução por ID.
   */
  async buscarPorId(tenantId: string, devolucaoId: string) {
    return this.prisma.devolucao.findFirst({
      where: {
        id: devolucaoId,
        tenantId,
      },
      include: {
        itens: true,
      },
    });
  }

  /**
   * Buscar devoluções de um pedido.
   */
  async buscarPorPedido(tenantId: string, pedidoId: string) {
    return this.prisma.devolucao.findMany({
      where: {
        pedidoId,
        tenantId,
      },
      include: {
        itens: true,
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  /**
   * Adicionar itens à devolução.
   */
  async adicionarItens(devolucaoId: string, itens: any[]) {
    return this.prisma.itemDevolucao.createMany({
      data: itens.map((item) => ({
        ...item,
        devolucaoId,
      })),
    });
  }

  /**
   * Atualizar status da devolução.
   *
   * Write multi-tenant seguro: filtra por { id, tenantId } via updateMany
   * e retorna a devolução atualizada (buscada com o mesmo filtro de tenant).
   */
  async atualizarStatus(tenantId: string, devolucaoId: string, novoStatus: string) {
    await this.prisma.devolucao.updateMany({
      where: { id: devolucaoId, tenantId },
      data: {
        status: novoStatus as StatusDevolucao,
        atualizadoEm: new Date(),
      },
    });

    return this.prisma.devolucao.findFirst({
      where: { id: devolucaoId, tenantId },
      include: { itens: true },
    });
  }

  /**
   * Atualizar rastreio de retorno (write multi-tenant seguro).
   */
  async atualizarRastreioRetorno(
    tenantId: string,
    devolucaoId: string,
    codigoRastreioRetorno: string,
  ) {
    return this.prisma.devolucao.updateMany({
      where: { id: devolucaoId, tenantId },
      data: {
        codigoRastreioRetorno,
        atualizadoEm: new Date(),
      },
    });
  }

  /**
   * Listar devoluções do tenant.
   */
  async listar(tenantId: string, filtros: any) {
    const { status, dataInicio, dataFim } = filtros;

    // Mesma armadilha do pagamento.repository: `@Query() filtros: any` faz o
    // ValidationPipe pular a conversão, então pagina/limite chegam como STRING
    // e `take: '10'` derruba o Prisma (ValidationError → 500).
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
      this.prisma.devolucao.findMany({
        where,
        skip,
        take: limite,
        include: { itens: true },
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.devolucao.count({ where }),
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
