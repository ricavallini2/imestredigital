/**
 * Serviço de Marcas.
 *
 * Regras de negócio do domínio de marcas:
 * - Slug estável derivado do nome, único por tenant.
 * - Soft delete via flag `ativa`, bloqueado quando há produtos vinculados.
 * - Cache com invalidação e publicação de evento no Kafka.
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'

import { MarcaRepository } from './marca.repository'
import { ProducerService } from '../../events/producer.service'
import { CacheService } from '../cache/cache.service'
import { CriarMarcaDto } from '../../dtos/marca/criar-marca.dto'
import { AtualizarMarcaDto } from '../../dtos/marca/atualizar-marca.dto'
import { ListarMarcasDto } from '../../dtos/marca/listar-marcas.dto'
import { gerarSlug } from '../../common/slug.util'
import { TOPICOS_CATALOGO } from '../../config/kafka.config'

@Injectable()
export class MarcaService {
  constructor(
    private readonly repositorio: MarcaRepository,
    private readonly producer: ProducerService,
    private readonly cache: CacheService,
  ) {}

  /** Cria uma nova marca, resolvendo slug único. */
  async criar(tenantId: string, dto: CriarMarcaDto) {
    const slug = await this.resolverSlugUnico(tenantId, dto.nome)

    const marca = await this.repositorio.criar(tenantId, {
      nome: dto.nome,
      slug,
      ativa: dto.ativa ?? true,
      logoUrl: dto.logoUrl,
    })

    await this.publicarAtualizacao(tenantId, marca.id, 'criada')
    await this.invalidarCache(tenantId)

    return marca
  }

  /** Lista marcas com paginação e filtros (envelope canônico). */
  async listar(tenantId: string, filtros: ListarMarcasDto) {
    return this.repositorio.listar(tenantId, filtros)
  }

  /** Busca marca por ID; lança 404 se não existir no tenant. */
  async buscarPorId(tenantId: string, id: string) {
    const marca = await this.repositorio.buscarPorId(tenantId, id)
    if (!marca) {
      throw new NotFoundException(`Marca com ID ${id} não encontrada`)
    }
    return marca
  }

  /** Atualiza uma marca (nome/slug, logo e/ou status). */
  async atualizar(tenantId: string, id: string, dto: AtualizarMarcaDto) {
    const atual = await this.buscarPorId(tenantId, id)

    const dados: Partial<{ nome: string; slug: string; ativa: boolean; logoUrl: string | null }> = {}

    if (dto.nome !== undefined && dto.nome !== atual.nome) {
      dados.nome = dto.nome
      dados.slug = await this.resolverSlugUnico(tenantId, dto.nome, id)
    }

    if (dto.ativa !== undefined) dados.ativa = dto.ativa
    if (dto.logoUrl !== undefined) dados.logoUrl = dto.logoUrl

    const marca = await this.repositorio.atualizar(tenantId, id, dados)

    await this.publicarAtualizacao(tenantId, id, 'atualizada')
    await this.invalidarCache(tenantId)

    return marca
  }

  /**
   * Remove uma marca (soft delete via flag `ativa`).
   *
   * Bloqueia a remoção quando existem produtos vinculados, para preservar
   * a integridade referencial.
   */
  async remover(tenantId: string, id: string) {
    await this.buscarPorId(tenantId, id)

    const produtos = await this.repositorio.contarProdutos(tenantId, id)
    if (produtos > 0) {
      throw new ConflictException(
        `Não é possível remover: existem ${produtos} produto(s) vinculado(s) a esta marca`,
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
    const base = gerarSlug(nome) || 'marca'
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

  /** Publica evento de marca alterada no Kafka. */
  private async publicarAtualizacao(tenantId: string, marcaId: string, acao: string) {
    await this.producer.publicar(
      TOPICOS_CATALOGO.MARCA_ATUALIZADA,
      tenantId,
      TOPICOS_CATALOGO.MARCA_ATUALIZADA,
      { marcaId, acao },
    )
  }

  /** Invalida todas as chaves de cache de marcas do tenant. */
  private async invalidarCache(tenantId: string) {
    await this.cache.invalidarPorPrefixo(this.cache.gerarChave(tenantId, 'marcas'))
  }
}
