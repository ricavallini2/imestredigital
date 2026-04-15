import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PedidoMarketplace } from '@prisma/client';

/**
 * Repository para PedidoMarketplace
 */
@Injectable()
export class PedidoMarketplaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: any): Promise<PedidoMarketplace> {
    return this.prisma.pedidoMarketplace.create({ data: dados });
  }

  async buscarPorId(id: string, tenantId: string): Promise<PedidoMarketplace | null> {
    return this.prisma.pedidoMarketplace.findFirst({
      where: { id, tenantId },
    });
  }

  async buscarPorMarketplacePedidoId(marketplacePedidoId: string): Promise<PedidoMarketplace | null> {
    return this.prisma.pedidoMarketplace.findFirst({
      where: { marketplacePedidoId },
    });
  }

  async listar(tenantId: string, filtros?: any): Promise<PedidoMarketplace[]> {
    return this.prisma.pedidoMarketplace.findMany({
      where: { tenantId, ...filtros },
      orderBy: { dataVenda: 'desc' },
    });
  }

  async atualizar(id: string, dados: Partial<PedidoMarketplace>): Promise<PedidoMarketplace> {
    return this.prisma.pedidoMarketplace.update({
      where: { id },
      data: { ...dados, updatedAt: new Date() },
    });
  }

  async contarNaoSincronizados(tenantId: string): Promise<number> {
    return this.prisma.pedidoMarketplace.count({
      where: { tenantId, sincronizado: false },
    });
  }
}
