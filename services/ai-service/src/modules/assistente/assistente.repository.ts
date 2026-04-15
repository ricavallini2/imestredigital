/**
 * Repository do Assistente - Camada de dados
 *
 * Centraliza acesso a ConversaIA e MensagemIA
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
   * Obtém uma conversa com todas as mensagens
   */
  async obterConversa(conversaId: string) {
    return this.prisma.conversaIA.findUnique({
      where: { id: conversaId },
      include: {
        mensagens: {
          orderBy: { criadoEm: 'asc' },
        },
      },
    });
  }

  /**
   * Lista conversas de um usuário
   */
  async listarConversas(
    tenantId: string,
    usuarioId: string,
    limite: number = 20,
    offset: number = 0,
  ) {
    const [conversas, total] = await Promise.all([
      this.prisma.conversaIA.findMany({
        where: {
          tenantId,
          usuarioId,
        },
        orderBy: { atualizadoEm: 'desc' },
        take: limite,
        skip: offset,
      }),
      this.prisma.conversaIA.count({
        where: {
          tenantId,
          usuarioId,
        },
      }),
    ]);

    return { conversas, total, pagina: offset / limite };
  }

  /**
   * Adiciona uma mensagem a uma conversa
   */
  async adicionarMensagem(dados: {
    conversaId: string;
    papel: 'USUARIO' | 'ASSISTENTE' | 'SISTEMA';
    conteudo: string;
    metadados?: Record<string, any>;
  }) {
    // Atualizar conversa com timestamp
    await this.prisma.conversaIA.update({
      where: { id: dados.conversaId },
      data: { atualizadoEm: new Date() },
    });

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
   * Obtém as últimas mensagens de uma conversa (para contexto)
   */
  async obterUltimasMensagens(
    conversaId: string,
    limite: number = 10,
  ) {
    return this.prisma.mensagemIA.findMany({
      where: { conversaId },
      orderBy: { criadoEm: 'desc' },
      take: limite,
    });
  }

  /**
   * Atualiza o contexto de uma conversa
   */
  async atualizarContexto(
    conversaId: string,
    novoContexto: Record<string, any>,
  ) {
    return this.prisma.conversaIA.update({
      where: { id: conversaId },
      data: {
        contexto: novoContexto,
        atualizadoEm: new Date(),
      },
    });
  }

  /**
   * Deleta uma conversa (soft delete)
   */
  async deletarConversa(conversaId: string) {
    return this.prisma.conversaIA.delete({
      where: { id: conversaId },
    });
  }
}
