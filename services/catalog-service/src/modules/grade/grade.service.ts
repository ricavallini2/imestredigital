/**
 * Serviço de Grades de Tamanhos.
 *
 * Regras de negócio do domínio de grades (padrão varejo BR):
 * - Nome único por tenant (unique [tenantId, nome]) — colisão vira 409.
 * - Lista de tamanhos ORDENADA: a posição no array define a `ordem` (a sequência
 *   de varejo nem sempre é ordenável — ex: PP, P, M, G, GG).
 * - Normalização: cada tamanho é trimado; vazios são descartados; duplicados
 *   (mesmo valor) são colapsados preservando a primeira ocorrência.
 * - Atualização com substituição inteligente dos tamanhos (delegada ao repo).
 * - Soft delete via flag `ativa`.
 * - Cache com invalidação por prefixo do tenant.
 *
 * Grade é um recurso de configuração do catálogo (não dispara eventos de
 * domínio no Kafka — nenhum outro serviço reage a mudanças de grade).
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common'

import { GradeRepository, TamanhoOrdenado } from './grade.repository'
import { CacheService } from '../cache/cache.service'
import { CriarGradeDto } from '../../dtos/grade/criar-grade.dto'
import { AtualizarGradeDto } from '../../dtos/grade/atualizar-grade.dto'
import { ListarGradesDto } from '../../dtos/grade/listar-grades.dto'

@Injectable()
export class GradeService {
  constructor(
    private readonly repositorio: GradeRepository,
    private readonly cache: CacheService,
  ) {}

  /** Cria uma nova grade com seus tamanhos ordenados. */
  async criar(tenantId: string, dto: CriarGradeDto) {
    await this.garantirNomeDisponivel(tenantId, dto.nome)

    const tamanhos = this.normalizarTamanhos(dto.tamanhos)

    const grade = await this.repositorio.criar(tenantId, {
      nome: dto.nome.trim(),
      descricao: dto.descricao?.trim() || undefined,
      ativa: dto.ativa ?? true,
      tamanhos,
    })

    await this.invalidarCache(tenantId)
    return grade
  }

  /** Lista grades com paginação e filtros (envelope canônico). */
  async listar(tenantId: string, filtros: ListarGradesDto) {
    return this.repositorio.listar(tenantId, filtros)
  }

  /** Busca grade por ID; lança 404 se não existir no tenant. */
  async buscarPorId(tenantId: string, id: string) {
    const grade = await this.repositorio.buscarPorId(tenantId, id)
    if (!grade) {
      throw new NotFoundException(`Grade com ID ${id} não encontrada`)
    }
    return grade
  }

  /** Atualiza uma grade (nome/descricao/ativa e/ou substituição dos tamanhos). */
  async atualizar(tenantId: string, id: string, dto: AtualizarGradeDto) {
    const atual = await this.buscarPorId(tenantId, id)

    const dados: Partial<{ nome: string; descricao: string | null; ativa: boolean }> = {}

    if (dto.nome !== undefined && dto.nome.trim() !== atual.nome) {
      await this.garantirNomeDisponivel(tenantId, dto.nome, id)
      dados.nome = dto.nome.trim()
    }

    if (dto.descricao !== undefined) {
      dados.descricao = dto.descricao.trim() || null
    }

    if (dto.ativa !== undefined) dados.ativa = dto.ativa

    // Só recalcula tamanhos quando a lista foi enviada.
    const tamanhos = dto.tamanhos ? this.normalizarTamanhos(dto.tamanhos) : undefined

    const grade = await this.repositorio.atualizar(tenantId, id, dados, tamanhos)

    await this.invalidarCache(tenantId)
    return grade
  }

  /** Remove uma grade (soft delete via flag `ativa`). */
  async remover(tenantId: string, id: string) {
    await this.buscarPorId(tenantId, id)
    await this.repositorio.desativar(tenantId, id)
    await this.invalidarCache(tenantId)
  }

  // ── Auxiliares ──────────────────────────────────────────────────────────

  /**
   * Normaliza a lista de tamanhos preservando a ordem de envio:
   *  - faz trim de cada valor;
   *  - descarta entradas vazias;
   *  - colapsa duplicados (mesmo valor) mantendo a primeira ocorrência;
   *  - atribui `ordem` sequencial (0, 1, 2, ...) conforme a posição final.
   *
   * Lança 400 se, após a limpeza, não sobrar nenhum tamanho válido.
   */
  private normalizarTamanhos(valores: string[]): TamanhoOrdenado[] {
    const vistos = new Set<string>()
    const resultado: TamanhoOrdenado[] = []

    for (const bruto of valores) {
      const valor = (bruto ?? '').trim()
      if (!valor) continue
      if (vistos.has(valor)) continue
      vistos.add(valor)
      resultado.push({ valor, ordem: resultado.length })
    }

    if (resultado.length === 0) {
      throw new BadRequestException('Informe pelo menos um tamanho válido')
    }

    return resultado
  }

  /**
   * Garante que o nome esteja disponível no tenant (unique [tenantId, nome]).
   * Ignora o próprio registro em atualizações (`idIgnorar`).
   */
  private async garantirNomeDisponivel(tenantId: string, nome: string, idIgnorar?: string) {
    const existente = await this.repositorio.buscarPorNome(tenantId, nome.trim())
    if (existente && existente.id !== idIgnorar) {
      throw new ConflictException(`Já existe uma grade com o nome "${nome.trim()}" nesta empresa`)
    }
  }

  /** Invalida todas as chaves de cache de grades do tenant. */
  private async invalidarCache(tenantId: string) {
    await this.cache.invalidarPorPrefixo(this.cache.gerarChave(tenantId, 'grades'))
  }
}
