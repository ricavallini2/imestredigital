/**
 * Serviço Consumidor Kafka.
 *
 * Escuta eventos de outros serviços e dispara notificações automaticamente:
 * - pedido.criado → notifica cliente + admin
 * - pedido.status.alterado → notifica cliente
 * - estoque.baixo → notifica admin
 * - nfe.autorizada → notifica cliente com link do PDF
 * - pagamento.confirmado → notifica cliente
 * - marketplace.pergunta.recebida → notifica vendedor
 * - marketplace.pedido.importado → notifica admin
 */

import { Injectable, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificacaoService } from '../notificacao/notificacao.service';
import { TipoNotificacao } from '../../dtos/criar-notificacao.dto';

@Injectable()
export class NotificacaoConsumerService {
  private readonly logger = new Logger(NotificacaoConsumerService.name);

  constructor(
    private readonly notificacaoService: NotificacaoService,
  ) {}

  /**
   * Evento: Pedido criado
   */
  @MessagePattern('pedido.criado')
  async aoAoCriarPedido(
    @Payload()
    dados: {
      tenantId: string;
      pedidoId: string;
      clienteId: string;
      clienteEmail: string;
      clienteNome: string;
      total: number;
      adminEmail?: string;
    },
  ) {
    try {
      this.logger.log(`Pedido criado: ${dados.pedidoId}`);

      // Notifica o cliente
      await this.notificacaoService.criarNotificacao(dados.tenantId, {
        tipo: TipoNotificacao.EMAIL,
        titulo: 'Seu pedido foi recebido',
        mensagem: `Pedido #${dados.pedidoId} no valor de R$ ${dados.total.toFixed(2)} foi recebido com sucesso.`,
        destinatarioId: dados.clienteId,
        destinatarioEmail: dados.clienteEmail,
        metadata: {
          pedidoId: dados.pedidoId,
          evento: 'pedido.criado',
        },
      });

      // Notifica admin se email fornecido
      if (dados.adminEmail) {
        await this.notificacaoService.criarNotificacao(dados.tenantId, {
          tipo: TipoNotificacao.EMAIL,
          titulo: `Novo pedido: ${dados.clienteNome}`,
          mensagem: `Cliente ${dados.clienteNome} criou pedido #${dados.pedidoId} no valor de R$ ${dados.total.toFixed(2)}.`,
          destinatarioEmail: dados.adminEmail,
          metadata: {
            pedidoId: dados.pedidoId,
            evento: 'pedido.criado.admin',
          },
        });
      }
    } catch (erro) {
      this.logger.error(`Erro ao processar pedido.criado:`, erro);
    }
  }

  /**
   * Evento: Status do pedido alterado
   */
  @MessagePattern('pedido.status.alterado')
  async aoAlterarStatusPedido(
    @Payload()
    dados: {
      tenantId: string;
      pedidoId: string;
      clienteId: string;
      clienteEmail: string;
      clienteNome: string;
      statusAnterior: string;
      statusNovo: string;
    },
  ) {
    try {
      this.logger.log(
        `Status do pedido alterado: ${dados.pedidoId} de ${dados.statusAnterior} para ${dados.statusNovo}`,
      );

      // Traduz o status para português amigável
      const statusTraducao: Record<string, string> = {
        'pendente': 'Pendente',
        'processando': 'Processando',
        'enviado': 'Enviado',
        'entregue': 'Entregue',
        'cancelado': 'Cancelado',
        'devolvido': 'Devolvido',
      };

      const novoStatusLegivel = statusTraducao[dados.statusNovo] || dados.statusNovo;

      await this.notificacaoService.criarNotificacao(dados.tenantId, {
        tipo: TipoNotificacao.EMAIL,
        titulo: `Atualização do seu pedido #${dados.pedidoId}`,
        mensagem: `Seu pedido #${dados.pedidoId} foi atualizado para: ${novoStatusLegivel}.`,
        destinatarioId: dados.clienteId,
        destinatarioEmail: dados.clienteEmail,
        metadata: {
          pedidoId: dados.pedidoId,
          statusAnterior: dados.statusAnterior,
          statusNovo: dados.statusNovo,
          evento: 'pedido.status.alterado',
        },
      });
    } catch (erro) {
      this.logger.error(`Erro ao processar pedido.status.alterado:`, erro);
    }
  }

  /**
   * Evento: Estoque baixo
   */
  @MessagePattern('estoque.baixo')
  async aoEstoqueBaixo(
    @Payload()
    dados: {
      tenantId: string;
      produtoId: string;
      produtoNome: string;
      quantidadeEmEstoque: number;
      nivelMinimo: number;
      adminEmail?: string;
    },
  ) {
    try {
      this.logger.log(`Estoque baixo: ${dados.produtoNome}`);

      if (dados.adminEmail) {
        await this.notificacaoService.criarNotificacao(dados.tenantId, {
          tipo: TipoNotificacao.EMAIL,
          titulo: 'Alerta: Estoque baixo',
          mensagem: `Produto "${dados.produtoNome}" tem apenas ${dados.quantidadeEmEstoque} unidades em estoque (mínimo: ${dados.nivelMinimo}).`,
          destinatarioEmail: dados.adminEmail,
          prioridade: 'ALTA' as any,
          metadata: {
            produtoId: dados.produtoId,
            evento: 'estoque.baixo',
          },
        });
      }
    } catch (erro) {
      this.logger.error(`Erro ao processar estoque.baixo:`, erro);
    }
  }

  /**
   * Evento: NFe autorizada
   */
  @MessagePattern('nfe.autorizada')
  async aoNfeAutorizada(
    @Payload()
    dados: {
      tenantId: string;
      nfeId: string;
      nfeNumero: string;
      pedidoId: string;
      clienteId: string;
      clienteEmail: string;
      clienteNome: string;
      pdfUrl?: string;
    },
  ) {
    try {
      this.logger.log(`NFe autorizada: ${dados.nfeNumero}`);

      const linkPdf = dados.pdfUrl ? `\n\nBaixar NFe: ${dados.pdfUrl}` : '';

      await this.notificacaoService.criarNotificacao(dados.tenantId, {
        tipo: TipoNotificacao.EMAIL,
        titulo: `NFe autorizada - Pedido #${dados.pedidoId}`,
        mensagem: `Sua NFe #${dados.nfeNumero} foi autorizada pela Receita Federal.${linkPdf}`,
        destinatarioId: dados.clienteId,
        destinatarioEmail: dados.clienteEmail,
        metadata: {
          nfeId: dados.nfeId,
          nfeNumero: dados.nfeNumero,
          pedidoId: dados.pedidoId,
          pdfUrl: dados.pdfUrl,
          evento: 'nfe.autorizada',
        },
      });
    } catch (erro) {
      this.logger.error(`Erro ao processar nfe.autorizada:`, erro);
    }
  }

  /**
   * Evento: Pagamento confirmado
   */
  @MessagePattern('pagamento.confirmado')
  async aoPagamentoConfirmado(
    @Payload()
    dados: {
      tenantId: string;
      pagamentoId: string;
      pedidoId: string;
      clienteId: string;
      clienteEmail: string;
      clienteNome: string;
      valor: number;
      metodo: string;
    },
  ) {
    try {
      this.logger.log(`Pagamento confirmado: ${dados.pagamentoId}`);

      const metodoTraducao: Record<string, string> = {
        'credito': 'Crédito',
        'debito': 'Débito',
        'boleto': 'Boleto',
        'pix': 'PIX',
        'transferencia': 'Transferência',
      };

      const metodoLegivel = metodoTraducao[dados.metodo] || dados.metodo;

      await this.notificacaoService.criarNotificacao(dados.tenantId, {
        tipo: TipoNotificacao.EMAIL,
        titulo: 'Pagamento confirmado',
        mensagem: `Pagamento de R$ ${dados.valor.toFixed(2)} via ${metodoLegivel} foi confirmado para o pedido #${dados.pedidoId}.`,
        destinatarioId: dados.clienteId,
        destinatarioEmail: dados.clienteEmail,
        metadata: {
          pagamentoId: dados.pagamentoId,
          pedidoId: dados.pedidoId,
          valor: dados.valor,
          metodo: dados.metodo,
          evento: 'pagamento.confirmado',
        },
      });
    } catch (erro) {
      this.logger.error(`Erro ao processar pagamento.confirmado:`, erro);
    }
  }

  /**
   * Evento: Pergunta recebida no marketplace
   */
  @MessagePattern('marketplace.pergunta.recebida')
  async aoMarketplacePerguntaRecebida(
    @Payload()
    dados: {
      tenantId: string;
      perguntaId: string;
      produtoId: string;
      produtoNome: string;
      vendedorId: string;
      vendedorEmail: string;
      vendedorNome: string;
      compradorNome: string;
      pergunta: string;
    },
  ) {
    try {
      this.logger.log(`Pergunta recebida: ${dados.perguntaId}`);

      await this.notificacaoService.criarNotificacao(dados.tenantId, {
        tipo: TipoNotificacao.EMAIL,
        titulo: `Nova pergunta no produto "${dados.produtoNome}"`,
        mensagem: `${dados.compradorNome} perguntou: "${dados.pergunta}"`,
        destinatarioId: dados.vendedorId,
        destinatarioEmail: dados.vendedorEmail,
        metadata: {
          perguntaId: dados.perguntaId,
          produtoId: dados.produtoId,
          produtoNome: dados.produtoNome,
          compradorNome: dados.compradorNome,
          evento: 'marketplace.pergunta.recebida',
        },
      });
    } catch (erro) {
      this.logger.error(`Erro ao processar marketplace.pergunta.recebida:`, erro);
    }
  }

  /**
   * Evento: Pedido importado do marketplace
   */
  @MessagePattern('marketplace.pedido.importado')
  async aoMarketplacePedidoImportado(
    @Payload()
    dados: {
      tenantId: string;
      pedidoExternoId: string;
      pedidoInternoId: string;
      marketplaceNome: string;
      quantidadeProdutos: number;
      valorTotal: number;
      adminEmail?: string;
    },
  ) {
    try {
      this.logger.log(
        `Pedido importado do ${dados.marketplaceNome}: ${dados.pedidoExternoId}`,
      );

      if (dados.adminEmail) {
        await this.notificacaoService.criarNotificacao(dados.tenantId, {
          tipo: TipoNotificacao.EMAIL,
          titulo: `Novo pedido importado do ${dados.marketplaceNome}`,
          mensagem: `Pedido #${dados.pedidoExternoId} com ${dados.quantidadeProdutos} produtos no valor de R$ ${dados.valorTotal.toFixed(2)} foi importado com sucesso.`,
          destinatarioEmail: dados.adminEmail,
          metadata: {
            pedidoExternoId: dados.pedidoExternoId,
            pedidoInternoId: dados.pedidoInternoId,
            marketplaceNome: dados.marketplaceNome,
            quantidadeProdutos: dados.quantidadeProdutos,
            valorTotal: dados.valorTotal,
            evento: 'marketplace.pedido.importado',
          },
        });
      }
    } catch (erro) {
      this.logger.error(`Erro ao processar marketplace.pedido.importado:`, erro);
    }
  }
}
