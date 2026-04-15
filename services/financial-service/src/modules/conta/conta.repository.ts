/**
 * Repository para operações com Contas Financeiras.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Decimal from 'decimal.js';

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
        tipo: dados.tipo,
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
   */
  async atualizar(id: string, tenantId: string, dados: Partial<CriarContaInput>) {
    return this.prisma.contaFinanceira.update({
      where: { id },
      data: {
        ...dados,
        atualizadoEm: new Date(),
      },
    });
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
   */
  async transferir(
    idOrigem: string,
    idDestino: string,
    tenantId: string,
    valor: Decimal,
  ) {
    const contaOrigem = await this.buscarPorId(idOrigem, tenantId);
    const contaDestino = await this.buscarPorId(idDestino, tenantId);

    if (!contaOrigem || !contaDestino) {
      throw new Error('Uma ou ambas as contas não foram encontradas');
    }

    const novoSaldoOrigem = new Decimal(contaOrigem.saldoAtual).minus(valor);
    const novoSaldoDestino = new Decimal(contaDestino.saldoAtual).plus(valor);

    await this.atualizarSaldo(idOrigem, tenantId, novoSaldoOrigem);
    await this.atualizarSaldo(idDestino, tenantId, novoSaldoDestino);

    return {
      contaOrigem: { id: idOrigem, novoSaldo: novoSaldoOrigem },
      contaDestino: { id: idDestino, novoSaldo: novoSaldoDestino },
    };
  }

  /**
   * Deleta conta (soft delete).
   */
  async deletar(id: string, tenantId: string) {
    return this.desativar(id, tenantId);
  }
}
