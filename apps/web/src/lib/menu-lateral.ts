/**
 * Definição canônica do menu lateral + utilitários de ordenação.
 *
 * A ESTRUTURA (labels, ícones, hrefs, aninhamento) vive aqui, no código. O que o
 * tenant configura e persiste no backend é SÓ a ORDEM — uma árvore de ids
 * (`OrdemNo[]`). Assim, mudar um label ou adicionar um item novo no código nunca
 * corrompe a config salva: ids desconhecidos na ordem são ignorados e itens do
 * menu ausentes na ordem entram no fim (na ordem canônica).
 *
 * id estável de um nó = `href` (link) ou `id` (grupo).
 */

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
  type LucideIcon,
} from 'lucide-react';

export interface ItemLink {
  tipo: 'link';
  href: string;
  label: string;
  icone: LucideIcon;
  destaque?: boolean;
  badge?: 'mensagens';
}

export interface ItemGrupo {
  tipo: 'grupo';
  id: string;
  label: string;
  icone: LucideIcon;
  filhos: MenuItem[];
}

export type MenuItem = ItemLink | ItemGrupo;

/** Nó da ordem persistida: só id + ordem dos filhos, nada de UI. */
export interface OrdemNo {
  id: string;
  filhos?: OrdemNo[];
}

export const MENU: MenuItem[] = [
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

/** id estável de um nó: href p/ link, id p/ grupo. */
export function idNo(item: MenuItem): string {
  return item.tipo === 'link' ? item.href : item.id;
}

/**
 * Reordena o menu canônico conforme a ordem salva. Ids desconhecidos na ordem
 * são ignorados; itens do menu ausentes na ordem entram no FIM, preservando a
 * ordem canônica. Recursivo nos grupos.
 */
export function aplicarOrdem(menu: MenuItem[], ordem: OrdemNo[] | null | undefined): MenuItem[] {
  if (!ordem || ordem.length === 0) return menu;
  const porId = new Map(menu.map((m) => [idNo(m), m]));
  const usados = new Set<string>();
  const ordenados: MenuItem[] = [];

  for (const o of ordem) {
    const item = porId.get(o.id);
    if (!item || usados.has(o.id)) continue;
    usados.add(o.id);
    ordenados.push(
      item.tipo === 'grupo' ? { ...item, filhos: aplicarOrdem(item.filhos, o.filhos) } : item,
    );
  }
  // Itens canônicos não citados na ordem: vão para o fim, na ordem original.
  for (const m of menu) {
    if (!usados.has(idNo(m))) ordenados.push(m);
  }
  return ordenados;
}

/** Deriva a árvore de ordem (só ids) a partir de um menu já na ordem desejada. */
export function extrairOrdem(menu: MenuItem[]): OrdemNo[] {
  return menu.map((m) =>
    m.tipo === 'grupo' ? { id: m.id, filhos: extrairOrdem(m.filhos) } : { id: m.href },
  );
}
