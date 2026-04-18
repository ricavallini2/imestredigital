import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PerguntaMarketplace } from '../../../generated/client';

/**
 * Repository para PerguntaMarketplace
 */
@Injectable()
export class PerguntaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: any): Promise<PerguntaMarketplace> {
    return this.prisma.perguntaMarketplace.create({ data: dados });
  }

  async buscarPorId(id: string, tenantId: string): Promise<PerguntaMarketplace | null> {
    return this.prisma.perguntaMarketplace.findFirst({
      where: { id, tenantId },
    });
  }

  async listar(tenantId: string, filtros?: any): Promise<PerguntaMarketplace[]> {
    return this.prisma.perguntaMarketplace.findMany({
      where: { tenantId, ...filtros },
      orderBy: { dataEnvio: 'desc' },
    });
  }

  async listarPendentes(tenantId: string): Promise<PerguntaMarketplace[]> {
    return this.prisma.perguntaMarketplace.findMany({
      where: { tenantId, status: 'PENDENTE' },
      orderBy: { dataEnvio: 'asc' },
    });
  }

  async atualizar(id: string, dados: Partial<PerguntaMarketplace>): Promise<PerguntaMarketplace> {
    return this.prisma.perguntaMarketplace.update({
      where: { id },
      data: { ...dados },
    });
  }

  async contarPendentes(tenantId: string): Promise<number> {
    return this.prisma.perguntaMarketplace.count({
      where: { tenantId, status: 'PENDENTE' },
    });
  }
}
