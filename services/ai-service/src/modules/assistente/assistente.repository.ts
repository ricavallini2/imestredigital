/**
 * Repository do Assistente - Camada de dados
 *
 * Centraliza acesso a ConversaIA e MensagemIA
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../../generated/client';

@Injectable()
export class AssistenteRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova conversa
   */
  async criarConversa(dados: {
    tenantId: string;
    usuarioId: string;
    titulo: string;
    contexto?: Record<string, any>;
  }) {
    return this.prisma.conversaIA.create({
      data: {
        tenantId: dados.tenantId,
        usuarioId: dados.usuarioId,
        titulo: dados.titulo,
        contexto: dados.contexto || {},
      },
    });
  }

  /**
   * Obtém uma conversa com todas as mensagens.
   *
   * Sempre escopado por tenantId na própria query (findFirst com { id, tenantId }),
   * nunca por id sozinho — mesmo padrão do InsightsRepository.
   */
  async obterConversa(tenantId: string, conversaId: string) {
    return this.prisma.conversaIA.findFirst({
      where: { id: conversaId, tenantId },
      include: {
        mensagens: {
          orderBy: { criadoEm: 'asc' },
        },
      },
    });
  }

  /**
   * Lista conversas de um usuário do tenant, com paginação.
   * Retorna também o total para o service montar o envelope paginado.
   */
  async listarConversas(
    tenantId: string,
    usuarioId: string,
    limite: number = 20,
    offset: number = 0,
  ) {
    const where: Prisma.ConversaIAWhereInput = { tenantId, usuarioId };

    const [conversas, total] = await Promise.all([
      this.prisma.conversaIA.findMany({
        where,
        orderBy: { atualizadoEm: 'desc' },
        take: limite,
        skip: offset,
      }),
      this.prisma.conversaIA.count({ where }),
    ]);

    return { conversas, total };
  }

  /**
   * Adiciona uma mensagem a uma conversa do tenant.
   *
   * A conversa é tocada via updateMany com { id, tenantId } (where composto) —
   * mesmo padrão do InsightsRepository.marcarVisualizado. Se a conversa não
   * pertencer ao tenant, nada é gravado e o retorno é null.
   */
  async adicionarMensagem(dados: {
    tenantId: string;
    conversaId: string;
    papel: 'USUARIO' | 'ASSISTENTE' | 'SISTEMA';
    conteudo: string;
    metadados?: Record<string, any>;
  }) {
    // Atualizar conversa com timestamp, restringindo por tenantId
    const conversaTocada = await this.prisma.conversaIA.updateMany({
      where: { id: dados.conversaId, tenantId: dados.tenantId },
      data: { atualizadoEm: new Date() },
    });

    if (conversaTocada.count === 0) {
      return null;
    }

    return this.prisma.mensagemIA.create({
      data: {
        conversaId: dados.conversaId,
        papel: dados.papel,
        conteudo: dados.conteudo,
        metadados: dados.metadados || {},
      },
    });
  }

  /**
   * Obtém as últimas mensagens de uma conversa (para contexto).
   *
   * MensagemIA não tem tenantId próprio: o escopo vem da relação com a
   * ConversaIA, por isso o filtro { conversa: { tenantId } }.
   */
  async obterUltimasMensagens(
    tenantId: string,
    conversaId: string,
    limite: number = 10,
  ) {
    return this.prisma.mensagemIA.findMany({
      where: { conversaId, conversa: { tenantId } },
      orderBy: { criadoEm: 'desc' },
      take: limite,
    });
  }

  /**
   * Atualiza o contexto de uma conversa do tenant.
   * Retorna a conversa atualizada ou null se não pertencer ao tenant.
   */
  async atualizarContexto(
    tenantId: string,
    conversaId: string,
    novoContexto: Record<string, any>,
  ) {
    const resultado = await this.prisma.conversaIA.updateMany({
      where: { id: conversaId, tenantId },
      data: {
        contexto: novoContexto,
        atualizadoEm: new Date(),
      },
    });

    if (resultado.count === 0) {
      return null;
    }

    return this.prisma.conversaIA.findFirst({
      where: { id: conversaId, tenantId },
    });
  }

  /**
   * Deleta uma conversa do tenant (as mensagens caem por cascade no schema).
   * Retorna true se algo foi deletado, false se a conversa não é do tenant.
   */
  async deletarConversa(tenantId: string, conversaId: string): Promise<boolean> {
    const resultado = await this.prisma.conversaIA.deleteMany({
      where: { id: conversaId, tenantId },
    });

    return resultado.count > 0;
  }
}
