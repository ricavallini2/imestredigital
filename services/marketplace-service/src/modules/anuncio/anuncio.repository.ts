import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnuncioMarketplace, Prisma } from '../../../generated/client';

/**
 * Repository para AnuncioMarketplace.
 * Todo write é escopado por tenantId (updateMany/deleteMany com where composto).
 */
@Injectable()
export class AnuncioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: Prisma.AnuncioMarketplaceUncheckedCreateInput): Promise<AnuncioMarketplace> {
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

  /**
   * Lista anúncios paginados do tenant, aplicando filtros suportados.
   * Retorna itens + total para montar o envelope paginado no serviço.
   */
  async listarPaginado(
    tenantId: string,
    where: Prisma.AnuncioMarketplaceWhereInput,
    pagina: number,
    limite: number,
  ): Promise<{ itens: AnuncioMarketplace[]; total: number }> {
    const [itens, total] = await this.prisma.$transaction([
      this.prisma.anuncioMarketplace.findMany({
        where: { tenantId, ...where },
        orderBy: { criadoEm: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      this.prisma.anuncioMarketplace.count({ where: { tenantId, ...where } }),
    ]);
    return { itens, total };
  }

  async atualizar(
    id: string,
    tenantId: string,
    dados: Prisma.AnuncioMarketplaceUncheckedUpdateInput,
  ): Promise<AnuncioMarketplace> {
    await this.prisma.anuncioMarketplace.updateMany({
      where: { id, tenantId },
      data: dados,
    });
    const anuncio = await this.buscarPorId(id, tenantId);
    if (!anuncio) {
      throw new NotFoundException('Anúncio não encontrado');
    }
    return anuncio;
  }

  async deletar(id: string, tenantId: string): Promise<void> {
    await this.prisma.anuncioMarketplace.deleteMany({ where: { id, tenantId } });
  }

  async contarPorConta(contaId: string): Promise<number> {
    return this.prisma.anuncioMarketplace.count({
      where: { contaMarketplaceId: contaId },
    });
  }

  async buscarPorMarketplaceItemId(
    tenantId: string,
    marketplaceItemId: string,
  ): Promise<AnuncioMarketplace | null> {
    return this.prisma.anuncioMarketplace.findFirst({
      where: { tenantId, idExterno: marketplaceItemId },
    });
  }
}
