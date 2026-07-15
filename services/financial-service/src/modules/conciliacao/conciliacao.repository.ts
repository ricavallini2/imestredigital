/**
 * Repository para operações com Conciliação Bancária.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Decimal from 'decimal.js';
import { StatusConciliacao } from '../../../generated/client';

interface CriarConciliacaoInput {
  tenantId: string;
  contaId: string;
  dataInicio: Date;
  dataFim: Date;
  saldoInicial: Decimal;
  saldoFinal: Decimal;
  status?: string;
  divergencias?: any;
}

@Injectable()
export class ConciliacaoRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria nova conciliação.
   */
  async criar(dados: CriarConciliacaoInput) {
    return this.prisma.conciliacaoBancaria.create({
      data: {
        tenantId: dados.tenantId,
        contaId: dados.contaId,
        dataInicio: dados.dataInicio,
        dataFim: dados.dataFim,
        saldoInicial: dados.saldoInicial,
        saldoFinal: dados.saldoFinal,
        status: (dados.status || 'EM_ANDAMENTO') as StatusConciliacao,
        divergencias: dados.divergencias || [],
      },
      include: {
        conta: true,
      },
    });
  }

  /**
   * Busca conciliação por ID.
   */
  async buscarPorId(id: string, tenantId: string) {
    return this.prisma.conciliacaoBancaria.findFirst({
      where: { id, tenantId },
      include: { conta: true },
    });
  }

  /**
   * Lista conciliações de uma conta.
   */
  async listarPorConta(contaId: string, tenantId: string) {
    return this.prisma.conciliacaoBancaria.findMany({
      where: { contaId, tenantId },
      include: { conta: true },
      orderBy: { dataFim: 'desc' },
    });
  }

  /**
   * Atualiza status da conciliação.
   *
   * Usa updateMany com { id, tenantId } para impedir escrita
   * cross-tenant e retorna o registro já filtrado por tenant.
   */
  async atualizarStatus(id: string, tenantId: string, status: string, divergencias?: any) {
    await this.prisma.conciliacaoBancaria.updateMany({
      where: { id, tenantId },
      data: {
        status: status as StatusConciliacao,
        divergencias: divergencias || [],
        atualizadoEm: new Date(),
      },
    });

    return this.buscarPorId(id, tenantId);
  }

  /**
   * Busca conciliação mais recente de uma conta.
   */
  async buscarMaisRecente(contaId: string, tenantId: string) {
    return this.prisma.conciliacaoBancaria.findFirst({
      where: { contaId, tenantId },
      include: { conta: true },
      orderBy: { dataFim: 'desc' },
    });
  }
}
