/**
 * Serviço de Interações com Cliente
 *
 * Registra histórico de todas as interações: vendas, atendimentos,
 * reclamações, emails, etc.
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrarInteracaoDto } from '@/dtos/interacao/registrar-interacao.dto';
import { InteracaoCliente, TipoInteracao, CanalInteracao } from '../../../generated/client';

@Injectable()
export class InteracaoService {
  private readonly logger = new Logger(InteracaoService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Registra uma nova interação
   */
  async registrar(
    tenantId: string,
    clienteId: string,
    usuarioId: string,
    dto: RegistrarInteracaoDto,
  ): Promise<InteracaoCliente> {
    // Verifica se cliente existe
    const cliente = await this.prisma.cliente.findFirst({
      where: { id: clienteId, tenantId },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const interacao = await this.prisma.interacaoCliente.create({
      data: {
        tenantId,
        clienteId,
        tipo: dto.tipo as TipoInteracao,
        canal: dto.canal as CanalInteracao,
        titulo: dto.titulo,
        descricao: dto.descricao,
        data: new Date(),
        usuarioId,
        pedidoId: dto.pedidoId,
        metadata: dto.metadata,
      },
    });

    this.logger.log(`Interação ${interacao.id} registrada para cliente ${clienteId}`);

    return interacao;
  }

  /**
   * Lista interações do cliente com filtros
   */
  async listarPorCliente(
    tenantId: string,
    clienteId: string,
    filtros?: {
      tipo?: TipoInteracao[];
      canal?: CanalInteracao[];
      dataInicio?: Date;
      dataFim?: Date;
      pagina?: number;
      limite?: number;
    },
  ) {
    const { tipo, canal, dataInicio, dataFim, pagina = 1, limite = 20 } = filtros || {};

    const skip = (pagina - 1) * limite;

    const where: any = { tenantId, clienteId };

    if (tipo && tipo.length > 0) {
      where.tipo = { in: tipo };
    }

    if (canal && canal.length > 0) {
      where.canal = { in: canal };
    }

    if (dataInicio || dataFim) {
      where.data = {};
      if (dataInicio) where.data.gte = dataInicio;
      if (dataFim) where.data.lte = dataFim;
    }

    const [interacoes, total] = await Promise.all([
      this.prisma.interacaoCliente.findMany({
        where,
        skip,
        take: limite,
        orderBy: { data: 'desc' },
      }),
      this.prisma.interacaoCliente.count({ where }),
    ]);

    return {
      interacoes,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  /**
   * Busca interação por ID
   */
  async buscarPorId(tenantId: string, clienteId: string, interacaoId: string): Promise<InteracaoCliente | null> {
    return this.prisma.interacaoCliente.findFirst({
      where: { id: interacaoId, clienteId, tenantId },
    });
  }

  /**
   * Obtém timeline (histórico cronológico) do cliente
   */
  async obterTimeline(tenantId: string, clienteId: string, limite: number = 50): Promise<InteracaoCliente[]> {
    return this.prisma.interacaoCliente.findMany({
      where: { clienteId, tenantId },
      orderBy: { data: 'desc' },
      take: limite,
    });
  }
}
