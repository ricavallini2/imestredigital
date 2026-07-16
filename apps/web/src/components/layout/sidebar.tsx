'use client';

/**
 * Sidebar de navegação principal — responsiva e recolhível.
 * Desktop: visível (w-64), recolhível para rail de ícones (w-[72px]).
 * Mobile: drawer deslizante acionado pelo DashboardShell (sempre expandido).
 *
 * Menu em árvore com grupos aninhados (ex: Cadastros > Produtos > Categorias).
 * O grupo que contém a rota ativa abre sozinho; a marcação de "ativo" usa o
 * href mais específico do menu inteiro (evita marcar pai e filho juntos).
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Landmark,
  Store,
  FileText,
  DollarSign,
  Users,
  Bot,
  Settings,
  X,
  ShoppingBag,
  Megaphone,
  MessageCircle,
  BarChart2,
  BadgeDollarSign,
  Settings2,
  FileCheck2,
  History,
  Tag,
  Tags,
  FolderTree,
  MessagesSquare,
  Grid3x3,
  BookUser,
  Hash,
  Truck,
  ClipboardList,
  UserCog,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import { clsx } from 'clsx';
import { LogoSidebar } from '@/components/ui/logo';

// ─── Modelo de menu (árvore) ─────────────────────────────────────────────────

interface ItemLink {
  tipo: 'link';
  href: string;
  label: string;
  icone: LucideIcon;
  destaque?: boolean;
  badge?: 'mensagens';
}

interface ItemGrupo {
  tipo: 'grupo';
  id: string;
  label: string;
  icone: LucideIcon;
  filhos: MenuItem[];
}

type MenuItem = ItemLink | ItemGrupo;

const MENU: MenuItem[] = [
  { tipo: 'link', href: '/dashboard', label: 'Dashboard', icone: LayoutDashboard },
  { tipo: 'link', href: '/dashboard/ia', label: 'iMestreAI', icone: Bot, destaque: true },
  {
    tipo: 'grupo',
    id: 'cadastros',
    label: 'Cadastros',
    icone: BookUser,
    filhos: [
      { tipo: 'link', href: '/dashboard/clientes', label: 'Clientes', icone: Users },
      { tipo: 'link', href: '/dashboard/cadastros/usuarios', label: 'Usuários', icone: UserCog },
      { tipo: 'link', href: '/dashboard/cadastros/cfop', label: 'CFOP', icone: Hash },
      {
        tipo: 'link',
        href: '/dashboard/compras/fornecedores',
        label: 'Fornecedores',
        icone: Truck,
      },
      {
        tipo: 'grupo',
        id: 'produtos',
        label: 'Produtos',
        icone: Package,
        filhos: [
          { tipo: 'link', href: '/dashboard/produtos', label: 'Todos os Produtos', icone: Package },
          {
            tipo: 'link',
            href: '/dashboard/produtos/categorias',
            label: 'Categorias',
            icone: FolderTree,
          },
          { tipo: 'link', href: '/dashboard/produtos/marcas', label: 'Marcas', icone: Tags },
          { tipo: 'link', href: '/dashboard/produtos/grades', label: 'Grades', icone: Grid3x3 },
          { tipo: 'link', href: '/dashboard/produtos/etiquetas', label: 'Etiquetas', icone: Tag },
        ],
      },
    ],
  },
  { tipo: 'link', href: '/dashboard/estoque', label: 'Estoque', icone: Warehouse },
  {
    tipo: 'grupo',
    id: 'vendas',
    label: 'Vendas',
    icone: ShoppingCart,
    filhos: [
      { tipo: 'link', href: '/dashboard/caixa', label: 'Caixa', icone: Landmark },
      { tipo: 'link', href: '/dashboard/pedidos', label: 'Pedidos', icone: ClipboardList },
    ],
  },
  { tipo: 'link', href: '/dashboard/compras', label: 'Compras', icone: ShoppingBag },
  {
    tipo: 'grupo',
    id: 'marketplace',
    label: 'Marketplace',
    icone: Store,
    filhos: [
      { tipo: 'link', href: '/dashboard/marketplaces', label: 'Visão Geral', icone: Store },
      {
        tipo: 'link',
        href: '/dashboard/marketplaces/anuncios',
        label: 'Anúncios',
        icone: Megaphone,
      },
      {
        tipo: 'link',
        href: '/dashboard/marketplaces/perguntas',
        label: 'Perguntas',
        icone: MessageCircle,
      },
      { tipo: 'link', href: '/dashboard/marketplaces/vendas', label: 'Vendas', icone: BarChart2 },
    ],
  },
  { tipo: 'link', href: '/dashboard/fiscal', label: 'Fiscal', icone: FileText },
  { tipo: 'link', href: '/dashboard/financeiro', label: 'Financeiro', icone: DollarSign },
  {
    tipo: 'grupo',
    id: 'cobranca',
    label: 'Cobrança',
    icone: BadgeDollarSign,
    filhos: [
      { tipo: 'link', href: '/dashboard/cobranca', label: 'Visão Geral', icone: BadgeDollarSign },
      {
        tipo: 'link',
        href: '/dashboard/cobranca/configuracoes',
        label: 'Configurações',
        icone: Settings2,
      },
      { tipo: 'link', href: '/dashboard/cobranca/acordos', label: 'Acordos', icone: FileCheck2 },
      { tipo: 'link', href: '/dashboard/cobranca/historico', label: 'Histórico', icone: History },
    ],
  },
  {
    tipo: 'link',
    href: '/dashboard/mensagens',
    label: 'Mensagens',
    icone: MessagesSquare,
    badge: 'mensagens',
  },
];

const ITEM_RODAPE = { href: '/dashboard/configuracoes', label: 'Configurações', icone: Settings };

/** Rota casa com o href (exata ou como prefixo de segmento). */
function casaRota(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(href + '/');
}

/** Todos os hrefs da subárvore (folhas). */
function coletarHrefs(itens: MenuItem[]): string[] {
  return itens.flatMap((i) => (i.tipo === 'link' ? [i.href] : coletarHrefs(i.filhos)));
}

interface SidebarProps {
  aberta?: boolean;
  onFechar?: () => void;
}

export function Sidebar({ aberta = false, onFechar }: SidebarProps) {
  const pathname = usePathname();
  const [msgNaoLidas, setMsgNaoLidas] = useState(0);
  const [recolhido, setRecolhido] = useState(false);
  const [abertos, setAbertos] = useState<Record<string, boolean>>({});

  // Estado de recolhido persistido por dispositivo.
  useEffect(() => {
    try {
      setRecolhido(localStorage.getItem('sidebar-recolhido') === '1');
    } catch {
      /* ignore */
    }
  }, []);

  const definirRecolhido = (valor: boolean) => {
    setRecolhido(valor);
    try {
      localStorage.setItem('sidebar-recolhido', valor ? '1' : '0');
    } catch {
      /* ignore */
    }
  };

  // Badge de mensagens não lidas.
  useEffect(() => {
    const ler = () => {
      try {
        const v = localStorage.getItem('chat-nao-lidas');
        setMsgNaoLidas(v ? parseInt(v, 10) : 0);
      } catch {
        /* ignore */
      }
    };
    ler();
    window.addEventListener('chat-unread-changed', ler);
    return () => window.removeEventListener('chat-unread-changed', ler);
  }, []);

  /**
   * href ativo = o mais específico do menu inteiro que casa com a rota.
   * Assim /dashboard/produtos/categorias vence /dashboard/produtos e /dashboard.
   */
  const hrefAtivo = useMemo(
    () =>
      coletarHrefs(MENU)
        .filter((h) => casaRota(h, pathname))
        .sort((a, b) => b.length - a.length)[0],
    [pathname],
  );

  const grupoTemAtivo = (grupo: ItemGrupo) =>
    !!hrefAtivo && coletarHrefs(grupo.filhos).includes(hrefAtivo);

  /** Abre todos os grupos no caminho até o href ativo (usado ao expandir do rail). */
  const abrirCaminhoAte = (grupo: ItemGrupo) => {
    const ids: Record<string, boolean> = { [grupo.id]: true };
    const percorrer = (itens: MenuItem[]) => {
      for (const i of itens) {
        if (i.tipo === 'grupo' && grupoTemAtivo(i)) {
          ids[i.id] = true;
          percorrer(i.filhos);
        }
      }
    };
    percorrer(grupo.filhos);
    setAbertos((prev) => ({ ...prev, ...ids }));
  };

  // ── Renderização recursiva ────────────────────────────────────────────────

  const renderLink = (item: ItemLink, nivel: number, recolhidoEfetivo: boolean) => {
    const estaAtivo = item.href === hrefAtivo;
    const temBadge = item.badge === 'mensagens' && msgNaoLidas > 0;

    if (recolhidoEfetivo) {
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onFechar}
          title={item.label}
          className={clsx(
            'flex items-center justify-center px-2 py-2.5 rounded-lg transition-colors',
            estaAtivo
              ? 'bg-marca-50 text-marca-700 dark:bg-marca-900/30 dark:text-marca-300'
              : item.destaque
                ? 'text-destaque-600 dark:text-destaque-400 hover:bg-destaque-50 dark:hover:bg-destaque-900/20'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50',
          )}
        >
          <span className="relative shrink-0">
            <item.icone className="w-5 h-5" />
            {temBadge && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-marca-600 ring-2 ring-white dark:ring-slate-800" />
            )}
          </span>
        </Link>
      );
    }

    const ehRaiz = nivel === 0;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onFechar}
        className={clsx(
          'flex items-center rounded-lg font-medium transition-colors',
          ehRaiz ? 'gap-3 px-3 py-2.5 text-sm' : 'gap-2 px-2 py-1.5 text-xs rounded-md',
          estaAtivo
            ? 'bg-marca-50 text-marca-700 dark:bg-marca-900/30 dark:text-marca-300'
            : item.destaque
              ? 'text-destaque-600 dark:text-destaque-400 hover:bg-destaque-50 dark:hover:bg-destaque-900/20'
              : ehRaiz
                ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/40',
        )}
      >
        <item.icone className={clsx('shrink-0', ehRaiz ? 'w-5 h-5' : 'w-3.5 h-3.5')} />
        <span className="flex-1">{item.label}</span>
        {item.destaque && !estaAtivo && (
          <span className="text-[10px] bg-destaque-100 dark:bg-destaque-900/30 text-destaque-600 dark:text-destaque-400 px-1.5 py-0.5 rounded-full font-semibold">
            IA
          </span>
        )}
        {temBadge && !estaAtivo && (
          <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-marca-600 text-white text-[10px] font-bold px-1">
            {msgNaoLidas > 99 ? '99+' : msgNaoLidas}
          </span>
        )}
      </Link>
    );
  };

  const renderGrupo = (item: ItemGrupo, nivel: number, recolhidoEfetivo: boolean) => {
    const temAtivo = grupoTemAtivo(item);
    const aberto = abertos[item.id] ?? temAtivo;

    // Rail recolhido: só o ícone — clicar expande a barra e abre o caminho.
    if (recolhidoEfetivo) {
      return (
        <button
          key={item.id}
          title={item.label}
          onClick={() => {
            definirRecolhido(false);
            abrirCaminhoAte(item);
          }}
          className={clsx(
            'flex w-full items-center justify-center px-2 py-2.5 rounded-lg transition-colors',
            temAtivo
              ? 'bg-marca-50 text-marca-700 dark:bg-marca-900/30 dark:text-marca-300'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50',
          )}
        >
          <item.icone className="w-5 h-5 shrink-0" />
        </button>
      );
    }

    const ehRaiz = nivel === 0;
    return (
      <div key={item.id}>
        <button
          onClick={() =>
            setAbertos((prev) => ({ ...prev, [item.id]: !(prev[item.id] ?? temAtivo) }))
          }
          aria-expanded={aberto}
          className={clsx(
            'flex w-full items-center rounded-lg font-medium transition-colors',
            ehRaiz ? 'gap-3 px-3 py-2.5 text-sm' : 'gap-2 px-2 py-1.5 text-xs rounded-md',
            temAtivo
              ? 'text-marca-700 dark:text-marca-300'
              : ehRaiz
                ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/40',
          )}
        >
          <item.icone className={clsx('shrink-0', ehRaiz ? 'w-5 h-5' : 'w-3.5 h-3.5')} />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            className={clsx(
              'shrink-0 text-slate-400 transition-transform',
              ehRaiz ? 'w-4 h-4' : 'w-3 h-3',
              aberto && 'rotate-180',
            )}
          />
        </button>
        {aberto && (
          <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-marca-200 dark:border-marca-800 pl-3">
            {item.filhos.map((f) => renderItem(f, nivel + 1, false))}
          </div>
        )}
      </div>
    );
  };

  const renderItem = (item: MenuItem, nivel: number, recolhidoEfetivo: boolean): React.ReactNode =>
    item.tipo === 'link'
      ? renderLink(item, nivel, recolhidoEfetivo)
      : renderGrupo(item, nivel, recolhidoEfetivo);

  // recolhidoEfetivo: mobile ignora o recolhido (drawer sempre completo).
  const renderConteudo = (recolhidoEfetivo: boolean) => (
    <>
      {/* Logo + botão fechar (mobile) */}
      <div
        className={clsx(
          'h-16 flex items-center border-b border-slate-200 dark:border-slate-700 shrink-0',
          recolhidoEfetivo ? 'justify-center px-2' : 'justify-between px-4',
        )}
      >
        <Link href="/dashboard" className="flex items-center" onClick={onFechar}>
          <LogoSidebar recolhido={recolhidoEfetivo} />
        </Link>
        {!recolhidoEfetivo && (
          <button
            onClick={onFechar}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Menu principal */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {MENU.map((item) => renderItem(item, 0, recolhidoEfetivo))}
      </nav>

      {/* Rodapé: Configurações + recolher (desktop) */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700 space-y-0.5 shrink-0">
        <Link
          href={ITEM_RODAPE.href}
          onClick={onFechar}
          title={recolhidoEfetivo ? ITEM_RODAPE.label : undefined}
          className={clsx(
            'flex items-center gap-3 rounded-lg text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors',
            recolhidoEfetivo ? 'justify-center px-2 py-2' : 'px-3 py-2',
          )}
        >
          <ITEM_RODAPE.icone className="w-4 h-4 shrink-0" />
          {!recolhidoEfetivo && ITEM_RODAPE.label}
        </Link>
        {/* Botão recolher — só desktop */}
        <button
          onClick={() => definirRecolhido(!recolhido)}
          title={recolhidoEfetivo ? 'Expandir menu' : 'Recolher menu'}
          className={clsx(
            'hidden lg:flex items-center gap-3 w-full rounded-lg text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors',
            recolhidoEfetivo ? 'justify-center px-2 py-2' : 'px-3 py-2',
          )}
        >
          {recolhidoEfetivo ? (
            <PanelLeftOpen className="w-4 h-4 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 shrink-0" />
              Recolher menu
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop — visível, recolhível */}
      <aside
        className={clsx(
          'hidden lg:flex shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col h-full transition-[width] duration-200',
          recolhido ? 'w-[72px]' : 'w-64',
        )}
      >
        {renderConteudo(recolhido)}
      </aside>

      {/* Mobile — drawer deslizante (sempre completo) */}
      <aside
        className={clsx(
          'lg:hidden fixed inset-y-0 left-0 z-30 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-transform duration-300 ease-in-out',
          aberta ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Menu de navegação"
      >
        {renderConteudo(false)}
      </aside>
    </>
  );
}
