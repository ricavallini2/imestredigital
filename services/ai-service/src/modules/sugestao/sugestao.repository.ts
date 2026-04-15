/**
 * Repository de Sugestões - Camada de dados
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SugestaoRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma sugestão
   */
  async criarSugestao(dados: {
    tenantId: string;
    tipo:
      | 'PRECO'
      | 'ESTOQUE'
      | 'CLASSIFICACAO_FISCAL'
      | 'RESPOSTA_MARKETPLACE'
      | 'DESCRICAO_PRODUTO';
    contexto: Record<string, any>;
    sugestao: string;
    confianca: number;
  }) {
    return this.prisma.sugestaoIA.create({
      data: {
        tenantId: dados.tenantId,
        tipo: dados.tipo,
        contexto: dados.contexto,
        sugestao: dados.sugestao,
        confianca: dados.confianca,
      },
    });
  }

  /**
   * Lista sugestões
   */
  async listarSugestoes(
    tenantId: string,
    filtros?: {
      tipo?: string;
      aceita?: boolean;
      limite?: number;
      offset?: number;
    },
  ) {
    const where: any = { tenantId };

    if (filtros?.tipo) {
      where.tipo = filtros.tipo;
    }

    if (filtros?.aceita !== undefined) {
      where.aceita = filtros.aceita;
    }

    const [sugestoes, total] = await Promise.all([
      this.prisma.sugestaoIA.findMany({
        where,
        orderBy: { criadoEm: 'desc' },
        take: filtros?.limite || 20,
        skip: filtros?.offset || 0,
      }),
      this.prisma.sugestaoIA.count({ where }),
    ]);

    return { sugestoes, total };
  }

  /**
   * Marca sugestão como aceita
   */
  async aceitarSugestao(sugestaoId: string) {
    return this.prisma.sugestaoIA.update({
      where: { id: sugestaoId },
      data: { aceita: true },
    });
  }
}
