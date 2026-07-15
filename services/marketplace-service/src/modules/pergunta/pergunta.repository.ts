import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PerguntaMarketplace, StatusPerguntaMarketplace, Prisma } from '../../../generated/client';

/**
 * Repository para PerguntaMarketplace.
 * Writes escopados por tenantId (updateMany com where composto).
 */
@Injectable()
export class PerguntaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: Prisma.PerguntaMarketplaceUncheckedCreateInput): Promise<PerguntaMarketplace> {
    return this.prisma.perguntaMarketplace.create({ data: dados });
  }

  async buscarPorId(id: string, tenantId: string): Promise<PerguntaMarketplace | null> {
    return this.prisma.perguntaMarketplace.findFirst({
      where: { id, tenantId },
    });
  }

  /**
   * Busca por id externo do marketplace, dentro do tenant.
   */
  async buscarPorIdExterno(
    tenantId: string,
    idExterno: string,
  ): Promise<PerguntaMarketplace | null> {
    return this.prisma.perguntaMarketplace.findFirst({
      where: { tenantId, idExterno },
    });
  }

  async listar(
    tenantId: string,
    where: Prisma.PerguntaMarketplaceWhereInput = {},
  ): Promise<PerguntaMarketplace[]> {
    return this.prisma.perguntaMarketplace.findMany({
      where: { tenantId, ...where },
      orderBy: { dataEnvio: 'desc' },
    });
  }

  async listarPendentes(tenantId: string): Promise<PerguntaMarketplace[]> {
    return this.prisma.perguntaMarketplace.findMany({
      where: { tenantId, status: StatusPerguntaMarketplace.PENDENTE },
      orderBy: { dataEnvio: 'asc' },
    });
  }

  async atualizar(
    id: string,
    tenantId: string,
    dados: Prisma.PerguntaMarketplaceUncheckedUpdateInput,
  ): Promise<PerguntaMarketplace> {
    await this.prisma.perguntaMarketplace.updateMany({
      where: { id, tenantId },
      data: dados,
    });
    const pergunta = await this.buscarPorId(id, tenantId);
    if (!pergunta) {
      throw new NotFoundException('Pergunta não encontrada');
    }
    return pergunta;
  }

  async contarPendentes(tenantId: string): Promise<number> {
    return this.prisma.perguntaMarketplace.count({
      where: { tenantId, status: StatusPerguntaMarketplace.PENDENTE },
    });
  }
}
