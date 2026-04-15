'use client';

/**
 * Página de Registro - iMestreDigital
 * Criar nova conta com dados básicos
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Building2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { FormField } from '@/components/ui/form-field';
import { LogoAuth } from '@/components/ui/logo';
import { api } from '@/lib/api';

export default function RegistroPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa: '',
    cnpj: '',
    senha: '',
    confirmarSenha: '',
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const validar = () => {
    const novosErros: Record<string, string> = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      novosErros.email = 'Email inválido';
    }

    if (!formData.empresa.trim()) {
      novosErros.empresa = 'Nome da empresa é obrigatório';
    }

    if (!formData.cnpj.trim()) {
      novosErros.cnpj = 'CNPJ é obrigatório';
    } else if (!/^\d{14}$/.test(formData.cnpj.replace(/\D/g, ''))) {
      novosErros.cnpj = 'CNPJ deve ter 14 dígitos';
    }

    if (!formData.senha.trim()) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      novosErros.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (formData.senha !== formData.confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpar erro do campo quando usuário começa a digitar
    if (erros[name]) {
      setErros((prev) => {
        const novo = { ...prev };
        delete novo[name];
        return novo;
      });
    }
  };

  const formatarCNPJ = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    return numeros
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      cnpj: formatarCNPJ(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    setCarregando(true);

    try {
      await api.post('/v1/auth/registrar', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        nomeEmpresa: formData.empresa,
        cnpj: formData.cnpj.replace(/\D/g, '') || undefined,
      });

      router.push('/login?registro=sucesso');
    } catch (err: any) {
      const mensagem =
        err.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      setErros((prev) => ({ ...prev, geral: mensagem }));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-marca-50 to-slate-100 px-4 py-8 dark:from-slate-900 dark:to-slate-800">
      {/* Container */}
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
        {/* Logo/Branding */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <LogoAuth />
          <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
            Criar Conta
          </h1>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Erro geral */}
          {erros.geral && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {erros.geral}
            </div>
          )}

          {/* Campo Nome */}
          <FormField
            type="text"
            name="nome"
            label="Nome Completo"
            placeholder="Seu nome"
            value={formData.nome}
            onChange={handleChange}
            error={erros.nome}
            icon={<User className="h-5 w-5" />}
            required
          />

          {/* Campo Email */}
          <FormField
            type="email"
            name="email"
            label="Email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            error={erros.email}
            icon={<Mail className="h-5 w-5" />}
            required
          />

          {/* Campo Empresa */}
          <FormField
            type="text"
            name="empresa"
            label="Nome da Empresa"
            placeholder="Sua empresa"
            value={formData.empresa}
            onChange={handleChange}
            error={erros.empresa}
            icon={<Building2 className="h-5 w-5" />}
            required
          />

          {/* Campo CNPJ */}
          <FormField
            type="text"
            name="cnpj"
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            value={formData.cnpj}
            onChange={handleCNPJChange}
            error={erros.cnpj}
            hint="Apenas os dígitos serão aceitos"
            required
          />

          {/* Campo Senha */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Senha
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-slate-400 dark:text-slate-600" />
              </div>

              <input
                type={mostrarSenha ? 'text' : 'password'}
                name="senha"
                placeholder="Mínimo 6 caracteres"
                value={formData.senha}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  erros.senha
                    ? 'border-red-300 focus:ring-red-500 dark:border-red-700'
                    : 'border-slate-300 focus:ring-marca-500 dark:border-slate-600'
                } bg-white px-3 py-2 pl-10 pr-10 transition-colors placeholder-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500`}
                required
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {mostrarSenha ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {erros.senha && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {erros.senha}
              </div>
            )}
          </div>

          {/* Campo Confirmar Senha */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Confirmar Senha
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-slate-400 dark:text-slate-600" />
              </div>

              <input
                type={mostrarConfirmar ? 'text' : 'password'}
                name="confirmarSenha"
                placeholder="Repita sua senha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  erros.confirmarSenha
                    ? 'border-red-300 focus:ring-red-500 dark:border-red-700'
                    : 'border-slate-300 focus:ring-marca-500 dark:border-slate-600'
                } bg-white px-3 py-2 pl-10 pr-10 transition-colors placeholder-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500`}
                required
              />

              <button
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {mostrarConfirmar ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {erros.confirmarSenha && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {erros.confirmarSenha}
              </div>
            )}
          </div>

          {/* Botão Criar Conta */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-gradient-to-r from-marca-500 to-marca-600 px-4 py-2.5 font-semibold text-white transition-all hover:shadow-lg hover:from-marca-600 hover:to-marca-700 disabled:opacity-50 dark:from-marca-600 dark:to-marca-700"
          >
            {carregando ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        {/* Link para login */}
        <div className="mt-6 border-t border-slate-200 pt-6 text-center dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Já tem uma conta?{' '}
            <Link
              href="/login"
              className="font-semibold text-marca-600 hover:text-marca-700 dark:text-marca-400 dark:hover:text-marca-300"
            >
              Faça login
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500">
          © 2024 iMestreDigital. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
