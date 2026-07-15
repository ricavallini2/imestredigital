/**
 * Repositório de Variações de Produto.
 *
 * O isolamento por tenant é garantido no service (que valida que o produto
 * pertence ao tenant antes de delegar). Aqui as operações são escopadas por
 * `produtoId` — e as de update/delete confirmam o vínculo produtoId+variacaoId,
 * de modo que uma variação de outro produto nunca seja afetada.
 *
 * As variações são sempre retornadas com atributos e imagens ordenados.
 */

import { Injectable } from '@nestjs/common'
import { Prisma } from '../../../generated/client'

import { PrismaService } from '../prisma/prisma.service'

/** Include padrão: atributos + imagens ordenadas por `ordem`. */
const INCLUDE_VARIACAO = {
  atributos: true,
  imagens: { orderBy: { ordem: 'asc' } },
} satisfies Prisma.VariacaoProdutoInclude

/** Shape normalizado de um item de variação para upsert. */
export interface VariacaoUpsertInput {
  sku: string
  nome: string
  gtin?: string | null
  precoVenda?: number | null
  peso?: number | null
  atributos?: { nome: string; valor: string }[]
}

/** Campos atualizáveis de uma variação individual (todos opcionais). */
export interface VariacaoUpdateInput {
  sku?: string
  nome?: string
  gtin?: string | null
  precoVenda?: number | null
  peso?: number | null
  atributos?: { nome: string; valor: string }[]
}

@Injectable()
export class VariacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Lista as variações de um produto (com atributos e imagens). */
  async listarPorProduto(produtoId: string) {
    return this.prisma.variacaoProduto.findMany({
      where: { produtoId },
      include: INCLUDE_VARIACAO,
      orderBy: { criadoEm: 'asc' },
    })
  }

  /** Busca uma variação pelo par produtoId + variacaoId (vínculo garantido). */
  async buscarPorId(produtoId: string, variacaoId: string) {
    return this.prisma.variacaoProduto.findFirst({
      where: { id: variacaoId, produtoId },
      include: INCLUDE_VARIACAO,
    })
  }

  /**
   * Upsert em LOTE por (produtoId, sku), tudo dentro de uma única transação.
   *
   * Para cada item:
   *  - se já existe variação com o mesmo SKU no produto → atualiza os campos e
   *    SUBSTITUI os atributos (apaga os antigos e recria a lista enviada);
   *  - senão → cria a variação com seus atributos.
   *
   * Ao final, relê e retorna todas as variações do produto (estado consistente).
   */
  async upsertLote(produtoId: string, itens: VariacaoUpsertInput[]) {
    await this.prisma.$transaction(async (tx) => {
      // Mapa SKU → id das variações já existentes no produto.
      const existentes = await tx.variacaoProduto.findMany({
        where: { produtoId },
        select: { id: true, sku: true },
      })
      const idPorSku = new Map(existentes.map((v) => [v.sku, v.id]))

      for (const item of itens) {
        const atributos = item.atributos ?? []
        const idExistente = idPorSku.get(item.sku)

        if (idExistente) {
          // Atualiza a variação e regrava os atributos do zero.
          await tx.variacaoProduto.update({
            where: { id: idExistente },
            data: {
              nome: item.nome,
              gtin: item.gtin ?? null,
              precoVenda: item.precoVenda ?? null,
              peso: item.peso ?? null,
            },
          })
          await tx.atributoVariacao.deleteMany({ where: { variacaoId: idExistente } })
          if (atributos.length > 0) {
            await tx.atributoVariacao.createMany({
              data: atributos.map((a) => ({ variacaoId: idExistente, nome: a.nome, valor: a.valor })),
            })
          }
        } else {
          // Cria a variação com seus atributos aninhados.
          const criada = await tx.variacaoProduto.create({
            data: {
              produtoId,
              sku: item.sku,
              nome: item.nome,
              gtin: item.gtin ?? null,
              precoVenda: item.precoVenda ?? null,
              peso: item.peso ?? null,
              atributos:
                atributos.length > 0
                  ? { create: atributos.map((a) => ({ nome: a.nome, valor: a.valor })) }
                  : undefined,
            },
            select: { id: true, sku: true },
          })
          // Registra o SKU recém-criado para deduplicar itens repetidos no lote.
          idPorSku.set(criada.sku, criada.id)
        }
      }
    })

    return this.listarPorProduto(produtoId)
  }

  /**
   * Atualiza UMA variação (campos parciais). Quando `atributos` é fornecido,
   * substitui integralmente a lista de atributos. Escopado por produtoId para
   * não afetar variações de outros produtos.
   */
  async atualizar(produtoId: string, variacaoId: string, dados: VariacaoUpdateInput) {
    await this.prisma.$transaction(async (tx) => {
      const campos: Prisma.VariacaoProdutoUpdateInput = {}
      if (dados.sku !== undefined) campos.sku = dados.sku
      if (dados.nome !== undefined) campos.nome = dados.nome
      if (dados.gtin !== undefined) campos.gtin = dados.gtin
      if (dados.precoVenda !== undefined) campos.precoVenda = dados.precoVenda
      if (dados.peso !== undefined) campos.peso = dados.peso

      if (Object.keys(campos).length > 0) {
        // updateMany permite escopar por produtoId (segurança de vínculo).
        await tx.variacaoProduto.updateMany({
          where: { id: variacaoId, produtoId },
          data: campos,
        })
      }

      if (dados.atributos !== undefined) {
        await tx.atributoVariacao.deleteMany({ where: { variacaoId } })
        if (dados.atributos.length > 0) {
          await tx.atributoVariacao.createMany({
            data: dados.atributos.map((a) => ({ variacaoId, nome: a.nome, valor: a.valor })),
          })
        }
      }
    })

    return this.buscarPorId(produtoId, variacaoId)
  }

  /**
   * Remove UMA variação. Atributos e imagens saem em cascata (onDelete: Cascade
   * no schema). Escopado por produtoId para não remover variação de outro produto.
   */
  async remover(produtoId: string, variacaoId: string) {
    return this.prisma.variacaoProduto.deleteMany({
      where: { id: variacaoId, produtoId },
    })
  }
}
