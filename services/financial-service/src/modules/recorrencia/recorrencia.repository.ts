/**
 * Repository para operações com Recorrências.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Decimal from 'decimal.js';

interface CriarRecorrenciaInput {
  tenantId: string;
  descricao: string;
  tipo: string;
  categoria?: string;
  valor: Decimal;
  contaId?: string;
  frequencia: string;
  diaVencimento?: number;
  proximaGeracao: Date;
  ativa?: boolean;
}

@Injectable()
export class RecorrenciaRepository {
  constructor(private prisma: PrismaService) {}

  async criar(dados: CriarRecorrenciaInput) {
    return this.prisma.recorrencia.create({
      data: {
        tenantId: dados.tenantId,
        descricao: dados.descricao,
        tipo: dados.tipo,
        categoria: dados.categoria,
        valor: dados.valor,
        contaId: dados.contaId,
        frequencia: dados.frequencia,
        diaVencimento: dados.diaVencimento,
        proximaGeracao: dados.proximaGeracao,
        ativa: dados.ativa !== false,
      },
      include: {
        conta: true,
      },
    });
  }

  async buscarPorId(id: string, tenantId: string) {
    return this.prisma.recorrencia.findFirst({
      where: { id, tenantId },
      include: { conta: true },
    });
  }

  async listar(tenantId: string, apenasAtivas: boolean = true) {
    const where: any = { tenantId };
    if (apenasAtivas) where.ativa = true;

    return this.prisma.recorrencia.findMany({
      where,
      include: { conta: true },
      orderBy: { proximaGeracao: 'asc' },
    });
  }

  async buscarParaGerar(tenantId?: string) {
    const agora = new Date();
    const where: any = {
      ativa: true,
      proximaGeracao: { lte: agora },
    };

    if (tenantId) where.tenantId = tenantId;

    return this.prisma.recorrencia.findMany({
      where,
      include: { conta: true },
    });
  }

  async atualizar(id: string, tenantId: string, dados: Partial<CriarRecorrenciaInput>) {
    return this.prisma.recorrencia.update({
      where: { id },
      data: {
        ...dados,
        atualizadoEm: new Date(),
      },
      include: { conta: true },
    });
  }

  async desativar(id: string, tenantId: string) {
    return this.atualizar(id, tenantId, { ativa: false });
  }
}
