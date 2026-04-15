import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AnuncioRepository } from './anuncio.repository';
import { ContaMarketplaceRepository } from '../conta-marketplace/conta-marketplace.repository';
import { IntegracaoFactory } from '../integracao/integracao.factory';
import { ProdutorEventosService } from '../eventos/produtor-eventos.service';
import { CacheService } from '../cache/cache.service';
import { StatusAnuncioMarketplace } from '@prisma/client';

/**
 * Serviço de gerenciamento de anúncios no marketplace
 */
@Injectable()
export class AnuncioService {
  private readonly logger = new Logger(AnuncioService.name);

  constructor(
    private readonly repository: AnuncioRepository,
    private readonly contaRepository: ContaMarketplaceRepository,
    private readonly integracaoFactory: IntegracaoFactory,
    private readonly produtorEventos: ProdutorEventosService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Cria novo anúncio no marketplace
   */
  async criarAnuncio(tenantId: string, contaId: string, dados: any) {
    try {
      this.logger.log(`Criando anúncio: ${dados.titulo}`);

      const conta = await this.contaRepository.buscarPorId(contaId, tenantId);
      if (!conta) throw new NotFoundException('Conta não encontrada');

      const adapter = this.integracaoFactory.criar(conta.marketplace);
      const anuncioExterno = await adapter.criarAnuncio(dados);

      const anuncio = await this.repository.criar({
        tenantId,
        contaMarketplaceId: contaId,
        produtoId: dados.produtoId,
        variacaoId: dados.variacaoId,
        marketplaceItemId: anuncioExterno.id,
        titulo: anuncioExterno.titulo,
        descricao: anuncioExterno.descricao,
        preco: anuncioExterno.preco,
        precoPromocional: anuncioExterno.precoPromocional,
        estoque: anuncioExterno.estoque,
        status: StatusAnuncioMarketplace.ATIVO,
        url: anuncioExterno.url,
        categoria: anuncioExterno.categoria,
        fotos: anuncioExterno.fotos,
        atributos: anuncioExterno.atributos,
        metricas: anuncioExterno.metricas,
        ultimaSincronizacao: new Date(),
      });

      await this.produtorEventos.anuncioCriado(tenantId, {
        anuncioId: anuncio.id,
        marketplace: conta.marketplace,
        marketplaceItemId: anuncio.marketplaceItemId,
        produtoId: dados.produtoId,
      });

      return anuncio;
    } catch (erro) {
      this.logger.error(`Erro ao criar anúncio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Cria anúncio automaticamente (trigger de evento)
   */
  async criarAnuncioAutomatico(tenantId: string, contaId: string, dados: any) {
    // Lógica similar mas sem exigir dados completos
    return this.criarAnuncio(tenantId, contaId, dados);
  }

  /**
   * Atualiza anúncio
   */
  async atualizarAnuncio(tenantId: string, anuncioId: string, dados: any) {
    try {
      const anuncio = await this.repository.buscarPorId(anuncioId, tenantId);
      if (!anuncio) throw new NotFoundException('Anúncio não encontrado');

      const conta = await this.contaRepository.buscarPorId(
        anuncio.contaMarketplaceId,
        tenantId,
      );
      if (!conta) throw new NotFoundException('Conta não encontrada');

      const adapter = this.integracaoFactory.criar(conta.marketplace);
      await adapter.atualizarAnuncio(anuncio.marketplaceItemId, dados);

      const anuncioAtualizado = await this.repository.atualizar(anuncioId, {
        titulo: dados.titulo || anuncio.titulo,
        descricao: dados.descricao || anuncio.descricao,
        preco: dados.preco || anuncio.preco,
        precoPromocional: dados.precoPromocional || anuncio.precoPromocional,
        fotos: dados.fotos || anuncio.fotos,
        atributos: dados.atributos || anuncio.atributos,
        ultimaSincronizacao: new Date(),
      });

      await this.produtorEventos.anuncioAtualizado(tenantId, {
        anuncioId: anuncioId,
        marketplace: conta.marketplace,
      });

      return anuncioAtualizado;
    } catch (erro) {
      this.logger.error(`Erro ao atualizar anúncio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Pausa anúncio
   */
  async pausarAnuncio(tenantId: string, anuncioId: string) {
    try {
      const anuncio = await this.repository.buscarPorId(anuncioId, tenantId);
      if (!anuncio) throw new NotFoundException('Anúncio não encontrado');

      const conta = await this.contaRepository.buscarPorId(
        anuncio.contaMarketplaceId,
        tenantId,
      );

      const adapter = this.integracaoFactory.criar(conta.marketplace);
      await adapter.pausarAnuncio(anuncio.marketplaceItemId);

      return this.repository.atualizar(anuncioId, {
        status: StatusAnuncioMarketplace.PAUSADO,
      });
    } catch (erro) {
      this.logger.error(`Erro ao pausar anúncio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Reativa anúncio
   */
  async reativarAnuncio(tenantId: string, anuncioId: string) {
    try {
      const anuncio = await this.repository.buscarPorId(anuncioId, tenantId);
      if (!anuncio) throw new NotFoundException('Anúncio não encontrado');

      const conta = await this.contaRepository.buscarPorId(
        anuncio.contaMarketplaceId,
        tenantId,
      );

      const adapter = this.integracaoFactory.criar(conta.marketplace);
      await adapter.reativarAnuncio(anuncio.marketplaceItemId);

      return this.repository.atualizar(anuncioId, {
        status: StatusAnuncioMarketplace.ATIVO,
      });
    } catch (erro) {
      this.logger.error(`Erro ao reativar anúncio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Encerra anúncio
   */
  async encerrarAnuncio(tenantId: string, anuncioId: string) {
    try {
      const anuncio = await this.repository.buscarPorId(anuncioId, tenantId);
      if (!anuncio) throw new NotFoundException('Anúncio não encontrado');

      const conta = await this.contaRepository.buscarPorId(
        anuncio.contaMarketplaceId,
        tenantId,
      );

      const adapter = this.integracaoFactory.criar(conta.marketplace);
      await adapter.encerrarAnuncio(anuncio.marketplaceItemId);

      return this.repository.atualizar(anuncioId, {
        status: StatusAnuncioMarketplace.ENCERRADO,
      });
    } catch (erro) {
      this.logger.error(`Erro ao encerrar anúncio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Sincroniza estoque
   */
  async sincronizarEstoque(tenantId: string, anuncioId: string, quantidade: number) {
    try {
      const anuncio = await this.repository.buscarPorId(anuncioId, tenantId);
      if (!anuncio) throw new NotFoundException('Anúncio não encontrado');

      const conta = await this.contaRepository.buscarPorId(
        anuncio.contaMarketplaceId,
        tenantId,
      );

      const adapter = this.integracaoFactory.criar(conta.marketplace);
      await adapter.atualizarEstoque(anuncio.marketplaceItemId, quantidade);

      await this.repository.atualizar(anuncioId, {
        estoque: quantidade,
        ultimaSincronizacao: new Date(),
      });

      await this.produtorEventos.estoqueSincronizado(tenantId, {
        anuncioId,
        quantidade,
      });
    } catch (erro) {
      this.logger.error(`Erro ao sincronizar estoque: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Sincroniza preço
   */
  async sincronizarPreco(
    tenantId: string,
    anuncioId: string,
    preco: number,
    precoPromocional?: number,
  ) {
    try {
      const anuncio = await this.repository.buscarPorId(anuncioId, tenantId);
      if (!anuncio) throw new NotFoundException('Anúncio não encontrado');

      const conta = await this.contaRepository.buscarPorId(
        anuncio.contaMarketplaceId,
        tenantId,
      );

      const adapter = this.integracaoFactory.criar(conta.marketplace);
      await adapter.atualizarPreco(anuncio.marketplaceItemId, preco, precoPromocional);

      await this.repository.atualizar(anuncioId, {
        preco: preco as any,
        precoPromocional: precoPromocional as any,
        ultimaSincronizacao: new Date(),
      });

      await this.produtorEventos.precoSincronizado(tenantId, {
        anuncioId,
        preco,
        precoPromocional,
      });
    } catch (erro) {
      this.logger.error(`Erro ao sincronizar preço: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Lista anúncios
   */
  async listar(tenantId: string, filtros?: any) {
    return this.repository.listar(tenantId, filtros);
  }

  /**
   * Busca por ID
   */
  async buscarPorId(tenantId: string, anuncioId: string) {
    const anuncio = await this.repository.buscarPorId(anuncioId, tenantId);
    if (!anuncio) throw new NotFoundException('Anúncio não encontrado');
    return anuncio;
  }

  /**
   * Busca por produto ID
   */
  async buscarPorProdutoId(tenantId: string, produtoId: string) {
    return this.repository.buscarPorProdutoId(tenantId, produtoId);
  }

  /**
   * Busca contas ativas para criar anúncios
   */
  async buscarContasAtivas(tenantId: string) {
    return this.contaRepository.listarAtivas(tenantId);
  }
}
