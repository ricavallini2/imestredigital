import { NextRequest, NextResponse } from 'next/server'
import { findProduto } from '../../../_mock-data'
import {
  getVariacoes,
  setVariacoes,
  novaVariacaoId,
  agora,
  type VariacaoProdutoMock,
  type AtributoVariacaoMock,
} from '../_mock-data'

function normalizarAtributos(entrada: unknown): AtributoVariacaoMock[] {
  if (!Array.isArray(entrada)) return []
  return entrada
    .map((a) => {
      const obj = (a ?? {}) as Record<string, unknown>
      return { nome: String(obj.nome ?? '').trim(), valor: String(obj.valor ?? '').trim() }
    })
    .filter((a) => a.nome && a.valor)
}

/**
 * POST /api/v1/produtos/:id/variacoes/lote
 * Body: { variacoes: [{ id?, sku, nome, precoVenda?, gtin?, peso?, atributos[] }] }
 *
 * Upsert por SKU: variações com SKU já existente são atualizadas; as novas são
 * criadas. Retorna a lista completa de variações do produto após o merge.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const produto = findProduto(id)
  if (!produto) return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 })

  const body = await req.json()
  const entradas = Array.isArray(body.variacoes) ? body.variacoes : []
  if (entradas.length === 0) {
    return NextResponse.json({ message: 'Envie ao menos uma variação' }, { status: 400 })
  }

  // Validação: SKU obrigatório e sem duplicados no lote.
  const skus = entradas.map((v: Record<string, unknown>) => String(v.sku ?? '').trim())
  if (skus.some((s: string) => !s)) {
    return NextResponse.json({ message: 'Toda variação precisa de um SKU' }, { status: 400 })
  }
  const skusUpper = skus.map((s: string) => s.toUpperCase())
  if (new Set(skusUpper).size !== skusUpper.length) {
    return NextResponse.json({ message: 'Há SKUs duplicados no lote' }, { status: 400 })
  }

  const existentes = getVariacoes(id)
  const porSku = new Map(existentes.map((v) => [v.sku.toUpperCase(), v]))

  for (const bruto of entradas) {
    const v = bruto as Record<string, unknown>
    const sku = String(v.sku).trim()
    const chave = sku.toUpperCase()
    const anterior = porSku.get(chave)
    const registro: VariacaoProdutoMock = {
      id: anterior?.id ?? (v.id ? String(v.id) : novaVariacaoId()),
      produtoId: id,
      sku,
      nome: String(v.nome ?? '').trim() || sku,
      precoVenda: v.precoVenda != null && v.precoVenda !== '' ? Number(v.precoVenda) : undefined,
      gtin: v.gtin ? String(v.gtin).trim() : undefined,
      peso: v.peso != null && v.peso !== '' ? Number(v.peso) : undefined,
      atributos: normalizarAtributos(v.atributos),
      criadoEm: anterior?.criadoEm ?? agora(),
      atualizadoEm: agora(),
    }
    porSku.set(chave, registro)
  }

  const merged = Array.from(porSku.values())
  setVariacoes(id, merged)
  return NextResponse.json({ dados: merged })
}
