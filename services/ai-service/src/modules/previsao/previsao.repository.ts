/**
 * Repository de Previsão - Camada de dados
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrevisaoRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma previsão
   */
  async criarPrevisao(dados: {
    tenantId: string;
    produtoId: string;
    periodo: Date;
    quantidadePrevista: number;
    confianca: number;
    metodoCalculo: string;
    dadosEntrada: Record<string, any>;
  }) {
    return this.prisma.previsaoDemanda.create({
      data: {
        tenantId: dados.tenantId,
        produtoId: dados.produtoId,
        periodo: dados.periodo,
        quantidadePrevista: dados.quantidadePrevista,
        confianca: dados.confianca,
        metodoCalculo: dados.metodoCalculo,
        dadosEntrada: dados.dadosEntrada,
      },
    });
  }

  /**
   * Lista previsões
   */
  async listarPrevisoes(
    tenantId: string,
    filtros?: {
      produtoId?: string;
      limite?: number;
      offset?: number;
    },
  ) {
    const where: any = { tenantId };

    if (filtros?.produtoId) {
      where.produtoId = filtros.produtoId;
    }

    const [previsoes, total] = await Promise.all([
      this.prisma.previsaoDemanda.findMany({
        where,
        orderBy: { periodo: 'desc' },
        take: filtros?.limite || 20,
        skip: filtros?.offset || 0,
      }),
      this.prisma.previsaoDemanda.count({ where }),
    ]);

    return { previsoes, total };
  }

  /**
   * Obtém última previsão de um produto
   */
  async obterUltimaPrevisao(tenantId: string, produtoId: string) {
    return this.prisma.previsaoDemanda.findFirst({
      where: {
        tenantId,
        produtoId,
      },
      orderBy: { periodo: 'desc' },
    });
  }
}
