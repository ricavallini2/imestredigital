'use client';

/**
 * Formulário de Nova NF-e — totalmente integrado ao catálogo de produtos e clientes.
 *
 * Automações:
 * - Seleção de cliente → preenche CNPJ/CPF, UF, e-mail; sugere tipo NF; ajusta CFOP
 * - Seleção de produto → preenche NCM, preço, unidade; busca regra fiscal → alíquotas automáticas
 * - Destino interestadual → CFOP muda de 51xx para 61xx automaticamente
 * - Totais + carga tributária calculados em tempo real
 * - Importação de pedido via ?pedidoId=xxx — preenche tudo de uma vez
 */

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Plus, Trash2, Send, Save, ShieldCheck, Loader2,
  ChevronDown, X, Search, Package, User, Building2,
  AlertTriangle, CheckCircle2, Zap,
} from 'lucide-react';
import { useCriarNF, useValidarNF, useEmitirNF, useCatalogoFiscal } from '@/hooks/useFiscal';
import { usePedido } from '@/hooks/usePedidos';
import type { ItemNF, TipoNF, ProdutoCatalogo, ClienteCatalogo } from '@/services/fiscal.service';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pct = (v: number) => `${v.toFixed(2)}%`;

const NATUREZAS: Record<TipoNF, string[]> = {
  NFE:  ['Venda de Mercadoria', 'Transferência', 'Devolução de Compra', 'Remessa para Conserto', 'Remessa para Industrialização'],
  NFCE: ['Venda ao Consumidor'],
  NFSE: ['Prestação de Serviços'],
};

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

// ─── Tipos do formulário ──────────────────────────────────────────────────────
interface ClienteForm {
  id?: string;
  nome: string;
  tipo: 'PJ' | 'PF' | 'CONSUMIDOR';
  cnpjCpf: string;
  uf: string;
  email: string;
}

interface ItemForm extends Omit<ItemNF, 'id'> {
  _key: string;
  produtoId?: string;
  buscaProduto: string;
}

// ─── Cálculo de item ──────────────────────────────────────────────────────────
function calcItem(it: ItemForm): ItemForm {
  const valorTotal  = Math.max(0, it.quantidade * it.valorUnitario - it.desconto);
  const baseICMS    = valorTotal;
  return {
    ...it,
    valorTotal:  +valorTotal.toFixed(2),
    baseICMS:    +baseICMS.toFixed(2),
    valorICMS:   +(baseICMS  * it.aliquotaICMS   / 100).toFixed(2),
    valorPIS:    +(valorTotal * it.aliquotaPIS    / 100).toFixed(2),
    valorCOFINS: +(valorTotal * it.aliquotaCOFINS / 100).toFixed(2),
  };
}

function emptyItem(cfg?: { aliquotaICMS: number; aliquotaPIS: number; aliquotaCOFINS: number; cfop: string }): ItemForm {
  return calcItem({
    _key: Math.random().toString(36).slice(2),
    buscaProduto: '',
    descricao: '', ncm: '', cfop: cfg?.cfop ?? '5102', unidade: 'UN',
    quantidade: 1, valorUnitario: 0, desconto: 0, valorTotal: 0,
    baseICMS: 0,
    aliquotaICMS:   cfg?.aliquotaICMS   ?? 12,
    valorICMS:      0,
    aliquotaPIS:    cfg?.aliquotaPIS    ?? 0.65,
    valorPIS:       0,
    aliquotaCOFINS: cfg?.aliquotaCOFINS ?? 3,
    valorCOFINS:    0,
    csosn: '400',
  });
}

// ─── Combobox de Cliente ──────────────────────────────────────────────────────
function ClienteSelector({
  clientes, value, onChange, empresaUF,
}: {
  clientes: ClienteCatalogo[];
  value: ClienteForm | null;
  onChange: (c: ClienteForm | null) => void;
  empresaUF: string;
}) {
  const [busca,  setBusca]  = useState('');
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.cnpjCpf.includes(busca) ||
    c.email.toLowerCase().includes(busca.toLowerCase())
  ).slice(0, 10);

  const selecionar = (c: ClienteCatalogo) => {
    onChange({
      id:      c.id,
      nome:    c.nome,
      tipo:    c.tipo,
      cnpjCpf: c.cnpjCpf,
      uf:      c.uf,
      email:   c.email,
    });
    setBusca('');
    setAberto(false);
  };

  const limpar = () => { onChange(null); setBusca(''); };

  return (
    <div ref={ref} className="relative">
      {value ? (
        /* Cliente selecionado — card */
        <div className="flex items-center justify-between rounded-xl border border-marca-300 dark:border-marca-700 bg-marca-50 dark:bg-marca-900/20 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`rounded-lg p-1.5 flex-shrink-0 ${value.tipo === 'PJ' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
              {value.tipo === 'PJ' ? <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" /> : <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{value.nome}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold flex-shrink-0 ${value.tipo === 'PJ' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : value.tipo === 'PF' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                  {value.tipo}
                </span>
                <span className="rounded-full border border-slate-300 dark:border-slate-600 px-2 py-0.5 text-[10px] text-slate-500 flex-shrink-0">{value.uf}</span>
                {value.uf !== empresaUF && (
                  <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] text-amber-700 dark:text-amber-400 font-semibold flex-shrink-0">Interestadual</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{value.cnpjCpf || 'Sem documento'} · {value.email}</p>
            </div>
          </div>
          <button onClick={limpar} className="ml-2 flex-shrink-0 rounded-lg p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* Campo de busca */
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={busca}
            onChange={e => { setBusca(e.target.value); setAberto(true); }}
            onFocus={() => setAberto(true)}
            placeholder="Buscar cliente por nome, CNPJ/CPF ou e-mail..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
          />
        </div>
      )}

      {/* Dropdown */}
      {aberto && !value && (
        <div className="absolute top-full left-0 right-0 mt-1 z-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden max-h-64 overflow-y-auto">
          {filtrados.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400">Nenhum cliente encontrado</p>
          ) : filtrados.map(c => (
            <button key={c.id} onMouseDown={() => selecionar(c)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left border-b border-slate-100 dark:border-slate-700/50 last:border-0">
              <div className={`rounded-lg p-1.5 flex-shrink-0 ${c.tipo === 'PJ' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                {c.tipo === 'PJ' ? <Building2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> : <User className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{c.nome}</span>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{c.uf}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{c.cnpjCpf || '—'} · {c.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Seletor de Produto por linha ─────────────────────────────────────────────
function ProdutoSelector({
  produtos, value, onChange,
}: {
  produtos: ProdutoCatalogo[];
  value: string;
  onChange: (p: ProdutoCatalogo) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const [busca,  setBusca]  = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  // Sync display when parent clears
  useEffect(() => { setBusca(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.sku.toLowerCase().includes(busca.toLowerCase()) ||
    p.ncm.includes(busca)
  ).slice(0, 8);

  return (
    <div ref={ref} className="relative min-w-[180px]">
      <input
        value={busca}
        onChange={e => { setBusca(e.target.value); setAberto(true); }}
        onFocus={() => setAberto(true)}
        placeholder="Produto / SKU / NCM..."
        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-marca-500"
      />
      {aberto && (
        <div className="absolute top-full left-0 z-50 mt-1 w-72 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden max-h-56 overflow-y-auto">
          {filtrados.length === 0 ? (
            <p className="px-3 py-2 text-xs text-slate-400">Nenhum produto encontrado</p>
          ) : filtrados.map(p => (
            <button key={p.id} onMouseDown={() => { onChange(p); setBusca(p.nome); setAberto(false); }}
              className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left border-b border-slate-100 dark:border-slate-700/50 last:border-0">
              <Package className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{p.nome}</span>
                  <span className="text-[10px] font-semibold text-emerald-600 flex-shrink-0">{fmt(p.preco)}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400 font-mono">{p.sku}</span>
                  <span className="text-[10px] text-slate-400">NCM {p.ncm}</span>
                  <span className={`text-[10px] font-medium ${p.estoque > 5 ? 'text-emerald-600' : p.estoque > 0 ? 'text-amber-600' : 'text-red-500'}`}>
                    {p.estoque > 0 ? `${p.estoque} un.` : 'Sem estoque'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────
function NovaNotaFiscalForm() {
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const pedidoIdParam = searchParams.get('pedidoId');
  const tipoParam     = (searchParams.get('tipo') as TipoNF | null);

  // ── Data ──
  const { data: catalogo, isLoading: loadingCatalogo } = useCatalogoFiscal();
  const { data: pedidoImport } = usePedido(pedidoIdParam ?? '');

  // ── Form state ──
  const [tipo,      setTipo]      = useState<TipoNF>(tipoParam ?? 'NFE');
  const [natureza,  setNatureza]  = useState(tipoParam === 'NFCE' ? 'Venda ao Consumidor' : 'Venda de Mercadoria');
  const [finalidade, setFinalidade] = useState<'NORMAL'|'COMPLEMENTAR'|'AJUSTE'|'DEVOLUCAO'>('NORMAL');
  const [cliente,   setCliente]   = useState<ClienteForm | null>(null);
  const [itens,     setItens]     = useState<ItemForm[]>(() => [emptyItem()]);
  const [obs,       setObs]       = useState('');
  const [pedidoId,  setPedidoId]  = useState<string | undefined>();
  const [pedidoNum, setPedidoNum] = useState<string | undefined>();
  const [imported,  setImported]  = useState(false);
  const [toast, setToast] = useState<{ msg: string; tipo: 'ok' | 'err' } | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const criarNF  = useCriarNF();
  const validarNF = useValidarNF();
  const emitirNF  = useEmitirNF();

  const empresaUF = catalogo?.empresaUF ?? 'SP';

  // ── Pré-preenche Consumidor Final quando tipo=NFCE sem pedido ─────────────────
  useEffect(() => {
    if (tipoParam === 'NFCE' && !pedidoIdParam && catalogo && !imported) {
      setCliente({ nome: 'Consumidor Final', tipo: 'CONSUMIDOR', cnpjCpf: '', uf: empresaUF, email: '' });
      setImported(true);
    }
  }, [tipoParam, pedidoIdParam, catalogo, empresaUF, imported]);

  // ── Auto-ajuste de CFOP quando destino muda ──────────────────────────────────
  const ajustarCFOP = useCallback((ufDestino: string, prevItens: ItemForm[], prods: ProdutoCatalogo[]) => {
    const isInter = ufDestino !== (catalogo?.empresaUF ?? 'SP');
    return prevItens.map(it => {
      if (!it.produtoId) return it;
      const prod = prods.find(p => p.id === it.produtoId);
      if (!prod) return it;
      const cfop = isInter ? prod.cfopInterestadual : prod.cfopEstadual;
      return calcItem({ ...it, cfop });
    });
  }, [catalogo?.empresaUF]);

  // ── Quando cliente muda ───────────────────────────────────────────────────────
  const handleClienteChange = useCallback((c: ClienteForm | null) => {
    setCliente(c);
    // Sugestão automática do tipo de NF
    if (c?.tipo === 'PJ') setTipo('NFE');
    else if (c?.tipo === 'PF') setTipo('NFE');
    else if (c?.tipo === 'CONSUMIDOR') setTipo('NFCE');
    // Ajusta CFOP de todos os itens
    if (c && catalogo) {
      setItens(prev => ajustarCFOP(c.uf, prev, catalogo.produtos));
    }
  }, [catalogo, ajustarCFOP]);

  // ── Consumidor Final rápido ───────────────────────────────────────────────────
  const handleConsumidorFinal = () => {
    setCliente({ nome: 'Consumidor Final', tipo: 'CONSUMIDOR', cnpjCpf: '', uf: empresaUF, email: '' });
    setTipo('NFCE');
    setNatureza('Venda ao Consumidor');
  };

  // ── Selecionar produto em um item ─────────────────────────────────────────────
  const handleSelecionarProduto = useCallback((key: string, prod: ProdutoCatalogo) => {
    const isInter = (cliente?.uf ?? empresaUF) !== empresaUF;
    const cfop = isInter ? prod.cfopInterestadual : prod.cfopEstadual;
    setItens(prev => prev.map(it =>
      it._key === key ? calcItem({
        ...it,
        produtoId:      prod.id,
        buscaProduto:   prod.nome,
        descricao:      prod.nome,
        ncm:            prod.ncm,
        cfop,
        unidade:        prod.unidade,
        valorUnitario:  prod.preco,
        aliquotaICMS:   prod.aliquotaICMS,
        aliquotaPIS:    prod.aliquotaPIS,
        aliquotaCOFINS: prod.aliquotaCOFINS,
        csosn:          prod.csosn,
      }) : it
    ));
  }, [cliente?.uf, empresaUF]);

  // ── Atualizar campo de item ───────────────────────────────────────────────────
  const updateItem = useCallback((key: string, patch: Partial<ItemForm>) => {
    setItens(prev => prev.map(it => it._key === key ? calcItem({ ...it, ...patch }) : it));
  }, []);

  const addItem    = () => setItens(prev => [...prev, emptyItem({ aliquotaICMS: 12, aliquotaPIS: 0.65, aliquotaCOFINS: 3, cfop: (cliente?.uf ?? empresaUF) !== empresaUF ? '6102' : '5102' })]);
  const removeItem = (key: string) => setItens(prev => prev.filter(it => it._key !== key));

  // ── Importar pedido ───────────────────────────────────────────────────────────
  // Campos reais do PedidoMock:
  //   ped.cliente      → nome do cliente (string)
  //   ped.clienteId    → id do cliente
  //   ped.itensList[]  → array de itens (NÃO ped.itens, que é um número/count)
  //   pi.produto       → nome do produto no item (NÃO pi.nome)
  //   pi.produtoId, pi.quantidade, pi.precoUnitario, pi.desconto
  useEffect(() => {
    if (!pedidoImport || !catalogo || imported) return;
    const ped = pedidoImport as any;

    // ── Resolver cliente ──────────────────────────────────────────────────────
    // Tenta primeiro pelo id, depois pelo nome (campo "cliente", não "clienteNome")
    const cli = catalogo.clientes.find(c =>
      (ped.clienteId && c.id === ped.clienteId) ||
      (ped.cliente   && c.nome.toLowerCase() === String(ped.cliente).toLowerCase())
    );

    if (cli) {
      setCliente({ id: cli.id, nome: cli.nome, tipo: cli.tipo, cnpjCpf: cli.cnpjCpf, uf: cli.uf, email: cli.email });
    } else if (ped.cliente && ped.cliente !== 'Consumidor Final') {
      // Cliente existe no pedido mas não no catálogo (ex: balcão sem cadastro)
      // Cria entrada manual para não perder o nome
      setCliente({ nome: ped.cliente, tipo: 'PF', cnpjCpf: '', uf: empresaUF, email: ped.clienteEmail ?? '' });
    }

    // ── Resolver itens ────────────────────────────────────────────────────────
    // itensList é o array; ped.itens é apenas o count numérico
    const listaItens: any[] = Array.isArray(ped.itensList) ? ped.itensList : [];

    if (listaItens.length > 0) {
      const ufDest  = cli?.uf ?? empresaUF;
      const isInter = ufDest !== empresaUF;

      const novosItens: ItemForm[] = listaItens.map((pi: any) => {
        // Nome do produto está em pi.produto (não pi.nome)
        const nomeProd = pi.produto ?? pi.nome ?? '';
        const prod = catalogo.produtos.find(p =>
          p.id === pi.produtoId ||
          p.nome.toLowerCase() === nomeProd.toLowerCase() ||
          p.sku  === pi.sku
        );
        const cfop = prod
          ? (isInter ? prod.cfopInterestadual : prod.cfopEstadual)
          : (isInter ? '6102' : '5102');

        return calcItem({
          _key:           Math.random().toString(36).slice(2),
          buscaProduto:   prod?.nome ?? nomeProd,
          produtoId:      prod?.id   ?? pi.produtoId,
          descricao:      prod?.nome ?? nomeProd,
          ncm:            prod?.ncm  ?? '',
          cfop,
          unidade:        prod?.unidade    ?? 'UN',
          quantidade:     pi.quantidade   ?? 1,
          valorUnitario:  pi.precoUnitario ?? 0,
          desconto:       pi.desconto      ?? 0,
          valorTotal:     0, baseICMS: 0,
          aliquotaICMS:   prod?.aliquotaICMS   ?? 12,   valorICMS:   0,
          aliquotaPIS:    prod?.aliquotaPIS    ?? 0.65, valorPIS:    0,
          aliquotaCOFINS: prod?.aliquotaCOFINS ?? 3,   valorCOFINS: 0,
          csosn:          prod?.csosn          ?? '400',
        });
      });
      setItens(novosItens);
    }

    // Ajusta tipo NF pelo canal: BALCAO → sugere NFCE, demais → NFE
    if (!tipoParam) {
      if (ped.canal === 'BALCAO') { setTipo('NFCE'); setNatureza('Venda ao Consumidor'); }
      else                        { setTipo('NFE');  setNatureza('Venda de Mercadoria'); }
    }

    setPedidoId(ped.id);
    setPedidoNum(ped.numero);
    setImported(true);
  }, [pedidoImport, catalogo, imported, empresaUF, tipoParam]);

  // ── Totais ────────────────────────────────────────────────────────────────────
  const totais = itens.reduce((acc, it) => ({
    valorProdutos: acc.valorProdutos + it.valorTotal,
    valorICMS:     acc.valorICMS     + it.valorICMS,
    valorPIS:      acc.valorPIS      + it.valorPIS,
    valorCOFINS:   acc.valorCOFINS   + it.valorCOFINS,
  }), { valorProdutos: 0, valorICMS: 0, valorPIS: 0, valorCOFINS: 0 });

  const totalImpostos = totais.valorICMS + totais.valorPIS + totais.valorCOFINS;
  const cargaTrib     = totais.valorProdutos > 0 ? (totalImpostos / totais.valorProdutos) * 100 : 0;

  // ── Payload ───────────────────────────────────────────────────────────────────
  const buildPayload = () => ({
    tipo, naturezaOperacao: natureza, finalidade,
    destinatario:       cliente?.nome ?? '',
    destinatarioCnpjCpf: cliente?.cnpjCpf ?? '',
    destinatarioUF:     cliente?.uf ?? empresaUF,
    destinatarioEmail:  cliente?.email || undefined,
    itens: itens.map(({ _key, buscaProduto, ...it }) => ({ ...it, id: `item-${_key}` })),
    ...totais,
    valorDesconto: 0, valorFrete: 0, valorOutras: 0,
    baseICMS: itens.reduce((s, it) => s + it.baseICMS, 0),
    valorIPI: 0, valorISS: 0,
    valorTotal: totais.valorProdutos,
    pedidoId:     pedidoId,
    pedidoNumero: pedidoNum,
    observacoes: obs || undefined,
  });

  const showToast = (msg: string, tipo: 'ok' | 'err') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 4500);
  };

  // ── Ações ─────────────────────────────────────────────────────────────────────
  const handleSalvar = async () => {
    try {
      const nf = await criarNF.mutateAsync(buildPayload());
      setCreatedId(nf.id);
      showToast('Rascunho salvo com sucesso', 'ok');
    } catch { showToast('Erro ao salvar rascunho', 'err'); }
  };

  const handleValidar = async () => {
    try {
      let id = createdId;
      if (!id) { const nf = await criarNF.mutateAsync(buildPayload()); id = nf.id; setCreatedId(id); }
      await validarNF.mutateAsync(id);
      showToast('NF-e validada com sucesso', 'ok');
    } catch { showToast('Erro ao validar NF-e', 'err'); }
  };

  const handleEmitir = async () => {
    try {
      let id = createdId;
      if (!id) { const nf = await criarNF.mutateAsync(buildPayload()); id = nf.id; setCreatedId(id); await validarNF.mutateAsync(id); }
      const res = await emitirNF.mutateAsync(id);
      if (res.sucesso) {
        showToast('NF-e autorizada pela SEFAZ!', 'ok');
        setTimeout(() => router.push(`/dashboard/fiscal/${id}`), 1500);
      } else {
        showToast(`Rejeição: ${res.motivoRejeicao ?? 'erro SEFAZ'}`, 'err');
        if (id) setTimeout(() => router.push(`/dashboard/fiscal/${id}`), 2000);
      }
    } catch { showToast('Erro ao emitir NF-e', 'err'); }
  };

  const isBusy     = criarNF.isPending || validarNF.isPending || emitirNF.isPending;
  const canProceed = !!cliente?.nome && itens.some(it => it.descricao && it.valorTotal > 0);
  const isInter    = !!cliente && cliente.uf !== empresaUF && cliente.tipo !== 'CONSUMIDOR';

  if (loadingCatalogo) return (
    <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-marca-500" /></div>
  );

  const produtos = catalogo?.produtos ?? [];
  const clientes = catalogo?.clientes ?? [];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 rounded-2xl px-4 py-3 shadow-xl text-sm font-medium flex items-center gap-2 ${toast.tipo === 'ok' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.tipo === 'ok' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <ArrowLeft className="h-4 w-4 text-slate-500" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nova NF-e</h1>
          <p className="text-sm text-slate-500 mt-0.5">Produtos e impostos preenchidos automaticamente</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSalvar} disabled={isBusy || !cliente?.nome}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors">
            <Save className="h-4 w-4" />Rascunho
          </button>
          <button onClick={handleValidar} disabled={isBusy || !canProceed}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors">
            {validarNF.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Validar
          </button>
          <button onClick={handleEmitir} disabled={isBusy || !canProceed}
            className="flex items-center gap-1.5 rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 disabled:opacity-40 transition-colors shadow-sm">
            {emitirNF.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Emitir para SEFAZ
          </button>
        </div>
      </div>

      {/* Banner pedido importado */}
      {imported && pedidoNum && (
        <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 px-5 py-3 flex items-center gap-3">
          <Zap className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Importado automaticamente</strong> do pedido <span className="font-mono font-bold">{pedidoNum}</span> — destinatário, itens, preços e impostos preenchidos.
          </p>
        </div>
      )}

      {/* Tipo + Natureza + Finalidade */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tipo de Nota</label>
          <div className="flex gap-2">
            {(['NFE','NFCE','NFSE'] as TipoNF[]).map(t => (
              <button key={t} onClick={() => { setTipo(t); setNatureza(NATUREZAS[t][0]); }}
                className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-colors ${tipo === t ? 'border-marca-500 bg-marca-50 dark:bg-marca-900/20 text-marca-700 dark:text-marca-300' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                {t === 'NFE' ? 'NF-e' : t === 'NFCE' ? 'NFC-e' : 'NFS-e'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Natureza da Operação</label>
          <div className="relative">
            <select value={natureza} onChange={e => setNatureza(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 pr-8 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500">
              {NATUREZAS[tipo].map(n => <option key={n}>{n}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Finalidade</label>
          <div className="relative">
            <select value={finalidade} onChange={e => setFinalidade(e.target.value as any)}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 pr-8 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500">
              <option value="NORMAL">Normal</option>
              <option value="COMPLEMENTAR">Complementar</option>
              <option value="AJUSTE">Ajuste</option>
              <option value="DEVOLUCAO">Devolução</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Destinatário */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Destinatário</h2>
          <button onClick={handleConsumidorFinal}
            className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <User className="h-3.5 w-3.5" />Consumidor Final (NFC-e)
          </button>
        </div>

        <ClienteSelector
          clientes={clientes}
          value={cliente}
          onChange={handleClienteChange}
          empresaUF={empresaUF}
        />

        {/* Campos manuais quando cliente selecionado */}
        {cliente && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] text-slate-400 mb-1">CNPJ / CPF</label>
              <input value={cliente.cnpjCpf} onChange={e => setCliente(c => c ? { ...c, cnpjCpf: e.target.value } : null)}
                placeholder="Sem documento"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">UF Destino</label>
              <div className="relative">
                <select value={cliente.uf}
                  onChange={e => {
                    const uf = e.target.value;
                    setCliente(c => c ? { ...c, uf } : null);
                    if (catalogo) setItens(prev => ajustarCFOP(uf, prev, catalogo.produtos));
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 pr-7 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500">
                  {UFS.map(uf => <option key={uf}>{uf}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">E-mail NF</label>
              <input value={cliente.email} onChange={e => setCliente(c => c ? { ...c, email: e.target.value } : null)}
                placeholder="email@empresa.com"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
          </div>
        )}

        {isInter && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 px-4 py-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <strong>Operação Interestadual</strong> — CFOPs ajustados automaticamente para 6102 (destino {cliente?.uf}).
            </p>
          </div>
        )}
      </div>

      {/* Itens */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Itens da Nota</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Selecione o produto → NCM, CFOP e impostos preenchidos automaticamente</p>
          </div>
          <button onClick={addItem}
            className="flex items-center gap-1.5 rounded-xl bg-marca-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-marca-700 transition-colors">
            <Plus className="h-3.5 w-3.5" />Adicionar Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase min-w-[180px]">Produto</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase min-w-[180px]">Descrição na NF</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-slate-500 uppercase w-24">NCM</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-slate-500 uppercase w-20">CFOP</th>
                <th className="px-3 py-2.5 text-right  text-[10px] font-semibold text-slate-500 uppercase w-16">Qtd</th>
                <th className="px-3 py-2.5 text-right  text-[10px] font-semibold text-slate-500 uppercase w-24">Unit. R$</th>
                <th className="px-3 py-2.5 text-right  text-[10px] font-semibold text-slate-500 uppercase w-20">Desc. R$</th>
                <th className="px-3 py-2.5 text-right  text-[10px] font-semibold text-slate-500 uppercase w-28">Total + Imp.</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {itens.map((it) => (
                <tr key={it._key} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                  {/* Seletor de produto */}
                  <td className="px-2 py-2">
                    <ProdutoSelector
                      produtos={produtos}
                      value={it.buscaProduto}
                      onChange={prod => handleSelecionarProduto(it._key, prod)}
                    />
                  </td>
                  {/* Descrição (editável) */}
                  <td className="px-2 py-2">
                    <input value={it.descricao} onChange={e => updateItem(it._key, { descricao: e.target.value })}
                      placeholder="Descrição fiscal..."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-marca-500 min-w-[160px]" />
                  </td>
                  {/* NCM */}
                  <td className="px-2 py-2">
                    <input value={it.ncm} onChange={e => updateItem(it._key, { ncm: e.target.value })}
                      placeholder="0000.00.00"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1.5 text-[11px] text-center bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-marca-500" />
                  </td>
                  {/* CFOP */}
                  <td className="px-2 py-2">
                    <input value={it.cfop} onChange={e => updateItem(it._key, { cfop: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1.5 text-[11px] text-center bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-marca-500" />
                  </td>
                  {/* Qtd */}
                  <td className="px-2 py-2">
                    <input type="number" min={1} value={it.quantidade}
                      onChange={e => updateItem(it._key, { quantidade: Math.max(1, +e.target.value) })}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1.5 text-xs text-right tabular-nums bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-marca-500" />
                  </td>
                  {/* Preço unitário */}
                  <td className="px-2 py-2">
                    <input type="number" min={0} step={0.01} value={it.valorUnitario}
                      onChange={e => updateItem(it._key, { valorUnitario: +e.target.value })}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1.5 text-xs text-right tabular-nums bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-marca-500" />
                  </td>
                  {/* Desconto */}
                  <td className="px-2 py-2">
                    <input type="number" min={0} step={0.01} value={it.desconto}
                      onChange={e => updateItem(it._key, { desconto: +e.target.value })}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1.5 text-xs text-right tabular-nums bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-marca-500" />
                  </td>
                  {/* Total + impostos automáticos */}
                  <td className="px-3 py-2 text-right">
                    <div className="font-semibold text-sm tabular-nums text-slate-900 dark:text-slate-100">{fmt(it.valorTotal)}</div>
                    {it.valorTotal > 0 && (
                      <div className="text-[10px] text-orange-500 space-y-0 leading-tight mt-0.5">
                        <div>ICMS {fmt(it.valorICMS)} ({it.aliquotaICMS}%)</div>
                        <div>PIS+COF {fmt(it.valorPIS + it.valorCOFINS)}</div>
                      </div>
                    )}
                  </td>
                  {/* Remover */}
                  <td className="px-2 py-2">
                    {itens.length > 1 && (
                      <button onClick={() => removeItem(it._key)}
                        className="rounded-lg p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumo tributário */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Resumo Tributário</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: 'Subtotal',  value: fmt(totais.valorProdutos), color: 'text-slate-900 dark:text-slate-100', bg: 'bg-slate-50 dark:bg-slate-700/50' },
            { label: 'ICMS',      value: fmt(totais.valorICMS),     color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/10' },
            { label: 'PIS',       value: fmt(totais.valorPIS),      color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/10' },
            { label: 'COFINS',    value: fmt(totais.valorCOFINS),   color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/10' },
            { label: 'Total NF',  value: fmt(totais.valorProdutos), color: 'text-marca-600 font-bold', bg: 'bg-marca-50 dark:bg-marca-900/20' },
          ].map(f => (
            <div key={f.label} className={`rounded-xl p-3 ${f.bg}`}>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">{f.label}</p>
              <p className={`text-sm font-semibold tabular-nums mt-0.5 ${f.color}`}>{f.value}</p>
            </div>
          ))}
        </div>
        {totalImpostos > 0 && (
          <div className="mt-3 flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 px-4 py-2 flex items-center gap-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Total Impostos</p>
                <p className="text-sm font-bold text-orange-600 tabular-nums">{fmt(totalImpostos)}</p>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-600" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Carga Tributária</p>
                <p className="text-sm font-bold text-orange-600 tabular-nums">{pct(cargaTrib)}</p>
              </div>
            </div>
            {isInter && (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                ⚡ CFOPs interestaduais aplicados — {cliente?.uf ?? '?'} → empresa {empresaUF}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Observações */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Observações</label>
        <textarea value={obs} onChange={e => setObs(e.target.value)} rows={3}
          placeholder="Informações adicionais (opcional)"
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-marca-500" />
      </div>

      {/* Botões de ação rodapé */}
      <div className="flex justify-end gap-3 pb-6">
        <button onClick={handleSalvar} disabled={isBusy || !cliente?.nome}
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors">
          <Save className="h-4 w-4" />Salvar Rascunho
        </button>
        <button onClick={handleValidar} disabled={isBusy || !canProceed}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors">
          <ShieldCheck className="h-4 w-4" />Validar NF-e
        </button>
        <button onClick={handleEmitir} disabled={isBusy || !canProceed}
          className="flex items-center gap-2 rounded-xl bg-marca-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-marca-700 disabled:opacity-40 transition-colors shadow-sm">
          {emitirNF.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Emitir para SEFAZ
        </button>
      </div>
    </div>
  );
}

// Wrapper com Suspense (requerido pelo useSearchParams no Next.js 15)
export default function NovaNotaFiscalPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-marca-500" /></div>}>
      <NovaNotaFiscalForm />
    </Suspense>
  );
}
