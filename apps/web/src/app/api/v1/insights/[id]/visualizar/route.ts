import { NextRequest, NextResponse } from 'next/server';

declare global { var __insightsMock: any[] | undefined; }

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const insight = globalThis.__insightsMock?.find(i => i.id === id);
  if (!insight) return NextResponse.json({ erro: 'Insight não encontrado' }, { status: 404 });
  insight.visualizado = true;
  return NextResponse.json({ ok: true });
}
