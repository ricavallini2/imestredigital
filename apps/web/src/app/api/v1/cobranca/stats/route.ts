import { NextResponse } from 'next/server';
import { TITULOS_COBRANCA_MOCK, ACORDOS_MOCK, calcularScoreIA } from '../_mock-data';

export async function GET() {
  const t = TITULOS_COBRANCA_MOCK;
  const ativos  = t.filter(x => !['PAGO','PERDIDO'].includes(x.status));
  const pagos   = t.filter(x => x.status === 'PAGO').length;
  const perdidos = t.filter(x => x.status === 'PERDIDO').length;

  const totalVencido = ativos.reduce((s, x) => s + x.valor, 0);
  const emCobranca   = t.filter(x => x.status === 'EM_COBRANCA').length;
  const negociando   = t.filter(x => x.status === 'NEGOCIANDO').length;
  const acordo       = t.filter(x => x.status === 'ACORDO').length;
  const acordosAtivos= ACORDOS_MOCK.filter(a => a.status === 'ATIVO').length;
  const taxaRec      = (pagos + perdidos) > 0 ? Math.round(pagos / (pagos + perdidos) * 100) : 0;

  const previsaoRecuperacao = ACORDOS_MOCK
    .filter(a => a.status === 'ATIVO')
    .reduce((s, a) => s + a.parcelas.filter(p => !p.pago).reduce((ss, p) => ss + p.valor, 0), 0);

  const mediaDiasAtraso = ativos.length
    ? Math.round(ativos.reduce((s, x) => s + x.diasAtraso, 0) / ativos.length)
    : 0;

  const porPrioridade = {
    CRITICA: t.filter(x => x.prioridade === 'CRITICA' && !['PAGO','PERDIDO'].includes(x.status)).length,
    ALTA:    t.filter(x => x.prioridade === 'ALTA'    && !['PAGO','PERDIDO'].includes(x.status)).length,
    MEDIA:   t.filter(x => x.prioridade === 'MEDIA'   && !['PAGO','PERDIDO'].includes(x.status)).length,
    BAIXA:   t.filter(x => x.prioridade === 'BAIXA'   && !['PAGO','PERDIDO'].includes(x.status)).length,
  };

  const topCriticos = [...ativos]
    .map(x => ({ ...x, scoreIA: calcularScoreIA(x) }))
    .sort((a, b) => b.scoreIA - a.scoreIA)
    .slice(0, 5);

  return NextResponse.json({
    totalVencido, emCobranca, negociando, acordo, acordosAtivos,
    taxaRecuperacao: taxaRec, previsaoRecuperacao, mediaDiasAtraso,
    porPrioridade, topCriticos, pagos, perdidos, totalTitulos: t.length,
  });
}
