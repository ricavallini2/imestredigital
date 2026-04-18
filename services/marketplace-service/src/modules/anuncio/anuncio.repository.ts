import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnuncioMarketplace, StatusAnuncio } from '../../../generated/client';

/**
 * Repository para AnuncioMarketplace
 */
@Injectable()
export class AnuncioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: any): Promise<AnuncioMarketplace> {
    return this.prisma.anuncioMarketplace.create({ data: dados });
  }

  async buscarPorId(id: string, tenantId: string): Promise<AnuncioMarketplace | null> {
    return this.prisma.anuncioMarketplace.findFirst({
      where: { id, tenantId },
    });
  }

  async buscarPorProdutoId(tenantId: string, produtoId: string): Promise<AnuncioMarketplace[]> {
    return this.prisma.anuncioMarketplace.findMany({
      where: { tenantId, produtoId },
    });
  }

  async listar(tenantId: string, filtros?: any): Promise<AnuncioMarketplace[]> {
    return this.prisma.anuncioMarketplace.findMany({
      where: { tenantId, ...filtros },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async atualizar(id: string, dados: Partial<AnuncioMarketplace>): Promise<AnuncioMarketplace> {
    return this.prisma.anuncioMarketplace.update({
      where: { id },
      data: { ...dados },
    });
  }

  async deletar(id: string): Promise<void> {
    await this.prisma.anuncioMarketplace.delete({ where: { id } });
  }

  async contarPorConta(contaId: string): Promise<number> {
    return this.prisma.anuncioMarketplace.count({
      where: { contaMarketplaceId: contaId },
    });
  }

  async buscarPorMarketplaceItemId(marketplaceItemId: string): Promise<AnuncioMarketplace | null> {
    return this.prisma.anuncioMarketplace.findFirst({
      where: { idExterno: marketplaceItemId },
    });
  }
}
