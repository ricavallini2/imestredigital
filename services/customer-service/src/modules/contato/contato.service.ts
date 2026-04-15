/**
 * Serviço de Contatos de Cliente
 *
 * Gerencia múltiplos contatos por cliente.
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CriarContatoDto } from '@/dtos/contato/criar-contato.dto';
import { ContatoCliente } from '../../../generated/client';

@Injectable()
export class ContatoService {
  private readonly logger = new Logger(ContatoService.name);

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  /**
   * Cria novo contato para cliente
   */
  async criar(tenantId: string, clienteId: string, dto: CriarContatoDto): Promise<ContatoCliente> {
    // Se marcar como principal, desativa outros
    if (dto.principal) {
      await this.prisma.contatoCliente.updateMany({
        where: { clienteId, tenantId, principal: true },
        data: { principal: false },
      });
    }

    const contato = await this.prisma.contatoCliente.create({
      data: {
        tenantId,
        clienteId,
        nome: dto.nome,
        cargo: dto.cargo,
        email: dto.email,
        telefone: dto.telefone,
        celular: dto.celular,
        principal: dto.principal || false,
        observacoes: dto.observacoes,
      },
    });

    this.logger.log(`Contato criado para cliente ${clienteId}`);
    await this.cache.remover(`cliente:${tenantId}:${clienteId}`);

    return contato;
  }

  /**
   * Lista contatos do cliente
   */
  async listarPorCliente(tenantId: string, clienteId: string): Promise<ContatoCliente[]> {
    return this.prisma.contatoCliente.findMany({
      where: { clienteId, tenantId },
      orderBy: [{ principal: 'desc' }, { criadoEm: 'desc' }],
    });
  }

  /**
   * Atualiza contato
   */
  async atualizar(
    tenantId: string,
    clienteId: string,
    contatoId: string,
    dto: Partial<CriarContatoDto>,
  ): Promise<ContatoCliente> {
    const contato = await this.prisma.contatoCliente.findFirst({
      where: { id: contatoId, clienteId, tenantId },
    });

    if (!contato) {
      throw new NotFoundException('Contato não encontrado');
    }

    // Se marcar como principal, desativa outros
    if (dto.principal === true) {
      await this.prisma.contatoCliente.updateMany({
        where: { clienteId, tenantId, principal: true, id: { not: contatoId } },
        data: { principal: false },
      });
    }

    const contatoAtualizado = await this.prisma.contatoCliente.update({
      where: { id: contatoId },
      data: dto,
    });

    await this.cache.remover(`cliente:${tenantId}:${clienteId}`);

    return contatoAtualizado;
  }

  /**
   * Remove contato
   */
  async remover(tenantId: string, clienteId: string, contatoId: string): Promise<void> {
    const contato = await this.prisma.contatoCliente.findFirst({
      where: { id: contatoId, clienteId, tenantId },
    });

    if (!contato) {
      throw new NotFoundException('Contato não encontrado');
    }

    await this.prisma.contatoCliente.delete({
      where: { id: contatoId },
    });

    await this.cache.remover(`cliente:${tenantId}:${clienteId}`);
    this.logger.log(`Contato ${contatoId} removido`);
  }

  /**
   * Define contato como principal
   */
  async definirComoPrincipal(tenantId: string, clienteId: string, contatoId: string): Promise<ContatoCliente> {
    return this.atualizar(tenantId, clienteId, contatoId, { principal: true });
  }
}
