// Configuração do CommitLint para padronização de mensagens de commit
// Segue o padrão Conventional Commits: tipo(escopo): descrição
// Exemplos válidos:
//   feat(catalogo): adicionar busca por código de barras
//   fix(fiscal): corrigir cálculo de ICMS interestadual
//   docs(api): documentar endpoints do serviço de estoque
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Tipos permitidos para commits
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nova funcionalidade
        'fix',      // Correção de bug
        'docs',     // Documentação
        'style',    // Formatação (sem alteração de lógica)
        'refactor', // Refatoração de código
        'perf',     // Melhoria de performance
        'test',     // Adição/correção de testes
        'build',    // Alterações no build/dependências
        'ci',       // Alterações no CI/CD
        'chore',    // Manutenção geral
        'revert',   // Reverter commit anterior
      ],
    ],
    // Escopos sugeridos (não obrigatórios)
    'scope-enum': [
      1, // warning apenas
      'always',
      [
        'catalogo', 'estoque', 'pedidos', 'marketplace',
        'fiscal', 'financeiro', 'crm', 'ia', 'auth',
        'notificacao', 'web', 'mobile', 'gateway',
        'infra', 'config', 'deps', 'docs',
      ],
    ],
    'subject-max-length': [2, 'always', 100],
  },
};
