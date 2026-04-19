/**
 * Repository para operações com Lançamentos no banco de dados.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Decimal from 'decimal.js';

interface CriarLancamentoInput {
  tenantId: string;
  contaId?: string;
  tipo: string;
  categoria?: string;
  subcategoria?: string;
  descricao: string;
  valor: Decimal;
  dataVencimento: Date;
  dataPagamento?: Date;
  dataCompetencia?: Date;
  status: string;
  formaPagamento?: string;
  numeroParcela?: number;
  totalParcelas?: number;
  parcelaOrigemId?: string;
  pedidoId?: string;
  notaFiscalId?: string;
  fornecedor?: string;
  cliente?: string;
  observacao?: string;
  tags?: string[];
  recorrente?: boolean;
  recorrenciaId?: string;
  anexoUrl?: string;
  contaOrigemId?: string;
  contaDestinoId?: string;
}

@Injectable()
export class LancamentoRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria um novo lançamento.
   */
  async criar(dados: CriarLancamentoInput) {
    return this.prisma.lancamento.create({
      data: {
        ...(dados as any),
      },
      include: {
        conta: true,
        recorrencia: true,
      },
    });
  }

  /**
   * Encontra lançamento por ID.
   */
  async buscarPorId(id: string, tenantId: string) {
    return this.prisma.lancamento.findFirst({
      where: { id, tenantId },
      include: {
        conta: true,
        recorrencia: true,
      },
    });
  }

  /**
   * Lista lançamentos com filtros.
   */
  async listar(tenantId: string, filtros: any, skip: number, take: number) {
    const where: any = { tenantId };

    if (filtros.tipo) where.tipo = filtros.tipo;
    if (filtros.status) where.status = filtros.status;
    if (filtros.contaId) where.contaId = filtros.contaId;
    if (filtros.categoria) where.categoria = filtros.categoria;

    if (filtros.dataInicio || filtros.dataFim) {
      where.dataVencimento = {};
      if (filtros.dataInicio) {
        where.dataVencimento.gte = new Date(filtros.dataInicio);
      }
      if (filtros.dataFim) {
        where.dataVencimento.lte = new Date(filtros.dataFim);
      }
    }

    const [lancamentos, total] = await Promise.all([
      this.prisma.lancamento.findMany({
        where,
        include: {
          conta: true,
          recorrencia: true,
        },
        orderBy: { dataVencimento: 'desc' },
        skip,
        take,
      }),
      this.prisma.lancamento.count({ where }),
    ]);

    return { lancamentos, total };
  }

  /**
   * Encontra lançamentos atrasados.
   */
  async buscarAtrasados(tenantId: string) {
    const hoje = new Date();
    return this.prisma.lancamento.findMany({
      where: {
        tenantId,
        status: 'PENDENTE',
        dataVencimento: { lt: hoje },
      },
      include: {
        conta: true,
      },
      orderBy: { dataVencimento: 'asc' },
    });
  }

  /**
   * Atualiza lançamento.
   */
  async atualizar(id: string, tenantId: string, dados: Partial<CriarLancamentoInput>) {
    return this.prisma.lancamento.update({
      where: { id },
      data: {
        ...dados,
        atualizadoEm: new Date(),
      },
      include: {
        conta: true,
        recorrencia: true,
      },
    });
  }

  /**
   * Cancela lançamento.
   */
  async cancelar(id: string, tenantId: string) {
    return this.atualizar(id, tenantId, { status: 'CANCELADO' });
  }

  /**
   * Marca como pago.
   */
  async marcarComoPago(
    id: string,
    tenantId: string,
    dataPagamento: Date,
    contaId?: string,
  ) {
    const dados: any = {
      status: 'PAGO',
      dataPagamento,
    };

    if (contaId) dados.contaId = contaId;

    return this.atualizar(id, tenantId, dados);
  }

  /**
   * Busca lançamentos de uma recorrência.
   */
  async buscarPorRecorrencia(recorrenciaId: string) {
    return this.prisma.lancamento.findMany({
      where: { recorrenciaId },
      include: {
        conta: true,
      },
    });
  }

  /**
   * Busca lançamento por ID do pedido.
   */
  async buscarPorPedidoId(tenantId: string, pedidoId: string) {
    return this.prisma.lancamento.findFirst({
      where: { tenantId, pedidoId },
      include: {
        conta: true,
      },
    });
  }

  /**
   * Busca lançamentos por nota fiscal.
   */
  async buscarPorNotaFiscal(tenantId: string, notaFiscalId: string) {
    return this.prisma.lancamento.findMany({
      where: { tenantId, notaFiscalId },
      include: {
        conta: true,
      },
    });
  }

  /**
   * Atualiza nota fiscal em um lançamento.
   */
  async vincularNotaFiscal(id: string, tenantId: string, notaFiscalId: string) {
    return this.atualizar(id, tenantId, { notaFiscalId });
  }

  /**
   * Busca parcelas de um lançamento parcelado.
   */
  async buscarParcelas(parcelaOrigemId: string) {
    return this.prisma.lancamento.findMany({
      where: { parcelaOrigemId },
      orderBy: { numeroParcela: 'asc' },
      include: {
        conta: true,
      },
    });
  }

  /**
   * Soma de valores por status/tipo.
   */
  async somaValores(tenantId: string, filtro: { tipo?: string; status?: string }) {
    const where: any = { tenantId };
    if (filtro.tipo) where.tipo = filtro.tipo;
    if (filtro.status) where.status = filtro.status;

    const result = await this.prisma.lancamento.aggregate({
      where,
      _sum: { valor: true },
    });

    return result._sum.valor || new Decimal(0);
  }

  /**
   * Deleta lançamento (soft delete via status).
   */
  async deletar(id: string, tenantId: string) {
    return this.cancelar(id, tenantId);
  }
}
