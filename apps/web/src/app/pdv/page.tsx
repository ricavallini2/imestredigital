'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ShoppingCart, Plus, Minus, Search, X, Wallet,
  Banknote, Smartphone, CreditCard, Loader2, CheckCircle2,
  FileText, Receipt, ChevronRight, LockKeyhole,
  AlertTriangle, Package, Monitor, Headphones, Footprints,
  Shirt, Backpack, Camera, Tag, SplitSquareHorizontal,
  Trash2, ArrowLeft, Layers,
} from 'lucide-react';
import { useCatalogoPedidos, useCriarPedido } from '@/hooks/usePedidos';
import { useCaixaAtual } from '@/hooks/useCaixa';
import type { VariacaoCatalogo } from '@/services/pedidos.service';

// ─── Types ────────────────────────────────────────────────────────────────────

type FormaPgto = 'DINHEIRO' | 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO';

interface CartItem {
  produtoId: string;
  nome: string;
  sku: string;
  categoria: string;
  preco: number;         // preço efetivo (variação ou base)
  quantidade: number;
  desconto: number;
  variacaoId?: string;
  variacaoLabel?: string; // ex: "Tamanho: 42"
}

interface PagamentoEntry {
  id: string;
  forma: FormaPgto;
  valor: string;
  parcelas: number;
}

type ProdutoCatalogo = {
  id: string; nome: string; sku: string; preco: number; estoque: number;
  categoria?: string; marca?: string; variacoes: VariacaoCatalogo[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const uid = () => Math.random().toString(36).slice(2, 9);

const CATEGORIAS = ['Todos', 'Eletrônicos', 'Informática', 'Calçados', 'Vestuário', 'Acessórios', 'Áudio', 'Câmeras', 'Smartphones', 'Computadores'];

const CAT_ICON: Record<string, React.ElementType> = {
  Smartphones:  Monitor,
  Eletrônicos:  Monitor,
  Informática:  Monitor,
  Computadores: Monitor,
  Áudio:        Headphones,
  Câmeras:      Camera,
  Calçados:     Footprints,
  Vestuário:    Shirt,
  Acessórios:   Backpack,
};

const CAT_COLOR: Record<string, string> = {
  Smartphones:  'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  Eletrônicos:  'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  Informática:  'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  Computadores: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  Áudio:        'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  Câmeras:      'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
  Calçados:     'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  Vestuário:    'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  Acessórios:   'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
};

const PGTO_LABELS: Record<FormaPgto, { label: string; short: string; Icon: React.ElementType }> = {
  DINHEIRO:       { label: 'Dinheiro',  short: 'DIN', Icon: Banknote   },
  PIX:            { label: 'PIX',       short: 'PIX', Icon: Smartphone },
  CARTAO_CREDITO: { label: 'Crédito',   short: 'CRD', Icon: CreditCard },
  CARTAO_DEBITO:  { label: 'Débito',    short: 'DBT', Icon: CreditCard },
};

function stockBadge(estoque: number) {
  if (estoque === 0) return <span className="text-[10px] font-semibold text-red-500">Sem estoque</span>;
  if (estoque <= 5)  return <span className="text-[10px] font-semibold text-amber-500">Baixo ({estoque})</span>;
  return <span className="text-[10px] text-slate-400">Estoque: {estoque}</span>;
}

// ─── Variation Picker Modal ───────────────────────────────────────────────────

function VariacaoPickerModal({
  produto,
  onSelect,
  onClose,
}: {
  produto: ProdutoCatalogo;
  onSelect: (variacao: VariacaoCatalogo) => void;
  onClose: () => void;
}) {
  const tipoLabel = produto.variacoes[0]?.tipo ?? 'Variação';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700 px-5 py-4">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{tipoLabel}</p>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight line-clamp-2">{produto.nome}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{produto.sku}</p>
          </div>
          <button onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Variation grid */}
        <div className="p-4 grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
          {produto.variacoes.map((v) => {
            const precoDiferente = v.preco !== produto.preco;
            const semEstoque = v.estoque === 0;
            return (
              <button key={v.id} onClick={() => !semEstoque && onSelect(v)} disabled={semEstoque}
                className={`group relative rounded-xl border p-3 text-left transition-all
                  ${semEstoque
                    ? 'border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                    : 'border-slate-200 dark:border-slate-700 hover:border-marca-400 hover:bg-marca-50 dark:hover:bg-marca-900/10 hover:shadow-sm cursor-pointer active:scale-95'}`}>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{v.valor}</p>
                <p className={`text-xs font-semibold mt-0.5 ${precoDiferente ? 'text-marca-600 dark:text-marca-400' : 'text-slate-500'}`}>
                  {fmt(v.preco)}
                  {precoDiferente && <span className="ml-1 text-[9px] bg-marca-100 dark:bg-marca-900/30 text-marca-600 dark:text-marca-400 px-1 rounded">diferenciado</span>}
                </p>
                <div className="mt-1.5">{stockBadge(v.estoque)}</div>
                {v.sku && <p className="text-[9px] text-slate-300 dark:text-slate-600 font-mono mt-0.5">{v.sku}</p>}
              </button>
            );
          })}
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700 px-5 py-3">
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Caixa Fechado ───────────────────────────────────────────────────────────

function CaixaFechadoScreen() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-slate-50 dark:bg-slate-900 px-4 text-center">
      <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-6">
        <LockKeyhole className="h-16 w-16 text-amber-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Caixa Fechado</h2>
        <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400">
          Para realizar vendas no balcão, é necessário ter um caixa aberto.
          Acesse o módulo de Caixa e inicie uma nova sessão.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/dashboard/caixa"
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-600 transition-colors">
          <Wallet className="h-4 w-4" /> Abrir Caixa
        </Link>
        <Link href="/dashboard/pedidos"
          className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 px-6 py-3 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PdvPage() {
  const { data: caixaAtual, isLoading: loadingCaixa } = useCaixaAtual();
  const { data: catalogo, isLoading: loadingCatalogo } = useCatalogoPedidos();
  const criar = useCriarPedido();

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [desconto, setDesconto] = useState('');

  // Search & filter
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const inputRef = useRef<HTMLInputElement>(null);

  // Variation picker
  const [variacaoPicker, setVariacaoPicker] = useState<ProdutoCatalogo | null>(null);

  // Payments (multiple)
  const [pagamentos, setPagamentos] = useState<PagamentoEntry[]>([
    { id: uid(), forma: 'PIX', valor: '', parcelas: 1 },
  ]);

  // Misc
  const [vendedor, setVendedor] = useState('');
  const [sucesso, setSucesso] = useState<{ numero: string; id: string } | null>(null);
  const [erroMsg, setErroMsg] = useState<string | null>(null);

  const produtos = (catalogo?.produtos ?? []) as ProdutoCatalogo[];

  // Get unique categories from actual products
  const categoriasDisponiveis = ['Todos', ...Array.from(new Set(produtos.map((p) => p.categoria).filter(Boolean)))];

  const produtosFiltrados = produtos.filter((p) => {
    const matchBusca = !busca || p.nome.toLowerCase().includes(busca.toLowerCase()) || p.sku.toLowerCase().includes(busca.toLowerCase());
    const matchCat = categoria === 'Todos' || p.categoria === categoria;
    return matchBusca && matchCat;
  });

  // ── Cart helpers ──────────────────────────────────────────────────────────

  const addItemDirect = useCallback((prod: ProdutoCatalogo, variacao?: VariacaoCatalogo) => {
    const preco = variacao?.preco ?? prod.preco;
    const variacaoId = variacao?.id;
    const variacaoLabel = variacao ? `${variacao.tipo}: ${variacao.valor}` : undefined;
    const cartKey = variacaoId ? `${prod.id}::${variacaoId}` : prod.id;

    setCart((prev) => {
      const idx = prev.findIndex((i) => {
        const key = i.variacaoId ? `${i.produtoId}::${i.variacaoId}` : i.produtoId;
        return key === cartKey;
      });
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantidade: next[idx].quantidade + 1 };
        return next;
      }
      return [...prev, {
        produtoId: prod.id, nome: prod.nome,
        sku: variacao?.sku ?? prod.sku,
        categoria: prod.categoria ?? '',
        preco, quantidade: 1, desconto: 0,
        variacaoId, variacaoLabel,
      }];
    });
    setBusca('');
    inputRef.current?.focus();
  }, []);

  const handleProductClick = useCallback((prod: ProdutoCatalogo) => {
    if (prod.variacoes.length > 0) {
      setVariacaoPicker(prod);
    } else {
      addItemDirect(prod);
    }
  }, [addItemDirect]);

  const handleVariacaoSelect = (variacao: VariacaoCatalogo) => {
    if (!variacaoPicker) return;
    addItemDirect(variacaoPicker, variacao);
    setVariacaoPicker(null);
  };

  const removeItem = (cartKey: string) => setCart((p) => p.filter((i) => {
    const key = i.variacaoId ? `${i.produtoId}::${i.variacaoId}` : i.produtoId;
    return key !== cartKey;
  }));

  const changeQty = (cartKey: string, delta: number) => {
    setCart((prev) => prev.flatMap((i) => {
      const key = i.variacaoId ? `${i.produtoId}::${i.variacaoId}` : i.produtoId;
      if (key !== cartKey) return [i];
      const q = i.quantidade + delta;
      return q <= 0 ? [] : [{ ...i, quantidade: q }];
    }));
  };

  const changeItemDesc = (cartKey: string, val: string) =>
    setCart((prev) => prev.map((i) => {
      const key = i.variacaoId ? `${i.produtoId}::${i.variacaoId}` : i.produtoId;
      return key !== cartKey ? i : { ...i, desconto: Number(val) || 0 };
    }));

  // ── Totals ────────────────────────────────────────────────────────────────

  const subtotal = cart.reduce((s, i) => s + i.preco * i.quantidade - i.desconto, 0);
  const descontoGeral = Number(desconto) || 0;
  const total = Math.max(0, subtotal - descontoGeral);

  const totalPago = pagamentos.reduce((s, p) => s + (Number(p.valor) || 0), 0);
  const restante = Math.max(0, total - totalPago);
  const troco = totalPago > total && pagamentos.some((p) => p.forma === 'DINHEIRO')
    ? totalPago - total : 0;
  const podeFinalizar = cart.length > 0 && restante === 0 && !criar.isPending;

  // ── Payment helpers ───────────────────────────────────────────────────────

  const addPagamento = () => setPagamentos((prev) => [
    ...prev,
    { id: uid(), forma: 'DINHEIRO', valor: restante > 0 ? restante.toFixed(2) : '', parcelas: 1 },
  ]);

  const removePagamento = (id: string) =>
    setPagamentos((prev) => prev.length > 1 ? prev.filter((p) => p.id !== id) : prev);

  const updatePagamento = (id: string, patch: Partial<PagamentoEntry>) =>
    setPagamentos((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p));

  // ── Finalize ──────────────────────────────────────────────────────────────

  const handleFinalizar = async () => {
    if (!podeFinalizar) return;
    setErroMsg(null);
    try {
      const formasPagamento = pagamentos.map((p) => ({
        forma: p.forma, valor: Number(p.valor),
        ...(p.forma === 'CARTAO_CREDITO' ? { parcelas: p.parcelas } : {}),
      }));
      const result = await criar.mutateAsync({
        canal: 'BALCAO',
        itensList: cart.map((i) => ({
          produtoId: i.produtoId, quantidade: i.quantidade,
          precoUnitario: i.preco, desconto: i.desconto,
          variacaoId: i.variacaoId, variacao: i.variacaoLabel,
        })),
        desconto: descontoGeral, frete: 0,
        formasPagamento,
        troco: troco > 0 ? troco : undefined,
        vendedor: vendedor || undefined,
      });
      setSucesso({ numero: (result as any).numero, id: (result as any).id });
      setCart([]);
      setDesconto('');
      setPagamentos([{ id: uid(), forma: 'PIX', valor: '', parcelas: 1 }]);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erro ao finalizar venda. Tente novamente.';
      setErroMsg(msg);
    }
  };

  // ── Guards ────────────────────────────────────────────────────────────────

  if (loadingCaixa) return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
    </div>
  );

  if (!caixaAtual?.aberto || !caixaAtual?.sessao) return <CaixaFechadoScreen />;
  const sessao = caixaAtual.sessao;

  // ── Success Screen ────────────────────────────────────────────────────────

  if (sucesso) return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-slate-50 dark:bg-slate-900 px-4">
      <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-6">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Venda Realizada!</h2>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Pedido <span className="font-mono font-semibold">{sucesso.numero}</span> registrado com sucesso.
        </p>
        <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">
          Movimentação registrada no caixa <span className="font-semibold">{sessao.numero}</span>
        </p>
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-700/50 px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Emitir Nota Fiscal</p>
        </div>
        <Link href={`/dashboard/fiscal/nova?pedidoId=${sucesso.id}&tipo=NFCE`}
          className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors group">
          <div className="rounded-xl bg-purple-100 dark:bg-purple-900/30 p-2.5 flex-shrink-0">
            <Receipt className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1"><p className="font-semibold text-slate-900 dark:text-slate-100">Emitir NFC-e</p>
            <p className="text-xs text-slate-500">Nota Fiscal ao Consumidor · sem identificação</p></div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
        </Link>
        <Link href={`/dashboard/fiscal/nova?pedidoId=${sucesso.id}&tipo=NFE`}
          className="flex items-center gap-4 px-5 py-4 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group">
          <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-2.5 flex-shrink-0">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1"><p className="font-semibold text-slate-900 dark:text-slate-100">Emitir NF-e</p>
            <p className="text-xs text-slate-500">Com CPF/CNPJ do comprador identificado</p></div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
        </Link>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setSucesso(null)}
          className="rounded-xl bg-emerald-500 px-6 py-2.5 font-semibold text-white hover:bg-emerald-600 transition-colors">
          Nova Venda
        </button>
        <Link href="/dashboard/caixa"
          className="rounded-xl border border-slate-300 dark:border-slate-600 px-6 py-2.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          Ver Caixa
        </Link>
        <Link href="/dashboard/pedidos"
          className="rounded-xl border border-slate-300 dark:border-slate-600 px-6 py-2.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          Ver Pedidos
        </Link>
      </div>
    </div>
  );

  // ── PDV Principal ─────────────────────────────────────────────────────────

  return (
    <>
      {/* Variation picker overlay */}
      {variacaoPicker && (
        <VariacaoPickerModal
          produto={variacaoPicker}
          onSelect={handleVariacaoSelect}
          onClose={() => setVariacaoPicker(null)}
        />
      )}

      <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100 dark:bg-slate-950">

        {/* ── Top bar ── */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-marca-600 text-white text-xs font-bold select-none">MD</div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">PDV</p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">Venda Balcão</p>
            </div>
          </div>
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
          <Link href="/dashboard/caixa" target="_blank"
            className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20 px-3 py-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 leading-none">{sessao.numero}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 leading-none">{sessao.operador} · {fmt(sessao.saldoEsperado)}</p>
            </div>
            <Wallet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          </Link>
          <div className="flex-1" />
          <input value={vendedor} onChange={(e) => setVendedor(e.target.value)}
            placeholder="Vendedor (opcional)"
            className="hidden md:block w-44 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-400" />
          <Link href="/dashboard/pedidos"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="h-3.5 w-3.5" /> Fechar
          </Link>
        </header>

        {/* ── Error banner ── */}
        {erroMsg && (
          <div className="shrink-0 flex items-center gap-3 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-800 px-4 py-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            <p className="flex-1 text-sm text-red-700 dark:text-red-300">{erroMsg}</p>
            <button onClick={() => setErroMsg(null)} className="text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* ── Main content ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT — product catalog */}
          <div className="flex flex-1 flex-col overflow-hidden bg-slate-100 dark:bg-slate-950 p-4 gap-3">

            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input ref={inputRef} type="text" value={busca} onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, SKU ou código de barras..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-9 pr-9 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-400 shadow-sm" />
              {busca && (
                <button onClick={() => { setBusca(''); inputRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {categoriasDisponiveis.map((cat) => (
                <button key={cat} onClick={() => setCategoria(cat)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors
                    ${categoria === cat
                      ? 'bg-marca-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-marca-400 hover:text-marca-600'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Product grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              {loadingCatalogo ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse h-36 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  ))}
                </div>
              ) : produtosFiltrados.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                  <Package className="h-10 w-10" />
                  <p className="text-sm">Nenhum produto encontrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {produtosFiltrados.map((prod) => {
                    const cat = prod.categoria ?? '';
                    const Icon = CAT_ICON[cat] ?? Tag;
                    const colorClass = CAT_COLOR[cat] ?? 'bg-slate-100 dark:bg-slate-800 text-slate-500';
                    const noStock = prod.estoque === 0;
                    const hasVariacoes = prod.variacoes.length > 0;
                    // How many in cart (all variations combined)
                    const qtyInCart = cart.filter((i) => i.produtoId === prod.id).reduce((s, i) => s + i.quantidade, 0);
                    // Price range if variations have different prices
                    const varPrices = prod.variacoes.map((v) => v.preco);
                    const minPrice = varPrices.length > 0 ? Math.min(...varPrices) : prod.preco;
                    const maxPrice = varPrices.length > 0 ? Math.max(...varPrices) : prod.preco;
                    const hasRange = minPrice !== maxPrice;

                    return (
                      <button key={prod.id} onClick={() => !noStock && handleProductClick(prod)} disabled={noStock}
                        className={`group relative rounded-2xl border bg-white dark:bg-slate-800 text-left transition-all active:scale-95 overflow-hidden
                          ${noStock
                            ? 'border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                            : 'border-slate-200 dark:border-slate-700 hover:border-marca-400 hover:shadow-md cursor-pointer'}`}>
                        {/* Category color bar */}
                        <div className={`flex items-center justify-between h-14 px-3 ${colorClass}`}>
                          <Icon className="h-6 w-6" />
                          {hasVariacoes && (
                            <span className="flex items-center gap-0.5 text-[10px] font-semibold bg-white/70 dark:bg-black/30 rounded-full px-1.5 py-0.5">
                              <Layers className="h-2.5 w-2.5" /> {prod.variacoes.length}
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight line-clamp-2 min-h-[2rem]">{prod.nome}</p>
                          <p className="mt-1 text-[10px] text-slate-400 font-mono truncate">{prod.sku}</p>
                          <div className="mt-2 flex items-end justify-between gap-1 flex-wrap">
                            <div>
                              <p className="text-sm font-bold text-marca-600 dark:text-marca-400">
                                {hasRange ? `${fmt(minPrice)} – ${fmt(maxPrice)}` : fmt(prod.preco)}
                              </p>
                              {hasVariacoes && (
                                <p className="text-[10px] text-slate-400">{prod.variacoes[0].tipo}</p>
                              )}
                            </div>
                            {stockBadge(prod.estoque)}
                          </div>
                        </div>
                        {/* Qty badge */}
                        {qtyInCart > 0 && (
                          <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-marca-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                            {qtyInCart}
                          </div>
                        )}
                        {/* "Selecionar variação" hint */}
                        {hasVariacoes && !noStock && (
                          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform bg-marca-600 text-white text-[10px] font-semibold text-center py-1 rounded-b-2xl">
                            Selecionar {prod.variacoes[0].tipo}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <input value={vendedor} onChange={(e) => setVendedor(e.target.value)}
              placeholder="Vendedor (opcional)"
              className="md:hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300" />
          </div>

          {/* RIGHT — cart + payment */}
          <div className="flex w-[360px] shrink-0 flex-col overflow-hidden border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

            {/* Cart header */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 px-4 py-3 shrink-0">
              <ShoppingCart className="h-4 w-4 text-slate-500" />
              <span className="font-semibold text-slate-900 dark:text-slate-100">Carrinho</span>
              <span className="ml-auto text-xs text-slate-400">{cart.reduce((s, i) => s + i.quantidade, 0)} item(s)</span>
              {cart.length > 0 && (
                <button onClick={() => setCart([])} title="Limpar carrinho"
                  className="rounded p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 min-h-0">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 gap-2 text-slate-400">
                  <ShoppingCart className="h-8 w-8" />
                  <span className="text-sm">Carrinho vazio</span>
                </div>
              ) : (
                cart.map((item) => {
                  const cartKey = item.variacaoId ? `${item.produtoId}::${item.variacaoId}` : item.produtoId;
                  return (
                    <div key={cartKey} className="px-4 py-2.5 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">{item.nome}</p>
                          {item.variacaoLabel && (
                            <span className="inline-block mt-0.5 text-[10px] font-medium bg-marca-50 dark:bg-marca-900/20 text-marca-600 dark:text-marca-400 px-1.5 py-0.5 rounded-full">
                              {item.variacaoLabel}
                            </span>
                          )}
                          <p className="text-[10px] text-slate-400 font-mono">{item.sku}</p>
                        </div>
                        <button onClick={() => removeItem(cartKey)}
                          className="rounded p-0.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                          <button onClick={() => changeQty(cartKey, -1)} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-l-lg transition-colors">
                            <Minus className="h-3 w-3 text-slate-500" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-800 dark:text-slate-200">{item.quantidade}</span>
                          <button onClick={() => changeQty(cartKey, +1)} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-r-lg transition-colors">
                            <Plus className="h-3 w-3 text-slate-500" />
                          </button>
                        </div>
                        <div className="relative flex-1">
                          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">R$</span>
                          <input type="number" min="0" value={item.desconto || ''} onChange={(e) => changeItemDesc(cartKey, e.target.value)}
                            placeholder="Desc."
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent pl-6 pr-2 py-1 text-xs text-slate-700 dark:text-slate-300" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums shrink-0">
                          {fmt(item.preco * item.quantidade - item.desconto)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Discount + totals */}
            <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2 shrink-0">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 shrink-0">Desconto geral (R$)</label>
                <input type="number" min="0" value={desconto} onChange={(e) => setDesconto(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-2 py-1 text-xs text-slate-800 dark:text-slate-200" />
              </div>
              <div className="flex justify-between text-xs text-slate-500"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              {descontoGeral > 0 && <div className="flex justify-between text-xs text-red-500"><span>Desconto geral</span><span>−{fmt(descontoGeral)}</span></div>}
              <div className="flex justify-between text-base font-bold text-slate-900 dark:text-slate-100">
                <span>Total</span><span>{fmt(total)}</span>
              </div>
            </div>

            {/* ── Payment section ── */}
            <div className="border-t-2 border-slate-200 dark:border-slate-800 px-4 py-3 space-y-3 shrink-0 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                  <SplitSquareHorizontal className="h-3.5 w-3.5" /> Pagamento
                </p>
                {restante > 0 && (
                  <button onClick={addPagamento}
                    className="flex items-center gap-1 text-xs font-semibold text-marca-600 dark:text-marca-400 hover:text-marca-700 transition-colors">
                    <Plus className="h-3 w-3" /> Dividir
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {pagamentos.map((pg, idx) => {
                  const meta = PGTO_LABELS[pg.forma];
                  const Icon = meta.Icon;
                  return (
                    <div key={pg.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                      <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-700">
                        {(Object.keys(PGTO_LABELS) as FormaPgto[]).map((f) => {
                          const m = PGTO_LABELS[f];
                          const Ic = m.Icon;
                          return (
                            <button key={f} onClick={() => updatePagamento(pg.id, { forma: f })}
                              className={`flex items-center justify-center gap-1 py-1.5 text-[10px] font-semibold transition-colors
                                ${pg.forma === f ? 'bg-marca-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                              <Ic className="h-3 w-3" /><span>{m.short}</span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                        <div className="relative flex-1">
                          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">R$</span>
                          <input type="number" min="0" step="0.01" value={pg.valor}
                            onChange={(e) => updatePagamento(pg.id, { valor: e.target.value })}
                            onFocus={() => { if (!pg.valor && restante > 0) updatePagamento(pg.id, { valor: restante.toFixed(2) }); }}
                            placeholder={idx === 0 ? fmt(total) : 'Valor...'}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 pl-8 pr-2 py-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-marca-400" />
                        </div>
                        {pagamentos.length > 1 && (
                          <button onClick={() => removePagamento(pg.id)}
                            className="rounded p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      {pg.forma === 'CARTAO_CREDITO' && (
                        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-700 px-3 py-2">
                          <label className="text-[10px] text-slate-500 shrink-0">Parcelas</label>
                          <select value={pg.parcelas} onChange={(e) => updatePagamento(pg.id, { parcelas: Number(e.target.value) })}
                            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent px-2 py-1 text-xs dark:text-white">
                            {[1,2,3,4,6,10,12].map((n) => (
                              <option key={n} value={n}>{n}× de {fmt((Number(pg.valor) || total) / n)}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {pg.forma === 'DINHEIRO' && troco > 0 && totalPago >= total && (
                        <div className="flex justify-between items-center border-t border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1.5">
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Troco</span>
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{fmt(troco)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {total > 0 && (
                <div className={`flex justify-between items-center rounded-xl px-3 py-2 text-sm font-bold
                  ${restante > 0
                    ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                    : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'}`}>
                  <span>{restante > 0 ? 'Restante' : 'Coberto'}</span>
                  <span className="tabular-nums">{restante > 0 ? fmt(restante) : '✓ ' + fmt(total)}</span>
                </div>
              )}
            </div>

            {/* Finalize button */}
            <div className="shrink-0 px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <button onClick={handleFinalizar} disabled={!podeFinalizar}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
                {criar.isPending
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Processando...</>
                  : <><CheckCircle2 className="h-4 w-4" /> Finalizar Venda · {fmt(total)}</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
