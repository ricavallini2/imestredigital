/**
 * Serviço de Contas Financeiras.
 * Lógica de negócio para gerenciamento de contas.
 */

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import Decimal from 'decimal.js';
import { ContaRepository } from './conta.repository';
import { CacheService } from '../cache/cache.service';

interface CriarContaInput {
  tenantId: string;
  nome: string;
  tipo: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  saldoInicial: number;
  cor?: string;
  icone?: string;
}

@Injectable()
export class ContaService {
  private readonly logger = new Logger('ContaService');

  constructor(
    private contaRepository: ContaRepository,
    private cache: CacheService,
  ) {}

  /**
   * Cria uma nova conta financeira.
   */
  async criar(input: CriarContaInput) {
    // Validações
    if (!['CORRENTE', 'POUPANCA', 'CAIXA', 'CARTAO', 'DIGITAL'].includes(input.tipo)) {
      throw new BadRequestException('Tipo de conta inválido');
    }

    if (input.saldoInicial < 0) {
      throw new BadRequestException('Saldo inicial não pode ser negativo');
    }

    const saldoDecimal = new Decimal(input.saldoInicial);

    // Criar conta
    const conta = await this.contaRepository.criar({
      tenantId: input.tenantId,
      nome: input.nome,
      tipo: input.tipo,
      banco: input.banco,
      agencia: input.agencia,
      conta: input.conta,
      saldoInicial: saldoDecimal,
      saldoAtual: saldoDecimal,
      cor: input.cor,
      icone: input.icone,
    });

    // Limpar cache
    await this.cache.remover(`contas:${input.tenantId}`);

    this.logger.log(`Conta criada: ${conta.id}`);

    return conta;
  }

  /**
   * Busca conta por ID.
   */
  async buscarPorId(id: string, tenantId: string) {
    const cacheKey = `conta:${id}:${tenantId}`;
    const cacheado = await this.cache.obter<any>(cacheKey);
    if (cacheado) return cacheado;

    const conta = await this.contaRepository.buscarPorId(id, tenantId);
    if (!conta) {
      throw new NotFoundException('Conta não encontrada');
    }

    // Cachear por 30 minutos
    await this.cache.definir(cacheKey, conta, 1800);

    return conta;
  }

  /**
   * Lista contas do tenant.
   */
  async listar(tenantId: string) {
    const cacheKey = `contas:${tenantId}`;
    const cacheado = await this.cache.obter<any>(cacheKey);
    if (cacheado) return cacheado;

    const contas = await this.contaRepository.listar(tenantId, true);

    // Cachear por 30 minutos
    await this.cache.definir(cacheKey, contas, 1800);

    return contas;
  }

  /**
   * Atualiza conta.
   */
  async atualizar(id: string, tenantId: string, dados: Partial<CriarContaInput>) {
    await this.buscarPorId(id, tenantId); // Validar que existe

    const atualizado = await this.contaRepository.atualizar(id, tenantId, {
      ...dados,
    } as any);

    // Limpar cache
    await this.cache.remover(`conta:${id}:${tenantId}`);
    await this.cache.remover(`contas:${tenantId}`);

    this.logger.log(`Conta atualizada: ${id}`);

    return atualizado;
  }

  /**
   * Desativa conta.
   */
  async desativar(id: string, tenantId: string) {
    await this.buscarPorId(id, tenantId); // Validar que existe

    const desativada = await this.contaRepository.desativar(id, tenantId);

    // Limpar cache
    await this.cache.remover(`conta:${id}:${tenantId}`);
    await this.cache.remover(`contas:${tenantId}`);

    this.logger.log(`Conta desativada: ${id}`);

    return desativada;
  }

  /**
   * Obtém saldo atual da conta.
   */
  async obterSaldo(id: string, tenantId: string) {
    const conta = await this.buscarPorId(id, tenantId);
    return {
      id: conta.id,
      nome: conta.nome,
      saldoAtual: conta.saldoAtual,
      saldoInicial: conta.saldoInicial,
    };
  }

  /**
   * Obtém saldo total de todas as contas.
   */
  async obterSaldoTotal(tenantId: string) {
    const saldoTotal = await this.contaRepository.somarSaldosAtivos(tenantId);
    return { tenantId, saldoTotal };
  }

  /**
   * Realiza transferência entre contas.
   */
  async transferir(
    contaOrigemId: string,
    contaDestinoId: string,
    tenantId: string,
    valor: number,
  ) {
    if (valor <= 0) {
      throw new BadRequestException('Valor da transferência deve ser positivo');
    }

    if (contaOrigemId === contaDestinoId) {
      throw new BadRequestException('Contas de origem e destino devem ser diferentes');
    }

    // Verificar existência das contas
    await this.buscarPorId(contaOrigemId, tenantId);
    await this.buscarPorId(contaDestinoId, tenantId);

    const valorDecimal = new Decimal(valor);

    // Realizar transferência
    const resultado = await this.contaRepository.transferir(
      contaOrigemId,
      contaDestinoId,
      tenantId,
      valorDecimal,
    );

    // Limpar caches
    await this.cache.remover(`conta:${contaOrigemId}:${tenantId}`);
    await this.cache.remover(`conta:${contaDestinoId}:${tenantId}`);
    await this.cache.remover(`contas:${tenantId}`);

    this.logger.log(
      `Transferência realizada: ${contaOrigemId} → ${contaDestinoId} (${valor})`,
    );

    return resultado;
  }
}
