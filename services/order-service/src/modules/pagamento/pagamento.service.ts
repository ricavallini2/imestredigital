/**
 * ═══════════════════════════════════════════════════════════════
 * Serviço de Pagamentos
 * ═══════════════════════════════════════════════════════════════
 *
 * Gerencia registros de pagamento:
 * - Registrar pagamentos (webhook do gateway)
 * - Processar autorização e captura
 * - Estornar pagamentos
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PagamentoRepository } from './pagamento.repository';
import { CacheService } from '../cache/cache.service';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { RegistrarPagamentoDto } from '../../dtos/pagamento.dto';

@Injectable()
export class PagamentoService {
  constructor(
    private pagamentoRepository: PagamentoRepository,
    private cache: CacheService,
    private kafkaProducer: KafkaProducerService,
  ) {}

  /**
   * Registrar novo pagamento.
   */
  async registrarPagamento(
    tenantId: string,
    pedidoId: string,
    dto: RegistrarPagamentoDto,
  ) {
    const pagamento = await this.pagamentoRepository.criar(tenantId, pedidoId, dto);

    // Publicar evento se autorizado ou pago
    if (dto.status === 'AUTORIZADO') {
      await this.kafkaProducer.publicarPedidoPago(tenantId, pedidoId);
    }

    // Limpar cache
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);
    await this.cache.deleteByPattern(`pagamentos:${tenantId}:*`);

    return pagamento;
  }

  /**
   * Processar webhook de gateway de pagamento.
   * Chamado por POST /pagamentos/webhook
   */
  async processarWebhook(tenantId: string, dadosWebhook: any) {
    const { pedidoId, status, transacaoExternaId, motivo } = dadosWebhook;

    // Buscar pagamento para validar
    // Em produção, validar assinatura do webhook

    if (status === 'APROVADO') {
      // Atualizar status para PAGO
      // Publicar evento PAGAMENTO_CAPTURADO
    } else if (status === 'RECUSADO') {
      // Atualizar status
      // Publicar evento PAGAMENTO_RECUSADO
    }

    return { sucesso: true };
  }

  /**
   * Estornar pagamento.
   */
  async estornarPagamento(
    tenantId: string,
    pagamentoId: string,
    motivo: string,
  ) {
    const pagamento = await this.pagamentoRepository.buscarPorId(
      tenantId,
      pagamentoId,
    );

    if (!pagamento) {
      throw new NotFoundException(`Pagamento ${pagamentoId} não encontrado`);
    }

    const pagamentoAtualizado = await this.pagamentoRepository.atualizarStatus(
      tenantId,
      pagamentoId,
      'ESTORNADO',
    );

    // Publicar evento
    // await this.kafkaProducer.publicarPagamentoEstornado(...)

    // Limpar cache
    await this.cache.deleteByPattern(`pagamentos:${tenantId}:*`);

    return pagamentoAtualizado;
  }

  /**
   * Listar pagamentos do tenant.
   */
  async listar(tenantId: string, filtros: any) {
    return this.pagamentoRepository.listar(tenantId, filtros);
  }

  /**
   * Buscar pagamentos de um pedido específico.
   */
  async buscarPorPedido(tenantId: string, pedidoId: string) {
    return this.pagamentoRepository.buscarPorPedido(tenantId, pedidoId);
  }
}
