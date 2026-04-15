/**
 * Consumidor Kafka para Cliente
 *
 * Escuta eventos de outros serviços para atualizar dados de clientes:
 * - Pedidos criados/entregues para atualizar última compra e valor total
 * - Devoluções para ajustar score
 * - Pedidos do marketplace para auto-criar clientes
 */

import { Injectable, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClienteConsumerService {
  private readonly logger = new Logger(ClienteConsumerService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * pedido.criado
   * Atualiza cliente com informações do novo pedido
   */
  @MessagePattern('pedido.criado')
  async aoHandlerPedidoCriado(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      this.logger.debug(`Pedido criado: ${data.pedidoId} para cliente ${data.clienteId}`);

      // Busca cliente
      const cliente = await this.prisma.cliente.findUnique({
        where: { id: data.clienteId },
      });

      if (!cliente) {
        this.logger.warn(`Cliente ${data.clienteId} não encontrado`);
        return;
      }

      // Atualiza cliente com informações do pedido
      await this.prisma.cliente.update({
        where: { id: data.clienteId },
        data: {
          ultimaCompra: new Date(),
          totalCompras: { increment: 1 },
          valorTotalCompras: { increment: data.valor || 0 },
          status: 'ATIVO', // Cliente tem compra confirmada
        },
      });

      this.logger.log(`Cliente ${data.clienteId} atualizado com novo pedido`);
    } catch (erro) {
      this.logger.error(`Erro ao processar pedido.criado: ${erro.message}`);
    }
  }

  /**
   * pedido.entregue
   * Registra interação de venda entregue
   */
  @MessagePattern('pedido.entregue')
  async aoHandlerPedidoEntregue(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      this.logger.debug(`Pedido entregue: ${data.pedidoId} para cliente ${data.clienteId}`);

      // Registra interação
      await this.prisma.interacaoCliente.create({
        data: {
          tenantId: data.tenantId,
          clienteId: data.clienteId,
          tipo: 'VENDA',
          canal: 'MARKETPLACE',
          titulo: `Pedido ${data.pedidoId} entregue`,
          descricao: `Pedido foi entregue com sucesso`,
          usuarioId: 'sistema',
          pedidoId: data.pedidoId,
          metadata: { statusPagamento: data.statusPagamento },
        },
      });

      this.logger.log(`Interação registrada para pedido ${data.pedidoId}`);
    } catch (erro) {
      this.logger.error(`Erro ao processar pedido.entregue: ${erro.message}`);
    }
  }

  /**
   * marketplace.pedido.importado
   * Auto-cria cliente se não existir
   */
  @MessagePattern('marketplace.pedido.importado')
  async aoHandlerMarketplacePedidoImportado(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      this.logger.debug(`Pedido marketplace importado: ${data.pedidoId}`);

      // Verifica se cliente existe
      let cliente = await this.prisma.cliente.findFirst({
        where: {
          tenantId: data.tenantId,
          email: data.emailCliente,
        },
      });

      // Se não existe, cria
      if (!cliente) {
        cliente = await this.prisma.cliente.create({
          data: {
            tenantId: data.tenantId,
            tipo: 'PESSOA_FISICA',
            nome: data.nomeCliente,
            email: data.emailCliente,
            telefone: data.telefone,
            status: 'PROSPECT',
            origem: 'MARKETPLACE',
          },
        });

        this.logger.log(`Cliente criado automaticamente: ${cliente.id} via marketplace`);
      }

      this.logger.log(`Cliente ${cliente.id} associado ao pedido marketplace`);
    } catch (erro) {
      this.logger.error(`Erro ao processar marketplace.pedido.importado: ${erro.message}`);
    }
  }

  /**
   * devolucao.criada
   * Registra interação de devolução e ajusta score
   */
  @MessagePattern('devolucao.criada')
  async aoHandlerDevolucaoCriada(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      this.logger.debug(`Devolução criada: ${data.devolucaoId} para cliente ${data.clienteId}`);

      // Busca cliente
      const cliente = await this.prisma.cliente.findUnique({
        where: { id: data.clienteId },
      });

      if (!cliente) {
        this.logger.warn(`Cliente ${data.clienteId} não encontrado`);
        return;
      }

      // Registra interação
      await this.prisma.interacaoCliente.create({
        data: {
          tenantId: data.tenantId,
          clienteId: data.clienteId,
          tipo: 'DEVOLUCAO',
          canal: 'MARKETPLACE',
          titulo: `Devolução solicitada - Pedido ${data.pedidoId}`,
          descricao: data.motivo || 'Cliente solicitou devolução',
          usuarioId: 'sistema',
          pedidoId: data.pedidoId,
        },
      });

      // Ajusta score (reduz por devolução)
      const novoScore = Math.max(0, cliente.score - 5);

      await this.prisma.cliente.update({
        where: { id: data.clienteId },
        data: { score: novoScore },
      });

      this.logger.log(`Score do cliente ${data.clienteId} ajustado para ${novoScore}`);
    } catch (erro) {
      this.logger.error(`Erro ao processar devolucao.criada: ${erro.message}`);
    }
  }
}
