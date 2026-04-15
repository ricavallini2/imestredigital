import { NextResponse } from 'next/server';
import { PRODUTOS_MOCK } from '../../produtos/_mock-data';
import { CLIENTES_CATALOGO } from '../_mock-data';

/**
 * Catálogo de produtos para pedidos/PDV.
 * Puxa diretamente do PRODUTOS_MOCK para manter variações e preços em sincronia.
 */
export async function GET() {
  const produtos = PRODUTOS_MOCK
    .filter((p) => p.status === 'ATIVO')
    .map((p) => {
      // Estoque total = soma das variações (se existirem) ou campo direto
      const estoqueTotal = p.variacoes.length > 0
        ? p.variacoes.reduce((s, v) => s + v.estoque, 0)
        : p.estoque;

      return {
        id: p.id,
        nome: p.nome,
        sku: p.sku,
        preco: p.preco,
        precoCusto: p.precoCusto,
        precoPromocional: p.precoPromocional,
        estoque: estoqueTotal,
        categoria: p.categoria,
        marca: p.marca,
        variacoes: p.variacoes.map((v) => ({
          id: v.id,
          tipo: v.tipo,
          valor: v.valor,
          sku: v.sku,
          preco: v.preco ?? p.preco, // fallback ao preço base
          estoque: v.estoque,
        })),
      };
    });

  return NextResponse.json({ produtos, clientes: CLIENTES_CATALOGO });
}
