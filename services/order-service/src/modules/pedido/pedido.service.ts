/**
 * ═══════════════════════════════════════════════════════════════
 * Serviço de Pedidos - Lógica de Negócio
 * ═══════════════════════════════════════════════════════════════
 *
 * Orquestra todo o workflow de pedidos:
 * - Criação (reserva estoque, publica PEDIDO_CRIADO)
 * - Confirmação (publica PEDIDO_CONFIRMADO)
 * - Separação (publica PEDIDO_SEPARANDO quando estoque reservado)
 * - Faturamento (publica PEDIDO_FATURAR ao fiscal-service)
 * - Envio (publica PEDIDO_ENVIADO)
 * - Entrega (publica PEDIDO_ENTREGUE)
 * - Cancelamento (publica PEDIDO_CANCELADO, libera estoque)
 *
 * Máquina de estados valida transições permitidas entre status.
 */

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { v4 as uuidv4 } from 'uuid';

import { PedidoRepository } from './pedido.repository';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { CacheService } from '../cache/cache.service';
import { CriarPedidoDto } from '../../dtos/criar-pedido.dto';
import { FiltroPedidoDto } from '../../dtos/filtro-pedido.dto';

@Injectable()
export class PedidoService {
  // Máquina de estados: transições permitidas
  private transicoePermitidas: Record<string, string[]> = {
    RASCUNHO: ['PENDENTE', 'CANCELADO'],
    PENDENTE: ['CONFIRMADO', 'CANCELADO'],
    CONFIRMADO: ['SEPARANDO', 'CANCELADO'],
    SEPARANDO: ['SEPARADO', 'CANCELADO'],
    SEPARADO: ['FATURADO', 'CANCELADO'],
    FATURADO: ['ENVIADO', 'CANCELADO'],
    ENVIADO: ['ENTREGUE', 'CANCELADO'],
    ENTREGUE: ['DEVOLVIDO'],
    CANCELADO: [],
    DEVOLVIDO: [],
  };

  constructor(
    private pedidoRepository: PedidoRepository,
    private kafkaProducer: KafkaProducerService,
    private cache: CacheService,
  ) {}

  /**
   * Criar novo pedido.
   * Publica PEDIDO_CRIADO e inicia fluxo de reserva de estoque.
   */
  async criarPedido(tenantId: string, dto: CriarPedidoDto) {
    // Calcular totais
    let valorProdutos = 0;
    let peso = 0;

    for (const item of dto.itens) {
      const subtotal = item.valorUnitario * item.quantidade;
      valorProdutos += subtotal;
      if (item.peso) peso += item.peso * item.quantidade;
    }

    const valorDesconto = dto.valorDesconto || 0;
    const valorFrete = dto.valorFrete || 0;
    const valorTotal = valorProdutos - valorDesconto + valorFrete;

    // Criar pedido
    const pedido = await this.pedidoRepository.criar(tenantId, {
      origem: dto.origem || 'MANUAL',
      canalOrigem: dto.canalOrigem,
      pedidoExternoId: dto.pedidoExternoId,
      clienteId: dto.clienteId,
      clienteNome: dto.clienteNome,
      clienteEmail: dto.clienteEmail,
      clienteCpfCnpj: dto.clienteCpfCnpj,
      metodoPagamento: dto.metodoPagamento,
      parcelas: dto.parcelas || 1,
      valorProdutos: new Decimal(valorProdutos),
      valorDesconto: new Decimal(valorDesconto),
      valorFrete: new Decimal(valorFrete),
      valorTotal: new Decimal(valorTotal),
      enderecoEntrega: dto.enderecoEntrega,
      observacao: dto.observacao,
    });

    // Adicionar itens
    const itensFormatados = dto.itens.map((item) => ({
      produtoId: item.produtoId,
      variacaoId: item.variacaoId,
      sku: item.sku,
      titulo: item.titulo,
      quantidade: item.quantidade,
      valorUnitario: new Decimal(item.valorUnitario),
      valorDesconto: new Decimal(item.valorDesconto || 0),
      valorTotal: new Decimal(
        (item.valorUnitario - (item.valorDesconto || 0)) * item.quantidade,
      ),
      peso: item.peso ? new Decimal(item.peso) : null,
      largura: item.largura ? new Decimal(item.largura) : null,
      altura: item.altura ? new Decimal(item.altura) : null,
      comprimento: item.comprimento ? new Decimal(item.comprimento) : null,
    }));

    await this.pedidoRepository.adicionarItens(pedido.id, itensFormatados);

    // Adicionar ao histórico
    await this.pedidoRepository.adicionarHistorico(
      pedido.id,
      tenantId,
      null,
      'RASCUNHO',
      'Pedido criado',
    );

    // Publicar evento
    await this.kafkaProducer.publicarPedidoCriado(tenantId, pedido.id, {
      numero: pedido.numero,
      cliente: pedido.clienteNome,
      itens: itensFormatados.map((i) => ({
        produtoId: i.produtoId,
        sku: i.sku,
        quantidade: i.quantidade,
      })),
      valorTotal: parseFloat(pedido.valorTotal.toString()),
    });

    // Limpar cache de listagem
    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);

    return pedido;
  }

  /**
   * Confirmar pedido (mover para CONFIRMADO).
   * Dispara reserva de estoque no inventory-service.
   */
  async confirmarPedido(tenantId: string, pedidoId: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'CONFIRMADO');

    // Atualizar status
    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'CONFIRMADO',
    );

    // Adicionar ao histórico
    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      'CONFIRMADO',
      'Pedido confirmado pelo cliente',
    );

    // Publicar evento
    await this.kafkaProducer.publicarPedidoConfirmado(tenantId, pedidoId, {
      numero: pedido.numero,
      cliente: pedido.clienteNome,
    });

    // Limpar cache
    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Confirmar pedido após pagamento ser autorizado.
   * Se pedido está em PENDENTE, passa para CONFIRMADO automaticamente.
   */
  async confirmarPedidoAposAutorizacao(
    tenantId: string,
    pedidoId: string,
  ) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);

    if (pedido.status === 'PENDENTE') {
      await this.confirmarPedido(tenantId, pedidoId);
    }
  }

  /**
   * Iniciar separação do pedido (SEPARANDO).
   * Disparado quando estoque é reservado.
   */
  async iniciarSeparacao(tenantId: string, pedidoId: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'SEPARANDO');

    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'SEPARANDO',
    );

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      'SEPARANDO',
      'Iniciada separação dos itens',
    );

    await this.kafkaProducer.publicarPedidoSeparando(
      tenantId,
      pedidoId,
      {},
    );

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Finalizar separação (SEPARADO).
   */
  async finalizarSeparacao(tenantId: string, pedidoId: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'SEPARADO');

    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'SEPARADO',
    );

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      'SEPARADO',
      'Separação concluída',
    );

    await this.kafkaProducer.publicarPedidoSeparado(
      tenantId,
      pedidoId,
      {},
    );

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Faturar pedido (FATURADO).
   * Publica PEDIDO_FATURAR ao fiscal-service.
   */
  async faturarPedido(tenantId: string, pedidoId: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'FATURADO');

    // Nota: O status FATURADO é atualizado quando recebe NOTA_AUTORIZADA do fiscal-service
    // Mas publicamos PEDIDO_FATURAR agora para solicitar

    await this.kafkaProducer.publicarPedidoFaturar(tenantId, pedidoId, {
      numero: pedido.numero,
      cliente: pedido.clienteNome,
      itens: pedido.itens.map((i) => ({
        sku: i.sku,
        titulo: i.titulo,
        quantidade: i.quantidade,
        valorTotal: parseFloat(i.valorTotal.toString()),
      })),
      valorTotal: parseFloat(pedido.valorTotal.toString()),
    });

    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedido;
  }

  /**
   * Marcar pedido como FATURADO (chamado pelo consumidor de NOTA_AUTORIZADA).
   */
  async marcarComoFaturado(
    tenantId: string,
    pedidoId: string,
    notaFiscalId: string,
  ) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);

    // Atualizar status via repository
    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'FATURADO',
    );

    // Atualizar notaFiscalId no banco
    await this.pedidoRepository.prisma.pedido.update({
      where: { id: pedidoId },
      data: { notaFiscalId },
    });

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      'SEPARADO',
      'FATURADO',
      `Nota Fiscal ${notaFiscalId} autorizada`,
    );

    await this.kafkaProducer.publicarPedidoFaturado(
      tenantId,
      pedidoId,
      notaFiscalId,
    );

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Enviar pedido (ENVIADO).
   * Registra rastreamento.
   */
  async enviarPedido(
    tenantId: string,
    pedidoId: string,
    codigoRastreio: string,
    transportadora: string,
    prazoEntrega?: number,
  ) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'ENVIADO');

    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'ENVIADO',
    );

    await this.pedidoRepository.atualizarRastreio(
      tenantId,
      pedidoId,
      codigoRastreio,
      transportadora,
      prazoEntrega,
    );

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      'ENVIADO',
      `Enviado por ${transportadora} - Rastreio: ${codigoRastreio}`,
    );

    await this.kafkaProducer.publicarPedidoEnviado(tenantId, pedidoId, {
      codigoRastreio,
      transportadora,
      prazoEntrega,
    });

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Marcar pedido como entregue.
   */
  async entregarPedido(tenantId: string, pedidoId: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'ENTREGUE');

    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'ENTREGUE',
    );

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      'ENTREGUE',
      'Pedido entregue',
    );

    await this.kafkaProducer.publicarPedidoEntregue(tenantId, pedidoId);

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Cancelar pedido.
   * Publica PEDIDO_CANCELADO para liberar estoque e reembolsar pagamento.
   */
  async cancelarPedido(tenantId: string, pedidoId: string, motivo: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'CANCELADO');

    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'CANCELADO',
    );

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      'CANCELADO',
      `Pedido cancelado: ${motivo}`,
    );

    // Atualizar status do pedido
    await this.pedidoRepository.prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        motivoCancelamento: motivo,
      },
    });

    // Publicar evento
    await this.kafkaProducer.publicarPedidoCancelado(
      tenantId,
      pedidoId,
      motivo,
    );

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Buscar pedido por ID com todas as informações relacionadas.
   */
  async buscarPorId(tenantId: string, pedidoId: string) {
    // Tentar cache primeiro
    const chaveCache = `pedido:${tenantId}:${pedidoId}`;
    const cached = await this.cache.getJson<any>(chaveCache);
    if (cached) return cached;

    const pedido = await this.pedidoRepository.buscarPorId(tenantId, pedidoId);
    if (!pedido) {
      throw new NotFoundException(`Pedido ${pedidoId} não encontrado`);
    }

    // Guardar em cache por 10 minutos
    await this.cache.setJson(chaveCache, pedido, 600);

    return pedido;
  }

  /**
   * Listar pedidos com paginação e filtros.
   */
  async listar(tenantId: string, filtros: FiltroPedidoDto) {
    const resultado = await this.pedidoRepository.listar(tenantId, filtros);
    return resultado;
  }

  /**
   * Atualizar rastreamento.
   */
  async atualizarRastreio(
    tenantId: string,
    pedidoId: string,
    codigoRastreio: string,
    transportadora: string,
  ) {
    await this.validarExistencia(tenantId, pedidoId);

    await this.pedidoRepository.atualizarRastreio(
      tenantId,
      pedidoId,
      codigoRastreio,
      transportadora,
    );

    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);
    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
  }

  /**
   * Calcular frete (placeholder para integração com APIs).
   */
  async calcularFrete(tenantId: string, dados: any) {
    // TODO: Integrar com Melhor Envio, Frenet, etc
    return {
      opcoes: [
        {
          servico: 'SEDEX',
          prazo: 2,
          valor: 50,
        },
        {
          servico: 'PAC',
          prazo: 7,
          valor: 20,
        },
      ],
    };
  }

  /**
   * Obter estatísticas (KPIs do dashboard).
   */
  async obterEstatisticas(tenantId: string, periodo: string) {
    const agora = new Date();
    let dataInicio: Date;

    switch (periodo) {
      case 'hoje':
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
        break;
      case 'semana':
        dataInicio = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'mes':
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
        break;
      case 'ano':
        dataInicio = new Date(agora.getFullYear(), 0, 1);
        break;
      default:
        dataInicio = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 dias
    }

    return this.pedidoRepository.obterEstatisticas(tenantId, dataInicio, agora);
  }

  /**
   * Atualizar status do pedido (helper privado usado por consumidores de eventos).
   */
  async atualizarStatusPedido(
    tenantId: string,
    pedidoId: string,
    novoStatus: string,
    descricao: string,
  ) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);

    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      novoStatus,
    );

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      novoStatus,
      descricao,
    );

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Atualizar status de pagamento (helper privado).
   */
  async atualizarStatusPagamento(
    tenantId: string,
    pedidoId: string,
    novoStatus: string,
  ) {
    await this.validarExistencia(tenantId, pedidoId);
    await this.pedidoRepository.atualizarStatusPagamento(
      tenantId,
      pedidoId,
      novoStatus,
    );

    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);
    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
  }

  // ─── Helpers Privados ────────────────────────────────────

  /**
   * Validar que pedido existe e pertence ao tenant.
   */
  private async validarExistencia(tenantId: string, pedidoId: string) {
    const pedido = await this.pedidoRepository.buscarPorId(tenantId, pedidoId);
    if (!pedido) {
      throw new NotFoundException(`Pedido ${pedidoId} não encontrado`);
    }
    return pedido;
  }

  /**
   * Validar transição de status permitida.
   */
  private validarTransicao(statusAtual: string, statusNovo: string) {
    const permitidas = this.transicoePermitidas[statusAtual] || [];
    if (!permitidas.includes(statusNovo)) {
      throw new BadRequestException(
        `Transição de ${statusAtual} para ${statusNovo} não permitida`,
      );
    }
  }
}
