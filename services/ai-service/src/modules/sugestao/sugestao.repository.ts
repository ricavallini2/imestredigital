/**
 * Repository de Sugestões - Camada de dados
 *
 * Todas as leituras/escritas são escopadas por tenantId.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Prisma,
  TipoSugestao,
  StatusSugestao,
} from '../../../generated/client';

@Injectable()
export class SugestaoRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma sugestão (sempre com tenantId).
   */
  async criarSugestao(dados: {
    tenantId: string;
    tipo: string;
    contexto: Record<string, any>;
    sugestao: string;
    confianca: number;
  }) {
    return this.prisma.sugestaoIA.create({
      data: {
        tenantId: dados.tenantId,
        tipo: dados.tipo as TipoSugestao,
        contexto: dados.contexto,
        sugestao: dados.sugestao,
        confianca: dados.confianca,
      },
    });
  }

  /**
   * Lista sugestões do tenant com filtros. Retorna total para o envelope.
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
    const where: Prisma.SugestaoIAWhereInput = { tenantId };

    if (filtros?.tipo) {
      where.tipo = filtros.tipo as TipoSugestao;
    }

    if (filtros?.aceita !== undefined) {
      where.status = filtros.aceita
        ? StatusSugestao.ACEITA
        : StatusSugestao.PENDENTE;
    }

    const [sugestoes, total] = await Promise.all([
      this.prisma.sugestaoIA.findMany({
        where,
        orderBy: { criadoEm: 'desc' },
        take: filtros?.limite ?? 20,
        skip: filtros?.offset ?? 0,
      }),
      this.prisma.sugestaoIA.count({ where }),
    ]);

    return { sugestoes, total };
  }

  /**
   * Marca sugestão como aceita, restringindo por tenantId.
   * Retorna o registro atualizado ou null se não pertencer ao tenant.
   */
  async aceitarSugestao(tenantId: string, sugestaoId: string) {
    const resultado = await this.prisma.sugestaoIA.updateMany({
      where: { id: sugestaoId, tenantId },
      data: {
        status: StatusSugestao.ACEITA,
        respondidoEm: new Date(),
      },
    });

    if (resultado.count === 0) {
      return null;
    }

    return this.prisma.sugestaoIA.findFirst({
      where: { id: sugestaoId, tenantId },
    });
  }
}
