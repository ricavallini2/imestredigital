/**
 * Serviço de Depósitos.
 * Gerencia armazéns, centros de distribuição e locais de estoque.
 */

import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarDepositoDto } from '../../dtos/deposito/criar-deposito.dto';

@Injectable()
export class DepositoService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lista todos os depósitos ativos do tenant */
  async listar(tenantId: string) {
    return this.prisma.deposito.findMany({
      where: { tenantId, ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  /** Cria novo depósito */
  async criar(tenantId: string, dto: CriarDepositoDto) {
    // Se for padrão, remove flag dos demais
    if (dto.padrao) {
      await this.prisma.deposito.updateMany({
        where: { tenantId, padrao: true },
        data: { padrao: false },
      });
    }

    return this.prisma.deposito.create({
      data: { tenantId, ...dto },
    });
  }
}
