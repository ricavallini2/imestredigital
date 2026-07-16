/**
 * Repositório de Formas de Pagamento (multi-tenancy).
 *
 * Todas as queries filtram por tenantId — isolamento total entre empresas.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CriarFormaPagamentoDto,
  AtualizarFormaPagamentoDto,
  ListarFormasPagamentoDto,
} from '../../dtos/forma-pagamento.dto';

@Injectable()
export class FormaPagamentoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(tenantId: string, filtros: ListarFormasPagamentoDto) {
    const { pagina = 1, limite = 100, tipo, ativa } = filtros;
    const where: any = { tenantId };
    if (tipo) where.tipo = tipo;
    if (ativa !== undefined) where.ativa = ativa;

    const [dados, total] = await Promise.all([
      this.prisma.formaPagamento.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        // Ordena por tipo, depois bandeira e parcelas — agrupa os cartões naturalmente.
        orderBy: [{ tipo: 'asc' }, { bandeira: 'asc' }, { parcelas: 'asc' }],
      }),
      this.prisma.formaPagamento.count({ where }),
    ]);

    return { dados, total, pagina, limite, totalPaginas: Math.ceil(total / limite) };
  }

  async buscarPorId(tenantId: string, id: string) {
    return this.prisma.formaPagamento.findFirst({ where: { id, tenantId } });
  }

  async criar(tenantId: string, dto: CriarFormaPagamentoDto) {
    return this.prisma.formaPagamento.create({
      data: { tenantId, parcelas: 1, ativa: true, ...dto },
    });
  }

  async atualizar(tenantId: string, id: string, dto: AtualizarFormaPagamentoDto) {
    await this.prisma.formaPagamento.updateMany({ where: { id, tenantId }, data: dto });
    return this.buscarPorId(tenantId, id);
  }

  /** Soft delete: inativa (histórico de vendas segue referenciando a descrição). */
  async inativar(tenantId: string, id: string) {
    return this.prisma.formaPagamento.updateMany({
      where: { id, tenantId },
      data: { ativa: false },
    });
  }
}
