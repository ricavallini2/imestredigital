import { NextRequest, NextResponse } from 'next/server'
import { findProduto } from '../../../_mock-data'
import { findGrade } from '../../../../grades/_mock-data'
import { slugUpper } from '../_mock-data'

/**
 * POST /api/v1/produtos/:id/variacoes/prever
 * Body: { atributo, valorAtributo, gradeId }
 *
 * Gera a matriz (uma variação por tamanho da grade) sem persistir:
 *   sku        = ${produto.sku}-${VALOR_SLUG}-${TAMANHO_SLUG}
 *   nome       = ${valorAtributo} ${tamanho}
 *   precoVenda = produto.preco (herdado, editável)
 *   atributos  = [{nome: atributo, valor: valorAtributo}, {nome:'Tamanho', valor: tamanho}]
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const produto = findProduto(id)
  if (!produto) return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 })

  const body = await req.json()
  const atributo = String(body.atributo ?? 'Cor').trim() || 'Cor'
  const valorAtributo = String(body.valorAtributo ?? '').trim()
  const gradeId = String(body.gradeId ?? '')

  if (!valorAtributo) {
    return NextResponse.json({ message: 'valorAtributo é obrigatório' }, { status: 400 })
  }
  const grade = findGrade(gradeId)
  if (!grade) return NextResponse.json({ message: 'Grade não encontrada' }, { status: 404 })
  if (grade.tamanhos.length === 0) {
    return NextResponse.json({ message: 'A grade não possui tamanhos' }, { status: 400 })
  }

  const skuBase = produto.sku
  const valorSlug = slugUpper(valorAtributo)
  const precoHerdado = produto.preco ?? 0

  const dados = [...grade.tamanhos]
    .sort((a, b) => a.ordem - b.ordem)
    .map((t) => {
      const tamanhoSlug = slugUpper(t.valor)
      return {
        sku: [skuBase, valorSlug, tamanhoSlug].filter(Boolean).join('-'),
        nome: `${valorAtributo} ${t.valor}`,
        precoVenda: precoHerdado,
        gtin: undefined as string | undefined,
        atributos: [
          { nome: atributo, valor: valorAtributo },
          { nome: 'Tamanho', valor: t.valor },
        ],
      }
    })

  return NextResponse.json({ dados })
}
