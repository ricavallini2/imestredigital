/**
 * Repository de Insights - Camada de dados
 *
 * Todas as leituras/escritas são escopadas por tenantId.
 * Enums (tipo, prioridade, status) seguem o schema Prisma como fonte da verdade.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Prisma,
  TipoInsight,
  PrioridadeInsight,
  StatusInsight,
} from '../../../generated/client';

interface FiltrosListagem {
  tipo?: string;
  prioridade?: string;
  apenasNaoLidos?: boolean;
  limite?: number;
  offset?: number;
}

@Injectable()
export class InsightsRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria um novo insight (sempre com tenantId).
   */
  async criarInsight(dados: {
    tenantId: string;
    tipo: string;
    titulo: string;
    descricao: string;
    prioridade?: string;
    dados?: Record<string, any>;
    acaoSugerida?: string;
  }) {
    return this.prisma.insightIA.create({
      data: {
        tenantId: dados.tenantId,
        tipo: dados.tipo as TipoInsight,
        titulo: dados.titulo,
        descricao: dados.descricao,
        prioridade: (dados.prioridade as PrioridadeInsight) ?? PrioridadeInsight.MEDIA,
        dados: dados.dados ?? {},
        acaoSugerida: dados.acaoSugerida,
      },
    });
  }

  /**
   * Lista insights do tenant com filtros e paginação.
   * Retorna também o total para montar o envelope paginado no service.
   */
  async listarInsights(tenantId: string, filtros?: FiltrosListagem) {
    const where: Prisma.InsightIAWhereInput = { tenantId };

    if (filtros?.tipo) {
      where.tipo = filtros.tipo as TipoInsight;
    }

    if (filtros?.prioridade) {
      where.prioridade = filtros.prioridade as PrioridadeInsight;
    }

    if (filtros?.apenasNaoLidos) {
      where.status = StatusInsight.ATIVO;
    }

    const [insights, total] = await Promise.all([
      this.prisma.insightIA.findMany({
        where,
        orderBy: { criadoEm: 'desc' },
        take: filtros?.limite ?? 20,
        skip: filtros?.offset ?? 0,
      }),
      this.prisma.insightIA.count({ where }),
    ]);

    return { insights, total };
  }

  /**
   * Obtém um insight específico do tenant (nunca por id sozinho).
   */
  async obterInsight(tenantId: string, insightId: string) {
    return this.prisma.insightIA.findFirst({
      where: { id: insightId, tenantId },
    });
  }

  /**
   * Marca insight como visualizado, restringindo por tenantId.
   * Usa updateMany com { id, tenantId } para nunca vazar entre tenants.
   * Retorna o registro atualizado (ou null se não pertencer ao tenant).
   */
  async marcarVisualizado(tenantId: string, insightId: string) {
    const resultado = await this.prisma.insightIA.updateMany({
      where: { id: insightId, tenantId },
      data: {
        status: StatusInsight.LIDO,
        lidoEm: new Date(),
      },
    });

    if (resultado.count === 0) {
      return null;
    }

    return this.obterInsight(tenantId, insightId);
  }

  /**
   * Conta insights não lidos do tenant.
   */
  async contarNaoLidos(tenantId: string): Promise<number> {
    return this.prisma.insightIA.count({
      where: {
        tenantId,
        status: StatusInsight.ATIVO,
      },
    });
  }
}
