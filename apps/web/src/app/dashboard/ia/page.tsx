'use client';

/**
 * iMestreAI — Módulo de Inteligência Artificial
 * Chat interativo com dados reais do ERP + painel de insights
 * Layout responsivo: mobile (single col) → lg (2 col) → xl (3 col)
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import {
  Bot, Send, Trash2, RefreshCw, Sparkles, AlertTriangle,
  TrendingUp, Package, Zap, Star, ArrowRight, Copy, CheckCheck,
  FileText, BarChart3, Users, ShoppingCart, Lightbulb,
  ChevronRight, MessageSquare, BookOpen, X,
} from 'lucide-react';
import { useChat, useInsights, useMarcarInsightVisualizado, type MensagemChat } from '@/hooks/useIA';

// ─── Constantes ───────────────────────────────────────────────────────────────
const TIPO_BADGE: Record<string, { cor: string; label: string }> = {
  texto:    { cor: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',       label: 'Resposta' },
  alerta:   { cor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',            label: 'Alerta' },
  sucesso:  { cor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',    label: 'OK' },
  relatorio:{ cor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',        label: 'Relatório' },
  previsao: { cor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',label: 'Previsão' },
  tabela:   { cor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',        label: 'Tabela' },
};

const ACAO_COR: Record<string, string> = {
  blue:  'bg-blue-600 hover:bg-blue-700 text-white',
  green: 'bg-green-600 hover:bg-green-700 text-white',
  amber: 'bg-amber-500 hover:bg-amber-600 text-white',
  red:   'bg-red-600 hover:bg-red-700 text-white',
  purple:'bg-purple-600 hover:bg-purple-700 text-white',
};

const INSIGHT_CORES: Record<string, string> = {
  ALERTA:      'border-l-red-500 bg-red-50 dark:bg-red-950/20',
  OPORTUNIDADE:'border-l-green-500 bg-green-50 dark:bg-green-950/20',
  PREVISAO:    'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20',
  ANOMALIA:    'border-l-amber-500 bg-amber-50 dark:bg-amber-950/20',
};
const INSIGHT_ICONE: Record<string, React.ReactNode> = {
  ALERTA:       <AlertTriangle className="w-4 h-4 text-red-500" />,
  OPORTUNIDADE: <Star className="w-4 h-4 text-green-500" />,
  PREVISAO:     <TrendingUp className="w-4 h-4 text-blue-500" />,
  ANOMALIA:     <Zap className="w-4 h-4 text-amber-500" />,
};
const PRIORIDADE_BADGE: Record<string, string> = {
  CRITICA: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  ALTA:    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  MEDIA:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  BAIXA:   'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
};

// ─── Sugestões rápidas agrupadas ──────────────────────────────────────────────
const SUGESTOES_RAPIDAS = [
  {
    categoria: 'Vendas',
    icone: <BarChart3 className="w-4 h-4" />,
    cor: 'text-blue-500',
    items: [
      'Como estão as vendas hoje?',
      'Quais os produtos mais vendidos no mês?',
      'Gere um relatório completo de vendas',
      'Qual a projeção de receita para este mês?',
      'Como estão as vendas por canal?',
    ],
  },
  {
    categoria: 'Estoque',
    icone: <Package className="w-4 h-4" />,
    cor: 'text-purple-500',
    items: [
      'Qual o status do estoque?',
      'Temos algum produto zerado?',
      'Quais produtos precisam de reposição urgente?',
      'Qual o valor total em estoque?',
      'Qual produto tem maior giro?',
    ],
  },
  {
    categoria: 'Clientes',
    icone: <Users className="w-4 h-4" />,
    cor: 'text-green-500',
    items: [
      'Quais clientes compraram mais este mês?',
      'Temos clientes inativos?',
      'Qual a análise de margem de lucro?',
    ],
  },
  {
    categoria: 'Pedidos & Fiscal',
    icone: <ShoppingCart className="w-4 h-4" />,
    cor: 'text-amber-500',
    items: [
      'Quais são os alertas críticos agora?',
      'Temos pedidos urgentes?',
      'Como está o módulo fiscal?',
      'Como emitir uma nota fiscal?',
    ],
  },
];

// ─── Renderizador de Markdown simples ────────────────────────────────────────
function RenderMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) return (
          <h1 key={i} className="text-base font-bold text-slate-900 dark:text-white mt-2 mb-1 pb-1 border-b border-slate-200 dark:border-slate-700">
            {renderInline(line.slice(2))}
          </h1>
        );
        if (line.startsWith('## ')) return (
          <h2 key={i} className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-3 mb-1 flex items-center gap-1.5">
            {renderInline(line.slice(3))}
          </h2>
        );
        if (line.startsWith('### ')) return (
          <h3 key={i} className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-2 mb-0.5 uppercase tracking-wide">
            {renderInline(line.slice(4))}
          </h3>
        );
        if (line.startsWith('|') && line.endsWith('|')) {
          const cells = line.split('|').filter((_, ci) => ci > 0 && ci < line.split('|').length - 1);
          const isSep = cells.every(c => c.trim().match(/^-+$/));
          if (isSep) return null;
          const isHeader = i > 0 && lines[i - 1]?.startsWith('|') && !lines[i - 2]?.startsWith('|');
          return (
            <div key={i} className={`grid gap-0 text-xs ${isHeader ? 'font-semibold bg-slate-100 dark:bg-slate-700/50 rounded-t' : 'bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700/50'}`}
              style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
              {cells.map((cell, ci) => (
                <span key={ci} className="px-2 py-1 truncate">{renderInline(cell.trim())}</span>
              ))}
            </div>
          );
        }
        if (line.startsWith('- ') || line.startsWith('* ')) return (
          <div key={i} className="flex gap-2 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
            <span>{renderInline(line.slice(2))}</span>
          </div>
        );
        if (/^\d+\.\s/.test(line)) return (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-slate-400 text-xs mt-0.5 shrink-0 w-4 text-right">{line.match(/^(\d+)/)?.[1]}.</span>
            <span>{renderInline(line.replace(/^\d+\.\s/, ''))}</span>
          </div>
        );
        if (line.startsWith('> ')) return (
          <blockquote key={i} className="border-l-2 border-marca-300 pl-3 text-slate-600 dark:text-slate-400 italic text-xs">
            {renderInline(line.slice(2))}
          </blockquote>
        );
        if (!line.trim()) return <div key={i} className="h-1" />;
        return <p key={i}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-xs font-mono text-destaque-600 dark:text-destaque-400">{part.slice(1, -1)}</code>;
    return part;
  });
}

// ─── Bolha de mensagem ────────────────────────────────────────────────────────
function Bolha({ msg, onSugestao }: { msg: MensagemChat; onSugestao: (s: string) => void }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = useCallback(async () => {
    await navigator.clipboard.writeText(msg.content);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }, [msg.content]);

  if (msg.loading) return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-destaque-500 to-purple-600 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-destaque-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-destaque-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-destaque-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );

  if (msg.role === 'user') return (
    <div className="flex gap-3 items-start justify-end">
      <div className="max-w-[85%] sm:max-w-[80%] px-4 py-3 rounded-2xl bg-marca-600 text-white text-sm shadow-sm">
        <p>{msg.content}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-marca-100 dark:bg-marca-900 flex items-center justify-center shrink-0 text-marca-600 dark:text-marca-300 text-xs font-bold">
        EU
      </div>
    </div>
  );

  const badge = msg.tipo ? TIPO_BADGE[msg.tipo] : TIPO_BADGE.texto;

  return (
    <div className="flex gap-2 sm:gap-3 items-start group">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-destaque-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm">
        <Bot className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {msg.tipo && msg.tipo !== 'texto' && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.cor}`}>
            {msg.tipo === 'relatorio' && <FileText className="w-3 h-3" />}
            {msg.tipo === 'alerta' && <AlertTriangle className="w-3 h-3" />}
            {msg.tipo === 'sucesso' && <CheckCheck className="w-3 h-3" />}
            {msg.tipo === 'previsao' && <TrendingUp className="w-3 h-3" />}
            {badge.label}
          </span>
        )}

        <div className={`px-3 sm:px-4 py-3 rounded-2xl shadow-sm text-slate-700 dark:text-slate-300 ${
          msg.tipo === 'alerta'    ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30' :
          msg.tipo === 'sucesso'   ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30' :
          msg.tipo === 'relatorio' ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30' :
          msg.tipo === 'previsao'  ? 'bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30' :
          'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
        }`}>
          <RenderMarkdown content={msg.content} />

          {msg.acoes && msg.acoes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              {msg.acoes.map(a => (
                <Link key={a.href} href={a.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${ACAO_COR[a.cor ?? 'blue'] ?? ACAO_COR.blue}`}>
                  {a.label} <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {msg.sugestoes && msg.sugestoes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {msg.sugestoes.map(s => (
              <button key={s.value} onClick={() => onSugestao(s.value)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-marca-50 hover:text-marca-600 dark:hover:bg-marca-900/30 dark:hover:text-marca-400 transition-colors border border-slate-200 dark:border-slate-600">
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-slate-400">
            {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button onClick={copiar} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors">
            {copiado ? <CheckCheck className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Painel de Insights ───────────────────────────────────────────────────────
function PainelInsights({ onPergunta }: { onPergunta: (q: string) => void }) {
  const { data: insights = [], isLoading } = useInsights({ limite: 10 });
  const marcar = useMarcarInsightVisualizado();
  const naoLidos = insights.filter(i => !i.visualizado).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" /> Insights Automáticos
        </h3>
        {naoLidos > 0 && (
          <span className="text-xs bg-destaque-100 dark:bg-destaque-900/30 text-destaque-700 dark:text-destaque-400 px-2 py-0.5 rounded-full font-medium">
            {naoLidos} novo(s)
          </span>
        )}
      </div>

      {isLoading && Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse" />
      ))}

      {!isLoading && insights.map(insight => (
        <div key={insight.id}
          className={`border-l-4 rounded-r-xl p-3 transition-opacity ${INSIGHT_CORES[insight.tipo] ?? 'border-l-slate-300 bg-slate-50 dark:bg-slate-800'} ${insight.visualizado ? 'opacity-60' : ''}`}>
          <div className="flex items-start gap-2">
            <div className="shrink-0 mt-0.5">{INSIGHT_ICONE[insight.tipo]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex-1">{insight.titulo}</p>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${PRIORIDADE_BADGE[insight.prioridade]}`}>
                  {insight.prioridade}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{insight.descricao}</p>
              {insight.acaoSugerida && (
                <button onClick={() => { onPergunta(`Me explique melhor: ${insight.titulo}`); marcar.mutate(insight.id); }}
                  className="mt-1.5 text-xs text-marca-600 dark:text-marca-400 hover:underline flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Saiba mais
                </button>
              )}
            </div>
            {!insight.visualizado && (
              <button onClick={() => marcar.mutate(insight.id)}
                className="shrink-0 w-2 h-2 rounded-full bg-destaque-500 hover:bg-slate-400 transition-colors mt-1" title="Marcar como lido" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Conteúdo interno do painel lateral ──────────────────────────────────────
function ConteudoPainel({
  abaSidebar,
  setAbaSidebar,
  onSugestao,
  onFechar,
}: {
  abaSidebar: 'insights' | 'sugestoes';
  setAbaSidebar: (v: 'insights' | 'sugestoes') => void;
  onSugestao: (s: string) => void;
  onFechar?: () => void;
}) {
  return (
    <>
      {/* Header do painel */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 shrink-0">
        <div className="flex flex-1 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <button onClick={() => setAbaSidebar('insights')}
            className={`flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${abaSidebar === 'insights' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <Lightbulb className="w-3.5 h-3.5" /> Insights
          </button>
          <button onClick={() => setAbaSidebar('sugestoes')}
            className={`flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${abaSidebar === 'sugestoes' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <BookOpen className="w-3.5 h-3.5" /> Perguntas
          </button>
        </div>
        {onFechar && (
          <button onClick={onFechar} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-4">
        {abaSidebar === 'insights' && (
          <PainelInsights onPergunta={(q) => { onSugestao(q); onFechar?.(); }} />
        )}
        {abaSidebar === 'sugestoes' && (
          <div className="space-y-4">
            {SUGESTOES_RAPIDAS.map(grupo => (
              <div key={grupo.categoria}>
                <div className={`flex items-center gap-1.5 text-xs font-semibold mb-2 ${grupo.cor}`}>
                  {grupo.icone} {grupo.categoria}
                </div>
                <div className="space-y-1">
                  {grupo.items.map(item => (
                    <button key={item} onClick={() => { onSugestao(item); onFechar?.(); }}
                      className="w-full text-left text-xs px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 flex items-center justify-between group">
                      <span>{item}</span>
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-marca-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function IAPage() {
  const { mensagens, enviando, enviar, limpar } = useChat();
  const [input, setInput] = useState('');
  const [abaSidebar, setAbaSidebar] = useState<'insights' | 'sugestoes'>('insights');
  const [painelAberto, setPainelAberto] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  // Fecha painel ao pressionar Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setPainelAberto(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  const handleEnviar = useCallback(() => {
    const texto = input.trim();
    if (!texto || enviando) return;
    setInput('');
    enviar(texto);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [input, enviando, enviar]);

  const handleSugestao = useCallback((s: string) => {
    setInput('');
    enviar(s);
  }, [enviar]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEnviar(); }
  }, [handleEnviar]);

  return (
    // Cancela o padding do DashboardShell para layout full-bleed
    <div className="-m-4 md:-m-6 flex overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>

      {/* ── Overlay mobile (painel aberto) ────────────────────────────────── */}
      {painelAberto && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setPainelAberto(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Painel lateral esquerdo ────────────────────────────────────────── */}
      {/* Desktop: sempre visível como coluna. Mobile: drawer fixo. */}
      <aside
        className={clsx(
          'shrink-0 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-900/50 w-72 xl:w-80',
          painelAberto
            ? 'fixed top-16 bottom-0 left-0 z-30 shadow-2xl flex'
            : 'hidden lg:flex',
        )}
        aria-label="Painel de insights"
      >
        <ConteudoPainel
          abaSidebar={abaSidebar}
          setAbaSidebar={setAbaSidebar}
          onSugestao={handleSugestao}
          onFechar={() => setPainelAberto(false)}
        />
      </aside>

      {/* ── Área principal do chat ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">

        {/* Header do chat */}
        <div className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">

          {/* Botão painel (mobile) */}
          <button
            onClick={() => setPainelAberto(v => !v)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative"
            aria-label="Abrir painel de insights"
          >
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </button>

          {/* Identidade */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-destaque-500 to-purple-600 flex items-center justify-center shadow shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-none">iMestreAI</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs text-slate-400 truncate">Online · Acesso total ao ERP</p>
              </div>
            </div>
          </div>

          {/* Ações header */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 hidden sm:block">
              {Math.max(0, mensagens.filter(m => !m.loading).length - 1)} msg
            </span>
            <button onClick={limpar}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-5">
          {mensagens.map(msg => (
            <Bolha key={msg.id} msg={msg} onSugestao={handleSugestao} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 md:px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
          {/* Sugestões rápidas inline (chat vazio) */}
          {mensagens.length <= 1 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: '📊 Vendas hoje', value: 'Como estão as vendas hoje?' },
                { label: '🚨 Alertas', value: 'Quais são os alertas críticos agora?' },
                { label: '📦 Estoque', value: 'Qual o status do estoque?' },
                { label: '📋 Relatório', value: 'Gere um relatório completo de vendas' },
              ].map(s => (
                <button key={s.value} onClick={() => handleSugestao(s.value)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-marca-300 hover:text-marca-600 dark:hover:text-marca-400 transition-colors bg-slate-50 dark:bg-slate-800">
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte sobre vendas, estoque, clientes... (Enter para enviar)"
                rows={1}
                className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-marca-400 focus:border-transparent transition-all"
                style={{ minHeight: '48px', maxHeight: '120px' }}
                onInput={e => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = 'auto';
                  t.style.height = Math.min(t.scrollHeight, 120) + 'px';
                }}
                disabled={enviando}
              />
            </div>
            <button
              onClick={handleEnviar}
              disabled={!input.trim() || enviando}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-destaque-500 to-purple-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0">
              {enviando
                ? <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                : <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              }
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center hidden sm:block">
            iMestreAI analisa dados reais do seu ERP · Enter para enviar · Shift+Enter para nova linha
          </p>
        </div>
      </div>

      {/* ── Painel direito: ações rápidas (xl+) ──────────────────────────── */}
      <aside className="hidden xl:flex w-60 shrink-0 border-l border-slate-200 dark:border-slate-700 flex-col bg-slate-50 dark:bg-slate-900/50">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Ações Rápidas
          </h3>
        </div>
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          {[
            { href: '/dashboard/pedidos/balcao',   label: 'Nova Venda Balcão',    icone: ShoppingCart, cor: 'text-indigo-500' },
            { href: '/dashboard/pedidos/interna',  label: 'Novo Pedido Interno',  icone: ShoppingCart, cor: 'text-blue-500' },
            { href: '/dashboard/fiscal/nova',      label: 'Emitir NF-e',          icone: FileText,     cor: 'text-cyan-500' },
            { href: '/dashboard/estoque/entrada',  label: 'Entrada de Estoque',   icone: Package,      cor: 'text-green-500' },
            { href: '/dashboard/clientes/novo',    label: 'Novo Cliente',         icone: Users,        cor: 'text-purple-500' },
            { href: '/dashboard/estoque',          label: 'Alertas Estoque',      icone: AlertTriangle,cor: 'text-red-500' },
            { href: '/dashboard/fiscal',           label: 'Módulo Fiscal',        icone: FileText,     cor: 'text-teal-500' },
            { href: '/dashboard',                  label: 'Dashboard',            icone: BarChart3,    cor: 'text-slate-500' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <item.icone className={`w-4 h-4 ${item.cor} shrink-0`} />
              <span className="text-xs">{item.label}</span>
              <ArrowRight className="w-3 h-3 ml-auto text-slate-300 group-hover:text-marca-500 opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
          ))}
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-700 shrink-0">
          <div className="p-3 rounded-xl bg-gradient-to-br from-destaque-50 to-purple-50 dark:from-destaque-900/20 dark:to-purple-900/20 border border-destaque-200 dark:border-destaque-800">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-destaque-500" />
              <span className="text-xs font-semibold text-destaque-700 dark:text-destaque-400">iMestreAI</span>
            </div>
            <p className="text-[11px] text-destaque-600 dark:text-destaque-400 leading-relaxed">
              Acesso completo a todos os módulos do ERP.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
