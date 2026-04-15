import { NextResponse } from 'next/server';
import { COMPRAS_MOCK } from '../_mock-data';
import { FORNECEDORES_MOCK } from '../../fornecedores/_mock-data';

export async function GET() {
  const agora = Date.now();
  const ms30d = 30 * 86400000;
  const ms7d  = 7  * 86400000;

  const recebidos = COMPRAS_MOCK.filter((c) => c.status === 'RECEBIDO');

  // Gastos nos últimos 30 dias
  const gastosTotal30d = recebidos
    .filter((c) => c.dataRecebimento && agora - new Date(c.dataRecebimento).getTime() <= ms30d)
    .reduce((s, c) => s + c.valorTotal, 0);

  // Gastos nos últimos 7 dias
  const gastosTotal7d = recebidos
    .filter((c) => c.dataRecebimento && agora - new Date(c.dataRecebimento).getTime() <= ms7d)
    .reduce((s, c) => s + c.valorTotal, 0);

  // Pedidos pendentes (ENVIADO + AGUARDANDO_RECEBIMENTO)
  const pedidosPendentes = COMPRAS_MOCK.filter(
    (c) => c.status === 'ENVIADO' || c.status === 'AGUARDANDO_RECEBIMENTO',
  ).length;

  // Pedidos recebidos nos últimos 30 dias
  const pedidosRecebidos30d = recebidos.filter(
    (c) => c.dataRecebimento && agora - new Date(c.dataRecebimento).getTime() <= ms30d,
  ).length;

  // NFs importadas (com nfeNumero)
  const nfesImportadas = COMPRAS_MOCK.filter((c) => !!c.nfeNumero).length;

  // Fornecedores ativos
  const fornecedoresAtivos = FORNECEDORES_MOCK.filter((f) => f.status === 'ATIVO').length;

  // Ticket médio de compra
  const ticketMedioCompra =
    recebidos.length > 0
      ? recebidos.reduce((s, c) => s + c.valorTotal, 0) / recebidos.length
      : 0;

  // Top 3 fornecedores por totalCompras
  const topFornecedores = [...FORNECEDORES_MOCK]
    .sort((a, b) => b.totalCompras - a.totalCompras)
    .slice(0, 3)
    .map((f) => ({
      id: f.id,
      nome: f.nomeFantasia || f.razaoSocial,
      total: f.totalCompras,
      qtd: f.qtdCompras,
    }));

  // Crescimento de gastos (mock fixo comparando dois períodos de 30 dias)
  const crescimentoGastos = -8.5;

  return NextResponse.json({
    gastosTotal30d: parseFloat(gastosTotal30d.toFixed(2)),
    gastosTotal7d: parseFloat(gastosTotal7d.toFixed(2)),
    pedidosPendentes,
    pedidosRecebidos30d,
    nfesImportadas,
    fornecedoresAtivos,
    ticketMedioCompra: parseFloat(ticketMedioCompra.toFixed(2)),
    topFornecedores,
    crescimentoGastos,
  });
}
