/**
 * Repository para operações com Recorrências.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Decimal from 'decimal.js';
import {
  Prisma,
  TipoLancamento,
  FrequenciaRecorrencia,
} from '../../../generated/client';

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
        tipo: dados.tipo as TipoLancamento,
        categoria: dados.categoria,
        valor: dados.valor,
        contaId: dados.contaId,
        frequencia: dados.frequencia as FrequenciaRecorrencia,
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

  /**
   * Atualiza recorrência.
   *
   * Usa updateMany com { id, tenantId } para impedir escrita
   * cross-tenant e retorna o registro já filtrado por tenant.
   */
  async atualizar(id: string, tenantId: string, dados: Partial<CriarRecorrenciaInput>) {
    const { tipo, frequencia, ...resto } = dados

    const data: Prisma.RecorrenciaUncheckedUpdateManyInput = {
      ...resto,
      atualizadoEm: new Date(),
    }

    if (tipo !== undefined) data.tipo = tipo as TipoLancamento
    if (frequencia !== undefined) {
      data.frequencia = frequencia as FrequenciaRecorrencia
    }

    await this.prisma.recorrencia.updateMany({
      where: { id, tenantId },
      data,
    });

    return this.buscarPorId(id, tenantId);
  }

  async desativar(id: string, tenantId: string) {
    return this.atualizar(id, tenantId, { ativa: false });
  }
}
