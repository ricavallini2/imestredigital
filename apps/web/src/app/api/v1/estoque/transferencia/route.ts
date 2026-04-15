import { NextRequest, NextResponse } from 'next/server';
import { SALDOS_MOCK, MOVIMENTACOES_MOCK, DEPOSITOS_MOCK, calcularStatus } from '../_mock-data';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { produtoId, depositoOrigemId, depositoDestinoId, variacaoId, quantidade, motivo, responsavel = 'Usuário' } = body;

  if (!produtoId || !depositoOrigemId || !depositoDestinoId || !quantidade || quantidade <= 0) {
    return NextResponse.json({ message: 'produtoId, depositoOrigemId, depositoDestinoId e quantidade são obrigatórios' }, { status: 400 });
  }
  if (depositoOrigemId === depositoDestinoId) {
    return NextResponse.json({ message: 'Depósito de origem e destino não podem ser iguais' }, { status: 400 });
  }

  const origem = SALDOS_MOCK.find((s) =>
    s.produtoId === produtoId &&
    s.depositoId === depositoOrigemId &&
    (!variacaoId || s.variacaoId === variacaoId)
  );
  if (!origem) return NextResponse.json({ message: 'Saldo de origem não encontrado' }, { status: 404 });
  if (origem.disponivel < quantidade) {
    return NextResponse.json({ message: `Estoque insuficiente na origem. Disponível: ${origem.disponivel}` }, { status: 422 });
  }

  const depOrigem = DEPOSITOS_MOCK.find((d) => d.id === depositoOrigemId);
  const depDestino = DEPOSITOS_MOCK.find((d) => d.id === depositoDestinoId);

  // Reduz na origem
  origem.fisico -= quantidade;
  origem.disponivel = origem.fisico - origem.reservado;
  origem.status = calcularStatus(origem.fisico, origem.minimo);

  // Aumenta no destino (cria saldo se não existir para esse depósito+variação)
  let destino = SALDOS_MOCK.find((s) =>
    s.produtoId === produtoId &&
    s.depositoId === depositoDestinoId &&
    (!variacaoId || s.variacaoId === variacaoId)
  );
  if (!destino) {
    destino = {
      id: `s${Date.now()}`, produtoId, produto: origem.produto, sku: origem.sku,
      variacaoId: origem.variacaoId, variacao: origem.variacao,
      depositoId: depositoDestinoId, deposito: depDestino?.nome ?? depositoDestinoId,
      fisico: 0, reservado: 0, disponivel: 0, minimo: origem.minimo, maximo: origem.maximo,
      custo: origem.custo, preco: origem.preco, giro30d: 0, status: 'SEM_ESTOQUE',
    };
    SALDOS_MOCK.push(destino);
  }
  destino.fisico += quantidade;
  destino.disponivel = destino.fisico - destino.reservado;
  destino.status = calcularStatus(destino.fisico, destino.minimo);

  const mov = {
    id: `mov-${Date.now()}`, tipo: 'TRANSFERENCIA' as const,
    produtoId, produto: origem.produto, sku: origem.sku,
    variacaoId: origem.variacaoId, variacao: origem.variacao,
    quantidade,
    depositoOrigemId, depositoOrigem: depOrigem?.nome ?? depositoOrigemId,
    depositoDestinoId, depositoDestino: depDestino?.nome ?? depositoDestinoId,
    motivo, responsavel, criadoEm: new Date().toISOString(),
  };
  MOVIMENTACOES_MOCK.unshift(mov);

  return NextResponse.json({ origemAtualizado: origem, destinoAtualizado: destino, movimentacao: mov }, { status: 201 });
}
