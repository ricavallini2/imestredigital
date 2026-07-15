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
import { StatusPagamentoDetalhado } from '../../../generated/client';

/**
 * Normaliza o status livre recebido (REST/webhook/evento) para o enum canônico
 * `StatusPagamentoDetalhado` do Prisma (fonte da verdade). Sinônimos legados
 * ("AUTORIZADO", "PAGO") mapeiam para APROVADO; desconhecidos caem em PENDENTE
 * (nunca gravamos string arbitrária no enum → evita erro de enum drift).
 */
const MAPA_STATUS_PAGAMENTO: Record<string, StatusPagamentoDetalhado> = {
  PENDENTE: StatusPagamentoDetalhado.PENDENTE,
  PROCESSANDO: StatusPagamentoDetalhado.PROCESSANDO,
  APROVADO: StatusPagamentoDetalhado.APROVADO,
  AUTORIZADO: StatusPagamentoDetalhado.APROVADO,
  PAGO: StatusPagamentoDetalhado.APROVADO,
  RECUSADO: StatusPagamentoDetalhado.RECUSADO,
  ESTORNADO: StatusPagamentoDetalhado.ESTORNADO,
};

function normalizarStatusPagamento(status: string | undefined): StatusPagamentoDetalhado {
  if (!status) return StatusPagamentoDetalhado.PENDENTE;
  return MAPA_STATUS_PAGAMENTO[status.trim().toUpperCase()] ?? StatusPagamentoDetalhado.PENDENTE;
}

@Injectable()
export class PagamentoService {
  constructor(
    private pagamentoRepository: PagamentoRepository,
    private cache: CacheService,
    private kafkaProducer: KafkaProducerService,
  ) {}

  /**
   * Registrar novo pagamento.
   *
   * Persiste o status já normalizado ao enum canônico e, quando o pagamento é
   * APROVADO, publica `pedido.pago` (contrato da saga → consumido por
   * inventory-service para baixa definitiva e financial-service para lançamento).
   */
  async registrarPagamento(tenantId: string, pedidoId: string, dto: RegistrarPagamentoDto) {
    const statusNormalizado = normalizarStatusPagamento(dto.status);

    const pagamento = await this.pagamentoRepository.criar(tenantId, pedidoId, {
      ...dto,
      status: statusNormalizado,
    });

    // Publica pedido.pago apenas quando o pagamento foi efetivamente aprovado.
    if (statusNormalizado === StatusPagamentoDetalhado.APROVADO) {
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
   *
   * TODO(Fase 1): STUB. Implementar:
   * - Validação da assinatura HMAC do gateway (segurança do endpoint público).
   * - Resolução do tenantId a partir da credencial/payload do webhook.
   * - Atualização do status do pagamento e publicação de PAGAMENTO_CAPTURADO
   *   (APROVADO) / PAGAMENTO_RECUSADO (RECUSADO) via KafkaProducerService.
   */
  async processarWebhook(tenantId: string, dadosWebhook: any) {
    const { pedidoId, status, transacaoExternaId, motivo } = dadosWebhook;

    if (status === 'APROVADO') {
      // Atualizar status para PAGO + publicar evento PAGAMENTO_CAPTURADO
    } else if (status === 'RECUSADO') {
      // Atualizar status + publicar evento PAGAMENTO_RECUSADO
    }

    return { sucesso: true };
  }

  /**
   * Estornar pagamento.
   */
  async estornarPagamento(tenantId: string, pagamentoId: string, motivo: string) {
    const pagamento = await this.pagamentoRepository.buscarPorId(tenantId, pagamentoId);

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
