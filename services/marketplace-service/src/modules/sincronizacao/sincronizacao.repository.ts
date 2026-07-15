import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SincronizacaoLog, StatusSincronizacao, Prisma } from '../../../generated/client';

/**
 * Repository para SincronizacaoLog.
 * Writes escopados por tenantId (updateMany com where composto).
 */
@Injectable()
export class SincronizacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: Prisma.SincronizacaoLogUncheckedCreateInput): Promise<SincronizacaoLog> {
    return this.prisma.sincronizacaoLog.create({ data: dados });
  }

  async buscarPorId(id: string, tenantId: string): Promise<SincronizacaoLog | null> {
    return this.prisma.sincronizacaoLog.findFirst({
      where: { id, tenantId },
    });
  }

  async listar(tenantId: string, contaId?: string): Promise<SincronizacaoLog[]> {
    return this.prisma.sincronizacaoLog.findMany({
      where: {
        tenantId,
        ...(contaId && { contaMarketplaceId: contaId }),
      },
      orderBy: { inicioEm: 'desc' },
      take: 100,
    });
  }

  async atualizar(
    id: string,
    tenantId: string,
    dados: Prisma.SincronizacaoLogUncheckedUpdateInput,
  ): Promise<void> {
    await this.prisma.sincronizacaoLog.updateMany({
      where: { id, tenantId },
      data: dados,
    });
  }

  async finalizarLog(
    id: string,
    tenantId: string,
    status: StatusSincronizacao,
    registrosProcessados: number,
    registrosErro: number,
    detalhesErro?: Prisma.InputJsonValue,
  ): Promise<void> {
    await this.prisma.sincronizacaoLog.updateMany({
      where: { id, tenantId },
      data: {
        status,
        registrosProcessados,
        registrosErro,
        detalhesErro: detalhesErro ?? [],
        fimEm: new Date(),
      },
    });
  }
}
