/**
 * Serviço de Depósitos.
 * Gerencia armazéns, centros de distribuição e locais de estoque.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarDepositoDto } from '../../dtos/deposito/criar-deposito.dto';
import { AtualizarDepositoDto } from '../../dtos/deposito/atualizar-deposito.dto';

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

  /**
   * Atualiza um depósito do tenant (atualização parcial).
   * Se marcar `padrao: true`, desmarca os demais atomicamente.
   */
  async atualizar(tenantId: string, id: string, dto: AtualizarDepositoDto) {
    await this.obterOuFalhar(tenantId, id);

    // Garante um único depósito padrão por tenant.
    if (dto.padrao === true) {
      await this.prisma.deposito.updateMany({
        where: { tenantId, padrao: true, NOT: { id } },
        data: { padrao: false },
      });
    }

    // updateMany com tenantId no filtro evita atualizar depósito de outro tenant.
    await this.prisma.deposito.updateMany({
      where: { id, tenantId },
      data: { ...dto },
    });

    return this.obterOuFalhar(tenantId, id);
  }

  /**
   * Remove (soft delete) um depósito do tenant marcando `ativo: false`.
   *
   * Bloqueia a remoção se o depósito ainda tiver saldo físico ou reservas
   * ativas (evita "perder" estoque). Depósito já inativo é no-op idempotente.
   */
  async remover(tenantId: string, id: string) {
    await this.obterOuFalhar(tenantId, id);

    const saldoComEstoque = await this.prisma.saldoEstoque.findFirst({
      where: {
        tenantId,
        depositoId: id,
        OR: [{ quantidadeFisica: { gt: 0 } }, { reservado: { gt: 0 } }],
      },
      select: { id: true },
    });

    if (saldoComEstoque) {
      throw new BadRequestException(
        'Não é possível remover um depósito com saldo em estoque ou reservas ativas. ' +
          'Zere/transfira o estoque antes de removê-lo.',
      );
    }

    await this.prisma.deposito.updateMany({
      where: { id, tenantId },
      data: { ativo: false, padrao: false },
    });

    return { id, removido: true };
  }

  /** Busca um depósito do tenant ou lança 404. */
  private async obterOuFalhar(tenantId: string, id: string) {
    const deposito = await this.prisma.deposito.findFirst({
      where: { id, tenantId },
    });
    if (!deposito) {
      throw new NotFoundException(`Depósito ${id} não encontrado`);
    }
    return deposito;
  }
}
