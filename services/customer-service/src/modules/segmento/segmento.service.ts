/**
 * Serviço de Segmentação de Clientes
 *
 * Gerencia segmentos dinâmicos com regras personalizadas.
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CriarSegmentoDto } from '@/dtos/segmento/criar-segmento.dto';
import { SegmentoCliente } from '../../../generated/client';

@Injectable()
export class SegmentoService {
  private readonly logger = new Logger(SegmentoService.name);

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  /**
   * Cria novo segmento
   */
  async criar(tenantId: string, dto: CriarSegmentoDto): Promise<SegmentoCliente> {
    const segmento = await this.prisma.segmentoCliente.create({
      data: {
        tenantId,
        nome: dto.nome,
        descricao: dto.descricao,
        regras: dto.regras,
        totalClientes: 0,
        ativo: true,
      },
    });

    this.logger.log(`Segmento ${segmento.id} criado para tenant ${tenantId}`);

    return segmento;
  }

  /**
   * Lista segmentos do tenant
   */
  async listar(tenantId: string, apenasAtivos: boolean = true) {
    return this.prisma.segmentoCliente.findMany({
      where: {
        tenantId,
        ...(apenasAtivos && { ativo: true }),
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  /**
   * Busca segmento por ID
   */
  async buscarPorId(tenantId: string, segmentoId: string): Promise<SegmentoCliente | null> {
    return this.prisma.segmentoCliente.findFirst({
      where: { id: segmentoId, tenantId },
    });
  }

  /**
   * Atualiza segmento
   */
  async atualizar(
    tenantId: string,
    segmentoId: string,
    dto: Partial<CriarSegmentoDto>,
  ): Promise<SegmentoCliente> {
    const segmento = await this.buscarPorId(tenantId, segmentoId);
    if (!segmento) {
      throw new NotFoundException('Segmento não encontrado');
    }

    return this.prisma.segmentoCliente.update({
      where: { id: segmentoId },
      data: {
        nome: dto.nome,
        descricao: dto.descricao,
        regras: dto.regras,
      },
    });
  }

  /**
   * Remove segmento
   */
  async remover(tenantId: string, segmentoId: string): Promise<void> {
    const segmento = await this.buscarPorId(tenantId, segmentoId);
    if (!segmento) {
      throw new NotFoundException('Segmento não encontrado');
    }

    await this.prisma.segmentoCliente.delete({
      where: { id: segmentoId },
    });

    this.logger.log(`Segmento ${segmentoId} removido`);
  }

  /**
   * Adiciona clientes ao segmento
   */
  async adicionarClientes(tenantId: string, segmentoId: string, clienteIds: string[]): Promise<void> {
    const segmento = await this.buscarPorId(tenantId, segmentoId);
    if (!segmento) {
      throw new NotFoundException('Segmento não encontrado');
    }

    // Cria associações
    await Promise.all(
      clienteIds.map(clienteId =>
        this.prisma.clienteSegmento.create({
          data: { clienteId, segmentoId },
        }),
      ),
    );

    // Atualiza contador
    const total = await this.prisma.clienteSegmento.count({
      where: { segmentoId },
    });

    await this.prisma.segmentoCliente.update({
      where: { id: segmentoId },
      data: { totalClientes: total },
    });

    this.logger.log(`${clienteIds.length} clientes adicionados ao segmento ${segmentoId}`);
  }

  /**
   * Remove clientes do segmento
   */
  async removerClientes(tenantId: string, segmentoId: string, clienteIds: string[]): Promise<void> {
    const segmento = await this.buscarPorId(tenantId, segmentoId);
    if (!segmento) {
      throw new NotFoundException('Segmento não encontrado');
    }

    // Remove associações
    await this.prisma.clienteSegmento.deleteMany({
      where: {
        segmentoId,
        clienteId: { in: clienteIds },
      },
    });

    // Atualiza contador
    const total = await this.prisma.clienteSegmento.count({
      where: { segmentoId },
    });

    await this.prisma.segmentoCliente.update({
      where: { id: segmentoId },
      data: { totalClientes: total },
    });

    this.logger.log(`${clienteIds.length} clientes removidos do segmento ${segmentoId}`);
  }

  /**
   * Recalcula segmento (re-evalua regras contra todos os clientes)
   * Nota: Implementação simplificada - em produção seria mais complexa
   */
  async recalcularSegmento(tenantId: string, segmentoId: string): Promise<void> {
    const segmento = await this.buscarPorId(tenantId, segmentoId);
    if (!segmento) {
      throw new NotFoundException('Segmento não encontrado');
    }

    // Remove clientes antigos
    await this.prisma.clienteSegmento.deleteMany({
      where: { segmentoId },
    });

    // Busca todos os clientes do tenant
    const clientes = await this.prisma.cliente.findMany({
      where: { tenantId },
    });

    // Aplica regras (simplificado)
    const clientesQuePassamNasRegras = this.filtrarClientesPorRegras(clientes, segmento.regras as Record<string, any>);

    // Re-adiciona clientes
    if (clientesQuePassamNasRegras.length > 0) {
      await this.adicionarClientes(tenantId, segmentoId, clientesQuePassamNasRegras.map(c => c.id));
    }

    this.logger.log(`Segmento ${segmentoId} recalculado com ${clientesQuePassamNasRegras.length} clientes`);
  }

  /**
   * Filtra clientes de acordo com as regras (implementação básica)
   */
  private filtrarClientesPorRegras(clientes: any[], regras: Record<string, any>): any[] {
    return clientes.filter(cliente => {
      // Exemplo: filtro por status
      if (regras.status && !regras.status.includes(cliente.status)) {
        return false;
      }

      // Exemplo: filtro por score mínimo
      if (regras.scoreMinimo && cliente.score < regras.scoreMinimo) {
        return false;
      }

      // Exemplo: filtro por valor mínimo
      if (regras.valorMinimo && cliente.valorTotalCompras < regras.valorMinimo) {
        return false;
      }

      return true;
    });
  }
}
