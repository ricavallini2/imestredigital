/**
 * Catálogo de módulos do ERP e templates de permissão por cargo.
 *
 * Fonte da verdade do RBAC: o backend valida contra esta lista e a expõe
 * em GET /usuarios/permissoes/modulos, de modo que a matriz da tela nunca
 * saia de sincronia com o que o servidor aceita.
 */

export const ACOES = ['visualizar', 'incluir', 'editar', 'excluir'] as const;
export type Acao = (typeof ACOES)[number];

export interface ModuloCatalogo {
  /** Chave persistida em PermissaoUsuario.modulo */
  chave: string;
  label: string;
  /** Agrupamento apenas visual na matriz da tela */
  grupo: string;
}

export const MODULOS: ModuloCatalogo[] = [
  { chave: 'dashboard', label: 'Dashboard', grupo: 'Geral' },
  { chave: 'ia', label: 'iMestreAI', grupo: 'Geral' },
  { chave: 'mensagens', label: 'Mensagens', grupo: 'Geral' },

  { chave: 'clientes', label: 'Clientes', grupo: 'Cadastros' },
  { chave: 'fornecedores', label: 'Fornecedores', grupo: 'Cadastros' },
  { chave: 'cfop', label: 'CFOP', grupo: 'Cadastros' },
  { chave: 'produtos', label: 'Produtos', grupo: 'Cadastros' },
  { chave: 'usuarios', label: 'Usuários', grupo: 'Cadastros' },

  { chave: 'estoque', label: 'Estoque', grupo: 'Operação' },
  { chave: 'pedidos', label: 'Pedidos', grupo: 'Vendas' },
  { chave: 'caixa', label: 'Caixa', grupo: 'Vendas' },
  { chave: 'pdv', label: 'PDV / Balcão', grupo: 'Vendas' },
  { chave: 'compras', label: 'Compras', grupo: 'Operação' },
  { chave: 'marketplaces', label: 'Marketplaces', grupo: 'Operação' },

  { chave: 'fiscal', label: 'Fiscal (NF-e/NFC-e)', grupo: 'Financeiro' },
  { chave: 'financeiro', label: 'Financeiro', grupo: 'Financeiro' },
  { chave: 'cobranca', label: 'Cobrança', grupo: 'Financeiro' },

  { chave: 'configuracoes', label: 'Configurações', grupo: 'Administração' },
];

export const CHAVES_MODULOS = MODULOS.map((m) => m.chave);

/** Permissões de um módulo (as 4 ações). */
export interface PermissaoModulo {
  modulo: string;
  visualizar: boolean;
  incluir: boolean;
  editar: boolean;
  excluir: boolean;
}

const todas = (modulo: string): PermissaoModulo => ({
  modulo,
  visualizar: true,
  incluir: true,
  editar: true,
  excluir: true,
});

const somenteVer = (modulo: string): PermissaoModulo => ({
  modulo,
  visualizar: true,
  incluir: false,
  editar: false,
  excluir: false,
});

const custom = (
  modulo: string,
  visualizar: boolean,
  incluir: boolean,
  editar: boolean,
  excluir: boolean,
): PermissaoModulo => ({ modulo, visualizar, incluir, editar, excluir });

const nenhuma = (modulo: string): PermissaoModulo => custom(modulo, false, false, false, false);

/**
 * Template inicial por cargo. É só o ponto de partida: depois de criado,
 * o usuário tem as permissões ajustadas individualmente.
 */
export function templatePorCargo(cargo: string): PermissaoModulo[] {
  const c = (cargo || 'FUNCIONARIO').toUpperCase();

  // Admin e gerente administram o sistema inteiro.
  if (c === 'ADMIN' || c === 'GERENTE') return CHAVES_MODULOS.map(todas);

  if (c === 'VISUALIZADOR') {
    // Vê tudo, exceto a administração de usuários/configurações.
    return CHAVES_MODULOS.map((m) =>
      m === 'usuarios' || m === 'configuracoes' ? nenhuma(m) : somenteVer(m),
    );
  }

  const base = CHAVES_MODULOS.map(nenhuma);
  const aplicar = (perms: PermissaoModulo[]) =>
    base.map((b) => perms.find((p) => p.modulo === b.modulo) ?? b);

  // VENDEDOR (e o legado OPERADOR): vende e cadastra cliente; não mexe em preço/estoque.
  if (c === 'VENDEDOR' || c === 'OPERADOR') {
    return aplicar([
      somenteVer('dashboard'),
      somenteVer('ia'),
      somenteVer('mensagens'),
      custom('clientes', true, true, true, false),
      somenteVer('produtos'),
      somenteVer('estoque'),
      custom('pedidos', true, true, true, false),
      custom('pdv', true, true, false, false),
      somenteVer('caixa'),
    ]);
  }

  if (c === 'CAIXA') {
    return aplicar([
      somenteVer('dashboard'),
      somenteVer('mensagens'),
      somenteVer('clientes'),
      somenteVer('produtos'),
      somenteVer('estoque'),
      custom('pedidos', true, true, true, false),
      custom('pdv', true, true, true, false),
      todas('caixa'),
      custom('fiscal', true, true, false, false),
    ]);
  }

  if (c === 'ESTOQUISTA') {
    return aplicar([
      somenteVer('dashboard'),
      somenteVer('mensagens'),
      custom('produtos', true, true, true, false),
      todas('estoque'),
      custom('compras', true, true, true, false),
      somenteVer('fornecedores'),
      somenteVer('pedidos'),
    ]);
  }

  if (c === 'FINANCEIRO') {
    return aplicar([
      somenteVer('dashboard'),
      somenteVer('mensagens'),
      somenteVer('clientes'),
      todas('financeiro'),
      todas('cobranca'),
      custom('fiscal', true, true, true, false),
      somenteVer('caixa'),
      somenteVer('pedidos'),
      somenteVer('compras'),
    ]);
  }

  // FUNCIONARIO (genérico): acesso mínimo — o gerente libera o resto.
  return aplicar([somenteVer('dashboard'), somenteVer('mensagens')]);
}
