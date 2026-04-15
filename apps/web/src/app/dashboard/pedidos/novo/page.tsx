'use client';

/**
 * Página de Criar Pedido Manual
 * Busca cliente, adiciona produtos, calcula totais
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save, Search } from 'lucide-react';
import { FormField } from '@/components/ui/form-field';

// Dados mock
const clientesMock = [
  { id: '1', nome: 'João Silva', email: 'joao@example.com' },
  { id: '2', nome: 'Maria Santos', email: 'maria@example.com' },
];

const produtosMock = [
  { id: '1', nome: 'iPhone 15 Pro', sku: 'APL-IP15P-256', preco: 7999.00 },
  { id: '2', nome: 'AirPods Pro 2', sku: 'APL-ADP2-WH', preco: 2299.00 },
  { id: '3', nome: 'Mouse Gamer', sku: 'MOU-GAME-RF-02', preco: 189.90 },
];

interface ItemPedido {
  id: string;
  nome: string;
  sku: string;
  quantidade: number;
  precoUnitario: number;
}

export default function NovoPedidoPage() {
  const router = useRouter();
  const [clienteId, setClienteId] = useState('');
  const [items, setItems] = useState<ItemPedido[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidadeProduto, setQuantidadeProduto] = useState('1');
  const [frete, setFrete] = useState('0');
  const [desconto, setDesconto] = useState('0');
  const [metodoPagamento, setMetodoPagamento] = useState('DINHEIRO');
  const [endereco, setEndereco] = useState('');
  const [salvando, setSalvando] = useState(false);

  const cliente = clientesMock.find((c) => c.id === clienteId);
  const subtotal = items.reduce((acc, item) => acc + item.precoUnitario * item.quantidade, 0);
  const total = subtotal + Number(frete) - Number(desconto);

  const handleAdicionarProduto = () => {
    if (!produtoSelecionado) return;

    const produto = produtosMock.find((p) => p.id === produtoSelecionado);
    if (!produto) return;

    const itemExistente = items.find((i) => i.id === produtoSelecionado);

    if (itemExistente) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === produtoSelecionado
            ? { ...i, quantidade: i.quantidade + Number(quantidadeProduto) }
            : i
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: produto.id,
          nome: produto.nome,
          sku: produto.sku,
          quantidade: Number(quantidadeProduto),
          precoUnitario: produto.preco,
        },
      ]);
    }

    setProdutoSelecionado('');
    setQuantidadeProduto('1');
  };

  const handleRemoverItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || items.length === 0) return;

    setSalvando(true);

    // Simulação de salvamento
    setTimeout(() => {
      router.push('/dashboard/pedidos');
      setSalvando(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Novo Pedido
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Crie um pedido manual
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid 2/3 + 1/3 */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cliente */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                Dados do Cliente
              </h2>
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="">Selecione um cliente</option>
                {clientesMock.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.email})
                  </option>
                ))}
              </select>

              {cliente && (
                <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {cliente.nome}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {cliente.email}
                  </p>
                </div>
              )}
            </div>

            {/* Produtos */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                Produtos
              </h2>

              <div className="space-y-3">
                <select
                  value={produtoSelecionado}
                  onChange={(e) => setProdutoSelecionado(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
                >
                  <option value="">Selecione um produto</option>
                  {produtosMock.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} - R$ {p.preco.toFixed(2)}
                    </option>
                  ))}
                </select>

                <div className="flex gap-3">
                  <input
                    type="number"
                    min="1"
                    value={quantidadeProduto}
                    onChange={(e) => setQuantidadeProduto(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
                    placeholder="Quantidade"
                  />
                  <button
                    type="button"
                    onClick={handleAdicionarProduto}
                    className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 font-medium text-white hover:bg-marca-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Lista de Items */}
              {items.length > 0 && (
                <div className="mt-6 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {item.nome}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {item.sku}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">
                          {item.quantidade}x R$ {item.precoUnitario.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoverItem(item.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Endereço */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                Endereço de Entrega
              </h2>

              <textarea
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Endereço completo..."
                rows={3}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resumo */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                Resumo
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Subtotal:
                  </span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400">
                    Frete:
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={frete}
                    onChange={(e) => setFrete(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400">
                    Desconto:
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={desconto}
                    onChange={(e) => setDesconto(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
                  />
                </div>

                <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-marca-600 dark:text-marca-400">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagamento */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                Forma de Pagamento
              </h2>

              <select
                value={metodoPagamento}
                onChange={(e) => setMetodoPagamento(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="DINHEIRO">Dinheiro</option>
                <option value="PIX">PIX</option>
                <option value="CARTAO">Cartão de Crédito</option>
                <option value="BOLETO">Boleto</option>
              </select>
            </div>

            {/* Botão Salvar */}
            <button
              type="submit"
              disabled={!clienteId || items.length === 0 || salvando}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-destaque-500 px-4 py-3 font-bold text-white hover:bg-destaque-600 disabled:opacity-50 transition-colors"
            >
              <Save className="h-5 w-5" />
              {salvando ? 'Salvando...' : 'Criar Pedido'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
