/**
 * Consumidor de Eventos (Kafka)
 * Processa eventos de outros serviços.
 */

import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { TOPICOS_KAFKA } from '../config/kafka.config';
import { NotaFiscalService } from '../modules/nota-fiscal/nota-fiscal.service';

@Controller()
export class ConsumidorEventosController {
  private readonly logger = new Logger('ConsumidorEventosController');

  constructor(private readonly notaFiscalService: NotaFiscalService) {}

  /**
   * Processa evento: Pedido criado (do order-service)
   * Gera NF-e automaticamente se configurado.
   */
  @EventPattern(TOPICOS_KAFKA.PEDIDO_FATURAR)
  async procesarPedidoFaturar(
    @Payload() dados: any,
    @Ctx() contexto: KafkaContext,
  ): Promise<void> {
    try {
      const { tenantId, pedidoId } = dados ?? {};
      if (!tenantId || !pedidoId) {
        this.logger.warn('pedido.faturar ignorado: payload incompleto');
        return;
      }
      this.logger.log(
        `Recebido evento pedido.faturar para pedido ${pedidoId} do tenant ${tenantId}`,
      );

      // Gera, valida e transmite a NF-e automaticamente (idempotente por pedidoId).
      await this.notaFiscalService.gerarNotaAutomaticamente(tenantId, dados);
    } catch (erro) {
      this.logger.error('Erro ao processar pedido.faturar:', erro);
    }
  }

  /**
   * Processa evento: Produto atualizado (do catalog-service)
   * Atualiza NCM/CFOP se o produto foi modificado.
   */
  @EventPattern(TOPICOS_KAFKA.PRODUTO_ATUALIZADO)
  async procesarProdutoAtualizado(
    @Payload() dados: any,
    @Ctx() contexto: KafkaContext,
  ): Promise<void> {
    try {
      const { tenantId, produtoId, ncm, cfop } = dados;
      this.logger.log(
        `Recebido evento PRODUTO_ATUALIZADO para produto ${produtoId} do tenant ${tenantId}`,
      );

      // Integração futura: atualizar itens de notas rascunho
      // Manter sincronização de NCM/CFOP
    } catch (erro) {
      this.logger.error('Erro ao processar PRODUTO_ATUALIZADO:', erro);
    }
  }
}
