/**
 * Serviço de Categorias Financeiras.
 * Lógica de negócio para categorias hierárquicas.
 */

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { CategoriaRepository } from './categoria.repository';
import { CacheService } from '../cache/cache.service';

interface CriarCategoriaInput {
  tenantId: string;
  nome: string;
  tipo: string;
  icone?: string;
  cor?: string;
  paiId?: string;
}

@Injectable()
export class CategoriaService {
  private readonly logger = new Logger('CategoriaService');

  constructor(
    private categoriaRepository: CategoriaRepository,
    private cache: CacheService,
  ) {}

  /**
   * Cria uma nova categoria.
   */
  async criar(input: CriarCategoriaInput) {
    if (!['RECEITA', 'DESPESA'].includes(input.tipo)) {
      throw new BadRequestException('Tipo de categoria inválido');
    }

    // Se tem pai, validar que existe
    if (input.paiId) {
      const pai = await this.categoriaRepository.buscarPorId(input.paiId, input.tenantId);
      if (!pai) {
        throw new NotFoundException('Categoria pai não encontrada');
      }
    }

    const categoria = await this.categoriaRepository.criar(input);

    // Limpar cache
    await this.cache.remover(`categorias:${input.tenantId}:${input.tipo}`);
    await this.cache.remover(`categorias_arvore:${input.tenantId}:${input.tipo}`);

    this.logger.log(`Categoria criada: ${categoria.id}`);

    return categoria;
  }

  /**
   * Busca categoria por ID.
   */
  async buscarPorId(id: string, tenantId: string) {
    const categoria = await this.categoriaRepository.buscarPorId(id, tenantId);
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return categoria;
  }

  /**
   * Lista categorias por tipo.
   */
  async listarPorTipo(tenantId: string, tipo: string) {
    const cacheKey = `categorias:${tenantId}:${tipo}`;
    const cacheado = await this.cache.obter<any>(cacheKey);
    if (cacheado) return cacheado;

    const categorias = await this.categoriaRepository.listarPorTipo(tenantId, tipo, true);

    // Cachear por 1 hora
    await this.cache.definir(cacheKey, categorias, 3600);

    return categorias;
  }

  /**
   * Obtém árvore hierárquica de categorias.
   */
  async obterArvore(tenantId: string, tipo: string) {
    const cacheKey = `categorias_arvore:${tenantId}:${tipo}`;
    const cacheado = await this.cache.obter<any>(cacheKey);
    if (cacheado) return cacheado;

    const arvore = await this.categoriaRepository.obterArvore(tenantId, tipo);

    // Cachear por 1 hora
    await this.cache.definir(cacheKey, arvore, 3600);

    return arvore;
  }

  /**
   * Atualiza categoria.
   */
  async atualizar(id: string, tenantId: string, dados: Partial<CriarCategoriaInput>) {
    await this.buscarPorId(id, tenantId); // Validar que existe

    const atualizada = await this.categoriaRepository.atualizar(id, tenantId, dados);

    // Limpar cache
    if (atualizada.tipo) {
      await this.cache.remover(`categorias:${tenantId}:${atualizada.tipo}`);
      await this.cache.remover(`categorias_arvore:${tenantId}:${atualizada.tipo}`);
    }

    this.logger.log(`Categoria atualizada: ${id}`);

    return atualizada;
  }

  /**
   * Desativa categoria.
   */
  async desativar(id: string, tenantId: string) {
    const categoria = await this.buscarPorId(id, tenantId);

    const desativada = await this.categoriaRepository.desativar(id, tenantId);

    // Limpar cache
    await this.cache.remover(`categorias:${tenantId}:${categoria.tipo}`);
    await this.cache.remover(`categorias_arvore:${tenantId}:${categoria.tipo}`);

    this.logger.log(`Categoria desativada: ${id}`);

    return desativada;
  }

  /**
   * Obtém categorias filhas.
   */
  async buscarFilhas(paiId: string) {
    return this.categoriaRepository.buscarFilhas(paiId);
  }
}
