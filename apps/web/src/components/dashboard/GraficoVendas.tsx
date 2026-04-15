'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface VendaDia {
  data: string;
  label: string;
  receita: number;
  pedidos: number;
}

function TooltipVendas({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      <p className="text-green-600 font-bold">{fmt(payload[0]?.value ?? 0)}</p>
      {payload[1] && <p className="text-slate-400 text-xs">{payload[1]?.value} pedidos</p>}
    </div>
  );
}

export default function GraficoVendas({ data }: { data: VendaDia[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis
          tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40}
        />
        <Tooltip content={<TooltipVendas />} />
        <Bar dataKey="receita" fill="#6366f1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
