/**
 * Serviço de Movimentações.
 * Consulta e filtra histórico de movimentações.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MovimentacaoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lista movimentações com filtros e paginação.
   */
  async listar(tenantId: string, filtros: any) {
    const { produtoId, depositoId, tipo } = filtros;
    const pagina = Number(filtros.pagina) > 0 ? Number(filtros.pagina) : 1;
    const itensPorPagina = Number(filtros.itensPorPagina) > 0 ? Number(filtros.itensPorPagina) : 50;
    const where: any = { tenantId };

    if (produtoId) where.produtoId = produtoId;
    if (depositoId) where.depositoId = depositoId;
    if (tipo) where.tipo = tipo;

    const [dados, total] = await Promise.all([
      this.prisma.movimentacao.findMany({
        where,
        skip: (pagina - 1) * itensPorPagina,
        take: itensPorPagina,
        orderBy: { criadoEm: 'desc' },
        include: { deposito: { select: { nome: true } } },
      }),
      this.prisma.movimentacao.count({ where }),
    ]);

    return {
      dados,
      meta: {
        total,
        pagina,
        itensPorPagina,
        totalPaginas: Math.ceil(total / itensPorPagina),
      },
    };
  }
}
