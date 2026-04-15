/**
 * Serviço de Produtos (COMPLETO).
 *
 * Lógica de negócio do domínio de produtos com:
 * - Publicação de eventos no Kafka
 * - Cache Redis com invalidação automática
 * - Isolamento por tenant
 * - Logging estruturado
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { ProdutoRepository } from './produto.repository';
import { ProducerService } from '../../events/producer.service';
import { CacheService } from '../cache/cache.service';
import { CriarProdutoDto } from '../../dtos/produto/criar-produto.dto';
import { AtualizarProdutoDto } from '../../dtos/produto/atualizar-produto.dto';
import { ListarProdutosDto } from '../../dtos/produto/listar-produtos.dto';
import { TOPICOS_CATALOGO } from '../../config/kafka.config';

@Injectable()
export class ProdutoService {
  constructor(
    private readonly produtoRepository: ProdutoRepository,
    private readonly producer: ProducerService,
    private readonly cache: CacheService,
  ) {}

  /**
   * Cria um novo produto no catálogo.
   *
   * Fluxo:
   * 1. Verifica se SKU já existe para o tenant
   * 2. Persiste no banco
   * 3. Publica evento PRODUTO_CRIADO no Kafka
   * 4. Invalida cache de listagem do tenant
   *
   * @param tenantId - ID do tenant (empresa)
   * @param dto - Dados do produto
   * @returns Produto criado com ID gerado
   */
  async criar(tenantId: string, dto: CriarProdutoDto) {
    // Verifica unicidade do SKU no tenant
    const skuExistente = await this.produtoRepository.buscarPorSku(tenantId, dto.sku);
    if (skuExistente) {
      throw new BadRequestException(`SKU "${dto.sku}" já está cadastrado nesta empresa`);
    }

    // Persiste no banco
    const produto = await this.produtoRepository.criar(tenantId, dto);

    // Publica evento para outros serviços
    await this.producer.publicar(
      TOPICOS_CATALOGO.PRODUTO_CRIADO,
      tenantId,
      TOPICOS_CATALOGO.PRODUTO_CRIADO,
      {
        produtoId: produto.id,
        sku: produto.sku,
        nome: produto.nome,
        precoVenda: produto.precoVenda,
        categoriaId: produto.categoriaId,
      },
    );

    // Invalida cache de listagem
    await this.cache.invalidar(this.cache.gerarChave(tenantId, 'produtos-lista'));

    console.log(`✅ Produto criado: ${produto.sku} [tenant: ${tenantId}]`);
    return produto;
  }

  /**
   * Lista produtos com paginação e filtros.
   * Resultado é cacheado por 2 minutos para otimizar performance.
   */
  async listar(tenantId: string, filtros: ListarProdutosDto) {
    // Para listagens com filtros, não usa cache (muitas variações)
    if (filtros.busca || filtros.status || filtros.categoriaId) {
      return this.produtoRepository.listar(tenantId, filtros);
    }

    // Listagem padrão (sem filtros): usa cache
    const chaveCache = this.cache.gerarChave(tenantId, 'produtos-lista');
    return this.cache.obterOuCarregar(
      chaveCache,
      () => this.produtoRepository.listar(tenantId, filtros),
      120, // 2 minutos
    );
  }

  /**
   * Busca um produto pelo ID com cache.
   * Cache individual por produto: 5 minutos.
   */
  async buscarPorId(tenantId: string, id: string) {
    const chaveCache = this.cache.gerarChave(tenantId, 'produto', id);

    const produto = await this.cache.obterOuCarregar(
      chaveCache,
      () => this.produtoRepository.buscarPorId(tenantId, id),
      300, // 5 minutos
    );

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return produto;
  }

  /**
   * Atualiza um produto existente.
   * Publica eventos específicos dependendo do que mudou.
   */
  async atualizar(tenantId: string, id: string, dto: AtualizarProdutoDto) {
    // Busca produto atual (verifica existência)
    const produtoAtual = await this.buscarPorId(tenantId, id);

    // Persiste atualização
    const produtoAtualizado = await this.produtoRepository.atualizar(tenantId, id, dto);

    // Publica evento genérico de atualização
    await this.producer.publicar(
      TOPICOS_CATALOGO.PRODUTO_ATUALIZADO,
      tenantId,
      TOPICOS_CATALOGO.PRODUTO_ATUALIZADO,
      {
        produtoId: id,
        camposAlterados: Object.keys(dto),
      },
    );

    // Se o preço mudou, publica evento específico de preço
    if (dto.precoVenda && dto.precoVenda !== produtoAtual.precoVenda) {
      await this.producer.publicar(
        TOPICOS_CATALOGO.PRECO_ALTERADO,
        tenantId,
        TOPICOS_CATALOGO.PRECO_ALTERADO,
        {
          produtoId: id,
          sku: produtoAtual.sku,
          precoAnterior: produtoAtual.precoVenda,
          precoNovo: dto.precoVenda,
        },
      );
    }

    // Invalida caches relacionados
    await this.cache.invalidar(this.cache.gerarChave(tenantId, 'produto', id));
    await this.cache.invalidar(this.cache.gerarChave(tenantId, 'produtos-lista'));

    console.log(`✏️ Produto atualizado: ${id} [tenant: ${tenantId}]`);
    return produtoAtualizado;
  }

  /**
   * Remove um produto (soft delete).
   * Marca como 'descontinuado' e publica evento.
   */
  async remover(tenantId: string, id: string) {
    const produto = await this.buscarPorId(tenantId, id);

    await this.produtoRepository.remover(tenantId, id);

    // Publica evento de remoção
    await this.producer.publicar(
      TOPICOS_CATALOGO.PRODUTO_REMOVIDO,
      tenantId,
      TOPICOS_CATALOGO.PRODUTO_REMOVIDO,
      {
        produtoId: id,
        sku: produto.sku,
      },
    );

    // Invalida caches
    await this.cache.invalidar(this.cache.gerarChave(tenantId, 'produto', id));
    await this.cache.invalidar(this.cache.gerarChave(tenantId, 'produtos-lista'));

    console.log(`🗑️ Produto removido: ${id} [tenant: ${tenantId}]`);
  }

  /**
   * Busca produtos por lista de IDs.
   * Usado internamente por outros serviços via Kafka.
   */
  async buscarPorIds(tenantId: string, ids: string[]) {
    return this.produtoRepository.buscarPorIds(tenantId, ids);
  }
}
