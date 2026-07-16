'use client';

/**
 * CFOP — Código Fiscal de Operações e Prestações.
 *
 * Tabela de referência (padrão nacional) usada na emissão fiscal. Os códigos
 * são fixos; o tipo (entrada/saída) e o âmbito (estadual/interestadual/exterior)
 * derivam do 1º dígito: 1/2/3 = entrada · 5/6/7 = saída · 1/5 estadual ·
 * 2/6 interestadual · 3/7 exterior.
 */

import { useState, useMemo } from 'react';
import { Hash, Search, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';

interface Cfop {
  codigo: string;
  descricao: string;
}

// Subconjunto dos CFOPs mais usados no varejo/indústria (entradas e saídas).
const CFOPS: Cfop[] = [
  // ── Entradas (1xxx estadual · 2xxx interestadual · 3xxx exterior) ──
  { codigo: '1101', descricao: 'Compra para industrialização' },
  { codigo: '1102', descricao: 'Compra para comercialização' },
  { codigo: '1111', descricao: 'Compra para industrialização de mercadoria recebida de terceiros' },
  {
    codigo: '1116',
    descricao: 'Compra para industrialização originada de encomenda para recebimento futuro',
  },
  { codigo: '1201', descricao: 'Devolução de venda de produção do estabelecimento' },
  {
    codigo: '1202',
    descricao: 'Devolução de venda de mercadoria adquirida ou recebida de terceiros',
  },
  { codigo: '1403', descricao: 'Compra para comercialização com mercadoria sujeita a ST' },
  { codigo: '1411', descricao: 'Devolução de venda de mercadoria sujeita a ST' },
  { codigo: '1556', descricao: 'Compra de material para uso ou consumo' },
  { codigo: '1653', descricao: 'Compra de combustível ou lubrificante para comercialização' },
  {
    codigo: '1902',
    descricao: 'Retorno de mercadoria remetida para industrialização por encomenda',
  },
  { codigo: '1908', descricao: 'Entrada de bem por conta de contrato de comodato' },
  {
    codigo: '1949',
    descricao: 'Outra entrada de mercadoria ou prestação de serviço não especificada',
  },
  { codigo: '2101', descricao: 'Compra para industrialização (outro estado)' },
  { codigo: '2102', descricao: 'Compra para comercialização (outro estado)' },
  {
    codigo: '2202',
    descricao: 'Devolução de venda de mercadoria adquirida de terceiros (outro estado)',
  },
  { codigo: '2403', descricao: 'Compra para comercialização sujeita a ST (outro estado)' },
  { codigo: '2556', descricao: 'Compra de material para uso ou consumo (outro estado)' },
  { codigo: '3102', descricao: 'Compra para comercialização (importação do exterior)' },
  // ── Saídas (5xxx estadual · 6xxx interestadual · 7xxx exterior) ──
  { codigo: '5101', descricao: 'Venda de produção do estabelecimento' },
  { codigo: '5102', descricao: 'Venda de mercadoria adquirida ou recebida de terceiros' },
  {
    codigo: '5103',
    descricao: 'Venda de produção do estabelecimento efetuada fora do estabelecimento',
  },
  {
    codigo: '5104',
    descricao: 'Venda de mercadoria adquirida de terceiros efetuada fora do estabelecimento',
  },
  { codigo: '5109', descricao: 'Venda de produção do estabelecimento (Zona Franca / ALC)' },
  {
    codigo: '5116',
    descricao: 'Venda de produção do estabelecimento originada de encomenda para entrega futura',
  },
  {
    codigo: '5117',
    descricao:
      'Venda de mercadoria adquirida de terceiros originada de encomenda para entrega futura',
  },
  { codigo: '5201', descricao: 'Devolução de compra para industrialização' },
  { codigo: '5202', descricao: 'Devolução de compra para comercialização' },
  { codigo: '5401', descricao: 'Venda de produção do estabelecimento sujeita a ST' },
  {
    codigo: '5403',
    descricao: 'Venda de mercadoria adquirida de terceiros sujeita a ST (substituto tributário)',
  },
  { codigo: '5405', descricao: 'Venda de mercadoria sujeita a ST (contribuinte substituído)' },
  { codigo: '5411', descricao: 'Devolução de compra para comercialização em operação com ST' },
  { codigo: '5551', descricao: 'Venda de bem do ativo imobilizado' },
  { codigo: '5556', descricao: 'Devolução de compra de material de uso ou consumo' },
  { codigo: '5910', descricao: 'Remessa em bonificação, doação ou brinde' },
  { codigo: '5915', descricao: 'Remessa de mercadoria para conserto ou reparo' },
  { codigo: '5929', descricao: 'Venda registrada em cupom fiscal (NFC-e / SAT / ECF)' },
  {
    codigo: '5949',
    descricao: 'Outra saída de mercadoria ou prestação de serviço não especificada',
  },
  { codigo: '6101', descricao: 'Venda de produção do estabelecimento (outro estado)' },
  { codigo: '6102', descricao: 'Venda de mercadoria adquirida de terceiros (outro estado)' },
  {
    codigo: '6108',
    descricao: 'Venda de mercadoria adquirida de terceiros a não contribuinte (outro estado)',
  },
  { codigo: '6404', descricao: 'Venda de mercadoria sujeita a ST (outro estado)' },
  { codigo: '6910', descricao: 'Remessa em bonificação, doação ou brinde (outro estado)' },
  { codigo: '6949', descricao: 'Outra saída de mercadoria ou prestação de serviço (outro estado)' },
  { codigo: '7101', descricao: 'Venda de produção do estabelecimento (exportação)' },
  { codigo: '7102', descricao: 'Venda de mercadoria adquirida de terceiros (exportação)' },
];

type FiltroTipo = 'TODOS' | 'ENTRADA' | 'SAIDA';

const tipoDoCodigo = (codigo: string): 'ENTRADA' | 'SAIDA' =>
  '123'.includes(codigo[0]) ? 'ENTRADA' : 'SAIDA';

const ambitoDoCodigo = (codigo: string): string => {
  const d = codigo[0];
  if (d === '1' || d === '5') return 'Estadual';
  if (d === '2' || d === '6') return 'Interestadual';
  return 'Exterior';
};

const AMBITO_CLS: Record<string, string> = {
  Estadual: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Interestadual: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Exterior: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export default function CfopPage() {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<FiltroTipo>('TODOS');

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return CFOPS.filter((c) => {
      if (filtro !== 'TODOS' && tipoDoCodigo(c.codigo) !== filtro) return false;
      if (!q) return true;
      return c.codigo.includes(q) || c.descricao.toLowerCase().includes(q);
    });
  }, [busca, filtro]);

  const totalEntradas = CFOPS.filter((c) => tipoDoCodigo(c.codigo) === 'ENTRADA').length;
  const totalSaidas = CFOPS.length - totalEntradas;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-marca-100 p-2.5 dark:bg-marca-900/30">
          <Hash className="h-6 w-6 text-marca-600 dark:text-marca-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">CFOP</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Código Fiscal de Operações e Prestações — tabela de referência
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard
          label="Códigos cadastrados"
          valor={String(CFOPS.length)}
          icone={<Hash className="h-5 w-5" />}
        />
        <KPICard
          label="Entradas"
          valor={String(totalEntradas)}
          icone={<ArrowDownLeft className="h-5 w-5" />}
        />
        <KPICard
          label="Saídas"
          valor={String(totalSaidas)}
          icone={<ArrowUpRight className="h-5 w-5" />}
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por código ou descrição..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-marca-400"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-slate-200 p-1 dark:border-slate-700">
          {(['TODOS', 'ENTRADA', 'SAIDA'] as FiltroTipo[]).map((t) => (
            <button
              key={t}
              onClick={() => setFiltro(t)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                filtro === t
                  ? 'bg-marca-600 text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              {t === 'TODOS' ? 'Todos' : t === 'ENTRADA' ? 'Entradas' : 'Saídas'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-400 dark:bg-slate-700/40">
              <tr>
                <th className="px-5 py-3">Código</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Âmbito</th>
                <th className="px-3 py-3">Descrição</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtrados.map((c) => {
                const tipo = tipoDoCodigo(c.codigo);
                const ambito = ambitoDoCodigo(c.codigo);
                return (
                  <tr
                    key={c.codigo}
                    className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/30"
                  >
                    <td className="px-5 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {c.codigo}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          tipo === 'ENTRADA'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}
                      >
                        {tipo === 'ENTRADA' ? (
                          <ArrowDownLeft className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${AMBITO_CLS[ambito]}`}
                      >
                        {ambito}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{c.descricao}</td>
                  </tr>
                );
              })}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-400">
                    Nenhum CFOP encontrado para “{busca}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        {filtrados.length} de {CFOPS.length} códigos · Tabela de referência nacional (subconjunto
        dos mais usados).
      </p>
    </div>
  );
}
