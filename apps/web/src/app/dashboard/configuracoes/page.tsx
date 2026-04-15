'use client';

/**
 * Página de Configurações Gerais
 * Dados da empresa, usuários, integrações e notificações
 */

import { useState } from 'react';
import {
  Building2,
  Users,
  Bell,
  Link as LinkIcon,
  Save,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import { FormField } from '@/components/ui/form-field';
import { Tabs } from '@/components/ui/tabs';
import { Modal } from '@/components/ui/modal';

// Dados mock
const usuariosMock = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@example.com',
    papel: 'ADMIN',
    status: 'ATIVO',
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@example.com',
    papel: 'GERENTE',
    status: 'ATIVO',
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    email: 'pedro@example.com',
    papel: 'VENDEDOR',
    status: 'INATIVO',
  },
];

export default function ConfiguracoesPage() {
  const [salvando, setSalvando] = useState(false);
  const [usuarios, setUsuarios] = useState(usuariosMock);
  const [modalNovoUsuario, setModalNovoUsuario] = useState(false);

  const [formEmpresa, setFormEmpresa] = useState({
    nome: 'iMestreDigital LTDA',
    cnpj: '12.345.678/0001-99',
    email: 'contato@imestredigital.com.br',
    telefone: '(11) 3000-0000',
    endereco: 'Rua das Flores, 123 - São Paulo, SP',
    logotipo: 'logo.png',
  });

  const [notificacoes, setNotificacoes] = useState({
    pedidosNovos: true,
    pedidosCancelados: true,
    estoqueBaixo: true,
    nfePendente: true,
    emailNotificacoes: true,
    whatsappNotificacoes: false,
  });

  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    papel: 'VENDEDOR',
    senha: '',
  });

  const handleSalvarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setTimeout(() => setSalvando(false), 1000);
  };

  const handleAdicionarUsuario = () => {
    if (!novoUsuario.nome || !novoUsuario.email) return;

    setUsuarios((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        papel: novoUsuario.papel,
        status: 'ATIVO',
      },
    ]);

    setModalNovoUsuario(false);
    setNovoUsuario({ nome: '', email: '', papel: 'VENDEDOR', senha: '' });
  };

  const handleRemoverUsuario = (id: string) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const abasConteudo = [
    {
      id: 'empresa',
      label: 'Dados da Empresa',
      icon: <Building2 className="h-4 w-4" />,
      content: (
        <form onSubmit={handleSalvarEmpresa} className="space-y-4">
          <FormField
            label="Nome da Empresa"
            value={formEmpresa.nome}
            onChange={(e) =>
              setFormEmpresa((prev) => ({ ...prev, nome: e.target.value }))
            }
            required
          />

          <FormField
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            value={formEmpresa.cnpj}
            onChange={(e) =>
              setFormEmpresa((prev) => ({ ...prev, cnpj: e.target.value }))
            }
            required
          />

          <FormField
            label="Email"
            type="email"
            value={formEmpresa.email}
            onChange={(e) =>
              setFormEmpresa((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />

          <FormField
            label="Telefone"
            value={formEmpresa.telefone}
            onChange={(e) =>
              setFormEmpresa((prev) => ({
                ...prev,
                telefone: e.target.value,
              }))
            }
          />

          <FormField
            label="Endereço"
            value={formEmpresa.endereco}
            onChange={(e) =>
              setFormEmpresa((prev) => ({
                ...prev,
                endereco: e.target.value,
              }))
            }
            required
          />

          <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
            <button
              type="submit"
              disabled={salvando}
              className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 font-medium text-white hover:bg-marca-600 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              {salvando ? 'Salvando...' : 'Salvar Dados'}
            </button>
          </div>
        </form>
      ),
    },
    {
      id: 'usuarios',
      label: 'Usuários e Permissões',
      icon: <Users className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <button
            onClick={() => setModalNovoUsuario(true)}
            className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 font-medium text-white hover:bg-marca-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo Usuário
          </button>

          <div className="space-y-3">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {usuario.nome}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {usuario.email}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="rounded-lg bg-marca-100 px-2 py-0.5 text-xs font-semibold text-marca-700 dark:bg-marca-900/30 dark:text-marca-400">
                      {usuario.papel}
                    </span>
                    <span
                      className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${
                        usuario.status === 'ATIVO'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
                      }`}
                    >
                      {usuario.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRemoverUsuario(usuario.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'notificacoes',
      label: 'Notificações',
      icon: <Bell className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            {[
              { key: 'pedidosNovos', label: 'Novos Pedidos' },
              { key: 'pedidosCancelados', label: 'Pedidos Cancelados' },
              { key: 'estoqueBaixo', label: 'Estoque Baixo' },
              { key: 'nfePendente', label: 'NF-e Pendente' },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <input
                  type="checkbox"
                  checked={notificacoes[key as keyof typeof notificacoes]}
                  onChange={(e) =>
                    setNotificacoes((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded"
                />
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {label}
                </span>
              </label>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
            <p className="mb-3 text-sm font-medium text-slate-900 dark:text-slate-100">
              Canais de Notificação
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notificacoes.emailNotificacoes}
                  onChange={(e) =>
                    setNotificacoes((prev) => ({
                      ...prev,
                      emailNotificacoes: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Email
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notificacoes.whatsappNotificacoes}
                  onChange={(e) =>
                    setNotificacoes((prev) => ({
                      ...prev,
                      whatsappNotificacoes: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  WhatsApp
                </span>
              </label>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'integracao',
      label: 'Integrações',
      icon: <LinkIcon className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              API Tokens
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Gerenciar tokens para integração com aplicações externas
            </p>
            <button className="mt-3 rounded-lg border border-marca-300 px-3 py-2 text-sm font-medium text-marca-600 hover:bg-marca-50 dark:border-marca-700 dark:text-marca-400 dark:hover:bg-marca-900/20">
              Gerar Novo Token
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Webhooks
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Configure notificações em tempo real para seus sistemas
            </p>
            <button className="mt-3 rounded-lg border border-marca-300 px-3 py-2 text-sm font-medium text-marca-600 hover:bg-marca-50 dark:border-marca-700 dark:text-marca-400 dark:hover:bg-marca-900/20">
              Adicionar Webhook
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Configurações
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Configure sua conta e preferências
        </p>
      </div>

      {/* Abas */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <Tabs tabs={abasConteudo} />
      </div>

      {/* Modal Novo Usuário */}
      <Modal
        isOpen={modalNovoUsuario}
        onClose={() => setModalNovoUsuario(false)}
        title="Adicionar Novo Usuário"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setModalNovoUsuario(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleAdicionarUsuario}
              className="rounded-lg bg-marca-500 px-4 py-2 font-medium text-white hover:bg-marca-600"
            >
              Adicionar
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Nome"
            placeholder="Nome completo"
            value={novoUsuario.nome}
            onChange={(e) =>
              setNovoUsuario((prev) => ({ ...prev, nome: e.target.value }))
            }
            required
          />

          <FormField
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={novoUsuario.email}
            onChange={(e) =>
              setNovoUsuario((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Papel
              <span className="ml-1 text-red-500">*</span>
            </label>
            <select
              value={novoUsuario.papel}
              onChange={(e) =>
                setNovoUsuario((prev) => ({ ...prev, papel: e.target.value }))
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
            >
              <option value="ADMIN">Administrador</option>
              <option value="GERENTE">Gerente</option>
              <option value="VENDEDOR">Vendedor</option>
              <option value="OPERADOR">Operador</option>
            </select>
          </div>

          <FormField
            label="Senha Temporária"
            type="password"
            placeholder="Será enviada por email"
            value={novoUsuario.senha}
            onChange={(e) =>
              setNovoUsuario((prev) => ({ ...prev, senha: e.target.value }))
            }
            hint="O usuário poderá alterar na primeira acesso"
          />
        </div>
      </Modal>
    </div>
  );
}
