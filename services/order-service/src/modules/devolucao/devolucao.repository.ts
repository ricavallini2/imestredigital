/**
 * ═══════════════════════════════════════════════════════════════
 * Repositório de Devoluções - Prisma
 * ═══════════════════════════════════════════════════════════════
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

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
   */
  async atualizarStatus(tenantId: string, devolucaoId: string, novoStatus: string) {
    return this.prisma.devolucao.update({
      where: { id: devolucaoId },
      data: {
        status: novoStatus,
        atualizadoEm: new Date(),
      },
      include: {
        itens: true,
      },
    });
  }

  /**
   * Atualizar rastreio de retorno.
   */
  async atualizarRastreioRetorno(
    tenantId: string,
    devolucaoId: string,
    codigoRastreioRetorno: string,
  ) {
    return this.prisma.devolucao.update({
      where: { id: devolucaoId },
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
    const { status, dataInicio, dataFim, pagina = 1, limite = 20 } = filtros;

    const skip = (pagina - 1) * limite;

    const where: any = { tenantId };

    if (status) where.status = status;

    if (dataInicio || dataFim) {
      where.criadoEm = {};
      if (dataInicio) where.criadoEm.gte = new Date(dataInicio);
      if (dataFim) where.criadoEm.lte = new Date(dataFim);
    }

    const [devolucoes, total] = await Promise.all([
      this.prisma.devolucao.findMany({
        where,
        skip,
        take: limite,
        include: { itens: true },
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.devolucao.count({ where }),
    ]);

    return {
      devolucoes,
      paginacao: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }
}
