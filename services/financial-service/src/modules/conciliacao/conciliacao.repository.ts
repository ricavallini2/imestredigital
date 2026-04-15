/**
 * Repository para operações com Conciliação Bancária.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Decimal from 'decimal.js';

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
        status: dados.status || 'EM_ANDAMENTO',
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
   */
  async atualizarStatus(id: string, tenantId: string, status: string, divergencias?: any) {
    return this.prisma.conciliacaoBancaria.update({
      where: { id },
      data: {
        status,
        divergencias: divergencias || [],
        atualizadoEm: new Date(),
      },
      include: { conta: true },
    });
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
