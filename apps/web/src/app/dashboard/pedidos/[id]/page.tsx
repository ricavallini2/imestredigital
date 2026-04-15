'use client';

/**
 * Página de Detalhes do Pedido
 * Timeline de status, dados do cliente, items, valores e ações
 */

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  Edit,
} from 'lucide-react';
import { Timeline } from '@/components/ui/timeline';
import { StatusBadge } from '@/components/ui/status-badge';
import { Modal } from '@/components/ui/modal';

// Dados mock
const pedidoMock = {
  numero: '1001',
  cliente: {
    nome: 'João Silva',
    email: 'joao@example.com',
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123 - São Paulo, SP - 01234-567',
  },
  items: [
    {
      id: '1',
      imagem: '📱',
      nome: 'iPhone 15 Pro',
      sku: 'APL-IP15P-256',
      quantidade: 1,
      precoUnitario: 7999.00,
    },
  ],
  valores: {
    subtotal: 7999.00,
    frete: 50.00,
    desconto: 0,
    total: 8049.00,
  },
  pagamento: {
    metodo: 'Cartão de Crédito',
    status: 'APROVADO',
    parcelas: 3,
    ultimos4Digitos: '1234',
  },
  envio: {
    transportadora: 'Sedex',
    rastreio: 'AA123456789BR',
    dataPostagem: '2024-03-22',
    dataPrevisaoEntrega: '2024-03-27',
  },
  status: 'ENVIADO',
};

const timeline = [
  {
    id: '1',
    label: 'Pedido Confirmado',
    description: 'Seu pedido foi confirmado com sucesso',
    timestamp: '2024-03-20 10:30',
    status: 'completed' as const,
  },
  {
    id: '2',
    label: 'Separando Produtos',
    description: 'Os produtos estão sendo separados no depósito',
    timestamp: '2024-03-21 09:15',
    status: 'completed' as const,
  },
  {
    id: '3',
    label: 'Postado',
    description: 'Seu pedido foi postado pela transportadora',
    timestamp: '2024-03-22 14:45',
    status: 'completed' as const,
  },
  {
    id: '4',
    label: 'Em Trânsito',
    description: 'Seu pedido está a caminho',
    timestamp: '2024-03-23 08:00',
    status: 'completed' as const,
  },
  {
    id: '5',
    label: 'Entrega Programada',
    description: 'Previsão de entrega para 27/03',
    timestamp: '',
    status: 'pending' as const,
  },
];

export default function DetalhesPedidoPage() {
  const router = useRouter();
  const params = useParams();
  const pedidoId = params.id;

  const [modalImpressaoAberta, setModalImpressaoAberta] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Pedido #{pedidoMock.numero}
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {pedidoMock.cliente.nome}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setModalImpressaoAberta(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Printer className="h-4 w-4" />
            Imprimir
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 font-medium text-white hover:bg-marca-600 transition-colors dark:bg-marca-600">
            <Mail className="h-4 w-4" />
            Enviar
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div>
        <StatusBadge status={pedidoMock.status} label="Enviado" />
      </div>

      {/* Grid Principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timeline (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline de Status */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-slate-100">
              Histórico
            </h2>
            <Timeline steps={timeline} />
          </div>

          {/* Detalhes do Cliente */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              Dados do Cliente
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <span>{pedidoMock.cliente.telefone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <span>{pedidoMock.cliente.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-slate-400" />
                <span>{pedidoMock.cliente.endereco}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              Itens do Pedido
            </h2>
            <div className="space-y-3">
              {pedidoMock.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b border-slate-200 pb-3 last:border-0 dark:border-slate-700"
                >
                  <div className="text-3xl">{item.imagem}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.nome}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {item.sku}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.quantidade} un.
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      R$ {item.precoUnitario.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Envio */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              Informações de Envio
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Transportadora:
                </span>
                <span className="font-semibold">
                  {pedidoMock.envio.transportadora}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Rastreio:
                </span>
                <span className="font-semibold font-mono">
                  {pedidoMock.envio.rastreio}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Data de Postagem:
                </span>
                <span className="font-semibold">
                  {pedidoMock.envio.dataPostagem}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Previsão Entrega:
                </span>
                <span className="font-semibold">
                  {pedidoMock.envio.dataPrevisaoEntrega}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Resumo de Valores */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              Resumo
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Subtotal:
                </span>
                <span>
                  R$ {pedidoMock.valores.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Frete:
                </span>
                <span>R$ {pedidoMock.valores.frete.toFixed(2)}</span>
              </div>
              {pedidoMock.valores.desconto > 0 && (
                <div className="flex justify-between text-sm text-destaque-500">
                  <span>Desconto:</span>
                  <span>
                    -R$ {pedidoMock.valores.desconto.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-marca-600 dark:text-marca-400">
                    R$ {pedidoMock.valores.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pagamento */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              Pagamento
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-slate-400" />
                <span>{pedidoMock.pagamento.metodo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Status:
                </span>
                <StatusBadge
                  status="EMITIDA"
                  label="Aprovado"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Parcelas:
                </span>
                <span>
                  {pedidoMock.pagamento.parcelas}x
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Cartão:
                </span>
                <span>
                  **** {pedidoMock.pagamento.ultimos4Digitos}
                </span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="space-y-2">
            <button className="w-full rounded-lg bg-marca-500 px-4 py-2 font-medium text-white hover:bg-marca-600 transition-colors">
              Confirmar Entrega
            </button>
            <button className="w-full rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
              <Edit className="inline mr-2 h-4 w-4" />
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Impressão */}
      <Modal
        isOpen={modalImpressaoAberta}
        onClose={() => setModalImpressaoAberta(false)}
        title="Imprimir Pedido"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setModalImpressaoAberta(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 font-medium text-white hover:bg-marca-600"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>Nota Fiscal</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>Etiqueta de Envio</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>Recibo de Pagamento</span>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
