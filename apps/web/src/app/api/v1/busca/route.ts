import { NextRequest, NextResponse } from 'next/server';
import { PEDIDOS_MOCK } from '../pedidos/_mock-data';
import { CLIENTES_MOCK } from '../clientes/_mock-data';

// Importação dinâmica de produtos via globalThis
declare global { var __produtosMock: any[] | undefined; }

/**
 * GET /api/v1/busca?q=...&limit=5
 * Busca global cross-módulo: produtos, pedidos e clientes.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '5'), 10);

  if (q.length < 2) return NextResponse.json({ produtos: [], pedidos: [], clientes: [] });

  const lower = q.toLowerCase();

  // ─── Produtos ────────────────────────────────────────────────────────────────
  const produtos = (globalThis.__produtosMock ?? [])
    .filter((p: any) =>
      p.nome?.toLowerCase().includes(lower) ||
      p.sku?.toLowerCase().includes(lower) ||
      p.ean?.toLowerCase().includes(lower) ||
      p.marca?.toLowerCase().includes(lower) ||
      p.categoria?.toLowerCase().includes(lower) ||
      p.tags?.some((t: string) => t.toLowerCase().includes(lower))
    )
    .slice(0, limit)
    .map((p: any) => ({
      id: p.id, nome: p.nome, sku: p.sku, preco: p.preco,
      estoque: p.estoque, status: p.status, categoria: p.categoria,
      href: `/dashboard/produtos/${p.id}`,
    }));

  // ─── Pedidos ─────────────────────────────────────────────────────────────────
  const pedidos = PEDIDOS_MOCK
    .filter(p =>
      p.numero?.toLowerCase().includes(lower) ||
      p.cliente?.toLowerCase().includes(lower) ||
      p.clienteEmail?.toLowerCase().includes(lower) ||
      p.canal?.toLowerCase().includes(lower) ||
      p.status?.toLowerCase().includes(lower) ||
      p.itensList?.some((i: any) => i.produto?.toLowerCase().includes(lower))
    )
    .slice(0, limit)
    .map(p => ({
      id: p.id, numero: p.numero, cliente: p.cliente,
      valor: p.valor, status: p.status, canal: p.canal, criadoEm: p.criadoEm,
      href: `/dashboard/pedidos/${p.id}`,
    }));

  // ─── Clientes ────────────────────────────────────────────────────────────────
  const clientes = (CLIENTES_MOCK as any[])
    .filter((c: any) =>
      c.nome?.toLowerCase().includes(lower) ||
      c.razaoSocial?.toLowerCase().includes(lower) ||
      c.email?.toLowerCase().includes(lower) ||
      c.cnpj?.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
      c.cpf?.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
      c.telefone?.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
    )
    .slice(0, limit)
    .map((c: any) => ({
      id: c.id, nome: c.nome, email: c.email, tipo: c.tipo,
      totalCompras: c.totalCompras, status: c.status,
      href: `/dashboard/clientes/${c.id}`,
    }));

  return NextResponse.json({ produtos, pedidos, clientes });
}
