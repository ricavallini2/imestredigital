/**
 * Repository de Insights - Camada de dados
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InsightsRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria um novo insight
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
        tipo: dados.tipo as any,
        titulo: dados.titulo,
        descricao: dados.descricao,
        dados: dados.dados || {},
        acaoSugerida: dados.acaoSugerida,
      },
    });
  }

  /**
   * Lista insights com filtros
   */
  async listarInsights(
    tenantId: string,
    filtros?: {
      tipo?: string;
      prioridade?: string;
      apenasNaoLidos?: boolean;
      limite?: number;
      offset?: number;
    },
  ) {
    const where: any = { tenantId };

    if (filtros?.tipo) {
      where.tipo = filtros.tipo;
    }

    if (filtros?.apenasNaoLidos) {
      where.status = 'ATIVO';
    }

    const [insights, total] = await Promise.all([
      this.prisma.insightIA.findMany({
        where,
        orderBy: { criadoEm: 'desc' },
        take: filtros?.limite || 20,
        skip: filtros?.offset || 0,
      }),
      this.prisma.insightIA.count({ where }),
    ]);

    return { insights, total };
  }

  /**
   * Obtém um insight específico
   */
  async obterInsight(insightId: string) {
    return this.prisma.insightIA.findUnique({
      where: { id: insightId },
    });
  }

  /**
   * Marca insight como visualizado
   */
  async marcarVisualizado(insightId: string) {
    return this.prisma.insightIA.update({
      where: { id: insightId },
      data: {
        status: 'LIDO' as any,
        lidoEm: new Date(),
      },
    });
  }

  /**
   * Conta insights não lidos
   */
  async contarNaoLidos(tenantId: string): Promise<number> {
    return this.prisma.insightIA.count({
      where: {
        tenantId,
        status: 'ATIVO' as any,
      },
    });
  }
}
