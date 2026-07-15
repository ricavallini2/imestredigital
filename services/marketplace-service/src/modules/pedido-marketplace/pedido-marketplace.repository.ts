import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PedidoMarketplace, Prisma } from '../../../generated/client';

/**
 * Repository para PedidoMarketplace.
 * Writes escopados por tenantId (updateMany com where composto).
 */
@Injectable()
export class PedidoMarketplaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: Prisma.PedidoMarketplaceUncheckedCreateInput): Promise<PedidoMarketplace> {
    return this.prisma.pedidoMarketplace.create({ data: dados });
  }

  async buscarPorId(id: string, tenantId: string): Promise<PedidoMarketplace | null> {
    return this.prisma.pedidoMarketplace.findFirst({
      where: { id, tenantId },
    });
  }

  /**
   * Busca por id externo do marketplace, dentro do tenant (evita colisão entre tenants).
   */
  async buscarPorIdExterno(
    tenantId: string,
    idExterno: string,
  ): Promise<PedidoMarketplace | null> {
    return this.prisma.pedidoMarketplace.findFirst({
      where: { tenantId, idExterno },
    });
  }

  /**
   * Lista pedidos paginados do tenant + total, para o envelope canônico.
   */
  async listarPaginado(
    tenantId: string,
    where: Prisma.PedidoMarketplaceWhereInput,
    pagina: number,
    limite: number,
  ): Promise<{ itens: PedidoMarketplace[]; total: number }> {
    const [itens, total] = await this.prisma.$transaction([
      this.prisma.pedidoMarketplace.findMany({
        where: { tenantId, ...where },
        orderBy: { dataVenda: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      this.prisma.pedidoMarketplace.count({ where: { tenantId, ...where } }),
    ]);
    return { itens, total };
  }

  async atualizar(
    id: string,
    tenantId: string,
    dados: Prisma.PedidoMarketplaceUncheckedUpdateInput,
  ): Promise<PedidoMarketplace> {
    await this.prisma.pedidoMarketplace.updateMany({
      where: { id, tenantId },
      data: dados,
    });
    const pedido = await this.buscarPorId(id, tenantId);
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return pedido;
  }

  async contarNaoSincronizados(tenantId: string): Promise<number> {
    return this.prisma.pedidoMarketplace.count({
      where: { tenantId, sincronizado: false },
    });
  }
}
