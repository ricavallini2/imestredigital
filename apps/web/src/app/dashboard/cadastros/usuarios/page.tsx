'use client';

/**
 * Cadastro de Usuários e Permissões.
 *
 * Admin/gerente criam usuários, definem o cargo (que semeia um template de
 * permissões) e ajustam individualmente o que cada um pode ver, incluir,
 * editar e excluir em cada módulo do ERP.
 */

import { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  ShieldCheck,
  Loader2,
  Search,
  KeyRound,
  Copy,
  CheckCircle2,
  X,
  UserCheck,
  UserX,
} from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';
import { Modal } from '@/components/ui/modal';
import { FormField } from '@/components/ui/form-field';
import {
  useUsuarios,
  useCatalogoPermissoes,
  useCriarUsuario,
  useAtualizarUsuario,
  useDefinirPermissoes,
  useRemoverUsuario,
  useUsuario,
} from '@/hooks/useUsuarios';
import {
  CARGO_LABELS,
  CARGOS_SELECIONAVEIS,
  STATUS_LABELS,
  type Usuario,
  type CargoUsuario,
  type StatusUsuario,
  type PermissaoModulo,
} from '@/services/usuarios.service';

const ACOES: Array<{ chave: keyof Omit<PermissaoModulo, 'modulo'>; label: string }> = [
  { chave: 'visualizar', label: 'Ver' },
  { chave: 'incluir', label: 'Incluir' },
  { chave: 'editar', label: 'Editar' },
  { chave: 'excluir', label: 'Excluir' },
];

const CARGO_CLS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  gerente: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  vendedor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  caixa: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  estoquista: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  financeiro: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
};

const dthr = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

export default function UsuariosPage() {
  const { data: usuarios, isLoading, isError } = useUsuarios();
  const { data: catalogo } = useCatalogoPermissoes();
  const criar = useCriarUsuario();
  const atualizar = useAtualizarUsuario();
  const definirPermissoes = useDefinirPermissoes();
  const remover = useRemoverUsuario();

  const [busca, setBusca] = useState('');
  const [modalUsuario, setModalUsuario] = useState<null | { id?: string }>(null);
  const [permissoesDe, setPermissoesDe] = useState<Usuario | null>(null);
  const [erro, setErro] = useState('');
  const [senhaGerada, setSenhaGerada] = useState<{ email: string; senha: string } | null>(null);
  const [copiado, setCopiado] = useState(false);

  const formVazio = {
    nome: '',
    email: '',
    cargo: 'funcionario' as CargoUsuario,
    senha: '',
    status: 'ativo' as StatusUsuario,
    podeLiberarVenda: false,
    reaplicarTemplateCargo: false,
  };
  const [form, setForm] = useState(formVazio);

  const lista = usuarios ?? [];
  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return lista;
    return lista.filter(
      (u) =>
        u.nome.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        CARGO_LABELS[u.cargo]?.toLowerCase().includes(q),
    );
  }, [lista, busca]);

  const ativos = lista.filter((u) => u.status === 'ativo').length;
  const gestores = lista.filter((u) => u.cargo === 'admin' || u.cargo === 'gerente').length;

  const abrirNovo = () => {
    setForm(formVazio);
    setErro('');
    setModalUsuario({});
  };

  const abrirEdicao = (u: Usuario) => {
    setForm({
      nome: u.nome,
      email: u.email,
      cargo: u.cargo,
      senha: '',
      status: u.status,
      podeLiberarVenda: u.podeLiberarVenda,
      reaplicarTemplateCargo: false,
    });
    setErro('');
    setModalUsuario({ id: u.id });
  };

  const salvarUsuario = async () => {
    setErro('');
    if (!form.nome.trim()) return setErro('Informe o nome.');
    if (!modalUsuario?.id && !form.email.trim()) return setErro('Informe o e-mail.');
    if (form.senha && form.senha.length < 8)
      return setErro('A senha deve ter ao menos 8 caracteres.');
    try {
      if (modalUsuario?.id) {
        await atualizar.mutateAsync({
          id: modalUsuario.id,
          dto: {
            nome: form.nome.trim(),
            cargo: form.cargo,
            status: form.status,
            podeLiberarVenda: form.podeLiberarVenda,
            ...(form.senha ? { senha: form.senha } : {}),
            reaplicarTemplateCargo: form.reaplicarTemplateCargo,
          },
        });
      } else {
        const res = await criar.mutateAsync({
          nome: form.nome.trim(),
          email: form.email.trim(),
          cargo: form.cargo,
          podeLiberarVenda: form.podeLiberarVenda,
          ...(form.senha ? { senha: form.senha } : {}),
        });
        // Senha gerada aparece UMA vez — não é recuperável depois.
        if (res.senhaGerada) setSenhaGerada({ email: res.usuario.email, senha: res.senhaGerada });
      }
      setModalUsuario(null);
    } catch (e: any) {
      const m = e?.response?.data?.message;
      setErro(Array.isArray(m) ? m[0] : (m ?? 'Erro ao salvar o usuário.'));
    }
  };

  const desativar = async (u: Usuario) => {
    if (!confirm(`Desativar o usuário ${u.nome}? Ele perde o acesso imediatamente.`)) return;
    try {
      await remover.mutateAsync(u.id);
    } catch (e: any) {
      const m = e?.response?.data?.message;
      alert(Array.isArray(m) ? m[0] : (m ?? 'Erro ao desativar.'));
    }
  };

  const salvando = criar.isPending || atualizar.isPending;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-marca-100 p-2.5 dark:bg-marca-900/30">
            <Users className="h-6 w-6 text-marca-600 dark:text-marca-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Usuários</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Cadastro da equipe e controle de acesso por módulo
            </p>
          </div>
        </div>
        <button
          onClick={abrirNovo}
          className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 font-medium text-white transition-colors hover:bg-marca-600"
        >
          <Plus className="h-4 w-4" /> Novo Usuário
        </button>
      </div>

      {/* Senha gerada (aparece só uma vez) */}
      {senhaGerada && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 dark:border-amber-800 dark:bg-amber-900/20">
          <KeyRound className="h-5 w-5 shrink-0 text-amber-500" />
          <p className="flex-1 text-sm text-amber-800 dark:text-amber-300">
            Senha inicial de <span className="font-semibold">{senhaGerada.email}</span>:{' '}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono font-bold dark:bg-amber-900/40">
              {senhaGerada.senha}
            </code>{' '}
            — anote agora, ela não será exibida novamente.
          </p>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(senhaGerada.senha);
              setCopiado(true);
              setTimeout(() => setCopiado(false), 2000);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
          >
            {copiado ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copiado ? 'Copiada' : 'Copiar'}
          </button>
          <button
            onClick={() => setSenhaGerada(null)}
            className="text-amber-400 hover:text-amber-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard
          label="Usuários"
          valor={String(lista.length)}
          icone={<Users className="h-5 w-5" />}
        />
        <KPICard label="Ativos" valor={String(ativos)} icone={<UserCheck className="h-5 w-5" />} />
        <KPICard
          label="Admins e gerentes"
          valor={String(gestores)}
          icone={<ShieldCheck className="h-5 w-5" />}
        />
      </div>

      {/* Busca */}
      <div className="relative w-full sm:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, e-mail ou cargo..."
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-marca-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      {/* Lista */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-marca-500" />
          </div>
        ) : isError ? (
          <p className="px-5 py-10 text-center text-sm text-red-500">
            Erro ao carregar usuários. Verifique se o serviço de autenticação está disponível.
          </p>
        ) : filtrados.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            {busca ? `Nenhum usuário encontrado para “${busca}”.` : 'Nenhum usuário cadastrado.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-400 dark:bg-slate-700/40">
                <tr>
                  <th className="px-5 py-3">Usuário</th>
                  <th className="px-3 py-3">Cargo</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Último acesso</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtrados.map((u) => (
                  <tr
                    key={u.id}
                    className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/30"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{u.nome}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                      {u.podeLiberarVenda && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <ShieldCheck className="h-3 w-3" /> Libera venda
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          CARGO_CLS[u.cargo] ??
                          'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {CARGO_LABELS[u.cargo] ?? u.cargo}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          u.status === 'ativo'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                        }`}
                      >
                        {STATUS_LABELS[u.status] ?? u.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500">{dthr(u.ultimoLogin)}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setPermissoesDe(u)}
                          title="Permissões"
                          className="rounded-lg p-1.5 text-marca-600 hover:bg-marca-50 dark:text-marca-400 dark:hover:bg-marca-900/20"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => abrirEdicao(u)}
                          title="Editar"
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {u.status === 'ativo' && (
                          <button
                            onClick={() => desativar(u)}
                            title="Desativar"
                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <UserX className="h-4 w-4" />
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

      {/* Modal criar/editar usuário */}
      <Modal
        isOpen={modalUsuario !== null}
        onClose={() => setModalUsuario(null)}
        title={modalUsuario?.id ? 'Editar Usuário' : 'Novo Usuário'}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setModalUsuario(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              onClick={salvarUsuario}
              disabled={salvando}
              className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-600 disabled:opacity-50"
            >
              {salvando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Salvar
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Nome"
            placeholder="Nome completo"
            value={form.nome}
            onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
            required
          />
          <FormField
            label="E-mail"
            type="email"
            placeholder="pessoa@empresa.com"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            disabled={!!modalUsuario?.id}
            hint={modalUsuario?.id ? 'O e-mail de login não pode ser alterado' : undefined}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Cargo
              </label>
              <select
                value={form.cargo}
                onChange={(e) => setForm((p) => ({ ...p, cargo: e.target.value as CargoUsuario }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                {CARGOS_SELECIONAVEIS.map((c) => (
                  <option key={c} value={c}>
                    {CARGO_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
            {modalUsuario?.id && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, status: e.target.value as StatusUsuario }))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  {(['ativo', 'inativo', 'bloqueado'] as StatusUsuario[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <FormField
            label={modalUsuario?.id ? 'Nova senha (opcional)' : 'Senha (opcional)'}
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={form.senha}
            onChange={(e) => setForm((p) => ({ ...p, senha: e.target.value }))}
            hint={
              modalUsuario?.id
                ? 'Preencha só para trocar a senha — isso encerra as sessões abertas'
                : 'Se deixar em branco, o sistema gera uma senha e mostra uma única vez'
            }
          />
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <input
              type="checkbox"
              checked={form.podeLiberarVenda}
              onChange={(e) => setForm((p) => ({ ...p, podeLiberarVenda: e.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-marca-600 focus:ring-marca-400"
            />
            <span>
              <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                Pode liberar venda
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                Autoriza vendas com desconto acima do máximo configurado.
              </span>
            </span>
          </label>
          {modalUsuario?.id && (
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/10">
              <input
                type="checkbox"
                checked={form.reaplicarTemplateCargo}
                onChange={(e) =>
                  setForm((p) => ({ ...p, reaplicarTemplateCargo: e.target.checked }))
                }
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-400"
              />
              <span>
                <span className="block text-sm font-medium text-amber-800 dark:text-amber-300">
                  Redefinir permissões pelo cargo
                </span>
                <span className="block text-xs text-amber-700 dark:text-amber-400">
                  Substitui os ajustes individuais pelo padrão do cargo selecionado.
                </span>
              </span>
            </label>
          )}
          {erro && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
              {erro}
            </p>
          )}
        </div>
      </Modal>

      {/* Matriz de permissões */}
      {permissoesDe && (
        <ModalPermissoes
          usuario={permissoesDe}
          modulos={catalogo?.modulos ?? []}
          onClose={() => setPermissoesDe(null)}
          onSalvar={async (permissoes) => {
            await definirPermissoes.mutateAsync({ id: permissoesDe.id, permissoes });
            setPermissoesDe(null);
          }}
          salvando={definirPermissoes.isPending}
        />
      )}
    </div>
  );
}

// ─── Modal da matriz de permissões ───────────────────────────────────────────

function ModalPermissoes({
  usuario,
  modulos,
  onClose,
  onSalvar,
  salvando,
}: {
  usuario: Usuario;
  modulos: Array<{ chave: string; label: string; grupo: string }>;
  onClose: () => void;
  onSalvar: (p: PermissaoModulo[]) => Promise<void>;
  salvando: boolean;
}) {
  // Busca o detalhe (matriz atual) do usuário selecionado.
  const { data: detalhe, isLoading } = useUsuario(usuario.id);
  const [matriz, setMatriz] = useState<Record<string, PermissaoModulo>>({});
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!detalhe) return;
    const m: Record<string, PermissaoModulo> = {};
    for (const mod of modulos) {
      const p = detalhe.permissoes.find((x) => x.modulo === mod.chave);
      m[mod.chave] = {
        modulo: mod.chave,
        visualizar: p?.visualizar ?? false,
        incluir: p?.incluir ?? false,
        editar: p?.editar ?? false,
        excluir: p?.excluir ?? false,
      };
    }
    setMatriz(m);
  }, [detalhe, modulos]);

  const grupos = useMemo(() => {
    const g: Record<string, typeof modulos> = {};
    for (const m of modulos) (g[m.grupo] ??= []).push(m);
    return g;
  }, [modulos]);

  const alternar = (modulo: string, acao: keyof Omit<PermissaoModulo, 'modulo'>) =>
    setMatriz((prev) => {
      const linha = { ...prev[modulo], [acao]: !prev[modulo]?.[acao] };
      // Incluir/editar/excluir sem "ver" não faz sentido — liga o ver junto.
      if (acao !== 'visualizar' && linha[acao]) linha.visualizar = true;
      // Tirar o "ver" derruba as demais ações do módulo.
      if (acao === 'visualizar' && !linha.visualizar) {
        linha.incluir = false;
        linha.editar = false;
        linha.excluir = false;
      }
      return { ...prev, [modulo]: linha };
    });

  const marcarLinha = (modulo: string, valor: boolean) =>
    setMatriz((prev) => ({
      ...prev,
      [modulo]: { modulo, visualizar: valor, incluir: valor, editar: valor, excluir: valor },
    }));

  const marcarTudo = (valor: boolean) =>
    setMatriz((prev) => {
      const novo: Record<string, PermissaoModulo> = {};
      for (const k of Object.keys(prev))
        novo[k] = { modulo: k, visualizar: valor, incluir: valor, editar: valor, excluir: valor };
      return novo;
    });

  const salvar = async () => {
    setErro('');
    try {
      await onSalvar(Object.values(matriz));
    } catch (e: any) {
      const m = e?.response?.data?.message;
      setErro(Array.isArray(m) ? m[0] : (m ?? 'Erro ao salvar as permissões.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
        <div className="flex items-start justify-between bg-marca-600 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-white/20 p-2">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Permissões</h2>
              <p className="text-xs text-marca-100">
                {usuario.nome} · {CARGO_LABELS[usuario.cargo] ?? usuario.cargo}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 text-marca-100 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-2.5 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Marque o que este usuário pode fazer em cada módulo.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => marcarTudo(true)}
              className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Marcar tudo
            </button>
            <button
              onClick={() => marcarTudo(false)}
              className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Limpar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-marca-500" />
            </div>
          ) : (
            <div className="space-y-5">
              {Object.entries(grupos).map(([grupo, mods]) => (
                <div key={grupo}>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                    {grupo}
                  </p>
                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-700/40">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400">
                            Módulo
                          </th>
                          {ACOES.map((a) => (
                            <th
                              key={a.chave}
                              className="w-16 px-2 py-2 text-center text-xs font-semibold text-slate-400"
                            >
                              {a.label}
                            </th>
                          ))}
                          <th className="w-20 px-2 py-2 text-center text-xs font-semibold text-slate-400">
                            Tudo
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {mods.map((mod) => {
                          const linha = matriz[mod.chave];
                          const todas =
                            linha?.visualizar && linha?.incluir && linha?.editar && linha?.excluir;
                          return (
                            <tr key={mod.chave} className="bg-white dark:bg-slate-800">
                              <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-200">
                                {mod.label}
                              </td>
                              {ACOES.map((a) => (
                                <td key={a.chave} className="px-2 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={linha?.[a.chave] ?? false}
                                    onChange={() => alternar(mod.chave, a.chave)}
                                    className="h-4 w-4 rounded border-slate-300 text-marca-600 focus:ring-marca-400"
                                  />
                                </td>
                              ))}
                              <td className="px-2 py-2 text-center">
                                <button
                                  onClick={() => marcarLinha(mod.chave, !todas)}
                                  className="text-[11px] font-semibold text-marca-600 hover:underline dark:text-marca-400"
                                >
                                  {todas ? 'limpar' : 'tudo'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
          {erro && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
              {erro}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-3 dark:border-slate-700">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={salvando || isLoading}
            className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-600 disabled:opacity-50"
          >
            {salvando ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Salvar permissões
          </button>
        </div>
      </div>
    </div>
  );
}
