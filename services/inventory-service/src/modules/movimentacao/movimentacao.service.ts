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
   *
   * Retorna o ENVELOPE PAGINADO canônico da Fase 0:
   * { dados, total, pagina, limite, totalPaginas }.
   */
  async listar(tenantId: string, filtros: any) {
    const { produtoId, depositoId, tipo } = filtros;
    const pagina = Number(filtros.pagina) > 0 ? Number(filtros.pagina) : 1;
    // Aceita `limite` (canônico) ou o legado `itensPorPagina`.
    const limiteBruto = Number(filtros.limite ?? filtros.itensPorPagina);
    const limite = limiteBruto > 0 ? limiteBruto : 50;
    const where: any = { tenantId };

    if (produtoId) where.produtoId = produtoId;
    if (depositoId) where.depositoId = depositoId;
    if (tipo) where.tipo = tipo;

    const [dados, total] = await Promise.all([
      this.prisma.movimentacao.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { criadoEm: 'desc' },
        include: { deposito: { select: { nome: true } } },
      }),
      this.prisma.movimentacao.count({ where }),
    ]);

    return {
      dados,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }
}
