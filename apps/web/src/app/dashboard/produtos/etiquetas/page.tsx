'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Tag, Printer, Search, Plus, Minus, X, Loader2, Package,
  Trash2, Check, AlignLeft, AlignCenter, Settings, Eye,
  Save, BookOpen, Pencil, Copy, MoreVertical, ChevronDown,
  Star, StarOff, Layout, AlertCircle, RotateCcw, Columns, Sparkles,
} from 'lucide-react';
import { useProdutos } from '@/hooks/useProdutos';

// ─── Types ─────────────────────────────────────────────────────────────────────

type Alinhamento = 'left' | 'center';
type TamanhoPagina = 'a4' | 'a5' | 'carta' | 'bobina80' | 'bobina58' | 'personalizado';
type OrientacaoPagina = 'retrato' | 'paisagem';

interface LayoutPagina {
  tamanhoPagina: TamanhoPagina;
  orientacao: OrientacaoPagina;
  larguraPaginaCustom: number;
  alturaPaginaCustom: number;
  larguraEtiqueta: number;
  alturaEtiqueta: number;
  colunas: number;
  linhas: number;
  margemTopo: number;
  margemBase: number;
  margemEsq: number;
  margemDir: number;
  espacoH: number;
  espacoV: number;
}

interface FontesSizes {
  nome: number;
  info: number;          // linha de marca + categoria
  variacao: number;
  sku: number;
  ean: number;
  precoOriginal: number; // preço riscado (promoção)
  preco: number;         // preço principal
}

interface ConteudoEtiqueta {
  mostrarNome: boolean;
  mostrarSku: boolean;
  mostrarEan: boolean;
  mostrarPreco: boolean;
  mostrarPrecoPromo: boolean;
  mostrarVariacao: boolean;
  mostrarMarca: boolean;
  mostrarCategoria: boolean;
  mostrarBarcode: boolean;
  corPreco: string;
  fundoColorido: boolean;
  exibirBorda: boolean;
  alinhamento: Alinhamento;
  fontes: FontesSizes;
}

interface LayoutCompleto {
  id: string;
  nome: string;
  layoutPagina: LayoutPagina;
  conteudo: ConteudoEtiqueta;
  padrao: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

interface PrintItem {
  id: string; produtoId: string; nome: string; sku: string; ean?: string;
  preco: number; precoPromocional?: number; categoria: string; marca: string;
  variacao?: string; variacaoTipo?: string; quantidade: number;
}

interface VarSel {
  id: string; tipo: string; valor: string; sku?: string; preco?: number; checked: boolean; qty: number;
}

// ─── Defaults ──────────────────────────────────────────────────────────────────

const LAYOUT_PAGINA_PADRAO: LayoutPagina = {
  tamanhoPagina: 'a4', orientacao: 'retrato',
  larguraPaginaCustom: 210, alturaPaginaCustom: 297,
  larguraEtiqueta: 63, alturaEtiqueta: 36,
  colunas: 3, linhas: 8,
  margemTopo: 10, margemBase: 10, margemEsq: 8, margemDir: 8,
  espacoH: 3, espacoV: 3,
};

const FONTES_PADRAO: FontesSizes = {
  nome: 8, info: 5.5, variacao: 6, sku: 5.5, ean: 5.5, precoOriginal: 6, preco: 11,
};

const CONTEUDO_PADRAO: ConteudoEtiqueta = {
  mostrarNome: true, mostrarSku: true, mostrarEan: false,
  mostrarPreco: true, mostrarPrecoPromo: true, mostrarVariacao: true,
  mostrarMarca: false, mostrarCategoria: false, mostrarBarcode: false,
  corPreco: '#2563eb', fundoColorido: false, exibirBorda: true, alinhamento: 'left',
  fontes: FONTES_PADRAO,
};

// Labels for per-field font sliders (cond evaluated against live ct)
const FONTES_CAMPOS: { key: keyof FontesSizes; label: string; cond: (c: ConteudoEtiqueta) => boolean }[] = [
  { key: 'nome',          label: 'Nome do produto',         cond: c => c.mostrarNome },
  { key: 'info',          label: 'Marca / Categoria',        cond: c => c.mostrarMarca || c.mostrarCategoria },
  { key: 'variacao',      label: 'Variação',                 cond: c => c.mostrarVariacao },
  { key: 'sku',           label: 'SKU',                      cond: c => c.mostrarSku },
  { key: 'ean',           label: 'EAN / GTIN',               cond: c => c.mostrarEan && !c.mostrarBarcode },
  { key: 'precoOriginal', label: 'Preço original (riscado)', cond: c => c.mostrarPreco && c.mostrarPrecoPromo },
  { key: 'preco',         label: 'Preço principal',          cond: c => c.mostrarPreco },
];

// ─── Paper presets (mm) ────────────────────────────────────────────────────────

const PAPEIS: Record<TamanhoPagina, { label: string; w: number; h: number; isBobina?: boolean }> = {
  a4:          { label: 'A4 (210×297mm)',   w: 210, h: 297 },
  a5:          { label: 'A5 (148×210mm)',   w: 148, h: 210 },
  carta:       { label: 'Carta (216×279mm)',w: 216, h: 279 },
  bobina80:    { label: 'Bobina 80mm',      w: 80,  h: 0, isBobina: true },
  bobina58:    { label: 'Bobina 58mm',      w: 58,  h: 0, isBobina: true },
  personalizado:{ label: 'Personalizado',   w: 210, h: 297 },
};

const CAMPOS: { key: keyof ConteudoEtiqueta; label: string }[] = [
  { key: 'mostrarNome',       label: 'Nome do produto' },
  { key: 'mostrarSku',        label: 'SKU / Código' },
  { key: 'mostrarEan',        label: 'EAN / GTIN' },
  { key: 'mostrarPreco',      label: 'Preço de venda' },
  { key: 'mostrarPrecoPromo', label: 'Preço promocional' },
  { key: 'mostrarVariacao',   label: 'Variação (cor/tam.)' },
  { key: 'mostrarMarca',      label: 'Marca' },
  { key: 'mostrarCategoria',  label: 'Categoria' },
  { key: 'mostrarBarcode',    label: 'Código de barras' },
];

const EXEMPLO: PrintItem = {
  id: 'ex', produtoId: 'ex',
  nome: 'iPhone 15 Pro 256GB', sku: 'APPL-IP15P-256', ean: '7891234567890',
  preco: 8999, precoPromocional: 7999,
  categoria: 'Eletrônicos', marca: 'Apple',
  variacao: '256GB', variacaoTipo: 'Capacidade', quantidade: 1,
};

const moeda  = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dtfmt  = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' });

const LS_LAYOUTS  = 'etiqueta-layouts-v2';
const LS_PAGINA   = 'etiqueta-pagina-v2';
const LS_CONTEUDO = 'etiqueta-conteudo-v2';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getPaginaDims(lp: LayoutPagina): { w: number; h: number } {
  if (lp.tamanhoPagina === 'personalizado') return { w: lp.larguraPaginaCustom, h: lp.alturaPaginaCustom };
  const p = PAPEIS[lp.tamanhoPagina];
  if (p.isBobina) return { w: p.w, h: 0 };
  return lp.orientacao === 'paisagem' ? { w: p.h, h: p.w } : { w: p.w, h: p.h };
}

function autoCalcColunas(lp: LayoutPagina): number {
  const { w } = getPaginaDims(lp);
  const area = w - lp.margemEsq - lp.margemDir;
  return Math.max(1, Math.floor((area + lp.espacoH) / (lp.larguraEtiqueta + lp.espacoH)));
}

function autoCalcLinhas(lp: LayoutPagina): number {
  const { h } = getPaginaDims(lp);
  if (h === 0) return lp.linhas; // bobina: keep manual
  const area = h - lp.margemTopo - lp.margemBase;
  return Math.max(1, Math.floor((area + lp.espacoV) / (lp.alturaEtiqueta + lp.espacoV)));
}

function gridWarning(lp: LayoutPagina): string | null {
  const { w, h } = getPaginaDims(lp);
  const usedW = lp.margemEsq + lp.margemDir + lp.colunas * lp.larguraEtiqueta + (lp.colunas - 1) * lp.espacoH;
  if (usedW > w) return `Largura excede o papel em ${(usedW - w).toFixed(1)}mm`;
  if (h > 0) {
    const usedH = lp.margemTopo + lp.margemBase + lp.linhas * lp.alturaEtiqueta + (lp.linhas - 1) * lp.espacoV;
    if (usedH > h) return `Altura excede o papel em ${(usedH - h).toFixed(1)}mm`;
  }
  return null;
}

// ─── AI Font Adjustment ───────────────────────────────────────────────────────

function ajustarFontesIA(lp: LayoutPagina, ct: ConteudoEtiqueta): FontesSizes {
  const REF_W = 63, REF_H = 36; // referência: etiqueta padrão A4 24-up
  const area = lp.larguraEtiqueta * lp.alturaEtiqueta;
  const areaScale = Math.sqrt(area / (REF_W * REF_H));
  const widthScale = Math.min(1.5, lp.larguraEtiqueta / REF_W);

  // Penalidade de densidade: mais linhas ativas = fontes menores
  const linhasAtivas = [
    ct.mostrarNome,
    ct.mostrarMarca || ct.mostrarCategoria,
    ct.mostrarVariacao,
    ct.mostrarSku,
    ct.mostrarEan && !ct.mostrarBarcode,
  ].filter(Boolean).length;
  const densidade = Math.max(0.62, 1 - (linhasAtivas - 2) * 0.075);

  const s = areaScale * densidade;
  const snap = (v: number, mn: number, mx: number) =>
    Math.round(Math.min(mx, Math.max(mn, v)) * 2) / 2; // arredonda para 0.5pt

  return {
    nome:          snap(8    * s,         5,  18),
    info:          snap(5.5  * s,         4,  10),
    variacao:      snap(6    * s,         4,  12),
    sku:           snap(5.5  * s,         4,  10),
    ean:           snap(5.5  * s,         4,  10),
    precoOriginal: snap(6    * s,         4,  12),
    // preço usa widthScale — dominado pela largura disponível
    preco:         snap(11   * Math.min(areaScale, widthScale * 1.15), 6, 26),
  };
}

function loadLayouts(): LayoutCompleto[] {
  try { return JSON.parse(localStorage.getItem(LS_LAYOUTS) ?? '[]'); } catch { return []; }
}
function saveLayouts(layouts: LayoutCompleto[]) {
  try { localStorage.setItem(LS_LAYOUTS, JSON.stringify(layouts)); } catch { /* ignore */ }
}

// ─── Barcode ──────────────────────────────────────────────────────────────────

function SimplBarcode({ code, h = 20, maxW = 130 }: { code: string; h?: number; maxW?: number }) {
  const seed = code.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < 50; i++) {
    const bw = ((seed + i * 7) % 3) + 1;
    if (i % 2 === 0) bars.push({ x, w: bw });
    x += bw + 1;
  }
  return (
    <div style={{ textAlign: 'center', maxWidth: maxW, margin: '0 auto' }}>
      <svg width="100%" viewBox={`0 0 ${x} ${h}`} style={{ display: 'block' }}>
        {bars.map((b, i) => <rect key={i} x={b.x} y={0} width={b.w} height={h} fill="#000" />)}
      </svg>
      <div style={{ fontSize: 6, fontFamily: 'monospace', marginTop: 1 }}>{code}</div>
    </div>
  );
}

// ─── Label render ──────────────────────────────────────────────────────────────

function EtiquetaLabel({ lp, ct, item = EXEMPLO, scale = 1 }: {
  lp: LayoutPagina; ct: ConteudoEtiqueta; item?: PrintItem; scale?: number;
}) {
  const MM = 3.7795;
  const w = lp.larguraEtiqueta * MM * scale;
  const h = lp.alturaEtiqueta * MM * scale;
  // Convert pt → screen px: 1pt = 0.3528mm, 1mm = MM px → 1pt = 0.3528*MM px at scale=1
  const PT = 0.3528 * MM; // px per pt at scale=1
  const f = ct.fontes ?? FONTES_PADRAO;
  const fPt = (pt: number) => Math.max(3, pt * PT * scale);
  const pad = Math.max(2, 3 * scale);

  return (
    <div style={{
      width: w, height: h, flexShrink: 0,
      border: ct.exibirBorda ? '1px solid #444' : '1px dashed #ddd',
      backgroundColor: ct.fundoColorido ? '#eff6ff' : '#fff',
      fontFamily: 'Arial, Helvetica, sans-serif',
      display: 'flex', flexDirection: 'column',
      padding: pad, gap: Math.max(1, 1.2 * scale),
      textAlign: ct.alinhamento, boxSizing: 'border-box', overflow: 'hidden',
      boxShadow: scale > 0.5 ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
    }}>
      {ct.mostrarNome && (
        <div style={{ fontSize: fPt(f.nome), fontWeight: 700, lineHeight: 1.2,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
          {item.nome}
        </div>
      )}
      {(ct.mostrarMarca || ct.mostrarCategoria) && (
        <div style={{ fontSize: fPt(f.info), color: '#666', lineHeight: 1 }}>
          {[ct.mostrarMarca && item.marca, ct.mostrarCategoria && item.categoria].filter(Boolean).join(' · ')}
        </div>
      )}
      {ct.mostrarVariacao && item.variacao && (
        <div style={{ fontSize: fPt(f.variacao), fontWeight: 600, color: '#444', lineHeight: 1 }}>
          {item.variacaoTipo}: {item.variacao}
        </div>
      )}
      {ct.mostrarSku && (
        <div style={{ fontSize: fPt(f.sku), color: '#777', fontFamily: 'monospace', lineHeight: 1 }}>{item.sku}</div>
      )}
      {ct.mostrarEan && item.ean && !ct.mostrarBarcode && (
        <div style={{ fontSize: fPt(f.ean), fontFamily: 'monospace', color: '#555' }}>{item.ean}</div>
      )}
      {ct.mostrarPreco && (
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column',
          alignItems: ct.alinhamento === 'center' ? 'center' : 'flex-start' }}>
          {ct.mostrarPrecoPromo && item.precoPromocional && item.precoPromocional < item.preco && (
            <div style={{ fontSize: fPt(f.precoOriginal), color: '#aaa', textDecoration: 'line-through', lineHeight: 1 }}>{moeda(item.preco)}</div>
          )}
          <div style={{ fontSize: fPt(f.preco), fontWeight: 900, color: ct.corPreco, lineHeight: 1 }}>
            {moeda(ct.mostrarPrecoPromo && item.precoPromocional && item.precoPromocional < item.preco
              ? item.precoPromocional : item.preco)}
          </div>
        </div>
      )}
      {ct.mostrarBarcode && (item.ean || item.sku) && (
        <div style={{ marginTop: 'auto' }}>
          <SimplBarcode code={item.ean ?? item.sku} h={h * 0.22} maxW={w - pad * 2} />
        </div>
      )}
    </div>
  );
}

// ─── Page preview ──────────────────────────────────────────────────────────────

function PagePreview({ lp, ct }: { lp: LayoutPagina; ct: ConteudoEtiqueta }) {
  const MM = 3.7795;
  const { w: pgWmm, h: pgHmm } = getPaginaDims(lp);
  const isBobina = pgHmm === 0;
  const dispH = isBobina ? (lp.linhas * (lp.alturaEtiqueta + lp.espacoV) + lp.margemTopo + lp.margemBase) : pgHmm;

  const containerW = 220;
  const containerH = 260;
  const scale = Math.min(containerW / pgWmm, containerH / dispH);

  const pgW = pgWmm * scale;
  const pgH = dispH * scale;

  const etiquetaW = lp.larguraEtiqueta * scale;
  const etiquetaH = lp.alturaEtiqueta * scale;
  const mT = lp.margemTopo * scale;
  const mL = lp.margemEsq * scale;
  const gH = lp.espacoH * scale;
  const gV = lp.espacoV * scale;

  const positions: { x: number; y: number }[] = [];
  for (let r = 0; r < lp.linhas; r++) {
    for (let c = 0; c < lp.colunas; c++) {
      positions.push({
        x: mL + c * (etiquetaW + gH),
        y: mT + r * (etiquetaH + gV),
      });
    }
  }

  return (
    <div style={{
      width: pgW, height: pgH, position: 'relative',
      backgroundColor: '#fff', border: '1.5px solid #94a3b8',
      boxShadow: '2px 2px 8px rgba(0,0,0,0.12)', flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Margin guides */}
      <div style={{
        position: 'absolute',
        top: lp.margemTopo * scale, left: lp.margemEsq * scale,
        right: lp.margemDir * scale, bottom: isBobina ? 0 : lp.margemBase * scale,
        border: '0.5px dashed #cbd5e1', pointerEvents: 'none',
      }} />
      {/* Labels */}
      {positions.map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', left: pos.x, top: pos.y,
          width: etiquetaW, height: etiquetaH,
          border: ct.exibirBorda ? '0.5px solid #475569' : '0.5px dashed #cbd5e1',
          backgroundColor: ct.fundoColorido ? '#dbeafe' : '#f8fafc',
          boxSizing: 'border-box', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          gap: 1,
        }}>
          {ct.mostrarNome && (
            <div style={{ width: '80%', height: 2, backgroundColor: '#475569', borderRadius: 1 }} />
          )}
          {(ct.mostrarSku || ct.mostrarPreco) && (
            <div style={{ width: '60%', height: 1.5, backgroundColor: '#94a3b8', borderRadius: 1 }} />
          )}
          {ct.mostrarPreco && (
            <div style={{ width: '50%', height: 2.5, backgroundColor: ct.corPreco, borderRadius: 1 }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Modals ────────────────────────────────────────────────────────────────────

function ModalNomeLayout({ titulo, nomePadrao = '', onClose, onSalvar }: {
  titulo: string; nomePadrao?: string; onClose: () => void; onSalvar: (nome: string) => void;
}) {
  const [nome, setNome] = useState(nomePadrao);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">{titulo}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><X className="h-4 w-4 text-slate-400" /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); const n = nome.trim(); if (n) { onSalvar(n); onClose(); } }} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Nome do layout</label>
            <input ref={inputRef} value={nome} onChange={e => setNome(e.target.value)} maxLength={40}
              placeholder="Ex: A4 Preço Grande, Bobina Promoção..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 px-3 py-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500" />
            <p className="mt-1 text-[11px] text-slate-400 text-right">{nome.length}/40</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancelar</button>
            <button type="submit" disabled={!nome.trim()} className="flex-1 rounded-xl bg-marca-600 py-2.5 text-sm font-semibold text-white hover:bg-marca-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              <Save className="h-4 w-4" /> Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalConfirm({ msg, onClose, onConfirm }: { msg: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-xs shadow-2xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 dark:text-slate-300">{msg}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors">Excluir</button>
        </div>
      </div>
    </div>
  );
}

function ModalVariacoes({ produto, onClose, onAdicionar }: {
  produto: any; onClose: () => void; onAdicionar: (items: Omit<PrintItem, 'id'>[]) => void;
}) {
  const vars = (produto.variacoes ?? []).filter((v: any) => v.tipo !== 'Única');
  const [sel, setSel] = useState<VarSel[]>(vars.map((v: any) => ({
    id: v.id, tipo: v.tipo, valor: v.valor, sku: v.sku, preco: v.preco ?? produto.preco, checked: true, qty: 1,
  })));
  const toggle = (id: string) => setSel(s => s.map(v => v.id === id ? { ...v, checked: !v.checked } : v));
  const setQty = (id: string, qty: number) => setSel(s => s.map(v => v.id === id ? { ...v, qty: Math.max(1, qty) } : v));
  const handle = () => {
    sel.filter(v => v.checked).forEach(v => onAdicionar([{
      produtoId: produto.id, nome: produto.nome, sku: v.sku ?? produto.sku, ean: produto.ean,
      preco: v.preco ?? produto.preco, precoPromocional: produto.precoPromocional,
      categoria: produto.categoria, marca: produto.marca, variacao: v.valor, variacaoTipo: v.tipo, quantidade: v.qty,
    }]));
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div><h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Selecionar Variações</h3><p className="text-xs text-slate-500 mt-0.5 truncate max-w-[220px]">{produto.nome}</p></div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><X className="h-4 w-4 text-slate-400" /></button>
        </div>
        <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
          {sel.map(v => (
            <div key={v.id} className={`flex items-center gap-3 rounded-xl border p-2.5 cursor-pointer transition-colors ${v.checked ? 'border-marca-300 bg-marca-50 dark:border-marca-700 dark:bg-marca-900/20' : 'border-slate-200 dark:border-slate-700'}`} onClick={() => toggle(v.id)}>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${v.checked ? 'bg-marca-600 border-marca-600' : 'border-slate-300 dark:border-slate-600'}`}>{v.checked && <Check className="h-2.5 w-2.5 text-white" />}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{v.tipo}: {v.valor}</p>{v.sku && <p className="text-xs text-slate-400 font-mono">{v.sku}</p>}</div>
              {v.preco && <p className="text-xs font-bold text-marca-600 flex-shrink-0">{moeda(v.preco)}</p>}
              {v.checked && (
                <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setQty(v.id, v.qty - 1)} className="w-6 h-6 rounded-md border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"><Minus className="h-3 w-3" /></button>
                  <span className="w-6 text-center text-xs font-semibold">{v.qty}</span>
                  <button onClick={() => setQty(v.id, v.qty + 1)} className="w-6 h-6 rounded-md border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"><Plus className="h-3 w-3" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancelar</button>
          <button onClick={handle} disabled={!sel.some(v => v.checked)} className="flex-1 rounded-xl bg-marca-600 py-2 text-sm font-semibold text-white hover:bg-marca-700 disabled:opacity-50 transition-colors">Adicionar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Layout Card ───────────────────────────────────────────────────────────────

function LayoutCard({ layout, ativo, onCarregar, onRenomear, onDuplicar, onExcluir, onTogglePadrao }: {
  layout: LayoutCompleto; ativo: boolean;
  onCarregar: () => void; onRenomear: () => void; onDuplicar: () => void;
  onExcluir: () => void; onTogglePadrao: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menuOpen]);

  const pgLabel = PAPEIS[layout.layoutPagina.tamanhoPagina]?.label ?? layout.layoutPagina.tamanhoPagina;
  const total = layout.layoutPagina.colunas * layout.layoutPagina.linhas;

  return (
    <div className={`group relative rounded-2xl border-2 transition-all cursor-pointer ${ativo ? 'border-marca-500 bg-marca-50 dark:bg-marca-900/20 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}`}>
      {/* Mini page preview */}
      <div className="p-3 pb-0 flex items-center justify-center" onClick={onCarregar}>
        <div style={{ transform: 'scale(0.9)', transformOrigin: 'center top' }}>
          <PagePreview lp={{ ...layout.layoutPagina, linhas: Math.min(layout.layoutPagina.linhas, 4), colunas: Math.min(layout.layoutPagina.colunas, 3) }} ct={layout.conteudo} />
        </div>
      </div>

      {/* Info */}
      <div className="px-3 pb-3 mt-1" onClick={onCarregar}>
        <div className="flex items-start gap-1">
          <p className={`text-xs font-semibold leading-tight line-clamp-1 flex-1 ${ativo ? 'text-marca-700 dark:text-marca-300' : 'text-slate-800 dark:text-slate-200'}`}>{layout.nome}</p>
          {layout.padrao && <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />}
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {layout.layoutPagina.colunas}×{layout.layoutPagina.linhas} = {total} etiq. · {layout.layoutPagina.larguraEtiqueta}×{layout.layoutPagina.alturaEtiqueta}mm
        </p>
        <p className="text-[10px] text-slate-400">{pgLabel.split(' ')[0]} · {dtfmt(layout.atualizadoEm)}</p>
        {ativo && <span className="inline-block mt-1 rounded-full bg-marca-600 px-2 py-0.5 text-[10px] font-semibold text-white">Em uso</span>}
      </div>

      {/* Menu */}
      <div className="absolute top-2 right-2" ref={menuRef}>
        <button onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
          className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600">
          <MoreVertical className="h-3.5 w-3.5 text-slate-500" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
            {[
              { label: 'Carregar layout', icon: <Layout className="h-3.5 w-3.5" />, action: onCarregar },
              { label: 'Renomear',        icon: <Pencil className="h-3.5 w-3.5" />, action: onRenomear },
              { label: 'Duplicar',        icon: <Copy className="h-3.5 w-3.5" />,   action: onDuplicar },
              { label: layout.padrao ? 'Remover padrão' : 'Definir padrão', icon: layout.padrao ? <StarOff className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />, action: onTogglePadrao },
            ].map(it => (
              <button key={it.label} onClick={() => { it.action(); setMenuOpen(false); }}
                className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                {it.icon} {it.label}
              </button>
            ))}
            <div className="border-t border-slate-100 dark:border-slate-700" />
            <button onClick={() => { onExcluir(); setMenuOpen(false); }}
              className="w-full px-3 py-2 text-left text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
              <Trash2 className="h-3.5 w-3.5" /> Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NumInput ─────────────────────────────────────────────────────────────────

function NumInput({ label, value, onChange, min = 0, max = 9999, step = 1, unit = 'mm', hint }: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; unit?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number" value={value} min={min} max={max} step={step}
          onChange={e => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-2 py-1.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-marca-400 tabular-nums"
        />
        <span className="text-[11px] text-slate-400 shrink-0">{unit}</span>
      </div>
      {hint && <p className="mt-0.5 text-[10px] text-slate-400">{hint}</p>}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? 'bg-marca-600' : 'bg-slate-200 dark:bg-slate-600'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function EtiquetasPage() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<'pagina' | 'conteudo'>('pagina');

  const [lp, setLp] = useState<LayoutPagina>(LAYOUT_PAGINA_PADRAO);
  const [ct, setCt] = useState<ConteudoEtiqueta>(CONTEUDO_PADRAO);
  const [items, setItems] = useState<PrintItem[]>([]);
  const [busca, setBusca] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [addModal, setAddModal] = useState<any | null>(null);

  const [layouts, setLayouts] = useState<LayoutCompleto[]>([]);
  const [layoutAtivo, setLayoutAtivo] = useState<string | null>(null);
  const [layoutsExpandido, setLayoutsExpandido] = useState(true);
  const [modalSalvar, setModalSalvar] = useState(false);
  const [modalRenomear, setModalRenomear] = useState<string | null>(null);
  const [modalExcluir, setModalExcluir] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [aiAjustando, setAiAjustando] = useState(false);

  const { data, isLoading } = useProdutos({ pagina: 1, limite: 100 });
  const produtos = (data?.dados ?? []) as any[];

  // ── Init ──
  useEffect(() => {
    try {
      const sp = localStorage.getItem(LS_PAGINA);
      const sc = localStorage.getItem(LS_CONTEUDO);
      if (sp) setLp(JSON.parse(sp));
      if (sc) setCt(JSON.parse(sc));
    } catch { /* ignore */ }
    const ls = loadLayouts();
    setLayouts(ls);
    const padrao = ls.find(l => l.padrao);
    if (padrao) { setLp(padrao.layoutPagina); setCt(padrao.conteudo); setLayoutAtivo(padrao.id); }
    // Load print queue from session if navigated here with pre-filled products
    try {
      const si = sessionStorage.getItem('etiqueta-items');
      if (si) { const parsed = JSON.parse(si); if (parsed?.length) setItems(parsed); sessionStorage.removeItem('etiqueta-items'); }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_PAGINA, JSON.stringify(lp)); } catch { /* ignore */ }
  }, [lp]);

  useEffect(() => {
    try { localStorage.setItem(LS_CONTEUDO, JSON.stringify(ct)); } catch { /* ignore */ }
  }, [ct]);

  const toast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 2800); };

  const setPage = <K extends keyof LayoutPagina>(key: K, val: LayoutPagina[K]) => {
    setLp(p => ({ ...p, [key]: val }));
    setLayoutAtivo(null);
  };

  const setContent = <K extends keyof ConteudoEtiqueta>(key: K, val: ConteudoEtiqueta[K]) => {
    setCt(c => ({ ...c, [key]: val }));
    setLayoutAtivo(null);
  };

  const setFonte = (key: keyof FontesSizes, val: number) => {
    setCt(c => ({ ...c, fontes: { ...(c.fontes ?? FONTES_PADRAO), [key]: val } }));
    setLayoutAtivo(null);
  };

  const handleAjustarIA = () => {
    setAiAjustando(true);
    setTimeout(() => {
      const fontes = ajustarFontesIA(lp, ct);
      setCt(c => ({ ...c, fontes }));
      setLayoutAtivo(null);
      setAiAjustando(false);
      toast('Fontes ajustadas pela IA!');
    }, 1400);
  };

  // Shortcuts
  const setCols = (v: number) => setPage('colunas', Math.max(1, v));
  const setRows = (v: number) => setPage('linhas', Math.max(1, v));

  // Auto calc
  const handleAutoCols = () => setCols(autoCalcColunas(lp));
  const handleAutoRows = () => { const r = autoCalcLinhas(lp); if (r !== lp.linhas) setPage('linhas', r); };

  // Paper change
  const handlePapelChange = (t: TamanhoPagina) => {
    const p = PAPEIS[t];
    setLp(prev => {
      const next = { ...prev, tamanhoPagina: t };
      if (p.isBobina) { next.orientacao = 'retrato'; }
      return next;
    });
    setLayoutAtivo(null);
  };

  // ── Layouts CRUD ──
  const salvarLayout = useCallback((nome: string) => {
    const now = new Date().toISOString();
    const novo: LayoutCompleto = { id: `l-${Date.now()}`, nome, layoutPagina: lp, conteudo: ct, padrao: layouts.length === 0, criadoEm: now, atualizadoEm: now };
    const updated = [...layouts, novo];
    setLayouts(updated); saveLayouts(updated); setLayoutAtivo(novo.id);
    toast(`Layout "${nome}" salvo!`);
  }, [lp, ct, layouts]);

  const atualizarLayout = useCallback((id: string) => {
    const now = new Date().toISOString();
    const updated = layouts.map(l => l.id === id ? { ...l, layoutPagina: lp, conteudo: ct, atualizadoEm: now } : l);
    setLayouts(updated); saveLayouts(updated); setLayoutAtivo(id);
    toast('Layout atualizado!');
  }, [lp, ct, layouts]);

  const renomearLayout = useCallback((id: string, nome: string) => {
    const updated = layouts.map(l => l.id === id ? { ...l, nome, atualizadoEm: new Date().toISOString() } : l);
    setLayouts(updated); saveLayouts(updated); toast('Layout renomeado!');
  }, [layouts]);

  const duplicarLayout = useCallback((id: string) => {
    const orig = layouts.find(l => l.id === id); if (!orig) return;
    const now = new Date().toISOString();
    const copia: LayoutCompleto = { ...orig, id: `l-${Date.now()}`, nome: `${orig.nome} (cópia)`, padrao: false, criadoEm: now, atualizadoEm: now };
    const updated = [...layouts, copia]; setLayouts(updated); saveLayouts(updated); toast('Layout duplicado!');
  }, [layouts]);

  const excluirLayout = useCallback((id: string) => {
    const updated = layouts.filter(l => l.id !== id); setLayouts(updated); saveLayouts(updated);
    if (layoutAtivo === id) setLayoutAtivo(null); toast('Layout excluído.');
  }, [layouts, layoutAtivo]);

  const carregarLayout = useCallback((layout: LayoutCompleto) => {
    setLp(layout.layoutPagina); setCt(layout.conteudo); setLayoutAtivo(layout.id);
    toast(`Layout "${layout.nome}" carregado`);
  }, []);

  const togglePadrao = useCallback((id: string) => {
    const updated = layouts.map(l => ({ ...l, padrao: l.id === id ? !l.padrao : false }));
    setLayouts(updated); saveLayouts(updated);
  }, [layouts]);

  // ── Fila ──
  const produtosFiltrados = useMemo(() => {
    if (!busca.trim()) return [];
    const q = busca.toLowerCase();
    return produtos.filter(p => p.nome?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)).slice(0, 8);
  }, [produtos, busca]);

  const addItem = (item: Omit<PrintItem, 'id'>) =>
    setItems(prev => [...prev, { ...item, id: `${item.produtoId}-${item.sku}-${Date.now()}` }]);

  const handleSelectProduto = (p: any) => {
    setBusca(''); setShowDropdown(false);
    const vars = (p.variacoes ?? []).filter((v: any) => v.tipo !== 'Única');
    if (vars.length > 1) { setAddModal(p); }
    else {
      const v = p.variacoes?.[0];
      addItem({ produtoId: p.id, nome: p.nome, sku: v?.sku ?? p.sku, ean: p.ean, preco: v?.preco ?? p.preco, precoPromocional: p.precoPromocional, categoria: p.categoria, marca: p.marca, variacao: v?.tipo !== 'Única' ? v?.valor : undefined, variacaoTipo: v?.tipo !== 'Única' ? v?.tipo : undefined, quantidade: 1 });
    }
  };

  const totalEtiquetas = items.reduce((s, i) => s + i.quantidade, 0);

  const handleImprimir = () => {
    try {
      sessionStorage.setItem('etiqueta-layout-pagina', JSON.stringify(lp));
      sessionStorage.setItem('etiqueta-conteudo', JSON.stringify(ct));
      sessionStorage.setItem('etiqueta-items', JSON.stringify(items));
    } catch { /* ignore */ }
    window.open('/dashboard/produtos/etiquetas/imprimir', '_blank');
  };

  // ── Derived ──
  const { w: pgW, h: pgH } = getPaginaDims(lp);
  const isBobina = pgH === 0;
  const totalPorPagina = lp.colunas * lp.linhas;
  const warning = gridWarning(lp);
  const layoutAtivoObj = layouts.find(l => l.id === layoutAtivo);
  const temAlteracoes = layoutAtivo && (
    JSON.stringify(layoutAtivoObj?.layoutPagina) !== JSON.stringify(lp) ||
    JSON.stringify(layoutAtivoObj?.conteudo) !== JSON.stringify(ct)
  );

  // Preview scale for label zoom
  const MM = 3.7795;
  const labelPreviewScale = Math.min(300 / (lp.larguraEtiqueta * MM), 200 / (lp.alturaEtiqueta * MM));

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900 dark:bg-slate-700 text-white px-4 py-3 shadow-2xl text-sm font-medium flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-400" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Tag className="h-7 w-7 text-marca-600" /> Etiquetas
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm">Configure a página, salve layouts e imprima</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {layoutAtivo && temAlteracoes ? (
            <button onClick={() => atualizarLayout(layoutAtivo)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 px-4 py-2.5 text-sm font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors">
              <Save className="h-4 w-4" /> Atualizar layout
            </button>
          ) : (
            <button onClick={() => setModalSalvar(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Save className="h-4 w-4" /> Salvar layout
            </button>
          )}
          <button onClick={handleImprimir} disabled={items.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-marca-600 px-5 py-2.5 font-semibold text-white hover:bg-marca-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
            <Printer className="h-4 w-4" />
            {totalEtiquetas > 0 ? `Imprimir ${totalEtiquetas} etiqueta${totalEtiquetas !== 1 ? 's' : ''}` : 'Imprimir Etiquetas'}
          </button>
        </div>
      </div>

      {/* ── Layouts salvos ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <button onClick={() => setLayoutsExpandido(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-4 w-4 text-marca-500" />
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Layouts Salvos</span>
            {layouts.length > 0 && <span className="rounded-full bg-marca-100 dark:bg-marca-900/30 px-2 py-0.5 text-[10px] font-bold text-marca-700 dark:text-marca-300">{layouts.length}</span>}
            {layoutAtivoObj && (
              <span className="text-xs text-slate-400 hidden sm:inline">
                — <span className="font-medium text-marca-600 dark:text-marca-400">{layoutAtivoObj.nome}</span>
                {temAlteracoes && <span className="ml-1 text-amber-500 font-semibold">• alterado</span>}
              </span>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${layoutsExpandido ? 'rotate-180' : ''}`} />
        </button>
        {layoutsExpandido && (
          <div className="border-t border-slate-100 dark:border-slate-700 p-4">
            {layouts.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-slate-400 dark:text-slate-500">
                <Layout className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm font-medium">Nenhum layout salvo ainda</p>
                <p className="text-xs mt-1 mb-4">Configure o layout e clique em "Salvar layout"</p>
                <button onClick={() => setModalSalvar(true)} className="flex items-center gap-1.5 rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 transition-colors"><Save className="h-4 w-4" /> Salvar configuração atual</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {layouts.map(layout => (
                    <LayoutCard key={layout.id} layout={layout} ativo={layoutAtivo === layout.id}
                      onCarregar={() => carregarLayout(layout)} onRenomear={() => setModalRenomear(layout.id)}
                      onDuplicar={() => duplicarLayout(layout.id)} onExcluir={() => setModalExcluir(layout.id)}
                      onTogglePadrao={() => togglePadrao(layout.id)} />
                  ))}
                  <button onClick={() => setModalSalvar(true)}
                    className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 hover:border-marca-400 dark:hover:border-marca-500 transition-colors flex flex-col items-center justify-center gap-2 p-4 text-slate-400 hover:text-marca-600 dark:hover:text-marca-400 min-h-[140px]">
                    <Plus className="h-6 w-6" />
                    <span className="text-xs font-medium text-center">Salvar como novo</span>
                  </button>
                </div>
                <p className="mt-3 text-[11px] text-slate-400 text-center">Clique para carregar · ⋮ para mais opções · <Star className="h-3 w-3 inline text-amber-400 fill-amber-400" /> = padrão</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Configurador + Preview ── */}
      <div className="flex flex-col xl:flex-row gap-5 items-start">

        {/* Left: Tabs de configuração */}
        <div className="w-full xl:w-80 shrink-0 space-y-4">

          {/* Layout ativo indicator */}
          {layoutAtivoObj && (
            <div className={`rounded-xl px-3 py-2.5 flex items-center gap-2.5 text-xs border ${temAlteracoes ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'}`}>
              {temAlteracoes ? <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" /> : <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${temAlteracoes ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>{layoutAtivoObj.nome}</p>
                <p className={`${temAlteracoes ? 'text-amber-600 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-500'}`}>{temAlteracoes ? 'Alterações não salvas' : 'Layout ativo'}</p>
              </div>
              {temAlteracoes && <button onClick={() => atualizarLayout(layoutAtivo!)} className="shrink-0 rounded-lg bg-amber-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-amber-700 transition-colors">Salvar</button>}
            </div>
          )}

          {/* Tabs */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <div className="flex border-b border-slate-100 dark:border-slate-700">
              {[
                { id: 'pagina' as const,   label: 'Layout da Página', icon: <Layout className="h-3.5 w-3.5" /> },
                { id: 'conteudo' as const, label: 'Conteúdo',         icon: <Tag className="h-3.5 w-3.5" /> },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${tab === t.id ? 'text-marca-700 dark:text-marca-300 bg-marca-50 dark:bg-marca-900/20 border-b-2 border-marca-500' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-4">
              {tab === 'pagina' && (
                <>
                  {/* Papel */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Papel</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(Object.entries(PAPEIS) as [TamanhoPagina, typeof PAPEIS[TamanhoPagina]][]).map(([key, p]) => (
                        <button key={key} onClick={() => handlePapelChange(key)}
                          className={`rounded-lg border-2 px-2.5 py-2 text-left text-xs transition-colors ${lp.tamanhoPagina === key ? 'border-marca-500 bg-marca-50 dark:bg-marca-900/20 text-marca-700 dark:text-marca-300 font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Personalizado dims */}
                  {lp.tamanhoPagina === 'personalizado' && (
                    <div className="grid grid-cols-2 gap-2">
                      <NumInput label="Larg. papel" value={lp.larguraPaginaCustom} onChange={v => setPage('larguraPaginaCustom', v)} min={30} max={500} />
                      <NumInput label="Alt. papel" value={lp.alturaPaginaCustom} onChange={v => setPage('alturaPaginaCustom', v)} min={30} max={1000} />
                    </div>
                  )}

                  {/* Orientação */}
                  {!isBobina && lp.tamanhoPagina !== 'personalizado' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Orientação</label>
                      <div className="flex gap-2">
                        {(['retrato', 'paisagem'] as OrientacaoPagina[]).map(o => (
                          <button key={o} onClick={() => setPage('orientacao', o)}
                            className={`flex-1 rounded-lg border-2 py-2 text-xs font-medium transition-colors ${lp.orientacao === o ? 'border-marca-500 bg-marca-50 dark:bg-marca-900/20 text-marca-700 dark:text-marca-300' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}>
                            {o === 'retrato' ? '↕ Retrato' : '↔ Paisagem'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tamanho da etiqueta */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Tamanho da etiqueta</label>
                    <div className="grid grid-cols-2 gap-2">
                      <NumInput label="Largura" value={lp.larguraEtiqueta} onChange={v => setPage('larguraEtiqueta', v)} min={10} max={500} hint={`Papel: ${pgW}mm`} />
                      <NumInput label="Altura" value={lp.alturaEtiqueta} onChange={v => setPage('alturaEtiqueta', v)} min={5} max={500} hint={pgH > 0 ? `Papel: ${pgH}mm` : 'Contínuo'} />
                    </div>
                  </div>

                  {/* Colunas e linhas */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Grade de etiquetas</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Colunas</label>
                        <div className="flex items-center gap-1">
                          <input type="number" value={lp.colunas} min={1} max={20} onChange={e => setCols(Number(e.target.value))}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-2 py-1.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-marca-400 tabular-nums" />
                          <button onClick={handleAutoCols} title="Calcular automaticamente" className="shrink-0 p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">{isBobina ? 'Qtd etiq.' : 'Linhas'}</label>
                        <div className="flex items-center gap-1">
                          <input type="number" value={lp.linhas} min={1} max={50} onChange={e => setRows(Number(e.target.value))}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-2 py-1.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-marca-400 tabular-nums" />
                          {!isBobina && (
                            <button onClick={handleAutoRows} title="Calcular automaticamente" className="shrink-0 p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info box */}
                    <div className={`mt-2.5 rounded-xl px-3 py-2 text-xs flex items-center gap-2 ${warning ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700'}`}>
                      {warning ? (
                        <><AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" /><span className="text-red-600 dark:text-red-400">{warning}</span></>
                      ) : (
                        <><Columns className="h-3.5 w-3.5 text-marca-500 shrink-0" /><span className="text-slate-600 dark:text-slate-400"><strong>{lp.colunas} × {lp.linhas} = {totalPorPagina}</strong> etiquetas por página</span></>
                      )}
                    </div>
                  </div>

                  {/* Margens */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Margens da página (mm)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <NumInput label="Topo"      value={lp.margemTopo}  onChange={v => setPage('margemTopo', v)}  max={100} />
                      <NumInput label="Base"      value={lp.margemBase}  onChange={v => setPage('margemBase', v)}  max={100} />
                      <NumInput label="Esquerda"  value={lp.margemEsq}   onChange={v => setPage('margemEsq', v)}   max={100} />
                      <NumInput label="Direita"   value={lp.margemDir}   onChange={v => setPage('margemDir', v)}   max={100} />
                    </div>
                  </div>

                  {/* Espaçamento */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Espaço entre etiquetas (mm)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <NumInput label="Horizontal" value={lp.espacoH} onChange={v => setPage('espacoH', v)} max={50} />
                      <NumInput label="Vertical"   value={lp.espacoV} onChange={v => setPage('espacoV', v)} max={50} />
                    </div>
                  </div>
                </>
              )}

              {tab === 'conteudo' && (
                <>
                  {/* Campos */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Campos visíveis</label>
                    <div className="space-y-2">
                      {CAMPOS.map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setContent(key as any, !ct[key as keyof ConteudoEtiqueta])}>
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${ct[key as keyof ConteudoEtiqueta] ? 'bg-marca-600 border-marca-600' : 'border-slate-300 dark:border-slate-600 group-hover:border-marca-400'}`}>
                            {ct[key as keyof ConteudoEtiqueta] && <Check className="h-2.5 w-2.5 text-white" />}
                          </div>
                          <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Estilo */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Estilo</label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 dark:text-slate-300">Cor do preço</span>
                        <div className="flex items-center gap-2">
                          <input type="color" value={ct.corPreco} onChange={e => setContent('corPreco', e.target.value)} className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer p-0.5" />
                          <span className="text-[11px] font-mono text-slate-400">{ct.corPreco}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {['#2563eb','#16a34a','#dc2626','#7c3aed','#ea580c','#0f172a'].map(c => (
                          <button key={c} onClick={() => setContent('corPreco', c)}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${ct.corPreco === c ? 'border-slate-800 dark:border-white scale-110' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 dark:text-slate-300">Borda na etiqueta</span>
                        <Toggle value={ct.exibirBorda} onChange={v => setContent('exibirBorda', v)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 dark:text-slate-300">Fundo azul claro</span>
                        <Toggle value={ct.fundoColorido} onChange={v => setContent('fundoColorido', v)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 dark:text-slate-300">Alinhamento</span>
                        <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
                          {(['left', 'center'] as Alinhamento[]).map(a => (
                            <button key={a} onClick={() => setContent('alinhamento', a)}
                              className={`p-1.5 transition-colors ${ct.alinhamento === a ? 'bg-marca-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                              {a === 'left' ? <AlignLeft className="h-3.5 w-3.5" /> : <AlignCenter className="h-3.5 w-3.5" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Tamanho das fontes ── */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Header com botão IA */}
                    <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Tamanho das fontes
                      </label>
                      <button
                        onClick={handleAjustarIA}
                        disabled={aiAjustando}
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white transition-all disabled:opacity-70"
                        style={{ background: aiAjustando ? '#7c3aed' : 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                      >
                        {aiAjustando
                          ? <><Loader2 className="h-3 w-3 animate-spin" /> Ajustando...</>
                          : <><Sparkles className="h-3 w-3" /> Ajustar com IA</>
                        }
                      </button>
                    </div>

                    {/* Sliders por campo ativo */}
                    <div className="p-3 space-y-2.5">
                      {(() => {
                        const fontes = ct.fontes ?? FONTES_PADRAO;
                        const ativos = FONTES_CAMPOS.filter(f => f.cond(ct));
                        if (ativos.length === 0) return (
                          <p className="text-xs text-slate-400 text-center py-2">
                            Ative campos acima para ajustar as fontes
                          </p>
                        );
                        return ativos.map(({ key, label }) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 w-[100px] shrink-0 truncate leading-none">
                              {label}
                            </span>
                            <input
                              type="range" min={4} max={28} step={0.5}
                              value={fontes[key]}
                              onChange={e => setFonte(key, Number(e.target.value))}
                              className="flex-1 h-1.5 cursor-pointer accent-marca-600"
                            />
                            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 w-9 text-right tabular-nums shrink-0">
                              {fontes[key]}pt
                            </span>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* Restaurar padrão */}
                    {JSON.stringify(ct.fontes ?? FONTES_PADRAO) !== JSON.stringify(FONTES_PADRAO) && (
                      <div className="px-3 pb-2.5">
                        <button
                          onClick={() => { setCt(c => ({ ...c, fontes: FONTES_PADRAO })); setLayoutAtivo(null); }}
                          className="text-[11px] text-slate-400 hover:text-marca-600 underline transition-colors"
                        >
                          Restaurar fontes padrão
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: previews + fila */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Previews side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Página preview */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3 flex items-center gap-2">
                <Layout className="h-4 w-4 text-slate-400" /> Página
              </h3>
              <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 rounded-xl p-4 min-h-[200px]">
                <PagePreview lp={lp} ct={ct} />
              </div>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                {pgW}×{pgH > 0 ? pgH : '∞'}mm · {lp.colunas}×{lp.linhas} = <strong>{totalPorPagina}</strong> por pág.
              </p>
            </div>

            {/* Etiqueta zoom */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4 text-slate-400" /> Etiqueta
              </h3>
              <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 rounded-xl p-4 min-h-[200px]">
                <EtiquetaLabel lp={lp} ct={ct} item={EXEMPLO} scale={labelPreviewScale} />
              </div>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                {lp.larguraEtiqueta}×{lp.alturaEtiqueta}mm · Dados de exemplo
              </p>
            </div>
          </div>

          {/* Fila */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Fila de Impressão
                {items.length > 0 && <span className="ml-2 text-xs font-normal text-slate-400">{items.length} produto(s) · {totalEtiquetas} etiqueta(s)</span>}
              </h3>
              {items.length > 0 && <button onClick={() => setItems([])} className="text-xs text-red-500 hover:text-red-700">Limpar tudo</button>}
            </div>

            {/* Busca */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 relative">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input ref={searchRef} value={busca} onChange={e => { setBusca(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)} placeholder="Buscar produto para adicionar à fila..."
                  className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none" />
                {busca && <button onClick={() => { setBusca(''); setShowDropdown(false); }}><X className="h-3.5 w-3.5 text-slate-400" /></button>}
                {isLoading && <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin" />}
              </div>
              {showDropdown && busca && (
                <div className="absolute left-4 right-4 top-full mt-1 z-30 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
                  {produtosFiltrados.length === 0
                    ? <div className="px-4 py-3 text-sm text-slate-500 text-center">Nenhum produto encontrado</div>
                    : produtosFiltrados.map(p => {
                        const vars = (p.variacoes ?? []).filter((v: any) => v.tipo !== 'Única');
                        return (
                          <button key={p.id} onClick={() => handleSelectProduto(p)}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition-colors border-b border-slate-50 dark:border-slate-700 last:border-0">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-base shrink-0">📦</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{p.nome}</p>
                              <p className="text-xs text-slate-400 font-mono">{p.sku}{vars.length > 1 && <span className="ml-2 text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{vars.length} var.</span>}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-semibold text-marca-600">{moeda(p.preco)}</p>
                            </div>
                          </button>
                        );
                      })}
                </div>
              )}
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-slate-400 dark:text-slate-500">
                <Package className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">Nenhum produto na fila</p>
                <p className="text-xs mt-1">Busque e adicione produtos acima</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Produto</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">SKU</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Preço</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-slate-500 uppercase">Qtd</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                    {items.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                        <td className="px-4 py-2.5">
                          <p className="font-medium text-slate-800 dark:text-slate-200 text-xs line-clamp-1">{item.nome}</p>
                          {item.variacao && <p className="text-[10px] text-slate-400 mt-0.5">{item.variacaoTipo}: {item.variacao}</p>}
                        </td>
                        <td className="px-4 py-2.5 hidden sm:table-cell"><span className="text-xs font-mono text-slate-500">{item.sku}</span></td>
                        <td className="px-4 py-2.5 text-right hidden sm:table-cell"><span className="text-xs font-semibold text-marca-600">{moeda(item.preco)}</span></td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantidade: Math.max(1, i.quantidade - 1) } : i))}
                              className="w-6 h-6 rounded-md border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><Minus className="h-3 w-3" /></button>
                            <span className="w-8 text-center text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-200">{item.quantidade}</span>
                            <button onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i))}
                              className="w-6 h-6 rounded-md border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><Plus className="h-3 w-3" /></button>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <p className="text-xs text-slate-500">{totalEtiquetas} etiqueta{totalEtiquetas !== 1 ? 's' : ''} · ~{Math.ceil(totalEtiquetas / totalPorPagina)} página{Math.ceil(totalEtiquetas / totalPorPagina) !== 1 ? 's' : ''}</p>
                  <button onClick={handleImprimir} className="flex items-center gap-1.5 rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 transition-colors">
                    <Printer className="h-3.5 w-3.5" /> Imprimir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalSalvar && <ModalNomeLayout titulo="Salvar como novo layout" nomePadrao={layoutAtivoObj ? `${layoutAtivoObj.nome} (novo)` : ''} onClose={() => setModalSalvar(false)} onSalvar={salvarLayout} />}
      {modalRenomear && <ModalNomeLayout titulo="Renomear layout" nomePadrao={layouts.find(l => l.id === modalRenomear)?.nome ?? ''} onClose={() => setModalRenomear(null)} onSalvar={n => renomearLayout(modalRenomear, n)} />}
      {modalExcluir && <ModalConfirm msg={`Excluir "${layouts.find(l => l.id === modalExcluir)?.nome}"?`} onClose={() => setModalExcluir(null)} onConfirm={() => excluirLayout(modalExcluir)} />}
      {addModal && <ModalVariacoes produto={addModal} onClose={() => setAddModal(null)} onAdicionar={its => its.forEach(addItem)} />}
      {showDropdown && busca && <div className="fixed inset-0 z-20" onClick={() => setShowDropdown(false)} />}
    </div>
  );
}
