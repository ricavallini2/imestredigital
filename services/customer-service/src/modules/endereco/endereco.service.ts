/**
 * Serviço de Endereços de Cliente
 *
 * Gerencia múltiplos endereços por cliente.
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CriarEnderecoDto } from '@/dtos/endereco/criar-endereco.dto';
import { EnderecoCliente } from '../../../generated/client';

@Injectable()
export class EnderecoService {
  private readonly logger = new Logger(EnderecoService.name);

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  /**
   * Cria novo endereço para cliente
   */
  async criar(tenantId: string, clienteId: string, dto: CriarEnderecoDto): Promise<EnderecoCliente> {
    // Se marcar como padrão, desativa outros
    if (dto.padrao) {
      await this.prisma.enderecoCliente.updateMany({
        where: { clienteId, tenantId, padrao: true },
        data: { padrao: false },
      });
    }

    const endereco = await this.prisma.enderecoCliente.create({
      data: {
        tenantId,
        clienteId,
        tipo: dto.tipo,
        logradouro: dto.logradouro,
        numero: dto.numero,
        complemento: dto.complemento,
        bairro: dto.bairro,
        cidade: dto.cidade,
        estado: dto.estado,
        cep: dto.cep,
        pais: dto.pais || 'BR',
        padrao: dto.padrao || false,
      },
    });

    this.logger.log(`Endereço criado para cliente ${clienteId}`);
    await this.cache.remover(`cliente:${tenantId}:${clienteId}`);

    return endereco;
  }

  /**
   * Lista endereços do cliente
   */
  async listarPorCliente(tenantId: string, clienteId: string): Promise<EnderecoCliente[]> {
    return this.prisma.enderecoCliente.findMany({
      where: { clienteId, tenantId },
      orderBy: [{ padrao: 'desc' }, { criadoEm: 'desc' }],
    });
  }

  /**
   * Atualiza endereço
   */
  async atualizar(
    tenantId: string,
    clienteId: string,
    enderecoId: string,
    dto: Partial<CriarEnderecoDto>,
  ): Promise<EnderecoCliente> {
    const endereco = await this.prisma.enderecoCliente.findFirst({
      where: { id: enderecoId, clienteId, tenantId },
    });

    if (!endereco) {
      throw new NotFoundException('Endereço não encontrado');
    }

    // Se marcar como padrão, desativa outros
    if (dto.padrao === true) {
      await this.prisma.enderecoCliente.updateMany({
        where: { clienteId, tenantId, padrao: true, id: { not: enderecoId } },
        data: { padrao: false },
      });
    }

    const enderecoAtualizado = await this.prisma.enderecoCliente.update({
      where: { id: enderecoId },
      data: dto,
    });

    await this.cache.remover(`cliente:${tenantId}:${clienteId}`);

    return enderecoAtualizado;
  }

  /**
   * Remove endereço
   */
  async remover(tenantId: string, clienteId: string, enderecoId: string): Promise<void> {
    const endereco = await this.prisma.enderecoCliente.findFirst({
      where: { id: enderecoId, clienteId, tenantId },
    });

    if (!endereco) {
      throw new NotFoundException('Endereço não encontrado');
    }

    await this.prisma.enderecoCliente.delete({
      where: { id: enderecoId },
    });

    await this.cache.remover(`cliente:${tenantId}:${clienteId}`);
    this.logger.log(`Endereço ${enderecoId} removido`);
  }

  /**
   * Define endereço como padrão
   */
  async definirComoPadrao(tenantId: string, clienteId: string, enderecoId: string): Promise<EnderecoCliente> {
    return this.atualizar(tenantId, clienteId, enderecoId, { padrao: true });
  }
}
