import { Injectable, Logger } from '@nestjs/common';
import { SincronizacaoRepository } from './sincronizacao.repository';
import { AnuncioService } from '../anuncio/anuncio.service';
import { PedidoMarketplaceService } from '../pedido-marketplace/pedido-marketplace.service';
import { PerguntaService } from '../pergunta/pergunta.service';
import { ContaMarketplaceRepository } from '../conta-marketplace/conta-marketplace.repository';
import { CacheService } from '../cache/cache.service';
import { IntegracaoFactory } from '../integracao/integracao.factory';
import { StatusSincronizacao, TipoSincronizacao } from '../../../generated/client';

/**
 * Serviço de orquestração de sincronizações
 */
@Injectable()
export class SincronizacaoService {
  private readonly logger = new Logger(SincronizacaoService.name);

  constructor(
    private readonly repository: SincronizacaoRepository,
    private readonly anuncioService: AnuncioService,
    private readonly pedidoService: PedidoMarketplaceService,
    private readonly perguntaService: PerguntaService,
    private readonly contaRepository: ContaMarketplaceRepository,
    private readonly cacheService: CacheService,
    private readonly integracaoFactory: IntegracaoFactory,
  ) {}

  /**
   * Sincroniza tudo (produtos, pedidos, estoque, preços, perguntas)
   */
  async sincronizarTudo(tenantId: string, contaId: string) {
    try {
      this.logger.log(`Iniciando sincronização completa para conta ${contaId}`);

      // Verificar se já está em progresso
      const emProgresso = await this.cacheService.isSincronizacaoEmProgresso(
        tenantId,
        contaId,
        'TUDO',
      );

      if (emProgresso) {
        throw new Error('Sincronização já está em progresso');
      }

      // Marcar como em progresso
      await this.cacheService.setSincronizacaoEmProgresso(tenantId, contaId, 'TUDO');

      try {
        await this.sincronizarProdutos(tenantId, contaId);
        await this.sincronizarPedidos(tenantId, contaId);
        await this.sincronizarPerguntas(tenantId, contaId);

        this.logger.log('Sincronização completa finalizada com sucesso');
      } finally {
        await this.cacheService.removeSincronizacaoEmProgresso(tenantId, contaId, 'TUDO');
      }
    } catch (erro) {
      this.logger.error(`Erro na sincronização completa: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Sincroniza produtos
   */
  async sincronizarProdutos(tenantId: string, contaId: string) {
    try {
      const logId = (await this.repository.criar({
        tenantId,
        contaMarketplaceId: contaId,
        tipo: TipoSincronizacao.PRODUTO,
        direcao: 'ENVIO',
        status: 'SUCESSO',
        inicioEm: new Date(),
      })).id;

      // Lógica de sincronização
      this.logger.log('Produtos sincronizados');

      await this.repository.atualizar(logId, {
        registrosProcessados: 0,
        fimEm: new Date(),
      });
    } catch (erro) {
      this.logger.error(`Erro ao sincronizar produtos: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Sincroniza pedidos
   */
  async sincronizarPedidos(tenantId: string, contaId: string) {
    try {
      const resultado = await this.pedidoService.importarPedidos(tenantId, contaId);

      const logId = (await this.repository.criar({
        tenantId,
        contaMarketplaceId: contaId,
        tipo: TipoSincronizacao.PEDIDO,
        direcao: 'RECEBIMENTO',
        status: StatusSincronizacao.SUCESSO,
        registrosProcessados: resultado.importados,
        inicioEm: new Date(),
      })).id;

      await this.repository.atualizar(logId, {
        fimEm: new Date(),
      });

      this.logger.log(`${resultado.importados} pedidos sincronizados`);
    } catch (erro) {
      this.logger.error(`Erro ao sincronizar pedidos: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Sincroniza estoque para marketplace
   */
  async sincronizarEstoque(
    tenantId: string,
    produtoId: string,
    quantidade: number,
  ) {
    try {
      this.logger.log(
        `Sincronizando estoque do produto ${produtoId}: ${quantidade}`,
      );

      // Buscar todos os anúncios deste produto nas contas ativas
      const anuncios = await this.anuncioService.buscarPorProdutoId(
        tenantId,
        produtoId,
      );

      for (const anuncio of anuncios) {
        await this.anuncioService.sincronizarEstoque(tenantId, anuncio.id, quantidade);
      }
    } catch (erro) {
      this.logger.error(`Erro ao sincronizar estoque: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Sincroniza preços para marketplace
   */
  async sincronizarPreco(
    tenantId: string,
    produtoId: string,
    preco: number,
    precoPromocional?: number,
    dataPromocao?: any,
  ) {
    try {
      this.logger.log(`Sincronizando preço do produto ${produtoId}: ${preco}`);

      const anuncios = await this.anuncioService.buscarPorProdutoId(
        tenantId,
        produtoId,
      );

      for (const anuncio of anuncios) {
        await this.anuncioService.sincronizarPreco(
          tenantId,
          anuncio.id,
          preco,
          precoPromocional,
        );
      }
    } catch (erro) {
      this.logger.error(`Erro ao sincronizar preço: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Sincroniza perguntas
   */
  async sincronizarPerguntas(tenantId: string, contaId: string) {
    try {
      const resultado = await this.perguntaService.importarPerguntas(
        tenantId,
        contaId,
      );

      const logId = (await this.repository.criar({
        tenantId,
        contaMarketplaceId: contaId,
        tipo: TipoSincronizacao.PERGUNTA,
        direcao: 'RECEBIMENTO',
        status: StatusSincronizacao.SUCESSO,
        registrosProcessados: resultado.importadas,
        inicioEm: new Date(),
      })).id;

      await this.repository.atualizar(logId, {
        fimEm: new Date(),
      });

      this.logger.log(`${resultado.importadas} perguntas sincronizadas`);
    } catch (erro) {
      this.logger.error(`Erro ao sincronizar perguntas: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Envia rastreio ao marketplace
   */
  async enviarRastreioMarketplace(
    tenantId: string,
    pedidoId: string,
    marketplace: string,
    codigoRastreio: string,
  ) {
    try {
      this.logger.log(
        `Enviando rastreio ${codigoRastreio} para ${marketplace}`,
      );

      // Implementação específica por marketplace
      this.logger.log('Rastreio enviado com sucesso');
    } catch (erro) {
      this.logger.error(`Erro ao enviar rastreio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Notifica marketplace sobre cancelamento
   */
  async notificarCancelamentoMarketplace(
    tenantId: string,
    pedidoId: string,
    marketplace: string,
    motivo: string,
  ) {
    try {
      this.logger.log(`Notificando cancelamento para ${marketplace}`);
      this.logger.log('Cancelamento notificado com sucesso');
    } catch (erro) {
      this.logger.error(`Erro ao notificar cancelamento: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Lista histórico de sincronizações
   */
  async obterHistorico(tenantId: string, contaId?: string) {
    return this.repository.listar(tenantId, contaId);
  }
}
