/**
 * Serviço de Recorrências.
 * Lógica para lançamentos recorrentes automáticos.
 */

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import Decimal from 'decimal.js';
import { RecorrenciaRepository } from './recorrencia.repository';
import { LancamentoRepository } from '../lancamento/lancamento.repository';
import { CacheService } from '../cache/cache.service';

interface CriarRecorrenciaInput {
  tenantId: string;
  descricao: string;
  tipo: string;
  categoria?: string;
  valor: number;
  contaId?: string;
  frequencia: string;
  diaVencimento?: number;
  proximaGeracao: Date | string;
}

@Injectable()
export class RecorrenciaService {
  private readonly logger = new Logger('RecorrenciaService');

  constructor(
    private recorrenciaRepository: RecorrenciaRepository,
    private lancamentoRepository: LancamentoRepository,
    private cache: CacheService,
  ) {}

  /**
   * Cria uma nova recorrência.
   */
  async criar(input: CriarRecorrenciaInput) {
    if (!['RECEITA', 'DESPESA'].includes(input.tipo)) {
      throw new BadRequestException('Tipo inválido');
    }

    if (input.valor <= 0) {
      throw new BadRequestException('Valor deve ser positivo');
    }

    const proximaGeracao = new Date(input.proximaGeracao);

    const recorrencia = await this.recorrenciaRepository.criar({
      tenantId: input.tenantId,
      descricao: input.descricao,
      tipo: input.tipo,
      categoria: input.categoria,
      valor: new Decimal(input.valor),
      contaId: input.contaId,
      frequencia: input.frequencia,
      diaVencimento: input.diaVencimento,
      proximaGeracao,
    });

    await this.cache.remover(`recorrencias:${input.tenantId}`);

    this.logger.log(`Recorrência criada: ${recorrencia.id}`);

    return recorrencia;
  }

  /**
   * Busca recorrência por ID.
   */
  async buscarPorId(id: string, tenantId: string) {
    const recorrencia = await this.recorrenciaRepository.buscarPorId(id, tenantId);
    if (!recorrencia) {
      throw new NotFoundException('Recorrência não encontrada');
    }
    return recorrencia;
  }

  /**
   * Lista recorrências ativas.
   */
  async listar(tenantId: string) {
    const cacheKey = `recorrencias:${tenantId}`;
    const cacheado = await this.cache.obter<any>(cacheKey);
    if (cacheado) return cacheado;

    const recorrencias = await this.recorrenciaRepository.listar(tenantId, true);

    await this.cache.definir(cacheKey, recorrencias, 1800);

    return recorrencias;
  }

  /**
   * Gera lançamentos de recorrências vencidas.
   */
  async gerarLancamentosRecorrentes(tenantId?: string) {
    const recorrenciasVencidas = await this.recorrenciaRepository.buscarParaGerar(tenantId);

    const lancamentosGerados = [];

    for (const rec of recorrenciasVencidas) {
      try {
        // Calcular próxima data de geração
        const proximaData = this.calcularProximaData(
          rec.proximaGeracao,
          rec.frequencia,
          rec.diaVencimento,
        );

        // Criar lançamento
        const lancamento = await this.lancamentoRepository.criar({
          tenantId: rec.tenantId,
          contaId: rec.contaId,
          tipo: rec.tipo,
          categoria: rec.categoria,
          descricao: rec.descricao,
          valor: new Decimal(rec.valor),
          dataVencimento: rec.proximaGeracao,
          status: 'PENDENTE',
          recorrenciaId: rec.id,
          recorrente: true,
        });

        // Atualizar próxima geração da recorrência
        await this.recorrenciaRepository.atualizar(rec.id, rec.tenantId, {
          proximaGeracao: proximaData,
        });

        lancamentosGerados.push(lancamento);

        this.logger.log(
          `Lançamento gerado para recorrência ${rec.id}: ${lancamento.id}`,
        );
      } catch (erro) {
        this.logger.error(
          `Erro ao gerar lançamento para recorrência ${rec.id}: ${erro.message}`,
        );
      }
    }

    if (tenantId) {
      await this.cache.remover(`recorrencias:${tenantId}`);
    }

    return {
      total: lancamentosGerados.length,
      lancamentos: lancamentosGerados,
    };
  }

  /**
   * Desativa recorrência.
   */
  async desativar(id: string, tenantId: string) {
    await this.buscarPorId(id, tenantId);

    const desativada = await this.recorrenciaRepository.desativar(id, tenantId);

    await this.cache.remover(`recorrencias:${tenantId}`);

    this.logger.log(`Recorrência desativada: ${id}`);

    return desativada;
  }

  /**
   * Calcula próxima data de geração baseado na frequência.
   */
  private calcularProximaData(dataAtual: Date, frequencia: string, diaVencimento?: number): Date {
    const novaData = new Date(dataAtual);

    switch (frequencia) {
      case 'DIARIA':
        novaData.setDate(novaData.getDate() + 1);
        break;
      case 'SEMANAL':
        novaData.setDate(novaData.getDate() + 7);
        break;
      case 'QUINZENAL':
        novaData.setDate(novaData.getDate() + 15);
        break;
      case 'MENSAL':
        novaData.setMonth(novaData.getMonth() + 1);
        if (diaVencimento) {
          novaData.setDate(diaVencimento);
        }
        break;
      case 'BIMESTRAL':
        novaData.setMonth(novaData.getMonth() + 2);
        if (diaVencimento) {
          novaData.setDate(diaVencimento);
        }
        break;
      case 'TRIMESTRAL':
        novaData.setMonth(novaData.getMonth() + 3);
        if (diaVencimento) {
          novaData.setDate(diaVencimento);
        }
        break;
      case 'SEMESTRAL':
        novaData.setMonth(novaData.getMonth() + 6);
        if (diaVencimento) {
          novaData.setDate(diaVencimento);
        }
        break;
      case 'ANUAL':
        novaData.setFullYear(novaData.getFullYear() + 1);
        if (diaVencimento) {
          novaData.setDate(diaVencimento);
        }
        break;
    }

    return novaData;
  }
}
