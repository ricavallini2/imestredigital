/**
 * Serviço de Conciliação Bancária.
 * Reconciliação de saldo com extrato bancário.
 */

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import Decimal from 'decimal.js';
import { ConciliacaoRepository } from './conciliacao.repository';
import { ContaRepository } from '../conta/conta.repository';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

interface IniciarConciliacaoInput {
  tenantId: string;
  contaId: string;
  dataInicio: Date;
  dataFim: Date;
  saldoInicial: number;
  saldoFinal: number;
}

@Injectable()
export class ConciliacaoService {
  private readonly logger = new Logger('ConciliacaoService');

  constructor(
    private conciliacaoRepository: ConciliacaoRepository,
    private contaRepository: ContaRepository,
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  /**
   * Inicia nova conciliação bancária.
   */
  async iniciarConciliacao(input: IniciarConciliacaoInput) {
    // Validar conta
    const conta = await this.contaRepository.buscarPorId(input.contaId, input.tenantId);
    if (!conta) {
      throw new NotFoundException('Conta não encontrada');
    }

    if (input.dataInicio >= input.dataFim) {
      throw new BadRequestException('Data inicial deve ser anterior à data final');
    }

    const conciliacao = await this.conciliacaoRepository.criar({
      tenantId: input.tenantId,
      contaId: input.contaId,
      dataInicio: input.dataInicio,
      dataFim: input.dataFim,
      saldoInicial: new Decimal(input.saldoInicial),
      saldoFinal: new Decimal(input.saldoFinal),
    });

    this.logger.log(`Conciliação iniciada: ${conciliacao.id}`);

    return conciliacao;
  }

  /**
   * Busca conciliação por ID.
   */
  async buscarPorId(id: string, tenantId: string) {
    const conciliacao = await this.conciliacaoRepository.buscarPorId(id, tenantId);
    if (!conciliacao) {
      throw new NotFoundException('Conciliação não encontrada');
    }
    return conciliacao;
  }

  /**
   * Lista conciliações de uma conta.
   */
  async listarPorConta(contaId: string, tenantId: string) {
    return this.conciliacaoRepository.listarPorConta(contaId, tenantId);
  }

  /**
   * Concilia lançamentos com saldos bancários.
   */
  async conciliar(conciliacaoId: string, tenantId: string, idsLancamentos: string[]) {
    const conciliacao = await this.buscarPorId(conciliacaoId, tenantId);

    // Buscar lançamentos
    const lancamentos = await this.prisma.lancamento.findMany({
      where: {
        tenantId,
        id: { in: idsLancamentos },
        dataPagamento: {
          gte: conciliacao.dataInicio,
          lte: conciliacao.dataFim,
        },
      },
    });

    // Marcar como conciliados
    const marcados = [];
    for (const lance of lancamentos) {
      const atualizado = await this.prisma.lancamento.update({
        where: { id: lance.id },
        data: {
          // Campo para marcar como conciliado pode ser adicionado ao schema
          atualizadoEm: new Date(),
        },
      });
      marcados.push(atualizado);
    }

    // Calcular saldos
    const saldoSistema = lancamentos
      .filter((l) => l.tipo === 'RECEITA')
      .reduce((acc, l) => acc.plus(new Decimal(l.valor)), new Decimal(0))
      .minus(
        lancamentos
          .filter((l) => l.tipo === 'DESPESA')
          .reduce((acc, l) => acc.plus(new Decimal(l.valor)), new Decimal(0)),
      )
      .plus(conciliacao.saldoInicial);

    const saldoBancario = conciliacao.saldoFinal;
    const diferenca = saldoBancario.minus(saldoSistema);

    const status =
      diferenca.eq(0) ? 'CONCLUIDA' : 'DIVERGENTE';

    const conciliada = await this.conciliacaoRepository.atualizarStatus(
      conciliacaoId,
      tenantId,
      status,
      {
        saldoSistema,
        saldoBancario,
        diferenca,
        lancamentosProcessados: marcados.length,
      },
    );

    if (status === 'DIVERGENTE') {
      this.logger.warn(
        `Conciliação divergente: ${conciliacaoId} - Diferença: ${diferenca}`,
      );
    } else {
      this.logger.log(`Conciliação concluída: ${conciliacaoId}`);
    }

    return conciliada;
  }

  /**
   * Finaliza conciliação.
   */
  async finalizar(conciliacaoId: string, tenantId: string) {
    const conciliacao = await this.buscarPorId(conciliacaoId, tenantId);

    if (!['EM_ANDAMENTO', 'DIVERGENTE'].includes(conciliacao.status)) {
      throw new BadRequestException('Conciliação já foi finalizada');
    }

    const finalizada = await this.conciliacaoRepository.atualizarStatus(
      conciliacaoId,
      tenantId,
      'CONCLUIDA',
    );

    this.logger.log(`Conciliação finalizada: ${conciliacaoId}`);

    return finalizada;
  }

  /**
   * Importa extrato (placeholder para OFX/CSV).
   */
  async importarExtrato(
    conciliacaoId: string,
    tenantId: string,
    arquivo: any,
  ) {
    const conciliacao = await this.buscarPorId(conciliacaoId, tenantId);

    // Implementação real exigiria parsing de OFX/CSV
    // Por enquanto, apenas placeholder
    this.logger.log(
      `Extrato importado para conciliação ${conciliacaoId}: ${arquivo.originalname}`,
    );

    return {
      conciliacaoId,
      arquivo: arquivo.originalname,
      mensagem: 'Extrato importado com sucesso (implementação placeholder)',
    };
  }

  /**
   * Busca conciliação mais recente de uma conta.
   */
  async buscarMaisRecente(contaId: string, tenantId: string) {
    return this.conciliacaoRepository.buscarMaisRecente(contaId, tenantId);
  }
}
