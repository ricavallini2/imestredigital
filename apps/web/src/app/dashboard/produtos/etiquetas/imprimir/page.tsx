'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type TamanhoPagina = 'a4' | 'a5' | 'carta' | 'bobina80' | 'bobina58' | 'personalizado';
type OrientacaoPagina = 'retrato' | 'paisagem';
type Alinhamento = 'left' | 'center';

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
  info: number;
  variacao: number;
  sku: number;
  ean: number;
  precoOriginal: number;
  preco: number;
}

const FONTES_PADRAO: FontesSizes = {
  nome: 8, info: 5.5, variacao: 6, sku: 5.5, ean: 5.5, precoOriginal: 6, preco: 11,
};

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
  fontes?: FontesSizes; // optional for backwards compat
}

interface PrintItem {
  id: string; produtoId: string; nome: string; sku: string; ean?: string;
  preco: number; precoPromocional?: number; categoria: string; marca: string;
  variacao?: string; variacaoTipo?: string; quantidade: number;
}

// ─── Paper presets (mm) ───────────────────────────────────────────────────────

const PAPEIS: Record<TamanhoPagina, { w: number; h: number; isBobina?: boolean }> = {
  a4:            { w: 210, h: 297 },
  a5:            { w: 148, h: 210 },
  carta:         { w: 216, h: 279 },
  bobina80:      { w: 80,  h: 0, isBobina: true },
  bobina58:      { w: 58,  h: 0, isBobina: true },
  personalizado: { w: 210, h: 297 },
};

function getPaginaDims(lp: LayoutPagina): { w: number; h: number; isBobina: boolean } {
  if (lp.tamanhoPagina === 'personalizado') {
    return { w: lp.larguraPaginaCustom, h: lp.alturaPaginaCustom, isBobina: false };
  }
  const p = PAPEIS[lp.tamanhoPagina];
  if (p.isBobina) return { w: p.w, h: 0, isBobina: true };
  const dims = lp.orientacao === 'paisagem' ? { w: p.h, h: p.w } : { w: p.w, h: p.h };
  return { ...dims, isBobina: false };
}

const moeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ─── Barcode ──────────────────────────────────────────────────────────────────

function SimplBarcode({ code, hMm }: { code: string; hMm: number }) {
  const seed = code.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < 50; i++) {
    const bw = ((seed + i * 7) % 3) + 1;
    if (i % 2 === 0) bars.push({ x, w: bw });
    x += bw + 1;
  }
  return (
    <div style={{ textAlign: 'center', margin: '0 auto', maxWidth: '90%' }}>
      <svg width="100%" viewBox={`0 0 ${x} 20`} style={{ display: 'block', height: `${hMm}mm` }}>
        {bars.map((b, i) => <rect key={i} x={b.x} y={0} width={b.w} height={20} fill="#000" />)}
      </svg>
      <div style={{ fontSize: '5.5pt', fontFamily: 'monospace', marginTop: '0.5mm' }}>{code}</div>
    </div>
  );
}

// ─── Single label ─────────────────────────────────────────────────────────────

function PrintLabel({ lp, ct, item }: { lp: LayoutPagina; ct: ConteudoEtiqueta; item: PrintItem }) {
  const f = ct.fontes ?? FONTES_PADRAO;
  const pt = (v: number) => `${v}pt`;

  return (
    <div style={{
      width: `${lp.larguraEtiqueta}mm`,
      height: `${lp.alturaEtiqueta}mm`,
      border: ct.exibirBorda ? '0.3mm solid #333' : '0.3mm solid transparent',
      backgroundColor: ct.fundoColorido ? '#eff6ff' : '#ffffff',
      fontFamily: 'Arial, Helvetica, sans-serif',
      display: 'flex', flexDirection: 'column',
      padding: '1.5mm', gap: '0.4mm',
      textAlign: ct.alinhamento,
      boxSizing: 'border-box', overflow: 'hidden',
      breakInside: 'avoid', pageBreakInside: 'avoid',
      flexShrink: 0,
    }}>
      {ct.mostrarNome && (
        <div style={{
          fontSize: pt(f.nome), fontWeight: 700, lineHeight: 1.2,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
        }}>
          {item.nome}
        </div>
      )}
      {(ct.mostrarMarca || ct.mostrarCategoria) && (
        <div style={{ fontSize: pt(f.info), color: '#666', lineHeight: 1 }}>
          {[ct.mostrarMarca && item.marca, ct.mostrarCategoria && item.categoria].filter(Boolean).join(' · ')}
        </div>
      )}
      {ct.mostrarVariacao && item.variacao && (
        <div style={{ fontSize: pt(f.variacao), fontWeight: 600, color: '#444', lineHeight: 1 }}>
          {item.variacaoTipo}: {item.variacao}
        </div>
      )}
      {ct.mostrarSku && (
        <div style={{ fontSize: pt(f.sku), color: '#777', fontFamily: 'monospace', lineHeight: 1 }}>
          {item.sku}
        </div>
      )}
      {ct.mostrarEan && item.ean && !ct.mostrarBarcode && (
        <div style={{ fontSize: pt(f.ean), fontFamily: 'monospace', color: '#555' }}>{item.ean}</div>
      )}
      {ct.mostrarPreco && (
        <div style={{
          marginTop: 'auto', display: 'flex', flexDirection: 'column',
          alignItems: ct.alinhamento === 'center' ? 'center' : 'flex-start',
        }}>
          {ct.mostrarPrecoPromo && item.precoPromocional && item.precoPromocional < item.preco && (
            <div style={{ fontSize: pt(f.precoOriginal), color: '#aaa', textDecoration: 'line-through', lineHeight: 1 }}>
              {moeda(item.preco)}
            </div>
          )}
          <div style={{ fontSize: pt(f.preco), fontWeight: 900, color: ct.corPreco, lineHeight: 1 }}>
            {moeda(
              ct.mostrarPrecoPromo && item.precoPromocional && item.precoPromocional < item.preco
                ? item.precoPromocional
                : item.preco
            )}
          </div>
        </div>
      )}
      {ct.mostrarBarcode && (item.ean || item.sku) && (
        <div style={{ marginTop: 'auto' }}>
          <SimplBarcode code={(item.ean ?? item.sku)!} hMm={lp.alturaEtiqueta * 0.25} />
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ImprimirEtiquetasPage() {
  const router = useRouter();
  const [lp, setLp] = useState<LayoutPagina | null>(null);
  const [ct, setCt] = useState<ConteudoEtiqueta | null>(null);
  const [items, setItems] = useState<PrintItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const rawLp    = sessionStorage.getItem('etiqueta-layout-pagina');
      const rawCt    = sessionStorage.getItem('etiqueta-conteudo');
      const rawItems = sessionStorage.getItem('etiqueta-items');
      if (rawLp)    setLp(JSON.parse(rawLp));
      if (rawCt)    setCt(JSON.parse(rawCt));
      if (rawItems) setItems(JSON.parse(rawItems));
    } catch { /* ignore parse errors */ }
    setReady(true);
  }, []);

  // Auto-print once data is loaded
  useEffect(() => {
    if (ready && lp && ct && items.length > 0) {
      const t = setTimeout(() => window.print(), 700);
      return () => clearTimeout(t);
    }
  }, [ready, lp, ct, items]);

  // Expand items by quantity
  const expandedLabels = items.flatMap(item =>
    Array.from({ length: item.quantidade }, (_, idx) => ({ ...item, _key: `${item.id}-${idx}` }))
  );
  const totalEtiquetas = items.reduce((s, i) => s + i.quantidade, 0);

  if (!ready) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-marca-500" />
    </div>
  );

  if (!lp || !ct || items.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-slate-500">
      <p className="text-lg font-medium">Nenhuma etiqueta para imprimir</p>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao configurador
      </button>
    </div>
  );

  const { w: pgW, h: pgH, isBobina } = getPaginaDims(lp);
  const labelsPerPage = lp.colunas * lp.linhas;

  // Paginate labels
  const pages: typeof expandedLabels[] = [];
  if (isBobina) {
    pages.push(expandedLabels); // continuous roll — no page breaks
  } else {
    for (let i = 0; i < expandedLabels.length; i += labelsPerPage) {
      pages.push(expandedLabels.slice(i, i + labelsPerPage));
    }
  }

  const pageSize = isBobina ? `${pgW}mm auto` : `${pgW}mm ${pgH}mm`;
  const labelInfo = `${lp.larguraEtiqueta}×${lp.alturaEtiqueta}mm · ${lp.colunas} col × ${lp.linhas} lin`;

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; background: white; }
          .print-page { box-shadow: none !important; margin: 0 !important; }
        }
        @page {
          size: ${pageSize};
          margin: 0;
        }
      `}</style>

      {/* Screen-only action bar */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-slate-800 text-white flex items-center gap-3 px-4 py-2 shadow-lg">
        <button
          onClick={() => window.close()}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Fechar
        </button>
        <span className="text-slate-400 text-sm flex-1">
          {totalEtiquetas} etiqueta{totalEtiquetas !== 1 ? 's' : ''} · {labelInfo}
          {!isBobina && ` · ${pages.length} página${pages.length !== 1 ? 's' : ''}`}
        </span>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg bg-marca-600 hover:bg-marca-700 px-4 py-1.5 text-sm font-semibold transition-colors"
        >
          <Printer className="h-4 w-4" /> Imprimir / Salvar PDF
        </button>
      </div>
      <div className="no-print" style={{ height: 48 }} />

      {/* Print content */}
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#e5e7eb',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}>
        {pages.map((page, pageIdx) => {
          const isLast = pageIdx === pages.length - 1;
          return (
            <div
              key={pageIdx}
              className="print-page"
              style={{
                width: `${pgW}mm`,
                minHeight: isBobina ? undefined : `${pgH}mm`,
                backgroundColor: '#fff',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                boxSizing: 'border-box',
                paddingTop:    `${lp.margemTopo}mm`,
                paddingBottom: `${lp.margemBase}mm`,
                paddingLeft:   `${lp.margemEsq}mm`,
                paddingRight:  `${lp.margemDir}mm`,
                pageBreakAfter: !isLast ? 'always' : 'auto',
                breakAfter:     !isLast ? 'page'   : 'auto',
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${lp.colunas}, ${lp.larguraEtiqueta}mm)`,
                columnGap: `${lp.espacoH}mm`,
                rowGap:    `${lp.espacoV}mm`,
                alignContent: 'start',
              }}>
                {page.map(item => (
                  <PrintLabel key={item._key} lp={lp} ct={ct} item={item} />
                ))}
                {/* Empty placeholder cells to preserve grid alignment on last page */}
                {!isBobina && isLast && page.length % lp.colunas !== 0 &&
                  Array.from({ length: lp.colunas - (page.length % lp.colunas) }).map((_, i) => (
                    <div key={`ph-${i}`} style={{
                      width: `${lp.larguraEtiqueta}mm`,
                      height: `${lp.alturaEtiqueta}mm`,
                    }} />
                  ))
                }
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
