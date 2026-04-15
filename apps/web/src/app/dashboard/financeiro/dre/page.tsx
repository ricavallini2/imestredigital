'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Download,
  Brain,
  TrendingUp,
  TrendingDown,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { useDRE } from '@/hooks/useFinanceiro';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function fmtPct(v: number) {
  return `${v >= 0 ? '' : ''}${v.toFixed(1)}%`;
}
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-100 dark:bg-slate-700 ${className ?? ''}`} />;
}

const MESES_LABELS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];
const ANOS = [2024, 2025, 2026];

// ─── DRE Row ─────────────────────────────────────────────────────────────────

type RowVariant = 'header' | 'item' | 'total' | 'separator' | 'margin' | 'big-total';

function DRERow({
  variant = 'item',
  label,
  value,
  isPositive,
  indent = 0,
  isLast = false,
  badge,
}: {
  variant?: RowVariant;
  label: string;
  value?: number | string;
  isPositive?: boolean;
  indent?: number;
  isLast?: boolean;
  badge?: string;
}) {
  if (variant === 'separator') {
    return <tr><td colSpan={2} className="py-1"><div className="border-t border-slate-200 dark:border-slate-600" /></td></tr>;
  }
  if (variant === 'header') {
    return (
      <tr>
        <td colSpan={2} className="pt-4 pb-1">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {label}
          </p>
        </td>
      </tr>
    );
  }
  if (variant === 'margin') {
    return (
      <tr className="bg-slate-50 dark:bg-slate-700/30">
        <td className="py-1 pr-4 pl-8 text-xs text-slate-500">{label}</td>
        <td className="py-1 text-right">
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${(typeof isPositive === 'boolean' ? isPositive : Number(value) >= 0) ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
            {typeof value === 'number' ? fmtPct(value) : value}
          </span>
        </td>
      </tr>
    );
  }
  if (variant === 'big-total') {
    const pos = typeof isPositive === 'boolean' ? isPositive : (typeof value === 'number' ? value >= 0 : true);
    return (
      <tr className="border-t-2 border-slate-300 dark:border-slate-500">
        <td className="py-3 pr-4 text-base font-black text-slate-900 dark:text-slate-100">{label}</td>
        <td className={`py-3 text-right text-xl font-black ${pos ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {typeof value === 'number' ? fmt(value) : value}
        </td>
      </tr>
    );
  }
  if (variant === 'total') {
    const pos = typeof isPositive === 'boolean' ? isPositive : (typeof value === 'number' ? value >= 0 : true);
    return (
      <tr className="border-t border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/20">
        <td className="py-2.5 pr-4 font-bold text-slate-900 dark:text-slate-100">
          <span className="text-slate-500 mr-1">(=)</span> {label}
        </td>
        <td className={`py-2.5 text-right font-bold ${pos ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {typeof value === 'number' ? fmt(value) : value}
        </td>
      </tr>
    );
  }

  // item
  const pos = typeof isPositive === 'boolean' ? isPositive : (typeof value === 'number' ? value >= 0 : true);
  const indent_cl = indent === 1 ? 'pl-6' : indent === 2 ? 'pl-10' : 'pl-4';
  return (
    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-700/20">
      <td className={`py-1.5 pr-4 text-sm text-slate-700 dark:text-slate-300 ${indent_cl}`}>
        <span className="text-slate-400 mr-1">{isLast ? '└──' : '├──'}</span>
        {label}
      </td>
      <td className={`py-1.5 text-right text-sm font-medium ${pos ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
        {typeof value === 'number'
          ? pos
            ? fmt(value)
            : `(${fmt(Math.abs(value))})`
          : value}
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DREPage() {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [ano, setAno] = useState(now.getFullYear());

  const { data: dre, isLoading, isError } = useDRE(mes, ano);

  const handleExport = () => {
    alert('Exportação em desenvolvimento. Em breve disponível em PDF e Excel.');
  };

  // KPI color helper
  const resultadoPositivo = (dre?.resultadoLiquido ?? 0) >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            DRE — Demonstrativo de Resultados
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Demonstrativo do Exercício · Competência · {MESES_LABELS[mes - 1]}/{ano}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            {MESES_LABELS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            {ANOS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="h-4 w-4" /> Exportar
          </button>
        </div>
      </div>

      {/* KPI Row */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/20">
          <p className="font-semibold text-red-600 dark:text-red-400">Erro ao carregar DRE</p>
          <p className="mt-1 text-sm text-red-500">Verifique se o serviço financeiro está disponível.</p>
        </div>
      ) : dre ? (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard label="Receita Bruta" value={dre.receitaBruta} color="green" icon={<TrendingUp className="h-5 w-5" />} />
            <KPICard
              label="Lucro Bruto"
              value={dre.lucroBruto}
              badge={`Margem ${fmtPct(dre.margemBruta)}`}
              color={dre.lucroBruto >= 0 ? 'green' : 'red'}
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <KPICard
              label="EBITDA"
              value={dre.ebitda}
              badge={`Margem ${fmtPct(dre.margemEbitda)}`}
              color={dre.ebitda >= 0 ? 'green' : 'red'}
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <KPICard
              label="Resultado Líquido"
              value={dre.resultadoLiquido}
              badge={`Margem ${fmtPct(dre.margemLiquida)}`}
              color={resultadoPositivo ? 'green' : 'red'}
              icon={resultadoPositivo ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            />
          </div>

          {/* Main DRE Table */}
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-slate-100">
                Demonstrativo de Resultados — {MESES_LABELS[mes - 1]}/{ano}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Conta
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {MESES_LABELS[mes - 1].slice(0, 3)}/{String(ano).slice(-2)}
                    </th>
                  </tr>
                </thead>
                <tbody className="px-6">
                  {/* RECEITAS */}
                  <DRERow variant="header" label="Receitas" value={undefined} />
                  <DRERow label="Vendas de Produtos" value={dre.vendasProdutos} isPositive={true} indent={1} />
                  <DRERow label="Marketplaces" value={dre.vendasMarketplaces} isPositive={true} indent={1} />
                  <DRERow label="Serviços" value={dre.vendasServicos} isPositive={true} indent={1} />
                  <DRERow label="Receitas Financeiras" value={dre.receitasFinanceiras} isPositive={true} indent={1} />
                  <DRERow label="Outras Receitas" value={dre.outrasReceitas} isPositive={true} indent={1} isLast />
                  <DRERow variant="total" label="RECEITA BRUTA" value={dre.receitaBruta} isPositive={true} />

                  <DRERow variant="separator" label="" />

                  {/* DEDUÇÕES */}
                  <DRERow variant="header" label="Deduções" value={undefined} />
                  <DRERow label="Impostos s/ Venda" value={-dre.impostosVenda} isPositive={false} indent={1} />
                  <DRERow label="Devoluções" value={-dre.devolucoes} isPositive={false} indent={1} isLast />
                  <DRERow variant="total" label="RECEITA LÍQUIDA" value={dre.receitaLiquida} isPositive={true} />

                  <DRERow variant="separator" label="" />

                  {/* CUSTOS */}
                  <DRERow variant="header" label="Custos" value={undefined} />
                  <DRERow label="CMV — Custo das Mercadorias" value={-dre.cmv} isPositive={false} indent={1} isLast />
                  <DRERow variant="total" label="LUCRO BRUTO" value={dre.lucroBruto} isPositive={dre.lucroBruto >= 0} />
                  <DRERow variant="margin" label="Margem Bruta" value={dre.margemBruta} isPositive={dre.margemBruta >= 0} />

                  <DRERow variant="separator" label="" />

                  {/* DESPESAS OPERACIONAIS */}
                  <DRERow variant="header" label="Despesas Operacionais" value={undefined} />
                  <DRERow label="Salários e Encargos" value={-dre.salarios} isPositive={false} indent={1} />
                  <DRERow label="Ocupação / Aluguel" value={-dre.ocupacao} isPositive={false} indent={1} />
                  <DRERow label="Marketing" value={-dre.marketing} isPositive={false} indent={1} />
                  <DRERow label="Operacional" value={-dre.operacional} isPositive={false} indent={1} />
                  <DRERow label="Impostos e Tributos" value={-dre.impostosTributos} isPositive={false} indent={1} />
                  <DRERow label="Outras" value={-dre.outrasDespesas} isPositive={false} indent={1} isLast />
                  <DRERow variant="total" label="EBITDA" value={dre.ebitda} isPositive={dre.ebitda >= 0} />
                  <DRERow variant="margin" label="Margem EBITDA" value={dre.margemEbitda} isPositive={dre.margemEbitda >= 0} />

                  <DRERow variant="separator" label="" />

                  {/* RESULTADO FINANCEIRO */}
                  <DRERow variant="header" label="Resultado Financeiro" value={undefined} />
                  <DRERow label="(+) Receitas Financeiras" value={dre.receitasFinanceirasResult} isPositive={true} indent={1} />
                  <DRERow label="(-) Despesas Financeiras" value={-dre.despesasFinanceiras} isPositive={false} indent={1} isLast />
                  <DRERow variant="total" label="RESULTADO ANTES DO IR" value={dre.resultadoAntesIR} isPositive={dre.resultadoAntesIR >= 0} />

                  <DRERow variant="separator" label="" />

                  <DRERow label="(-) IR / CSLL" value={-dre.irCsll} isPositive={false} indent={0} isLast />

                  <DRERow variant="separator" label="" />

                  <DRERow
                    variant="big-total"
                    label="(=) RESULTADO LÍQUIDO"
                    value={dre.resultadoLiquido}
                    isPositive={dre.resultadoLiquido >= 0}
                  />
                  <DRERow variant="margin" label="Margem Líquida" value={dre.margemLiquida} isPositive={dre.margemLiquida >= 0} />
                </tbody>
              </table>
            </div>
          </div>

          {/* Two-column breakdown */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Receita breakdown */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-4 font-bold text-slate-900 dark:text-slate-100">Composição da Receita Bruta</h3>
              <div className="space-y-3">
                {[
                  { label: 'Vendas de Produtos', value: dre.vendasProdutos, color: 'bg-emerald-500' },
                  { label: 'Marketplaces', value: dre.vendasMarketplaces, color: 'bg-blue-500' },
                  { label: 'Serviços', value: dre.vendasServicos, color: 'bg-purple-500' },
                  { label: 'Receitas Financeiras', value: dre.receitasFinanceiras, color: 'bg-amber-500' },
                  { label: 'Outras', value: dre.outrasReceitas, color: 'bg-slate-400' },
                ]
                  .filter((item) => item.value > 0)
                  .map((item) => {
                    const pct = dre.receitaBruta > 0 ? (item.value / dre.receitaBruta) * 100 : 0;
                    return (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                          <span className="text-slate-500">{fmt(item.value)}</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                          <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="mt-0.5 text-right text-xs text-slate-400">{pct.toFixed(1)}%</p>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Despesas breakdown */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-4 font-bold text-slate-900 dark:text-slate-100">Composição das Despesas</h3>
              <div className="space-y-3">
                {[
                  { label: 'Salários e Encargos', value: dre.salarios, color: 'bg-red-500' },
                  { label: 'Ocupação / Aluguel', value: dre.ocupacao, color: 'bg-orange-500' },
                  { label: 'Marketing', value: dre.marketing, color: 'bg-pink-500' },
                  { label: 'Operacional', value: dre.operacional, color: 'bg-amber-500' },
                  { label: 'Impostos e Tributos', value: dre.impostosTributos, color: 'bg-rose-600' },
                  { label: 'CMV', value: dre.cmv, color: 'bg-slate-500' },
                  { label: 'Outras', value: dre.outrasDespesas, color: 'bg-slate-400' },
                ]
                  .filter((item) => item.value > 0)
                  .map((item) => {
                    const total = dre.totalDespesasOperacionais + dre.cmv;
                    const pct = total > 0 ? (item.value / total) * 100 : 0;
                    return (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                          <span className="text-slate-500">{fmt(item.value)}</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                          <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="mt-0.5 text-right text-xs text-slate-400">
                          {pct.toFixed(1)}% · {dre.receitaBruta > 0 ? ((item.value / dre.receitaBruta) * 100).toFixed(1) : '0.0'}% da RB
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Month comparison */}
          {dre.mesAnterior && (
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Comparativo com Mês Anterior</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-700/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Indicador</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Mês Atual</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Mês Anterior</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Variação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {[
                      { label: 'Receita Bruta', curr: dre.receitaBruta, prev: dre.mesAnterior.receitaBruta },
                      { label: 'Lucro Bruto', curr: dre.lucroBruto, prev: dre.mesAnterior.lucroBruto },
                      { label: 'EBITDA', curr: dre.ebitda, prev: dre.mesAnterior.ebitda },
                      { label: 'Resultado Líquido', curr: dre.resultadoLiquido, prev: dre.mesAnterior.resultadoLiquido },
                    ].map((row) => {
                      const varPct = row.prev !== 0 ? ((row.curr - row.prev) / Math.abs(row.prev)) * 100 : 0;
                      const pos = varPct >= 0;
                      return (
                        <tr key={row.label} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                          <td className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">{row.label}</td>
                          <td className={`px-4 py-3 text-right font-semibold ${row.curr >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {fmt(row.curr)}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-500">{fmt(row.prev)}</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${pos ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                              {pos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {pos ? '+' : ''}{varPct.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Margins */}
                    {[
                      { label: 'Margem Bruta', curr: dre.margemBruta, prev: dre.mesAnterior.margemBruta, isMargem: true },
                      { label: 'Margem EBITDA', curr: dre.margemEbitda, prev: dre.mesAnterior.margemEbitda, isMargem: true },
                      { label: 'Margem Líquida', curr: dre.margemLiquida, prev: dre.mesAnterior.margemLiquida, isMargem: true },
                    ].map((row) => {
                      const varPp = row.curr - row.prev;
                      const pos = varPp >= 0;
                      return (
                        <tr key={row.label} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 bg-slate-50/50 dark:bg-slate-700/10">
                          <td className="px-6 py-2 text-xs text-slate-500 dark:text-slate-400 pl-10">{row.label}</td>
                          <td className="px-4 py-2 text-right text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {fmtPct(row.curr)}
                          </td>
                          <td className="px-4 py-2 text-right text-xs text-slate-400">{fmtPct(row.prev)}</td>
                          <td className="px-4 py-2 text-right">
                            <span className={`text-xs font-bold ${pos ? 'text-emerald-600' : 'text-red-600'}`}>
                              {pos ? '+' : ''}{varPp.toFixed(1)} pp
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI Insight Panel */}
          <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-purple-50 p-6 dark:border-amber-800 dark:from-amber-950/20 dark:to-purple-950/20">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-bold text-slate-900 dark:text-slate-100">iMestreAI — Insights do DRE</span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <div className="space-y-2">
              {/* Margem líquida vs setor */}
              <p className={`text-sm font-medium ${dre.margemLiquida >= 8 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                💡 Sua margem líquida de {fmtPct(dre.margemLiquida)} está{' '}
                {dre.margemLiquida >= 8 ? 'acima' : 'abaixo'} da média do setor de varejo (~8%).
                {dre.margemLiquida < 8 ? ' Revise despesas operacionais para melhorar.' : ' Excelente resultado!'}
              </p>
              {/* Peso de pessoal */}
              {dre.receitaBruta > 0 && (
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  👥 Despesas com pessoal representam{' '}
                  {((dre.salarios / dre.receitaBruta) * 100).toFixed(1)}% da receita bruta.
                  {(dre.salarios / dre.receitaBruta) > 0.35 ? ' Acima de 35% — avalie a eficiência operacional.' : ' Dentro do parâmetro saudável.'}
                </p>
              )}
              {/* Crescimento vs mês anterior */}
              {dre.mesAnterior && (
                <p className={`text-sm font-medium ${dre.receitaBruta >= dre.mesAnterior.receitaBruta ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                  📈 Receita bruta {dre.receitaBruta >= dre.mesAnterior.receitaBruta ? 'cresceu' : 'caiu'}{' '}
                  {Math.abs(((dre.receitaBruta - dre.mesAnterior.receitaBruta) / Math.max(dre.mesAnterior.receitaBruta, 1)) * 100).toFixed(1)}% vs mês anterior
                  ({fmt(dre.mesAnterior.receitaBruta)} → {fmt(dre.receitaBruta)}).
                </p>
              )}
            </div>
            <Link
              href="/dashboard/ia"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              <Brain className="h-4 w-4" />
              Analisar profundamente com IA →
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

function KPICard({
  label,
  value,
  badge,
  color,
  icon,
}: {
  label: string;
  value: number;
  badge?: string;
  color: 'green' | 'red';
  icon?: React.ReactNode;
}) {
  const colorMap = { green: 'text-emerald-600 dark:text-emerald-400', red: 'text-red-600 dark:text-red-400' };
  const iconBg = { green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        {icon && (
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg[color]}`}>
            {icon}
          </span>
        )}
      </div>
      <p className={`mt-2 text-2xl font-bold ${colorMap[color]}`}>{fmt(value)}</p>
      {badge && (
        <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-bold ${value >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
          {badge}
        </span>
      )}
    </div>
  );
}
