/**
 * Serviço de Tenants.
 * Lógica de negócio para gerenciamento de empresas.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarTenantDto } from '../../dtos/tenant/atualizar-tenant.dto';

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  /** Busca um tenant pelo ID */
  async buscarPorId(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: { select: { usuarios: true } },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return tenant;
  }

  /** Atualiza dados de um tenant */
  async atualizar(id: string, dto: AtualizarTenantDto) {
    await this.buscarPorId(id); // Verifica existência

    return this.prisma.tenant.update({
      where: { id },
      data: dto,
    });
  }
}
