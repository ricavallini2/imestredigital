/**
 * Serviço de Lançamentos.
 * Lógica de negócio para contas a pagar/receber.
 */

import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import Decimal from 'decimal.js';
import { LancamentoRepository } from './lancamento.repository';
import { CacheService } from '../cache/cache.service';
import { ProdutorEventosService } from '../eventos/produtor-eventos.service';
import { ContaRepository } from '../conta/conta.repository';

interface CriarLancamentoInput {
  tenantId: string;
  tipo: string;
  contaId?: string;
  categoria?: string;
  subcategoria?: string;
  descricao: string;
  valor: number;
  dataVencimento: Date | string;
  dataPagamento?: Date | string;
  dataCompetencia?: Date | string;
  status?: string;
  formaPagamento?: string;
  pedidoId?: string;
  notaFiscalId?: string;
  fornecedor?: string;
  cliente?: string;
  observacao?: string;
  tags?: string[];
  recorrenciaId?: string;
  anexoUrl?: string;
  contaOrigemId?: string;
  contaDestinoId?: string;
}

@Injectable()
export class LancamentoService {
  private readonly logger = new Logger('LancamentoService');

  constructor(
    private lancamentoRepository: LancamentoRepository,
    private contaRepository: ContaRepository,
    private cache: CacheService,
    private produtorEventos: ProdutorEventosService,
  ) {}

  /**
   * Cria um novo lançamento.
   */
  async criar(input: CriarLancamentoInput) {
    // Validações
    if (!['RECEITA', 'DESPESA', 'TRANSFERENCIA'].includes(input.tipo)) {
      throw new BadRequestException('Tipo de lançamento inválido');
    }

    if (input.valor <= 0) {
      throw new BadRequestException('Valor deve ser maior que zero');
    }

    // Conversão de tipos
    const dataVencimento = new Date(input.dataVencimento);
    const dataPagamento = input.dataPagamento ? new Date(input.dataPagamento) : undefined;
    const dataCompetencia = input.dataCompetencia ? new Date(input.dataCompetencia) : undefined;

    const valor = new Decimal(input.valor);

    // Verificar se conta existe (se fornecida)
    if (input.contaId) {
      const conta = await this.contaRepository.buscarPorId(input.contaId, input.tenantId);
      if (!conta) {
        throw new NotFoundException('Conta não encontrada');
      }
    }

    // Criar lançamento
    const lancamento = await this.lancamentoRepository.criar({
      tenantId: input.tenantId,
      contaId: input.contaId,
      tipo: input.tipo,
      categoria: input.categoria,
      subcategoria: input.subcategoria,
      descricao: input.descricao,
      valor,
      dataVencimento,
      dataPagamento,
      dataCompetencia: dataCompetencia || dataVencimento,
      status: input.status || 'PENDENTE',
      formaPagamento: input.formaPagamento,
      pedidoId: input.pedidoId,
      notaFiscalId: input.notaFiscalId,
      fornecedor: input.fornecedor,
      cliente: input.cliente,
      observacao: input.observacao,
      tags: input.tags || [],
      recorrenciaId: input.recorrenciaId,
      anexoUrl: input.anexoUrl,
      contaOrigemId: input.contaOrigemId,
      contaDestinoId: input.contaDestinoId,
    });

    // Atualizar saldo da conta se pago
    if (dataPagamento && input.contaId) {
      await this.atualizarSaldoConta(input.contaId, input.tenantId, input.tipo, valor);
    }

    // Limpar cache
    await this.cache.remover(`lancamentos:${input.tenantId}`);

    // Publicar evento
    await this.produtorEventos.publicarLancamentoCriado({
      tenantId: input.tenantId,
      id: lancamento.id,
      timestamp: new Date(),
      dados: lancamento,
    });

    this.logger.log(`Lançamento criado: ${lancamento.id}`);

    return lancamento;
  }

  /**
   * Cria lançamento a partir de evento (order-service, fiscal-service).
   */
  async criarAPartirEvento(input: CriarLancamentoInput) {
    return this.criar(input);
  }

  /**
   * Busca lançamento por ID.
   */
  async buscarPorId(id: string, tenantId: string) {
    const lancamento = await this.lancamentoRepository.buscarPorId(id, tenantId);
    if (!lancamento) {
      throw new NotFoundException('Lançamento não encontrado');
    }
    return lancamento;
  }

  /**
   * Lista lançamentos com filtros e paginação.
   */
  async listar(tenantId: string, filtros: any, pagina: number = 1, limite: number = 20) {
    const skip = (pagina - 1) * limite;
    const take = Math.min(limite, 100); // Máximo 100 itens por página

    const { lancamentos, total } = await this.lancamentoRepository.listar(
      tenantId,
      filtros,
      skip,
      take,
    );

    return {
      lancamentos,
      paginacao: {
        total,
        pagina,
        limite,
        paginas: Math.ceil(total / limite),
      },
    };
  }

  /**
   * Busca lançamentos atrasados.
   */
  async buscarAtrasados(tenantId: string) {
    const cacheKey = `lancamentos_atrasados:${tenantId}`;
    const cacheado = await this.cache.obter<any>(cacheKey);
    if (cacheado) return cacheado;

    const atrasados = await this.lancamentoRepository.buscarAtrasados(tenantId);

    // Cachear por 1 hora
    await this.cache.definir(cacheKey, atrasados, 3600);

    return atrasados;
  }

  /**
   * Registra pagamento de um lançamento.
   */
  async pagar(
    id: string,
    tenantId: string,
    dataPagamento: Date,
    contaId?: string,
    formaPagamento?: string,
  ) {
    const lancamento = await this.buscarPorId(id, tenantId);

    if (lancamento.status === 'PAGO') {
      throw new BadRequestException('Lançamento já foi pago');
    }

    if (lancamento.status === 'CANCELADO') {
      throw new BadRequestException('Não é possível pagar um lançamento cancelado');
    }

    const contaDef = contaId || lancamento.contaId;

    // Atualizar lançamento
    const atualizado = await this.lancamentoRepository.marcarComoPago(
      id,
      tenantId,
      dataPagamento,
      contaDef,
    );

    // Atualizar saldo da conta
    if (contaDef) {
      await this.atualizarSaldoConta(
        contaDef,
        tenantId,
        lancamento.tipo,
        new Decimal(lancamento.valor),
      );
    }

    // Limpar cache
    await this.cache.remover(`lancamentos:${tenantId}`);
    await this.cache.remover(`lancamentos_atrasados:${tenantId}`);

    // Publicar evento
    await this.produtorEventos.publicarLancamentoPago({
      tenantId,
      id,
      timestamp: dataPagamento,
      dados: atualizado,
    });

    this.logger.log(`Lançamento pago: ${id}`);

    return atualizado;
  }

  /**
   * Parcela um lançamento em múltiplas parcelas.
   */
  async parcelar(
    id: string,
    tenantId: string,
    numeroParcelas: number,
    dataInicioVencimento: Date,
    intervalo: 'SEMANAL' | 'QUINZENAL' | 'MENSAL',
  ) {
    const lancamento = await this.buscarPorId(id, tenantId);

    if (lancamento.totalParcelas) {
      throw new BadRequestException('Lançamento já está parcelado');
    }

    if (numeroParcelas < 2) {
      throw new BadRequestException('Número de parcelas deve ser maior que 1');
    }

    // Calcular valor por parcela
    const valorParcela = new Decimal(lancamento.valor).div(numeroParcelas);

    // Calcular dias para adicionar
    const diasPorIntervalo = {
      SEMANAL: 7,
      QUINZENAL: 15,
      MENSAL: 30,
    };

    const parcelas = [];

    for (let i = 1; i <= numeroParcelas; i++) {
      const dataVencimento = new Date(dataInicioVencimento);
      dataVencimento.setDate(
        dataVencimento.getDate() + diasPorIntervalo[intervalo] * (i - 1),
      );

      if (i === 1) {
        // Atualizar lançamento original
        await this.lancamentoRepository.atualizar(id, tenantId, {
          valor: valorParcela,
          dataVencimento,
          numeroParcela: 1,
          totalParcelas: numeroParcelas,
        });
        parcelas.push(id);
      } else {
        // Criar parcelas adicionais
        const parcela = await this.lancamentoRepository.criar({
          tenantId,
          tipo: lancamento.tipo,
          contaId: lancamento.contaId,
          categoria: lancamento.categoria,
          descricao: `${lancamento.descricao} (Parcela ${i}/${numeroParcelas})`,
          valor: valorParcela,
          dataVencimento,
          status: 'PENDENTE',
          parcelaOrigemId: id,
          numeroParcela: i,
          totalParcelas: numeroParcelas,
        });
        parcelas.push(parcela.id);
      }
    }

    this.logger.log(`Lançamento ${id} parcelado em ${numeroParcelas} vezes`);

    return {
      parcelaOrigemId: id,
      totalParcelas: numeroParcelas,
      parcelas,
    };
  }

  /**
   * Baixa lançamentos em lote.
   */
  async baixarEmLote(tenantId: string, ids: string[], dataPagamento: Date) {
    const resultados = [];

    for (const id of ids) {
      try {
        const resultado = await this.pagar(id, tenantId, dataPagamento);
        resultados.push({ id, sucesso: true, resultado });
      } catch (erro) {
        resultados.push({ id, sucesso: false, erro: erro.message });
      }
    }

    return resultados;
  }

  /**
   * Cancela lançamento.
   */
  async cancelar(id: string, tenantId: string) {
    const lancamento = await this.buscarPorId(id, tenantId);

    if (lancamento.status === 'CANCELADO') {
      throw new BadRequestException('Lançamento já foi cancelado');
    }

    const cancelado = await this.lancamentoRepository.cancelar(id, tenantId);

    // Limpar cache
    await this.cache.remover(`lancamentos:${tenantId}`);

    this.logger.log(`Lançamento cancelado: ${id}`);

    return cancelado;
  }

  /**
   * Cancela lançamento relacionado a um pedido.
   */
  async cancelarAPartirPedido(tenantId: string, pedidoId: string) {
    const lancamento = await this.lancamentoRepository.buscarPorPedidoId(
      tenantId,
      pedidoId,
    );

    if (lancamento) {
      await this.cancelar(lancamento.id, tenantId);
    }
  }

  /**
   * Vincula nota fiscal a lançamentos de um pedido.
   */
  async vincularNotaFiscal(tenantId: string, pedidoId: string, notaFiscalId: string) {
    const lancamento = await this.lancamentoRepository.buscarPorPedidoId(
      tenantId,
      pedidoId,
    );

    if (lancamento) {
      await this.lancamentoRepository.vincularNotaFiscal(
        lancamento.id,
        tenantId,
        notaFiscalId,
      );
    }
  }

  /**
   * Atualiza saldo da conta.
   */
  private async atualizarSaldoConta(
    contaId: string,
    tenantId: string,
    tipo: string,
    valor: Decimal,
  ) {
    const conta = await this.contaRepository.buscarPorId(contaId, tenantId);
    if (!conta) return;

    let novoSaldo = new Decimal(conta.saldoAtual);

    if (tipo === 'RECEITA') {
      novoSaldo = novoSaldo.plus(valor);
    } else if (tipo === 'DESPESA' || tipo === 'TRANSFERENCIA') {
      novoSaldo = novoSaldo.minus(valor);
    }

    await this.contaRepository.atualizarSaldo(contaId, tenantId, novoSaldo);
    await this.cache.remover(`conta:${contaId}:${tenantId}`);
  }
}
