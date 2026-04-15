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
      const { tenantId, pedidoId } = dados;
      this.logger.log(
        `Recebido evento PEDIDO_FATURAR para pedido ${pedidoId} do tenant ${tenantId}`,
      );

      // Integração futura: gerar NF-e automaticamente
      // await this.notaFiscalService.gerarNotaAutomaticamente(tenantId, pedidoId);
    } catch (erro) {
      this.logger.error('Erro ao processar PEDIDO_FATURAR:', erro);
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
