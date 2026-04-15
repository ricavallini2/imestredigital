'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Trash2, Search, User, Package, Truck,
  CreditCard, FileText, CheckCircle2, Loader2, ChevronDown, X,
  ChevronRight, Send,
} from 'lucide-react';
import { useCatalogoPedidos, useCriarPedido } from '@/hooks/usePedidos';

interface ItemForm {
  produtoId: string; nome: string; sku: string;
  quantidade: number; precoUnitario: number; desconto: number;
}

const FORMAS = [
  { value: 'BOLETO',         label: 'Boleto' },
  { value: 'PIX',            label: 'PIX' },
  { value: 'PRAZO',          label: 'A Prazo / Crédito' },
  { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
  { value: 'CARTAO_DEBITO',  label: 'Cartão de Débito' },
  { value: 'DINHEIRO',       label: 'Dinheiro' },
];

const fmt  = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtN = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

export default function VendasInternaPage() {
  const router = useRouter();
  const { data: catalogo, isLoading: loadingCatalogo } = useCatalogoPedidos();
  const criar = useCriarPedido();

  const [clienteSel, setClienteSel] = useState<{ id: string; nome: string; email: string; telefone: string } | null>(null);
  const [buscaCliente, setBuscaCliente] = useState('');
  const [mostrarClientes, setMostrarClientes] = useState(false);

  const [itens, setItens] = useState<ItemForm[]>([]);
  const [buscaProd, setBuscaProd] = useState('');
  const [mostrarProd, setMostrarProd] = useState(false);

  const [desconto, setDesconto] = useState('');
  const [frete, setFrete] = useState('');
  const [forma, setForma] = useState('BOLETO');
  const [parcelas, setParcelas] = useState('1');
  const [endereco, setEndereco] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [sucesso, setSucesso] = useState<{ numero: string; id: string; clienteNome?: string } | null>(null);

  const clientes = catalogo?.clientes ?? [];
  const produtos  = catalogo?.produtos ?? [];

  const clientesFiltrados = useMemo(() =>
    buscaCliente ? clientes.filter((c) => c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) || c.email.toLowerCase().includes(buscaCliente.toLowerCase()))
    : clientes, [clientes, buscaCliente]);

  const produtosFiltrados = useMemo(() =>
    buscaProd ? produtos.filter((p) => p.nome.toLowerCase().includes(buscaProd.toLowerCase()) || p.sku.toLowerCase().includes(buscaProd.toLowerCase()))
    : produtos, [produtos, buscaProd]);

  const addItem = (prod: typeof produtos[0]) => {
    setItens((prev) => {
      const existe = prev.find((i) => i.produtoId === prod.id);
      if (existe) return prev.map((i) => i.produtoId === prod.id ? { ...i, quantidade: i.quantidade + 1 } : i);
      return [...prev, { produtoId: prod.id, nome: prod.nome, sku: prod.sku, quantidade: 1, precoUnitario: prod.preco, desconto: 0 }];
    });
    setBuscaProd('');
    setMostrarProd(false);
  };

  const removeItem = (id: string) => setItens((prev) => prev.filter((i) => i.produtoId !== id));
  const updateItem = (id: string, field: keyof ItemForm, val: string | number) =>
    setItens((prev) => prev.map((i) => i.produtoId !== id ? i : { ...i, [field]: typeof val === 'string' ? (Number(val) || 0) : val }));

  const subtotal = itens.reduce((s, i) => s + i.precoUnitario * i.quantidade - i.desconto, 0);
  const total    = subtotal - (Number(desconto) || 0) + (Number(frete) || 0);

  const handleSubmit = async () => {
    if (!clienteSel || itens.length === 0) return;
    const result = await criar.mutateAsync({
      clienteId: clienteSel.id,
      cliente: clienteSel.nome,
      canal: 'INTERNA',
      itensList: itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade, precoUnitario: i.precoUnitario, desconto: i.desconto })),
      desconto: Number(desconto) || 0,
      frete: Number(frete) || 0,
      formaPagamento: forma,
      parcelas: forma === 'CARTAO_CREDITO' || forma === 'PRAZO' ? Number(parcelas) : undefined,
      enderecoEntrega: endereco || undefined,
      observacoes: observacoes || undefined,
      vendedor: vendedor || undefined,
    });
    setSucesso({ numero: (result as any).numero, id: (result as any).id, clienteNome: clienteSel?.nome });
  };

  if (sucesso) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      {/* Ícone de sucesso */}
      <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-6">
        <CheckCircle2 className="h-16 w-16 text-blue-500" />
      </div>

      {/* Título */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pedido Criado!</h2>
        <p className="mt-1 text-slate-500">
          Pedido <span className="font-mono font-semibold">{sucesso.numero}</span> registrado
          {sucesso.clienteNome && <> para <strong>{sucesso.clienteNome}</strong></>} com status <strong>Pendente</strong>.
        </p>
      </div>

      {/* ── Emissão de Nota Fiscal ── */}
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
        <div className="bg-slate-50 dark:bg-slate-700/50 px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Emitir Nota Fiscal</p>
        </div>

        {/* NF-e principal — B2B sempre usa NF-e */}
        <Link
          href={`/dashboard/fiscal/nova?pedidoId=${sucesso.id}&tipo=NFE`}
          className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group"
        >
          <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-2.5 flex-shrink-0">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900 dark:text-slate-100">Emitir NF-e</p>
              <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400">Recomendado</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {sucesso.clienteNome ? `Destinatário: ${sucesso.clienteNome}` : 'Dados do pedido pré-preenchidos'}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
        </Link>

        {/* Emitir depois — link para o pedido */}
        <Link
          href={`/dashboard/pedidos/${sucesso.id}`}
          className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
        >
          <div className="rounded-xl bg-slate-100 dark:bg-slate-700 p-2.5 flex-shrink-0">
            <Send className="h-4 w-4 text-slate-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Emitir depois</p>
            <p className="text-xs text-slate-400">Abrir pedido e emitir quando separado</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </Link>
      </div>

      {/* Ações secundárias */}
      <div className="flex gap-3">
        <button
          onClick={() => { setSucesso(null); setClienteSel(null); setItens([]); setDesconto(''); setFrete(''); setEndereco(''); setObservacoes(''); }}
          className="rounded-xl bg-marca-500 px-6 py-2.5 font-semibold text-white hover:bg-marca-600 transition-colors"
        >
          Novo Pedido
        </button>
        <button
          onClick={() => router.push('/dashboard/pedidos')}
          className="rounded-xl border border-slate-300 dark:border-slate-600 px-6 py-2.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Ver Pedidos
        </button>
      </div>
    </div>
  );

  const camposOk = clienteSel && itens.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <ArrowLeft className="h-4 w-4 text-slate-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Venda Interna</h1>
          <p className="text-sm text-slate-500">Pedido B2B / vendas diretas</p>
        </div>
      </div>

      {/* Cliente */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-500" />
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Cliente <span className="text-red-500">*</span></h2>
        </div>

        {clienteSel ? (
          <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20 px-4 py-3">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{clienteSel.nome}</p>
              <p className="text-xs text-slate-500">{clienteSel.email} · {clienteSel.telefone}</p>
            </div>
            <button onClick={() => setClienteSel(null)} className="rounded-lg p-1 hover:bg-blue-100 dark:hover:bg-blue-800 text-slate-500">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={buscaCliente} onChange={(e) => { setBuscaCliente(e.target.value); setMostrarClientes(true); }}
              onFocus={() => setMostrarClientes(true)}
              placeholder="Buscar cliente..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2.5 pl-9 pr-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-marca-400" />
            {mostrarClientes && clientesFiltrados.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
                {clientesFiltrados.map((c) => (
                  <button key={c.id} onClick={() => { setClienteSel(c); setBuscaCliente(''); setMostrarClientes(false); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{c.nome}</p>
                      <p className="text-xs text-slate-400">{c.email}</p>
                    </div>
                    <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${c.tipo === 'PJ' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                      {c.tipo}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Itens */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-700 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-slate-500" />
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Itens <span className="text-red-500">*</span></h2>
          </div>
          <div className="relative">
            <button onClick={() => setMostrarProd(!mostrarProd)}
              className="flex items-center gap-2 rounded-xl bg-marca-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-marca-600 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Adicionar Produto
            </button>
            {mostrarProd && (
              <div className="absolute top-full right-0 z-20 mt-1 w-72 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
                <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                  <input value={buscaProd} onChange={(e) => setBuscaProd(e.target.value)} autoFocus
                    placeholder="Buscar produto..." className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent px-2.5 py-1.5 text-sm dark:text-white focus:outline-none" />
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {loadingCatalogo ? <div className="p-4 text-center text-sm text-slate-400">Carregando...</div>
                  : produtosFiltrados.map((prod) => (
                    <button key={prod.id} onClick={() => addItem(prod)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{prod.nome}</p>
                        <p className="text-xs text-slate-400 font-mono">{prod.sku}</p>
                      </div>
                      <span className="text-sm font-semibold text-marca-600 dark:text-marca-400">{fmt(prod.preco)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {itens.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">Nenhum item adicionado</div>
        ) : (
          <>
            {/* Cabeçalho tabela */}
            <div className="grid grid-cols-[1fr_80px_120px_100px_80px_32px] gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-700">
              <span>Produto</span><span className="text-center">Qtd</span><span className="text-center">Preço Unit.</span><span className="text-center">Desconto</span><span className="text-right">Subtotal</span><span />
            </div>
            {itens.map((item) => (
              <div key={item.produtoId} className="grid grid-cols-[1fr_80px_120px_100px_80px_32px] gap-2 items-center px-5 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.nome}</p>
                  <p className="text-xs text-slate-400 font-mono">{item.sku}</p>
                </div>
                <input type="number" min="1" value={item.quantidade}
                  onChange={(e) => updateItem(item.produtoId, 'quantidade', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent px-2 py-1 text-center text-sm dark:text-white" />
                <input type="number" min="0" value={item.precoUnitario}
                  onChange={(e) => updateItem(item.produtoId, 'precoUnitario', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent px-2 py-1 text-center text-sm dark:text-white" />
                <input type="number" min="0" value={item.desconto || ''}
                  onChange={(e) => updateItem(item.produtoId, 'desconto', e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent px-2 py-1 text-center text-sm dark:text-white" />
                <span className="text-right text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {fmt(item.precoUnitario * item.quantidade - item.desconto)}
                </span>
                <button onClick={() => removeItem(item.produtoId)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {/* Totais */}
            <div className="border-t border-slate-200 dark:border-slate-700 px-5 py-4 space-y-2">
              <div className="flex items-center gap-3 justify-end">
                <span className="text-sm text-slate-500">Desconto geral (R$)</span>
                <input type="number" min="0" value={desconto} onChange={(e) => setDesconto(e.target.value)}
                  className="w-28 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-1 text-sm text-right dark:text-white" />
              </div>
              <div className="flex items-center gap-3 justify-end">
                <span className="text-sm text-slate-500">Frete (R$)</span>
                <input type="number" min="0" value={frete} onChange={(e) => setFrete(e.target.value)}
                  className="w-28 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-1 text-sm text-right dark:text-white" />
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-base font-bold text-slate-900 dark:text-slate-100">
                <span>Total</span><span>{fmt(total)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Pagamento */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-slate-500" />
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Pagamento</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Forma de Pagamento</label>
            <div className="relative">
              <select value={forma} onChange={(e) => setForma(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white pr-8">
                {FORMAS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          {(forma === 'CARTAO_CREDITO' || forma === 'PRAZO') && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Parcelas</label>
              <div className="relative">
                <select value={parcelas} onChange={(e) => setParcelas(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white pr-8">
                  {[1,2,3,4,6,10,12,18,24].map((n) => (
                    <option key={n} value={n}>{n}× de {total > 0 ? fmt(total / n) : '—'}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Entrega + Obs + Vendedor */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-slate-500" />
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Entrega e Detalhes</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Endereço de Entrega</label>
            <input value={endereco} onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, bairro, cidade, estado"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Vendedor</label>
            <input value={vendedor} onChange={(e) => setVendedor(e.target.value)}
              placeholder="Nome do vendedor responsável"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Observações</label>
            <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)}
              rows={3} placeholder="Instruções especiais, prazo de entrega, etc."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white resize-none" />
          </div>
        </div>
      </div>

      {/* Botão */}
      <div className="flex items-center justify-between pb-6">
        <div className="text-sm text-slate-500">
          {!clienteSel && <span className="text-red-500">⚠ Selecione um cliente</span>}
          {clienteSel && itens.length === 0 && <span className="text-red-500">⚠ Adicione pelo menos 1 item</span>}
          {camposOk && <span className="text-slate-500">Total: <strong className="text-slate-800 dark:text-slate-200">{fmt(total)}</strong></span>}
        </div>
        <button onClick={handleSubmit} disabled={!camposOk || criar.isPending}
          className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {criar.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
          Registrar Pedido
        </button>
      </div>
    </div>
  );
}
