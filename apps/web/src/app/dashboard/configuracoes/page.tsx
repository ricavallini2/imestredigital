'use client';

/**
 * Página de Configurações Gerais
 * Dados da empresa, usuários, integrações e notificações
 */

import { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Bell,
  Link as LinkIcon,
  Save,
  Plus,
  Edit,
  Trash2,
  CreditCard,
  Percent,
  Loader2,
} from 'lucide-react';
import { FormField } from '@/components/ui/form-field';
import { Tabs } from '@/components/ui/tabs';
import { Modal } from '@/components/ui/modal';
import {
  useFormasPagamento,
  useCriarFormaPagamento,
  useAtualizarFormaPagamento,
  useRemoverFormaPagamento,
} from '@/hooks/useFormasPagamento';
import { TIPO_FORMA_LABELS, type TipoFormaPagamento } from '@/services/formas-pagamento.service';
import { obterDescontoMaximoPct, salvarDescontoMaximoPct } from '@/lib/config-vendas';

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
    podeLiberarVenda: false,
  });

  // ── Política de venda: teto de desconto (%) ────────────────────────────────
  const [descontoMax, setDescontoMax] = useState('');
  const [descontoSalvo, setDescontoSalvo] = useState(false);
  useEffect(() => {
    const v = obterDescontoMaximoPct();
    setDescontoMax(v === null ? '' : String(v));
  }, []);
  const handleSalvarDesconto = () => {
    salvarDescontoMaximoPct(descontoMax === '' ? null : Number(descontoMax));
    setDescontoSalvo(true);
    setTimeout(() => setDescontoSalvo(false), 2000);
  };

  // ── Cadastro de formas de pagamento (CRUD real no order-service) ───────────
  const { data: formas, isLoading: loadingFormas } = useFormasPagamento({});
  const criarForma = useCriarFormaPagamento();
  const atualizarForma = useAtualizarFormaPagamento();
  const removerForma = useRemoverFormaPagamento();
  const [modalForma, setModalForma] = useState<null | { id?: string }>(null);
  const [erroForma, setErroForma] = useState('');
  const formaVazia = {
    descricao: '',
    tipo: 'CARTAO_CREDITO' as TipoFormaPagamento,
    bandeira: 'Visa',
    parcelas: 1,
    taxaPct: '',
    taxaFixa: '',
    prazoRecebimentoDias: '',
    ativa: true,
  };
  const [formForma, setFormForma] = useState(formaVazia);
  const ehCartao = formForma.tipo === 'CARTAO_CREDITO' || formForma.tipo === 'CARTAO_DEBITO';

  const abrirNovaForma = () => {
    setFormForma(formaVazia);
    setErroForma('');
    setModalForma({});
  };
  const abrirEditarForma = (f: any) => {
    setFormForma({
      descricao: f.descricao,
      tipo: f.tipo,
      bandeira: f.bandeira ?? 'Visa',
      parcelas: f.parcelas ?? 1,
      taxaPct: f.taxaPct != null ? String(f.taxaPct) : '',
      taxaFixa: f.taxaFixa != null ? String(f.taxaFixa) : '',
      prazoRecebimentoDias: f.prazoRecebimentoDias != null ? String(f.prazoRecebimentoDias) : '',
      ativa: f.ativa,
    });
    setErroForma('');
    setModalForma({ id: f.id });
  };
  const salvarForma = async () => {
    setErroForma('');
    if (!formForma.descricao.trim()) return setErroForma('Informe a descrição.');
    const dto = {
      descricao: formForma.descricao.trim(),
      tipo: formForma.tipo,
      bandeira: ehCartao ? formForma.bandeira : undefined,
      parcelas: formForma.tipo === 'CARTAO_CREDITO' ? Number(formForma.parcelas) || 1 : 1,
      taxaPct: formForma.taxaPct !== '' ? Number(formForma.taxaPct) : undefined,
      taxaFixa: formForma.taxaFixa !== '' ? Number(formForma.taxaFixa) : undefined,
      prazoRecebimentoDias:
        formForma.prazoRecebimentoDias !== '' ? Number(formForma.prazoRecebimentoDias) : undefined,
      ativa: formForma.ativa,
    };
    try {
      if (modalForma?.id) await atualizarForma.mutateAsync({ id: modalForma.id, dto });
      else await criarForma.mutateAsync(dto);
      setModalForma(null);
    } catch (e: any) {
      const m = e?.response?.data?.message;
      setErroForma(Array.isArray(m) ? m[0] : (m ?? 'Erro ao salvar a forma de pagamento.'));
    }
  };

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
            onChange={(e) => setFormEmpresa((prev) => ({ ...prev, nome: e.target.value }))}
            required
          />

          <FormField
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            value={formEmpresa.cnpj}
            onChange={(e) => setFormEmpresa((prev) => ({ ...prev, cnpj: e.target.value }))}
            required
          />

          <FormField
            label="Email"
            type="email"
            value={formEmpresa.email}
            onChange={(e) => setFormEmpresa((prev) => ({ ...prev, email: e.target.value }))}
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
                  <p className="font-medium text-slate-900 dark:text-slate-100">{usuario.nome}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{usuario.email}</p>
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
      id: 'vendas',
      label: 'Vendas e Pagamentos',
      icon: <CreditCard className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          {/* Política de desconto */}
          <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
              <Percent className="h-4 w-4 text-marca-500" /> Desconto máximo na venda
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Vendas com desconto acima deste percentual exigem liberação de um gerente ou de um
              usuário com permissão de liberar venda. Vazio = sem limite.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative w-40">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={descontoMax}
                  onChange={(e) => setDescontoMax(e.target.value)}
                  placeholder="ex: 10"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  %
                </span>
              </div>
              <button
                onClick={handleSalvarDesconto}
                className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 text-sm font-medium text-white hover:bg-marca-600"
              >
                <Save className="h-4 w-4" /> Salvar
              </button>
              {descontoSalvo && (
                <span className="text-sm font-medium text-emerald-600">✓ salvo</span>
              )}
            </div>
          </div>

          {/* Cadastro de formas de pagamento */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Formas de Pagamento
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Usadas no PDV e no recebimento do caixa (bandeira × parcelas, taxas e prazos).
                </p>
              </div>
              <button
                onClick={abrirNovaForma}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" /> Incluir forma
              </button>
            </div>
            {loadingFormas ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-marca-500" />
              </div>
            ) : (formas ?? []).length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">
                Nenhuma forma cadastrada. Clique em “Incluir forma”.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-400 dark:bg-slate-700/40">
                    <tr>
                      <th className="px-5 py-2.5">Descrição</th>
                      <th className="px-3 py-2.5">Tipo</th>
                      <th className="px-3 py-2.5">Bandeira</th>
                      <th className="px-3 py-2.5 text-center">Parcelas</th>
                      <th className="px-3 py-2.5 text-right">Taxa</th>
                      <th className="px-3 py-2.5 text-center">Prazo</th>
                      <th className="px-3 py-2.5 text-center">Situação</th>
                      <th className="px-3 py-2.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {(formas ?? []).map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-slate-100">
                          {f.descricao}
                        </td>
                        <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">
                          {TIPO_FORMA_LABELS[f.tipo] ?? f.tipo}
                        </td>
                        <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">
                          {f.bandeira ?? '—'}
                        </td>
                        <td className="px-3 py-2.5 text-center tabular-nums">{f.parcelas}×</td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-400">
                          {f.taxaPct != null ? `${f.taxaPct.toFixed(2)}%` : '—'}
                          {f.taxaFixa != null ? ` + R$ ${f.taxaFixa.toFixed(2)}` : ''}
                        </td>
                        <td className="px-3 py-2.5 text-center text-slate-600 dark:text-slate-400">
                          {f.prazoRecebimentoDias != null ? `${f.prazoRecebimentoDias}d` : '—'}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              f.ativa
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                            }`}
                          >
                            {f.ativa ? 'Ativa' : 'Inativa'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => abrirEditarForma(f)}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {f.ativa && (
                              <button
                                onClick={() => removerForma.mutate(f.id)}
                                className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Inativar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                <span className="font-medium text-slate-900 dark:text-slate-100">{label}</span>
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
                <span className="text-sm text-slate-700 dark:text-slate-300">Email</span>
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
                <span className="text-sm text-slate-700 dark:text-slate-300">WhatsApp</span>
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
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">API Tokens</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Gerenciar tokens para integração com aplicações externas
            </p>
            <button className="mt-3 rounded-lg border border-marca-300 px-3 py-2 text-sm font-medium text-marca-600 hover:bg-marca-50 dark:border-marca-700 dark:text-marca-400 dark:hover:bg-marca-900/20">
              Gerar Novo Token
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Webhooks</h3>
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Configurações</h1>
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
            onChange={(e) => setNovoUsuario((prev) => ({ ...prev, nome: e.target.value }))}
            required
          />

          <FormField
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={novoUsuario.email}
            onChange={(e) => setNovoUsuario((prev) => ({ ...prev, email: e.target.value }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Papel
              <span className="ml-1 text-red-500">*</span>
            </label>
            <select
              value={novoUsuario.papel}
              onChange={(e) => setNovoUsuario((prev) => ({ ...prev, papel: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
            >
              <option value="ADMIN">Administrador</option>
              <option value="GERENTE">Gerente</option>
              <option value="CAIXA">Caixa — recebe pagamentos e emite nota</option>
              <option value="VENDEDOR">Vendedor</option>
              <option value="OPERADOR">Operador</option>
            </select>
          </div>

          <FormField
            label="Senha Temporária"
            type="password"
            placeholder="Será enviada por email"
            value={novoUsuario.senha}
            onChange={(e) => setNovoUsuario((prev) => ({ ...prev, senha: e.target.value }))}
            hint="O usuário poderá alterar na primeira acesso"
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <input
              type="checkbox"
              checked={novoUsuario.podeLiberarVenda}
              onChange={(e) =>
                setNovoUsuario((prev) => ({ ...prev, podeLiberarVenda: e.target.checked }))
              }
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-marca-600 focus:ring-marca-400"
            />
            <span>
              <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                Pode liberar venda
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                Autoriza vendas com desconto acima do máximo configurado (gerentes e administradores
                já podem por padrão).
              </span>
            </span>
          </label>
        </div>
      </Modal>

      {/* Modal Forma de Pagamento */}
      <Modal
        isOpen={modalForma !== null}
        onClose={() => setModalForma(null)}
        title={modalForma?.id ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setModalForma(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              onClick={salvarForma}
              disabled={criarForma.isPending || atualizarForma.isPending}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {criarForma.isPending || atualizarForma.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Descrição"
            placeholder="ex: Amex Crédito 02x"
            value={formForma.descricao}
            onChange={(e) => setFormForma((p) => ({ ...p, descricao: e.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tipo de pagamento
              </label>
              <select
                value={formForma.tipo}
                onChange={(e) =>
                  setFormForma((p) => ({ ...p, tipo: e.target.value as TipoFormaPagamento }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                {Object.entries(TIPO_FORMA_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            {ehCartao && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bandeira
                </label>
                <select
                  value={formForma.bandeira}
                  onChange={(e) => setFormForma((p) => ({ ...p, bandeira: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  {['Visa', 'Mastercard', 'Amex', 'Elo', 'Hipercard', 'Diners', 'Outra'].map(
                    (b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ),
                  )}
                </select>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {formForma.tipo === 'CARTAO_CREDITO' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Parcelas
                </label>
                <select
                  value={formForma.parcelas}
                  onChange={(e) =>
                    setFormForma((p) => ({ ...p, parcelas: Number(e.target.value) }))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}×
                    </option>
                  ))}
                </select>
              </div>
            )}
            <FormField
              label="Taxa (%)"
              type="number"
              placeholder="ex: 4.92"
              value={formForma.taxaPct}
              onChange={(e) => setFormForma((p) => ({ ...p, taxaPct: e.target.value }))}
            />
            <FormField
              label="Prazo receb. (dias)"
              type="number"
              placeholder="ex: 30"
              value={formForma.prazoRecebimentoDias}
              onChange={(e) =>
                setFormForma((p) => ({ ...p, prazoRecebimentoDias: e.target.value }))
              }
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={formForma.ativa}
              onChange={(e) => setFormForma((p) => ({ ...p, ativa: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Ativa</span>
          </label>
          {erroForma && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
              {erroForma}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
