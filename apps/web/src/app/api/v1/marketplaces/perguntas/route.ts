import { NextRequest, NextResponse } from 'next/server';
import { PERGUNTAS_MOCK, PerguntaMock } from '../_mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const canal  = searchParams.get('canal')  ?? '';
  const status = searchParams.get('status') ?? '';
  const busca  = searchParams.get('busca')?.toLowerCase() ?? '';

  let lista: PerguntaMock[] = [...PERGUNTAS_MOCK];

  if (canal)  lista = lista.filter((p) => p.canal === canal);
  if (status) lista = lista.filter((p) => p.status === status);
  if (busca) {
    lista = lista.filter(
      (p) =>
        p.pergunta.toLowerCase().includes(busca) ||
        p.tituloAnuncio.toLowerCase().includes(busca) ||
        p.comprador.toLowerCase().includes(busca),
    );
  }

  // Ordena: URGENTE primeiro, depois por data (mais recentes primeiro)
  lista.sort((a, b) => {
    if (a.prioridade === 'URGENTE' && b.prioridade !== 'URGENTE') return -1;
    if (b.prioridade === 'URGENTE' && a.prioridade !== 'URGENTE') return 1;
    return new Date(b.dataPergunta).getTime() - new Date(a.dataPergunta).getTime();
  });

  const total    = lista.length;
  const pendentes = lista.filter((p) => p.status === 'PENDENTE').length;

  return NextResponse.json({ dados: lista, total, pendentes });
}
