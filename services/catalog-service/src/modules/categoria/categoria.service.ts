/**
 * Serviço de Categorias.
 *
 * Regras de negócio do domínio de categorias:
 * - Slug estável derivado do nome, único por tenant.
 * - Hierarquia simples: o nível é calculado a partir da categoria pai.
 * - Proteção contra ciclos ao reparentar.
 * - Soft delete via flag `ativa`, bloqueado quando há produtos/subcategorias.
 * - Cache com invalidação e publicação de evento no Kafka.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common'

import { CategoriaRepository } from './categoria.repository'
import { ProducerService } from '../../events/producer.service'
import { CacheService } from '../cache/cache.service'
import { CriarCategoriaDto } from '../../dtos/categoria/criar-categoria.dto'
import { AtualizarCategoriaDto } from '../../dtos/categoria/atualizar-categoria.dto'
import { ListarCategoriasDto } from '../../dtos/categoria/listar-categorias.dto'
import { gerarSlug } from '../../common/slug.util'
import { TOPICOS_CATALOGO } from '../../config/kafka.config'

@Injectable()
export class CategoriaService {
  constructor(
    private readonly repositorio: CategoriaRepository,
    private readonly producer: ProducerService,
    private readonly cache: CacheService,
  ) {}

  /** Cria uma nova categoria, resolvendo slug único e nível na árvore. */
  async criar(tenantId: string, dto: CriarCategoriaDto) {
    const slug = await this.resolverSlugUnico(tenantId, dto.nome)
    const nivel = await this.resolverNivel(tenantId, dto.categoriaPaiId)

    const categoria = await this.repositorio.criar(tenantId, {
      nome: dto.nome,
      slug,
      nivel,
      ativa: dto.ativa ?? true,
      categoriaPaiId: dto.categoriaPaiId,
    })

    await this.publicarAtualizacao(tenantId, categoria.id, 'criada')
    await this.invalidarCache(tenantId)

    return categoria
  }

  /** Lista categorias com paginação e filtros (envelope canônico). */
  async listar(tenantId: string, filtros: ListarCategoriasDto) {
    return this.repositorio.listar(tenantId, filtros)
  }

  /** Retorna a árvore completa de categorias do tenant. */
  async listarArvore(tenantId: string) {
    return this.repositorio.listarArvore(tenantId)
  }

  /** Busca categoria por ID; lança 404 se não existir no tenant. */
  async buscarPorId(tenantId: string, id: string) {
    const categoria = await this.repositorio.buscarPorId(tenantId, id)
    if (!categoria) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`)
    }
    return categoria
  }

  /** Atualiza uma categoria (nome/slug, status e/ou pai). */
  async atualizar(tenantId: string, id: string, dto: AtualizarCategoriaDto) {
    const atual = await this.buscarPorId(tenantId, id)

    const dados: Partial<{
      nome: string
      slug: string
      nivel: number
      ativa: boolean
      categoriaPaiId: string | null
    }> = {}

    if (dto.nome !== undefined && dto.nome !== atual.nome) {
      dados.nome = dto.nome
      dados.slug = await this.resolverSlugUnico(tenantId, dto.nome, id)
    }

    if (dto.ativa !== undefined) dados.ativa = dto.ativa

    // Reparentar: valida existência do pai, previne ciclos e recalcula o nível.
    if (dto.categoriaPaiId !== undefined && dto.categoriaPaiId !== atual.categoriaPaiId) {
      if (dto.categoriaPaiId === id) {
        throw new BadRequestException('Uma categoria não pode ser pai de si mesma')
      }
      if (dto.categoriaPaiId && (await this.ehDescendente(tenantId, id, dto.categoriaPaiId))) {
        throw new BadRequestException(
          'Não é possível mover a categoria para dentro de uma de suas subcategorias',
        )
      }
      dados.categoriaPaiId = dto.categoriaPaiId ?? null
      dados.nivel = await this.resolverNivel(tenantId, dto.categoriaPaiId)
    }

    const categoria = await this.repositorio.atualizar(tenantId, id, dados)

    await this.publicarAtualizacao(tenantId, id, 'atualizada')
    await this.invalidarCache(tenantId)

    return categoria
  }

  /**
   * Remove uma categoria (soft delete via flag `ativa`).
   *
   * Bloqueia a remoção quando existem produtos vinculados ou subcategorias,
   * para preservar a integridade referencial e a árvore.
   */
  async remover(tenantId: string, id: string) {
    await this.buscarPorId(tenantId, id)

    const [produtos, subcategorias] = await Promise.all([
      this.repositorio.contarProdutos(tenantId, id),
      this.repositorio.contarSubcategorias(tenantId, id),
    ])

    if (produtos > 0) {
      throw new ConflictException(
        `Não é possível remover: existem ${produtos} produto(s) vinculado(s) a esta categoria`,
      )
    }
    if (subcategorias > 0) {
      throw new ConflictException(
        `Não é possível remover: existem ${subcategorias} subcategoria(s). Remova-as primeiro`,
      )
    }

    await this.repositorio.desativar(tenantId, id)

    await this.publicarAtualizacao(tenantId, id, 'removida')
    await this.invalidarCache(tenantId)
  }

  // ── Auxiliares ──────────────────────────────────────────────────────────

  /**
   * Gera um slug único por tenant a partir do nome. Se já existir, acrescenta
   * um sufixo numérico incremental (`slug-2`, `slug-3`, ...). Ignora o próprio
   * registro em atualizações (`idIgnorar`).
   */
  private async resolverSlugUnico(tenantId: string, nome: string, idIgnorar?: string) {
    const base = gerarSlug(nome) || 'categoria'
    let candidato = base
    let sufixo = 1

    // Evita colisão de UNIQUE([tenantId, slug]).
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existente = await this.repositorio.buscarPorSlug(tenantId, candidato)
      if (!existente || existente.id === idIgnorar) return candidato
      sufixo += 1
      candidato = `${base}-${sufixo}`
    }
  }

  /** Calcula o nível na árvore: raiz = 0; filha = nível do pai + 1. */
  private async resolverNivel(tenantId: string, categoriaPaiId?: string): Promise<number> {
    if (!categoriaPaiId) return 0
    const pai = await this.repositorio.buscarPorId(tenantId, categoriaPaiId)
    if (!pai) {
      throw new BadRequestException(`Categoria pai ${categoriaPaiId} não encontrada`)
    }
    return pai.nivel + 1
  }

  /**
   * Verifica se `possivelDescendenteId` está na subárvore de `ancestralId`.
   * Usado para impedir ciclos ao reparentar.
   */
  private async ehDescendente(
    tenantId: string,
    ancestralId: string,
    possivelDescendenteId: string,
  ): Promise<boolean> {
    let atualId: string | null = possivelDescendenteId
    const visitados = new Set<string>()

    while (atualId) {
      if (atualId === ancestralId) return true
      if (visitados.has(atualId)) break // proteção contra dados já corrompidos
      visitados.add(atualId)

      const no = await this.repositorio.buscarPorId(tenantId, atualId)
      atualId = no?.categoriaPaiId ?? null
    }

    return false
  }

  /** Publica evento de categoria alterada no Kafka. */
  private async publicarAtualizacao(tenantId: string, categoriaId: string, acao: string) {
    await this.producer.publicar(
      TOPICOS_CATALOGO.CATEGORIA_ATUALIZADA,
      tenantId,
      TOPICOS_CATALOGO.CATEGORIA_ATUALIZADA,
      { categoriaId, acao },
    )
  }

  /** Invalida todas as chaves de cache de categorias do tenant. */
  private async invalidarCache(tenantId: string) {
    await this.cache.invalidarPorPrefixo(this.cache.gerarChave(tenantId, 'categorias'))
  }
}
