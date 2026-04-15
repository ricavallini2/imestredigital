'use client';

/**
 * Header da área autenticada — responsivo.
 * Mobile: hamburger menu + busca compacta.
 * Desktop: busca expandida + botão iMestreAI.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, Bell, Bot, User, X, Package, ShoppingCart,
  Users, ArrowRight, Loader2, Menu, Settings, LogOut,
  ShoppingBag, AlertTriangle, MessageSquare, FileText,
  BadgeDollarSign, CheckCheck, Store,
} from 'lucide-react';
import { useBuscaGlobal } from '@/hooks/useIA';
import { useDebounce } from '@/hooks/useDebounce';
import { useNotificacoes, type NotificacaoItem } from '@/hooks/useNotificacoes';

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const STATUS_COR: Record<string, string> = {
  ATIVO:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  INATIVO:    'bg-slate-100 text-slate-500',
  PENDENTE:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  CONFIRMADO: 'bg-blue-100 text-blue-700',
  ENTREGUE:   'bg-green-100 text-green-700',
  CANCELADO:  'bg-red-100 text-red-700',
  ENVIADO:    'bg-sky-100 text-sky-700',
  FATURADO:   'bg-cyan-100 text-cyan-700',
  SEPARANDO:  'bg-purple-100 text-purple-700',
};

// ─── Notification helpers ─────────────────────────────────────────────────────

function IconeNotif({ tipo }: { tipo: NotificacaoItem['tipo'] }) {
  const cls = 'w-4 h-4';
  if (tipo === 'pedido')      return <ShoppingBag     className={`${cls} text-blue-500`} />;
  if (tipo === 'estoque')     return <AlertTriangle   className={`${cls} text-amber-500`} />;
  if (tipo === 'marketplace') return <Store           className={`${cls} text-purple-500`} />;
  if (tipo === 'fiscal')      return <FileText        className={`${cls} text-cyan-500`} />;
  if (tipo === 'cobranca')    return <BadgeDollarSign className={`${cls} text-red-500`} />;
  return <Bell className={cls} />;
}

const COR_NOTIF: Record<NotificacaoItem['tipo'], string> = {
  pedido:      'bg-blue-50 dark:bg-blue-950/30',
  estoque:     'bg-amber-50 dark:bg-amber-950/30',
  marketplace: 'bg-purple-50 dark:bg-purple-950/30',
  fiscal:      'bg-cyan-50 dark:bg-cyan-950/30',
  cobranca:    'bg-red-50 dark:bg-red-950/30',
};

const COR_PRIORIDADE: Record<NotificacaoItem['prioridade'], string> = {
  critica: 'bg-red-500',
  alta:    'bg-amber-500',
  normal:  'bg-marca-500',
};

function tempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1)  return 'agora';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24)   return `${h} h`;
  return `${Math.floor(h / 24)} d`;
}

// ─── Header ───────────────────────────────────────────────────────────────────

interface HeaderProps {
  onAbrirMenu?: () => void;
}

export function Header({ onAbrirMenu }: HeaderProps) {
  const router = useRouter();
  const [query, setQuery]   = useState('');
  const [aberto, setAberto] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);

  const { data: notifData, isLoading: notifLoading } = useNotificacoes();
  const [lidasIds, setLidasIds]   = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('notif-lidas') ?? '[]')); } catch { return new Set(); }
  });
  const [showNotif, setShowNotif] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);

  const notifs = notifData ?? [];
  const naoLidasNotifs = notifs.filter(n => !lidasIds.has(n.id));

  const inputRef    = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef    = useRef<HTMLDivElement>(null);
  const perfilRef   = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);
  const { data, isFetching } = useBuscaGlobal(debouncedQuery, aberto);

  const total = (data?.produtos?.length ?? 0) + (data?.pedidos?.length ?? 0) + (data?.clientes?.length ?? 0);
  const naoLidas = naoLidasNotifs.length;

  const currentUser = useMemo(() => {
    try {
      const u = localStorage.getItem('user');
      if (u) return JSON.parse(u);
    } catch { /* ignore */ }
    return { nome: 'Administrador', email: 'admin@empresa.com', cargo: 'admin' };
  }, []);

  const cargoLabel: Record<string, string> = {
    admin: 'Administrador', gerente: 'Gerente',
    operador: 'Operador', visualizador: 'Visualizador',
  };

  // Fecha busca ao clicar fora
  useEffect(() => {
    function h(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current   && !inputRef.current.contains(e.target as Node)
      ) setAberto(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Fecha notif/perfil ao clicar fora
  useEffect(() => {
    function h(e: MouseEvent) {
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))  setShowNotif(false);
      if (perfilRef.current && !perfilRef.current.contains(e.target as Node)) setShowPerfil(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Ctrl+K / Escape
  useEffect(() => {
    function h(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setBuscaAberta(true);
        setTimeout(() => inputRef.current?.focus(), 50);
        setAberto(true);
      }
      if (e.key === 'Escape') {
        setAberto(false); setQuery(''); setBuscaAberta(false);
        setShowNotif(false); setShowPerfil(false);
      }
    }
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  const handleSelect = useCallback((href: string) => {
    setAberto(false); setQuery(''); setBuscaAberta(false); router.push(href);
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim().length >= 2) {
      setAberto(false); setBuscaAberta(false);
      router.push(`/dashboard/pedidos?busca=${encodeURIComponent(query)}`);
    }
  }, [query, router]);

  const marcarTodasLidas = useCallback(() => {
    const ids = new Set(notifs.map(n => n.id));
    setLidasIds(ids);
    try { localStorage.setItem('notif-lidas', JSON.stringify([...ids])); } catch { /* ignore */ }
  }, [notifs]);

  const marcarLida = useCallback((id: string) => {
    setLidasIds(prev => {
      const next = new Set(prev); next.add(id);
      try { localStorage.setItem('notif-lidas', JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const handleLogout = useCallback(() => {
    try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch { /* ignore */ }
    router.push('/login');
  }, [router]);

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3 px-3 md:px-6 relative z-40 shrink-0">

      {/* Hamburger (mobile) */}
      <button
        onClick={onAbrirMenu}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Busca */}
      <div className={`relative flex-1 max-w-xl ${buscaAberta ? 'flex' : 'hidden md:flex'}`}>
        <div className="relative w-full">
          {isFetching
            ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-marca-400 animate-spin pointer-events-none" />
            : <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          }
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setAberto(true); }}
            onFocus={() => setAberto(true)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar produtos, pedidos, clientes... (Ctrl+K)"
            className="input-padrao pl-10 h-10 pr-8 w-full text-sm"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setAberto(false); setBuscaAberta(false); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>

        {/* Dropdown de resultados */}
        {aberto && query.trim().length >= 2 && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto"
          >
            {isFetching && !total && (
              <div className="flex items-center gap-2 px-4 py-4 text-sm text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" /> Buscando...
              </div>
            )}
            {!isFetching && !total && (
              <div className="px-4 py-5 text-sm text-slate-400 text-center">
                <Search className="w-7 h-7 mx-auto mb-2 opacity-30" />
                Nenhum resultado para <strong>"{query}"</strong>
              </div>
            )}

            {(data?.produtos?.length ?? 0) > 0 && (
              <section>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700">
                  <Package className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Produtos</span>
                </div>
                {data!.produtos.map(p => (
                  <button key={p.id} onClick={() => handleSelect(p.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors text-left group border-b border-slate-50 dark:border-slate-700/30 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{p.nome}</p>
                      <p className="text-xs text-slate-400">{p.sku} · {p.categoria}</p>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{fmt(p.preco)}</p>
                      <p className="text-xs text-slate-400">Est: {p.estoque}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-marca-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  </button>
                ))}
              </section>
            )}

            {(data?.pedidos?.length ?? 0) > 0 && (
              <section>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-700">
                  <ShoppingCart className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pedidos</span>
                </div>
                {data!.pedidos.map(p => (
                  <button key={p.id} onClick={() => handleSelect(p.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors text-left group border-b border-slate-50 dark:border-slate-700/30 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{p.numero}</p>
                      <p className="text-xs text-slate-400 truncate">{p.cliente} · {p.canal.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{fmt(p.valor)}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_COR[p.status] ?? 'bg-slate-100 text-slate-500'}`}>{p.status}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-marca-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  </button>
                ))}
              </section>
            )}

            {(data?.clientes?.length ?? 0) > 0 && (
              <section>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-700">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Clientes</span>
                </div>
                {data!.clientes.map(c => (
                  <button key={c.id} onClick={() => handleSelect(c.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors text-left group border-b border-slate-50 dark:border-slate-700/30 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{c.nome}</p>
                      <p className="text-xs text-slate-400 truncate">{c.email}</p>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{fmt(c.totalCompras)}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_COR[c.status] ?? ''}`}>{c.status}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-marca-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  </button>
                ))}
              </section>
            )}

            {total > 0 && (
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-400">{total} resultado(s)</span>
                <Link href="/dashboard/ia" onClick={() => { setAberto(false); setQuery(''); setBuscaAberta(false); }}
                  className="text-xs text-destaque-500 hover:underline flex items-center gap-1">
                  <Bot className="w-3 h-3" /> Perguntar à IA
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Busca mobile */}
      {!buscaAberta && (
        <button
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
          onClick={() => { setBuscaAberta(true); setTimeout(() => inputRef.current?.focus(), 50); setAberto(true); }}
          aria-label="Abrir busca"
        >
          <Search className="w-5 h-5" />
        </button>
      )}

      {!buscaAberta && <div className="flex-1 md:hidden" />}

      {/* Ações */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/dashboard/ia"
          className="flex items-center gap-1.5 px-2.5 py-2 md:px-3 rounded-lg bg-gradient-to-r from-destaque-500 to-purple-600 text-white hover:opacity-90 transition-opacity text-sm font-medium shadow-sm">
          <Bot className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">iMestreAI</span>
        </Link>

        {/* ── Notificações ── */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotif(v => !v); setShowPerfil(false); }}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Notificações"
          >
            <Bell className="w-5 h-5" />
            {naoLidas > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold px-0.5">
                {naoLidas > 9 ? '9+' : naoLidas}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Notificações</span>
                  {naoLidas > 0 && (
                    <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full font-bold">
                      {naoLidas} não lida{naoLidas !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {naoLidas > 0 && (
                  <button
                    onClick={marcarTodasLidas}
                    className="flex items-center gap-1 text-xs text-marca-600 dark:text-marca-400 hover:underline"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Marcar todas como lidas
                  </button>
                )}
              </div>

              {/* Lista */}
              <div className="max-h-80 overflow-y-auto">
                {notifLoading && (
                  <div className="flex items-center gap-2 px-4 py-5 text-sm text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" /> Carregando...
                  </div>
                )}
                {!notifLoading && notifs.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-slate-400">
                    Nenhuma notificação no momento
                  </div>
                )}
                {notifs.map(n => {
                  const lida = lidasIds.has(n.id);
                  return (
                    <button
                      key={n.id}
                      onClick={() => { marcarLida(n.id); setShowNotif(false); router.push(n.href); }}
                      className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors text-left border-b border-slate-50 dark:border-slate-700/30 last:border-0 ${!lida ? 'bg-marca-50/40 dark:bg-marca-900/10' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${COR_NOTIF[n.tipo]}`}>
                        <IconeNotif tipo={n.tipo} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!lida ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                          {n.titulo}
                        </p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{n.desc}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-[10px] text-slate-400">{tempoRelativo(n.criadoEm)}</span>
                        {!lida && <span className={`w-2 h-2 rounded-full ${COR_PRIORIDADE[n.prioridade]}`} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Rodapé */}
              <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
                <button
                  onClick={() => setShowNotif(false)}
                  className="w-full text-xs text-marca-600 dark:text-marca-400 hover:underline text-center"
                >
                  Ver todas as notificações
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Perfil ── */}
        <div ref={perfilRef} className="relative">
          <button
            onClick={() => { setShowPerfil(v => !v); setShowNotif(false); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Meu perfil"
          >
            <div className="w-8 h-8 bg-marca-100 dark:bg-marca-900 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-marca-600 dark:text-marca-300" />
            </div>
          </button>

          {showPerfil && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-marca-100 dark:bg-marca-900 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-marca-600 dark:text-marca-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {currentUser?.nome ?? 'Usuário'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {currentUser?.email ?? ''}
                    </p>
                    <span className="inline-block mt-0.5 text-[10px] bg-marca-100 dark:bg-marca-900/40 text-marca-600 dark:text-marca-400 px-1.5 py-0.5 rounded-full font-medium">
                      {cargoLabel[currentUser?.cargo] ?? 'Usuário'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <div className="py-1">
                <Link
                  href="/dashboard/configuracoes"
                  onClick={() => setShowPerfil(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Configurações
                </Link>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
