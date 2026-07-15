/**
 * Serviço de Variações de Produto (grade de tamanhos, padrão varejo BR).
 *
 * Responsável por:
 *  - listar as variações de um produto;
 *  - PREVER (gerar sem persistir) a matriz de variações a partir de uma grade:
 *    uma variação por tamanho, com SKU/nome/preço derivados automaticamente;
 *  - salvar variações em LOTE (upsert por SKU, em transação);
 *  - atualizar/remover uma variação individual.
 *
 * Isolamento por tenant: todo fluxo começa validando que o produto (e, na
 * previsão, a grade) pertence ao tenant. As variações herdam o isolamento do
 * produto (não têm tenantId próprio no schema).
 */

import { Injectable, NotFoundException } from '@nestjs/common'

import { ProdutoRepository } from './produto.repository'
import {
  VariacaoRepository,
  VariacaoUpsertInput,
  VariacaoUpdateInput,
} from './variacao.repository'
import { GradeRepository } from '../grade/grade.repository'
import { CacheService } from '../cache/cache.service'
import { PreverVariacoesDto } from '../../dtos/variacao/prever-variacoes.dto'
import { VariacaoItemDto } from '../../dtos/variacao/variacao-item.dto'
import { AtualizarVariacaoDto } from '../../dtos/variacao/atualizar-variacao.dto'
import { ProdutoVariacaoEmbutidaDto } from '../../dtos/variacao/produto-variacao-embutida.dto'
import { composeSkuVariacao, segmentoSku } from '../../common/sku.util'

/** Atributo gerado/gravado numa variação. */
export interface AtributoGerado {
  nome: string
  valor: string
}

/** Linha da matriz de variações prevista (ainda não persistida). */
export interface VariacaoPrevista {
  sku: string
  nome: string
  precoVenda: number | null
  gtin: null
  atributos: AtributoGerado[]
}

/** Nome padrão do atributo distintivo quando o usuário não informa outro. */
const ATRIBUTO_PADRAO = 'Cor'
/** Rótulo fixo do atributo de tamanho gravado em cada variação gerada. */
const ATRIBUTO_TAMANHO = 'Tamanho'

@Injectable()
export class VariacaoService {
  constructor(
    private readonly produtoRepository: ProdutoRepository,
    private readonly variacaoRepository: VariacaoRepository,
    private readonly gradeRepository: GradeRepository,
    private readonly cache: CacheService,
  ) {}

  /** Lista as variações de um produto (com atributos e imagens). */
  async listar(tenantId: string, produtoId: string) {
    await this.garantirProduto(tenantId, produtoId)
    return this.variacaoRepository.listarPorProduto(produtoId)
  }

  /**
   * Gera (sem persistir) a matriz de variações de um produto a partir de uma
   * grade: uma variação por tamanho da grade.
   *
   * Regras da spec:
   *  - SKU automático: `${produto.sku}-${VALOR_SLUG}-${TAMANHO}` (MAIÚSCULAS, sem
   *    espaços). Se o SKU colidir com uma variação já existente do produto — ou
   *    com outra linha da própria matriz gerada — recebe sufixo incremental
   *    (`-2`, `-3`, ...).
   *  - nome: `${valorAtributo} ${tamanho}`.
   *  - precoVenda: herdado do produto (editável depois pelo usuário).
   *  - gtin: null.
   *  - atributos: [{ nome: atributo, valor: valorAtributo }, { nome: 'Tamanho', valor: tamanho }].
   */
  async prever(
    tenantId: string,
    produtoId: string,
    dto: PreverVariacoesDto,
  ): Promise<VariacaoPrevista[]> {
    const produto = await this.garantirProduto(tenantId, produtoId)

    // Grade precisa existir E pertencer ao mesmo tenant.
    const grade = await this.gradeRepository.buscarPorId(tenantId, dto.gradeId)
    if (!grade) {
      throw new NotFoundException(`Grade com ID ${dto.gradeId} não encontrada`)
    }

    const nomeAtributo = (dto.atributo ?? ATRIBUTO_PADRAO).trim() || ATRIBUTO_PADRAO
    const valorAtributo = dto.valorAtributo.trim()
    const precoHerdado = produto.precoVenda != null ? Number(produto.precoVenda) : null

    // SKUs já usados por variações existentes do produto (evita colisão).
    const existentes = await this.variacaoRepository.listarPorProduto(produtoId)
    const skusUsados = new Set<string>(existentes.map((v) => v.sku.toUpperCase()))

    // Tamanhos vêm ordenados por `ordem` do repositório de grades.
    return grade.tamanhos.map((t) => {
      const skuBase = composeSkuVariacao(produto.sku, valorAtributo, t.valor)
      const sku = this.skuUnico(skuBase, skusUsados)
      skusUsados.add(sku.toUpperCase())

      return {
        sku,
        nome: `${valorAtributo} ${t.valor}`.trim(),
        precoVenda: precoHerdado,
        gtin: null,
        atributos: [
          { nome: nomeAtributo, valor: valorAtributo },
          { nome: ATRIBUTO_TAMANHO, valor: t.valor },
        ],
      }
    })
  }

  /**
   * Salva variações em LOTE (upsert por (produtoId, sku)) e devolve o estado
   * persistido. Invalida o cache do produto (o detalhe inclui variações).
   */
  async salvarLote(tenantId: string, produtoId: string, itens: VariacaoItemDto[]) {
    await this.garantirProduto(tenantId, produtoId)

    const normalizados = itens.map((i) => this.paraUpsert(i))
    const variacoes = await this.variacaoRepository.upsertLote(produtoId, normalizados)

    await this.invalidarCacheProduto(tenantId, produtoId)
    return variacoes
  }

  /**
   * Upsert das variações EMBUTIDAS no update de produto (fix do 400).
   *
   * Recebe os itens do shape tolerante (canônico OU legado da UI), normaliza
   * cada um para o shape canônico e persiste em lote. Itens que representam
   * "produto sem variação" (linha única `tipo='Única'` sem atributos) ou que não
   * têm dado suficiente para gerar um SKU são ignorados.
   *
   * Retorna as variações persistidas (ou a lista atual, se nada foi aplicável).
   * NÃO invalida cache aqui: o produto service faz a invalidação no fim do update.
   */
  async salvarLoteEmbutido(
    tenantId: string,
    produtoId: string,
    itens: ProdutoVariacaoEmbutidaDto[],
  ) {
    const produto = await this.garantirProduto(tenantId, produtoId)

    // SKUs já usados (existentes + os gerados neste lote) para evitar colisão.
    const existentes = await this.variacaoRepository.listarPorProduto(produtoId)
    const skusUsados = new Set<string>(existentes.map((v) => v.sku.toUpperCase()))

    const normalizados: VariacaoUpsertInput[] = []
    for (const item of itens) {
      const upsert = this.normalizarEmbutida(produto.sku, item, skusUsados)
      if (upsert) {
        skusUsados.add(upsert.sku.toUpperCase())
        normalizados.push(upsert)
      }
    }

    // Nada aplicável (ex.: só a linha "Única"): devolve o estado atual sem tocar.
    if (normalizados.length === 0) {
      return existentes
    }

    return this.variacaoRepository.upsertLote(produtoId, normalizados)
  }

  /** Atualiza UMA variação do produto (campos parciais + atributos opcionais). */
  async atualizarVariacao(
    tenantId: string,
    produtoId: string,
    variacaoId: string,
    dto: AtualizarVariacaoDto,
  ) {
    await this.garantirProduto(tenantId, produtoId)
    await this.garantirVariacao(produtoId, variacaoId)

    const dados: VariacaoUpdateInput = {}
    if (dto.sku !== undefined) dados.sku = dto.sku.trim()
    if (dto.nome !== undefined) dados.nome = dto.nome.trim()
    if (dto.gtin !== undefined) dados.gtin = dto.gtin?.trim() || null
    if (dto.precoVenda !== undefined) dados.precoVenda = dto.precoVenda
    if (dto.peso !== undefined) dados.peso = dto.peso
    if (dto.atributos !== undefined) {
      dados.atributos = dto.atributos.map((a) => ({ nome: a.nome.trim(), valor: a.valor.trim() }))
    }

    const variacao = await this.variacaoRepository.atualizar(produtoId, variacaoId, dados)

    await this.invalidarCacheProduto(tenantId, produtoId)
    return variacao
  }

  /** Remove UMA variação do produto (atributos/imagens saem em cascata). */
  async removerVariacao(tenantId: string, produtoId: string, variacaoId: string) {
    await this.garantirProduto(tenantId, produtoId)
    await this.garantirVariacao(produtoId, variacaoId)

    await this.variacaoRepository.remover(produtoId, variacaoId)
    await this.invalidarCacheProduto(tenantId, produtoId)
  }

  // ── Auxiliares ──────────────────────────────────────────────────────────

  /**
   * Converte um item de DTO (lote/update) para o shape de upsert do repositório,
   * fazendo trim de textos. Reutilizado pelo produto service no PUT com
   * `variacoes` (fix do 400).
   */
  paraUpsert(item: VariacaoItemDto): VariacaoUpsertInput {
    return {
      sku: item.sku.trim(),
      nome: item.nome.trim(),
      gtin: item.gtin?.trim() || null,
      precoVenda: item.precoVenda ?? null,
      peso: item.peso ?? null,
      atributos: (item.atributos ?? []).map((a) => ({
        nome: a.nome.trim(),
        valor: a.valor.trim(),
      })),
    }
  }

  /**
   * Normaliza um item de variação EMBUTIDA (shape tolerante) para o shape
   * canônico de upsert, ou retorna `null` quando o item não deve ser persistido.
   *
   * Regras:
   *  - ignora a linha "produto sem variação" (tipo 'Única' sem atributos próprios);
   *  - `sku`: usa o informado; senão compõe `${produto.sku}-${VALOR}` (a partir do
   *    `valor` legado) e desambigua com sufixo `-2` se colidir;
   *  - `nome`: usa o informado; senão `${valor}` (ou `${tipo} ${valor}`); senão o sku;
   *  - `precoVenda`: canônico `precoVenda` tem prioridade; cai para `preco` legado;
   *  - `atributos`: canônicos têm prioridade; senão deriva `[{ nome: tipo, valor }]`
   *    do par legado (quando tipo ≠ 'Única');
   *  - descarta `precoCusto`/`estoque` legados (não pertencem à variação do catálogo).
   */
  private normalizarEmbutida(
    skuProduto: string,
    item: ProdutoVariacaoEmbutidaDto,
    usados: Set<string>,
  ): VariacaoUpsertInput | null {
    const tipo = item.tipo?.trim()
    const valor = item.valor?.trim()
    const ehUnica = !tipo || tipo.toLowerCase() === 'única' || tipo.toLowerCase() === 'unica'

    // Atributos: canônicos têm prioridade; senão deriva do par legado tipo/valor.
    let atributos: AtributoGerado[] | undefined
    if (item.atributos && item.atributos.length > 0) {
      atributos = item.atributos.map((a) => ({ nome: a.nome.trim(), valor: a.valor.trim() }))
    } else if (!ehUnica && valor) {
      atributos = [{ nome: tipo!, valor }]
    }

    // Resolve o SKU: informado > composto do valor legado.
    let sku = item.sku?.trim() || ''
    if (!sku) {
      if (!valor) {
        // Linha "Única" (ou sem valor) e sem SKU: não há variação real a persistir.
        return null
      }
      sku = this.skuUnico(composeSkuVariacao(skuProduto, valor, ''), usados)
    } else {
      sku = this.skuUnico(sku, usados)
    }
    // Sanidade: SKU vazio após normalização não é persistível.
    if (!segmentoSku(sku)) return null

    // Nome: informado > valor (ou "tipo valor") > o próprio sku.
    const nome =
      item.nome?.trim() ||
      (valor ? (ehUnica ? valor : `${tipo} ${valor}`.trim()) : '') ||
      sku

    // Preço: canônico > legado.
    const precoVenda = item.precoVenda ?? item.preco ?? null

    return {
      sku,
      nome,
      gtin: item.gtin?.trim() || null,
      precoVenda,
      peso: item.peso ?? null,
      atributos: atributos ?? [],
    }
  }

  /**
   * Resolve um SKU único contra o conjunto de SKUs já usados (case-insensitive).
   * Mantém o SKU base quando livre; senão acrescenta `-2`, `-3`, ... conforme a
   * spec ("se já existir variação com mesmo sku no produto, sufixe -2").
   */
  private skuUnico(base: string, usados: Set<string>): string {
    if (!usados.has(base.toUpperCase())) return base
    let sufixo = 2
    let candidato = `${base}-${sufixo}`
    while (usados.has(candidato.toUpperCase())) {
      sufixo += 1
      candidato = `${base}-${sufixo}`
    }
    return candidato
  }

  /** Garante que o produto existe no tenant; retorna-o (para reuso do preço/sku). */
  private async garantirProduto(tenantId: string, produtoId: string) {
    const produto = await this.produtoRepository.buscarPorId(tenantId, produtoId)
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${produtoId} não encontrado`)
    }
    return produto
  }

  /** Garante que a variação existe e pertence ao produto. */
  private async garantirVariacao(produtoId: string, variacaoId: string) {
    const variacao = await this.variacaoRepository.buscarPorId(produtoId, variacaoId)
    if (!variacao) {
      throw new NotFoundException(`Variação com ID ${variacaoId} não encontrada neste produto`)
    }
    return variacao
  }

  /** Invalida os caches afetados por mudança de variação (item + listagens). */
  private async invalidarCacheProduto(tenantId: string, produtoId: string) {
    await this.cache.invalidar(this.cache.gerarChave(tenantId, 'produto', produtoId))
    await this.cache.invalidarPorPrefixo(this.cache.gerarChave(tenantId, 'produtos-lista'))
  }
}
