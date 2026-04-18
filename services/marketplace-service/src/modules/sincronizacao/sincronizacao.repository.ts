import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SincronizacaoLog, TipoSincronizacao, StatusSincronizacao } from '../../../generated/client';

/**
 * Repository para SincronizacaoLog
 */
@Injectable()
export class SincronizacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: any): Promise<SincronizacaoLog> {
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

  async atualizar(id: string, dados: Partial<SincronizacaoLog>): Promise<SincronizacaoLog> {
    return this.prisma.sincronizacaoLog.update({
      where: { id },
      data: dados,
    });
  }

  async finalizarLog(
    id: string,
    status: StatusSincronizacao,
    registrosProcessados: number,
    registrosErro: number,
    detalhesErro?: any,
  ): Promise<SincronizacaoLog> {
    return this.prisma.sincronizacaoLog.update({
      where: { id },
      data: {
        status,
        registrosProcessados,
        registrosErro,
        detalhesErro: detalhesErro || [],
        fimEm: new Date(),
      },
    });
  }
}
