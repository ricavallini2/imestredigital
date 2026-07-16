'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { corCanal, rotularCanal } from '@/lib/canais';

interface CanalResumo {
  canal: string;
  label: string;
  qtd: number;
  valor: number;
}

// As cores saem de `@/lib/canais`, que cobre os valores REAIS de `canalOrigem`
// (BALCAO, SITE, MERCADOLIVRE, MAGALU…) e também os de `OrigemPedido`. O mapa
// local aqui só conhecia os nomes do mock (BALCAO/SHOPEE/INTERNA): em produção
// toda fatia caía no cinza de fallback e o donut ficava monocromático.

const rotulo = (c: CanalResumo) => c.label || rotularCanal(c.canal);

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtN = (v: number) => v.toLocaleString('pt-BR');

function TooltipCanal({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-medium">{d ? rotulo(d) : ''}</p>
      <p className="text-slate-700 dark:text-slate-200">{fmt(d?.valor ?? 0)}</p>
      <p className="text-slate-400 text-xs">{fmtN(d?.qtd ?? 0)} pedidos</p>
    </div>
  );
}

export default function GraficoCanal({ data }: { data: CanalResumo[] }) {
  return (
    <>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} dataKey="valor" nameKey="label"
            cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
            {data.map((entry) => (
              <Cell key={entry.canal} fill={corCanal(entry.canal)} />
            ))}
          </Pie>
          <Tooltip content={<TooltipCanal />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1 mt-2">
        {data.slice(0, 4).map((c) => (
          <div key={c.canal} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: corCanal(c.canal) }} />
              <span className="text-slate-600 dark:text-slate-400">{rotulo(c)}</span>
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-300">{fmt(c.valor)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
