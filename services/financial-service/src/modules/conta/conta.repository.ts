/**
 * Repository para operações com Contas Financeiras.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Decimal from 'decimal.js';
import { Prisma, TipoConta } from '../../../generated/client';

interface CriarContaInput {
  tenantId: string;
  nome: string;
  tipo: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  saldoInicial: Decimal;
  saldoAtual?: Decimal;
  ativa?: boolean;
  cor?: string;
  icone?: string;
}

@Injectable()
export class ContaRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova conta financeira.
   */
  async criar(dados: CriarContaInput) {
    return this.prisma.contaFinanceira.create({
      data: {
        tenantId: dados.tenantId,
        nome: dados.nome,
        tipo: dados.tipo as TipoConta,
        banco: dados.banco,
        agencia: dados.agencia,
        conta: dados.conta,
        saldoInicial: dados.saldoInicial,
        saldoAtual: dados.saldoAtual || dados.saldoInicial,
        ativa: dados.ativa !== false,
        cor: dados.cor,
        icone: dados.icone,
      },
    });
  }

  /**
   * Busca conta por ID.
   */
  async buscarPorId(id: string, tenantId: string) {
    return this.prisma.contaFinanceira.findFirst({
      where: { id, tenantId },
    });
  }

  /**
   * Lista contas do tenant.
   */
  async listar(tenantId: string, apenasAtivas: boolean = true) {
    const where: any = { tenantId };
    if (apenasAtivas) where.ativa = true;

    return this.prisma.contaFinanceira.findMany({
      where,
      orderBy: { criadoEm: 'desc' },
    });
  }

  /**
   * Atualiza conta.
   *
   * Usa updateMany com { id, tenantId } para impedir escrita
   * cross-tenant e retorna o registro já filtrado por tenant.
   */
  async atualizar(id: string, tenantId: string, dados: Partial<CriarContaInput>) {
    const data: Prisma.ContaFinanceiraUpdateManyMutationInput = {
      atualizadoEm: new Date(),
    }

    if (dados.nome !== undefined) data.nome = dados.nome
    if (dados.tipo !== undefined) data.tipo = dados.tipo as TipoConta
    if (dados.banco !== undefined) data.banco = dados.banco
    if (dados.agencia !== undefined) data.agencia = dados.agencia
    if (dados.conta !== undefined) data.conta = dados.conta
    if (dados.saldoInicial !== undefined) data.saldoInicial = dados.saldoInicial
    if (dados.saldoAtual !== undefined) data.saldoAtual = dados.saldoAtual
    if (dados.ativa !== undefined) data.ativa = dados.ativa
    if (dados.cor !== undefined) data.cor = dados.cor
    if (dados.icone !== undefined) data.icone = dados.icone

    await this.prisma.contaFinanceira.updateMany({
      where: { id, tenantId },
      data,
    });

    return this.buscarPorId(id, tenantId);
  }

  /**
   * Desativa conta.
   */
  async desativar(id: string, tenantId: string) {
    return this.atualizar(id, tenantId, { ativa: false });
  }

  /**
   * Atualiza saldo da conta.
   */
  async atualizarSaldo(id: string, tenantId: string, novoSaldo: Decimal) {
    return this.atualizar(id, tenantId, { saldoAtual: novoSaldo });
  }

  /**
   * Obtém saldo atual da conta.
   */
  async obterSaldo(id: string, tenantId: string) {
    const conta = await this.buscarPorId(id, tenantId);
    return conta?.saldoAtual || new Decimal(0);
  }

  /**
   * Busca conta por número.
   */
  async buscarPorNumeroConta(tenantId: string, numero: string) {
    return this.prisma.contaFinanceira.findFirst({
      where: {
        tenantId,
        conta: numero,
      },
    });
  }

  /**
   * Soma saldos de todas as contas ativas.
   */
  async somarSaldosAtivos(tenantId: string) {
    const result = await this.prisma.contaFinanceira.aggregate({
      where: {
        tenantId,
        ativa: true,
      },
      _sum: { saldoAtual: true },
    });

    return result._sum.saldoAtual || new Decimal(0);
  }

  /**
   * Transfere valor entre contas.
   *
   * Toda a operação (leitura de saldos + duas escritas) roda dentro de
   * uma única transação para garantir atomicidade: ou ambos os saldos
   * são atualizados, ou nenhum. As escritas são escopadas por tenantId.
   */
  async transferir(
    idOrigem: string,
    idDestino: string,
    tenantId: string,
    valor: Decimal,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const contaOrigem = await tx.contaFinanceira.findFirst({
        where: { id: idOrigem, tenantId },
      });
      const contaDestino = await tx.contaFinanceira.findFirst({
        where: { id: idDestino, tenantId },
      });

      if (!contaOrigem || !contaDestino) {
        throw new Error('Uma ou ambas as contas não foram encontradas');
      }

      const novoSaldoOrigem = new Decimal(contaOrigem.saldoAtual).minus(valor);
      const novoSaldoDestino = new Decimal(contaDestino.saldoAtual).plus(valor);

      await tx.contaFinanceira.updateMany({
        where: { id: idOrigem, tenantId },
        data: { saldoAtual: novoSaldoOrigem, atualizadoEm: new Date() },
      });
      await tx.contaFinanceira.updateMany({
        where: { id: idDestino, tenantId },
        data: { saldoAtual: novoSaldoDestino, atualizadoEm: new Date() },
      });

      return {
        contaOrigem: { id: idOrigem, novoSaldo: novoSaldoOrigem },
        contaDestino: { id: idDestino, novoSaldo: novoSaldoDestino },
      };
    });
  }

  /**
   * Deleta conta (soft delete).
   */
  async deletar(id: string, tenantId: string) {
    return this.desativar(id, tenantId);
  }
}
