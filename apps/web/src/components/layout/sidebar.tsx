'use client';

/**
 * Sidebar de navegação principal — responsiva.
 * Desktop: sempre visível (w-64).
 * Mobile: drawer deslizante acionado pelo DashboardShell.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Warehouse, ShoppingCart,
  Landmark, Store, FileText, DollarSign, Users, Bot,
  Settings, X, ShoppingBag, Megaphone, MessageCircle, BarChart2,
  BadgeDollarSign, Settings2, FileCheck2, History, Tag, MessagesSquare,
} from 'lucide-react';
import { clsx } from 'clsx';
import { LogoSidebar } from '@/components/ui/logo';

const itensMenu = [
  { href: '/dashboard',             label: 'Dashboard',   icone: LayoutDashboard },
  { href: '/dashboard/ia',          label: 'iMestreAI',   icone: Bot,  destaque: true },
  { href: '/dashboard/clientes',    label: 'Clientes',    icone: Users },
  { href: '/dashboard/produtos',    label: 'Produtos',    icone: Package },
  { href: '/dashboard/estoque',     label: 'Estoque',     icone: Warehouse },
  { href: '/dashboard/pedidos',     label: 'Pedidos',     icone: ShoppingCart },
  { href: '/dashboard/compras',     label: 'Compras',     icone: ShoppingBag },
  { href: '/dashboard/caixa',       label: 'Caixa',       icone: Landmark },
  { href: '/dashboard/marketplaces',label: 'Marketplace', icone: Store },
  { href: '/dashboard/fiscal',      label: 'Fiscal',      icone: FileText },
  { href: '/dashboard/financeiro',  label: 'Financeiro',  icone: DollarSign },
  { href: '/dashboard/cobranca',    label: 'Cobrança',    icone: BadgeDollarSign },
  { href: '/dashboard/mensagens',   label: 'Mensagens',   icone: MessagesSquare },
];

const itensRodape = [
  { href: '/dashboard/configuracoes', label: 'Configurações', icone: Settings },
];

interface SidebarProps {
  aberta?: boolean;
  onFechar?: () => void;
}

export function Sidebar({ aberta = false, onFechar }: SidebarProps) {
  const pathname = usePathname();
  const [msgNaoLidas, setMsgNaoLidas] = useState(0);

  useEffect(() => {
    const ler = () => {
      try {
        const v = localStorage.getItem('chat-nao-lidas');
        setMsgNaoLidas(v ? parseInt(v, 10) : 0);
      } catch { /* ignore */ }
    };
    ler();
    window.addEventListener('chat-unread-changed', ler);
    return () => window.removeEventListener('chat-unread-changed', ler);
  }, []);

  const conteudo = (
    <>
      {/* Logo + botão fechar (mobile) */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <Link href="/dashboard" className="flex items-center" onClick={onFechar}>
          <LogoSidebar />
        </Link>
        <button
          onClick={onFechar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Menu principal */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {itensMenu.map((item) => {
          const ativo = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const ehMarketplace = item.href === '/dashboard/marketplaces';
          const ehCobranca = item.href === '/dashboard/cobranca';
          const ehProdutos = item.href === '/dashboard/produtos';

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={onFechar}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  ativo
                    ? 'bg-marca-50 text-marca-700 dark:bg-marca-900/30 dark:text-marca-300'
                    : (item as any).destaque
                      ? 'text-destaque-600 dark:text-destaque-400 hover:bg-destaque-50 dark:hover:bg-destaque-900/20'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50',
                )}
              >
                <item.icone className="w-5 h-5 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {(item as any).destaque && !ativo && (
                  <span className="text-[10px] bg-destaque-100 dark:bg-destaque-900/30 text-destaque-600 dark:text-destaque-400 px-1.5 py-0.5 rounded-full font-semibold">
                    IA
                  </span>
                )}
                {item.href === '/dashboard/mensagens' && msgNaoLidas > 0 && !ativo && (
                  <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-marca-600 text-white text-[10px] font-bold px-1">
                    {msgNaoLidas > 99 ? '99+' : msgNaoLidas}
                  </span>
                )}
              </Link>
              {/* Sub-links de Cobrança */}
              {ehCobranca && ativo && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-marca-200 dark:border-marca-800 pl-3">
                  {[
                    { href: '/dashboard/cobranca/configuracoes', label: 'Configurações', icone: Settings2 },
                    { href: '/dashboard/cobranca/acordos',       label: 'Acordos',       icone: FileCheck2 },
                    { href: '/dashboard/cobranca/historico',     label: 'Histórico',     icone: History },
                  ].map((sub) => {
                    const subAtivo = pathname.startsWith(sub.href);
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onFechar}
                        className={clsx(
                          'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors',
                          subAtivo
                            ? 'text-marca-700 dark:text-marca-300 bg-marca-50 dark:bg-marca-900/20'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/40',
                        )}
                      >
                        <sub.icone className="w-3.5 h-3.5 shrink-0" />
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
              {/* Sub-links de Produtos */}
              {ehProdutos && ativo && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-marca-200 dark:border-marca-800 pl-3">
                  {[
                    { href: '/dashboard/produtos/etiquetas', label: 'Etiquetas', icone: Tag },
                  ].map((sub) => {
                    const subAtivo = pathname.startsWith(sub.href);
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onFechar}
                        className={clsx(
                          'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors',
                          subAtivo
                            ? 'text-marca-700 dark:text-marca-300 bg-marca-50 dark:bg-marca-900/20'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/40',
                        )}
                      >
                        <sub.icone className="w-3.5 h-3.5 shrink-0" />
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
              {/* Sub-links de Marketplace */}
              {ehMarketplace && ativo && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-marca-200 dark:border-marca-800 pl-3">
                  {[
                    { href: '/dashboard/marketplaces/anuncios',  label: 'Anúncios',  icone: Megaphone },
                    { href: '/dashboard/marketplaces/perguntas', label: 'Perguntas', icone: MessageCircle },
                    { href: '/dashboard/marketplaces/vendas',    label: 'Vendas',    icone: BarChart2 },
                  ].map((sub) => {
                    const subAtivo = pathname.startsWith(sub.href);
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onFechar}
                        className={clsx(
                          'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors',
                          subAtivo
                            ? 'text-marca-700 dark:text-marca-300 bg-marca-50 dark:bg-marca-900/20'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/40',
                        )}
                      >
                        <sub.icone className="w-3.5 h-3.5 shrink-0" />
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700 space-y-0.5 shrink-0">
        {itensRodape.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onFechar}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            <item.icone className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop — sempre visível */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col h-full">
        {conteudo}
      </aside>

      {/* Mobile — drawer deslizante */}
      <aside
        className={clsx(
          'lg:hidden fixed inset-y-0 left-0 z-30 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-transform duration-300 ease-in-out',
          aberta ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Menu de navegação"
      >
        {conteudo}
      </aside>
    </>
  );
}
