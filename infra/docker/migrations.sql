-- ═══════════════════════════════════════════════════════════════════════════════
-- iMestreDigital - Referência de Schema SQL (DOCUMENTO DE REFERÊNCIA)
-- ═══════════════════════════════════════════════════════════════════════════════
-- ⚠️  ATENÇÃO: Este arquivo NÃO é mais usado pelo deploy.sh.
--
-- O schema do banco é gerenciado diretamente pelo Prisma via:
--   ./deploy.sh migrate   → executa `prisma db push` em todos os serviços
--
-- Este arquivo foi gerado antes da reengenharia dos schemas (commit 7b4465d)
-- e pode estar DESATUALIZADO. Mantido apenas como referência histórica.
-- Para ver o schema atual, consulte cada services/<nome>/prisma/schema.prisma
-- ═══════════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════════
-- Database: auth_service
-- ═══════════════════════════════════════════════════════════════════════════════

\c auth_service;

-- Enum: Usuario.cargo
CREATE TYPE usuario_cargo_enum AS ENUM ('admin', 'gerente', 'operador', 'visualizador');

-- Enum: Tenant.status
CREATE TYPE tenant_status_enum AS ENUM ('ativo', 'suspenso', 'cancelado');

-- Enum: Usuario.status
CREATE TYPE usuario_status_enum AS ENUM ('ativo', 'pendente', 'inativo', 'removido');

-- Table: tenants
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  email TEXT NOT NULL,
  telefone TEXT,
  endereco TEXT,
  inscricao_estadual TEXT,
  plano TEXT NOT NULL DEFAULT 'starter',
  status TEXT NOT NULL DEFAULT 'ativo',
  limite_usuarios INTEGER NOT NULL DEFAULT 1,
  limite_pedidos_mes INTEGER NOT NULL DEFAULT 500,
  configuracoes JSONB DEFAULT '{}',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

-- Table: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  cargo TEXT NOT NULL DEFAULT 'operador',
  status TEXT NOT NULL DEFAULT 'ativo',
  email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
  ultimo_login TIMESTAMPTZ,
  tentativas_login INTEGER NOT NULL DEFAULT 0,
  bloqueado_ate TIMESTAMPTZ,
  avatar_url TEXT,
  preferencias JSONB DEFAULT '{}',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_tenant_id ON usuarios(tenant_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Table: refresh_tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  expira_em TIMESTAMPTZ NOT NULL,
  revogado BOOLEAN NOT NULL DEFAULT FALSE,
  revogado_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_usuario_id ON refresh_tokens(usuario_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);


-- ═══════════════════════════════════════════════════════════════════════════════
-- Database: catalog_service
-- ═══════════════════════════════════════════════════════════════════════════════

\c catalog_service;

-- Table: categorias
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  nome TEXT NOT NULL,
  slug TEXT NOT NULL,
  nivel INTEGER NOT NULL DEFAULT 0,
  ativa BOOLEAN NOT NULL DEFAULT TRUE,
  categoria_pai_id UUID,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_categorias_tenant_slug ON categorias(tenant_id, slug);
CREATE INDEX IF NOT EXISTS idx_categorias_tenant_id ON categorias(tenant_id);

-- Table: marcas
CREATE TABLE IF NOT EXISTS marcas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  nome TEXT NOT NULL,
  slug TEXT NOT NULL,
  logo_url TEXT,
  ativa BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_marcas_tenant_slug ON marcas(tenant_id, slug);
CREATE INDEX IF NOT EXISTS idx_marcas_tenant_id ON marcas(tenant_id);

-- Table: produtos
CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  sku TEXT NOT NULL,
  gtin TEXT,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  descricao_curta TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho',
  ncm TEXT NOT NULL,
  cest TEXT,
  origem INTEGER NOT NULL DEFAULT 0,
  preco_custo INTEGER NOT NULL,
  preco_venda INTEGER NOT NULL,
  preco_promocional INTEGER,
  peso INTEGER NOT NULL,
  altura DOUBLE PRECISION NOT NULL,
  largura DOUBLE PRECISION NOT NULL,
  comprimento DOUBLE PRECISION NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  meta_titulo TEXT,
  meta_descricao TEXT,
  categoria_id UUID NOT NULL REFERENCES categorias(id),
  marca_id UUID REFERENCES marcas(id),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_produtos_tenant_sku ON produtos(tenant_id, sku);
CREATE INDEX IF NOT EXISTS idx_produtos_tenant_id ON produtos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_produtos_tenant_status ON produtos(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_produtos_tenant_categoria_id ON produtos(tenant_id, categoria_id);
CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos(nome);
CREATE INDEX IF NOT EXISTS idx_produtos_gtin ON produtos(gtin);

-- Table: imagens_produto
CREATE TABLE IF NOT EXISTS imagens_produto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  url_miniatura TEXT,
  alt_text TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  principal BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_imagens_produto_produto_id ON imagens_produto(produto_id);

-- Table: variacoes_produto
CREATE TABLE IF NOT EXISTS variacoes_produto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  gtin TEXT,
  nome TEXT NOT NULL,
  preco_venda INTEGER,
  peso INTEGER,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variacoes_produto_produto_id ON variacoes_produto(produto_id);

-- Table: atributos_variacao
CREATE TABLE IF NOT EXISTS atributos_variacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variacao_id UUID NOT NULL REFERENCES variacoes_produto(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  valor TEXT NOT NULL
);

-- Table: imagens_variacao
CREATE TABLE IF NOT EXISTS imagens_variacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variacao_id UUID NOT NULL REFERENCES variacoes_produto(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0
);


-- ═══════════════════════════════════════════════════════════════════════════════
-- Database: customer_service
-- ═══════════════════════════════════════════════════════════════════════════════

\c customer_service;

-- Enums
CREATE TYPE tipo_cliente_enum AS ENUM ('PESSOA_FISICA', 'PESSOA_JURIDICA');
CREATE TYPE status_cliente_enum AS ENUM ('PROSPECT', 'ATIVO', 'INATIVO', 'BLOQUEADO');
CREATE TYPE origem_cliente_enum AS ENUM ('MANUAL', 'MARKETPLACE', 'SITE', 'INDICACAO', 'IMPORTACAO');
CREATE TYPE tipo_endereco_enum AS ENUM ('ENTREGA', 'COBRANCA', 'AMBOS');
CREATE TYPE tipo_interacao_enum AS ENUM ('VENDA', 'ATENDIMENTO', 'RECLAMACAO', 'DEVOLUCAO', 'EMAIL', 'TELEFONE', 'CHAT', 'MARKETPLACE', 'NOTA');
CREATE TYPE canal_interacao_enum AS ENUM ('TELEFONE', 'EMAIL', 'WHATSAPP', 'CHAT', 'PRESENCIAL', 'MARKETPLACE');
CREATE TYPE formato_importacao_enum AS ENUM ('CSV', 'XLSX');
CREATE TYPE status_importacao_enum AS ENUM ('PENDENTE', 'PROCESSANDO', 'CONCLUIDO', 'ERRO');

-- Table: clientes
CREATE TABLE IF NOT EXISTS clientes (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  tipo tipo_cliente_enum NOT NULL,
  nome TEXT NOT NULL,
  nome_fantasia TEXT,
  razao_social TEXT,
  cpf TEXT,
  cnpj TEXT,
  inscricao_estadual TEXT,
  email TEXT NOT NULL,
  email_secundario TEXT,
  telefone TEXT,
  celular TEXT,
  data_nascimento TIMESTAMPTZ,
  genero TEXT,
  observacoes TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  score INTEGER NOT NULL DEFAULT 0,
  status status_cliente_enum NOT NULL DEFAULT 'PROSPECT',
  origem origem_cliente_enum NOT NULL DEFAULT 'MANUAL',
  ultima_compra TIMESTAMPTZ,
  total_compras INTEGER NOT NULL DEFAULT 0,
  valor_total_compras INTEGER NOT NULL DEFAULT 0,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_cliente_tenant_cpf ON clientes(tenant_id, cpf) WHERE cpf IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uk_cliente_tenant_cnpj ON clientes(tenant_id, cnpj) WHERE cnpj IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uk_cliente_tenant_email ON clientes(tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_clientes_tenant_id ON clientes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clientes_tenant_status ON clientes(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_clientes_tenant_origem ON clientes(tenant_id, origem);
CREATE INDEX IF NOT EXISTS idx_clientes_tenant_criado_em ON clientes(tenant_id, criado_em);

-- Table: enderecos_cliente
CREATE TABLE IF NOT EXISTS enderecos_cliente (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  cliente_id TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  tipo tipo_endereco_enum NOT NULL,
  logradouro TEXT NOT NULL,
  numero TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado CHAR(2) NOT NULL,
  cep CHAR(8) NOT NULL,
  pais TEXT NOT NULL DEFAULT 'BR',
  padrao BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enderecos_cliente_tenant_cliente ON enderecos_cliente(tenant_id, cliente_id);

-- Table: contatos_cliente
CREATE TABLE IF NOT EXISTS contatos_cliente (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  cliente_id TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cargo TEXT,
  email TEXT,
  telefone TEXT,
  celular TEXT,
  principal BOOLEAN NOT NULL DEFAULT FALSE,
  observacoes TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contatos_cliente_tenant_cliente ON contatos_cliente(tenant_id, cliente_id);

-- Table: interacoes_cliente
CREATE TABLE IF NOT EXISTS interacoes_cliente (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  cliente_id TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  tipo tipo_interacao_enum NOT NULL,
  canal canal_interacao_enum NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  data TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  usuario_id TEXT NOT NULL,
  pedido_id TEXT,
  metadata JSONB,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interacoes_cliente_tenant_cliente ON interacoes_cliente(tenant_id, cliente_id);
CREATE INDEX IF NOT EXISTS idx_interacoes_cliente_tenant_tipo ON interacoes_cliente(tenant_id, tipo);
CREATE INDEX IF NOT EXISTS idx_interacoes_cliente_tenant_data ON interacoes_cliente(tenant_id, data);

-- Table: segmentos_cliente
CREATE TABLE IF NOT EXISTS segmentos_cliente (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  regras JSONB NOT NULL,
  total_clientes INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_segmentos_cliente_tenant_id ON segmentos_cliente(tenant_id);
CREATE INDEX IF NOT EXISTS idx_segmentos_cliente_tenant_ativo ON segmentos_cliente(tenant_id, ativo);

-- Table: clientes_segmento
CREATE TABLE IF NOT EXISTS clientes_segmento (
  id TEXT PRIMARY KEY,
  cliente_id TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  segmento_id TEXT NOT NULL REFERENCES segmentos_cliente(id) ON DELETE CASCADE,
  adicionado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_clientes_segmento ON clientes_segmento(cliente_id, segmento_id);
CREATE INDEX IF NOT EXISTS idx_clientes_segmento_segmento_id ON clientes_segmento(segmento_id);

-- Table: importacoes_cliente
CREATE TABLE IF NOT EXISTS importacoes_cliente (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  arquivo TEXT NOT NULL,
  formato formato_importacao_enum NOT NULL,
  status status_importacao_enum NOT NULL DEFAULT 'PENDENTE',
  total_registros INTEGER NOT NULL,
  importados INTEGER NOT NULL DEFAULT 0,
  erros INTEGER NOT NULL DEFAULT 0,
  log_erros JSONB,
  usuario_id TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  concluido_em TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_importacoes_cliente_tenant_status ON importacoes_cliente(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_importacoes_cliente_tenant_criado_em ON importacoes_cliente(tenant_id, criado_em);


-- ═══════════════════════════════════════════════════════════════════════════════
-- Database: financial_service
-- ═══════════════════════════════════════════════════════════════════════════════

\c financial_service;

-- Table: contas_financeiras
CREATE TABLE IF NOT EXISTS contas_financeiras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  banco TEXT,
  agencia TEXT,
  conta TEXT,
  saldo_atual NUMERIC(19, 2) NOT NULL DEFAULT 0,
  saldo_inicial NUMERIC(19, 2) NOT NULL DEFAULT 0,
  ativa BOOLEAN NOT NULL DEFAULT TRUE,
  cor TEXT DEFAULT '#3B82F6',
  icone TEXT DEFAULT 'bank',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contas_financeiras_tenant_id ON contas_financeiras(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contas_financeiras_ativa ON contas_financeiras(ativa);

-- Table: lancamentos
CREATE TABLE IF NOT EXISTS lancamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  conta_id UUID REFERENCES contas_financeiras(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL,
  categoria TEXT,
  subcategoria TEXT,
  descricao TEXT NOT NULL,
  valor NUMERIC(19, 2) NOT NULL,
  data_vencimento TIMESTAMPTZ NOT NULL,
  data_pagamento TIMESTAMPTZ,
  data_competencia TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'PENDENTE',
  forma_pagamento TEXT,
  numero_parcela INTEGER,
  total_parcelas INTEGER,
  parcela_origem_id UUID,
  pedido_id UUID,
  nota_fiscal_id UUID,
  fornecedor TEXT,
  cliente TEXT,
  observacao TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  recorrente BOOLEAN NOT NULL DEFAULT FALSE,
  recorrencia_id UUID,
  anexo_url TEXT,
  conta_origem_id UUID REFERENCES contas_financeiras(id) ON DELETE SET NULL,
  conta_destino_id UUID REFERENCES contas_financeiras(id) ON DELETE SET NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lancamentos_tenant_id ON lancamentos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_tipo ON lancamentos(tipo);
CREATE INDEX IF NOT EXISTS idx_lancamentos_status ON lancamentos(status);
CREATE INDEX IF NOT EXISTS idx_lancamentos_data_vencimento ON lancamentos(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_lancamentos_data_pagamento ON lancamentos(data_pagamento);
CREATE INDEX IF NOT EXISTS idx_lancamentos_conta_id ON lancamentos(conta_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_recorrencia_id ON lancamentos(recorrencia_id);

-- Table: categorias_financeiras
CREATE TABLE IF NOT EXISTS categorias_financeiras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  icone TEXT DEFAULT 'tag',
  cor TEXT DEFAULT '#6B7280',
  pai_id UUID REFERENCES categorias_financeiras(id) ON DELETE SET NULL,
  ativa BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categorias_financeiras_tenant_id ON categorias_financeiras(tenant_id);
CREATE INDEX IF NOT EXISTS idx_categorias_financeiras_tipo ON categorias_financeiras(tipo);
CREATE INDEX IF NOT EXISTS idx_categorias_financeiras_pai_id ON categorias_financeiras(pai_id);

-- Table: recorrencias
CREATE TABLE IF NOT EXISTS recorrencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  conta_id UUID REFERENCES contas_financeiras(id) ON DELETE SET NULL,
  descricao TEXT NOT NULL,
  tipo TEXT NOT NULL,
  categoria TEXT,
  valor NUMERIC(19, 2) NOT NULL,
  frequencia TEXT NOT NULL,
  dia_vencimento INTEGER,
  proxima_geracao TIMESTAMPTZ NOT NULL,
  ativa BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recorrencias_tenant_id ON recorrencias(tenant_id);
CREATE INDEX IF NOT EXISTS idx_recorrencias_frequencia ON recorrencias(frequencia);
CREATE INDEX IF NOT EXISTS idx_recorrencias_ativa ON recorrencias(ativa);

-- Table: conciliacoes_bancarias
CREATE TABLE IF NOT EXISTS conciliacoes_bancarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  conta_id UUID NOT NULL REFERENCES contas_financeiras(id) ON DELETE CASCADE,
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ NOT NULL,
  saldo_inicial NUMERIC(19, 2) NOT NULL,
  saldo_final NUMERIC(19, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'EM_ANDAMENTO',
  divergencias JSONB DEFAULT '[]',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conciliacoes_bancarias_tenant_id ON conciliacoes_bancarias(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conciliacoes_bancarias_conta_id ON conciliacoes_bancarias(conta_id);
CREATE INDEX IF NOT EXISTS idx_conciliacoes_bancarias_status ON conciliacoes_bancarias(status);

-- Table: dres
CREATE TABLE IF NOT EXISTS dres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  periodo TEXT NOT NULL,
  ano INTEGER NOT NULL,
  mes INTEGER,
  receita_bruta NUMERIC(19, 2) NOT NULL,
  deducoes NUMERIC(19, 2) NOT NULL DEFAULT 0,
  receita_liquida NUMERIC(19, 2) NOT NULL,
  custos_mercadorias NUMERIC(19, 2) NOT NULL DEFAULT 0,
  lucro_bruto NUMERIC(19, 2) NOT NULL,
  despesas_operacionais NUMERIC(19, 2) NOT NULL DEFAULT 0,
  despesas_administrativas NUMERIC(19, 2) NOT NULL DEFAULT 0,
  despesas_comerciais NUMERIC(19, 2) NOT NULL DEFAULT 0,
  resultado_operacional NUMERIC(19, 2) NOT NULL,
  despesas_financeiras NUMERIC(19, 2) NOT NULL DEFAULT 0,
  receitas_financeiras NUMERIC(19, 2) NOT NULL DEFAULT 0,
  lucro_liquido NUMERIC(19, 2) NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dres_tenant_id ON dres(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dres_ano ON dres(ano);
CREATE INDEX IF NOT EXISTS idx_dres_mes ON dres(mes);

-- Foreign key for lancamentos.recorrencia_id
ALTER TABLE lancamentos ADD CONSTRAINT fk_lancamentos_recorrencia_id FOREIGN KEY (recorrencia_id) REFERENCES recorrencias(id) ON DELETE SET NULL;


-- ═══════════════════════════════════════════════════════════════════════════════
-- Database: inventory_service
-- ═══════════════════════════════════════════════════════════════════════════════

\c inventory_service;

-- Table: depositos
CREATE TABLE IF NOT EXISTS depositos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  nome TEXT NOT NULL,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  padrao BOOLEAN NOT NULL DEFAULT FALSE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_depositos_tenant_id ON depositos(tenant_id);

-- Table: saldos_estoque
CREATE TABLE IF NOT EXISTS saldos_estoque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  produto_id UUID NOT NULL,
  deposito_id UUID NOT NULL REFERENCES depositos(id),
  quantidade_fisica INTEGER NOT NULL DEFAULT 0,
  reservado INTEGER NOT NULL DEFAULT 0,
  estoque_minimo INTEGER NOT NULL DEFAULT 0,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_saldos_estoque ON saldos_estoque(tenant_id, produto_id, deposito_id);
CREATE INDEX IF NOT EXISTS idx_saldos_estoque_tenant_id ON saldos_estoque(tenant_id);
CREATE INDEX IF NOT EXISTS idx_saldos_estoque_tenant_produto ON saldos_estoque(tenant_id, produto_id);

-- Table: reservas_estoque
CREATE TABLE IF NOT EXISTS reservas_estoque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  produto_id UUID NOT NULL,
  pedido_id UUID NOT NULL,
  quantidade INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservas_estoque_tenant_pedido ON reservas_estoque(tenant_id, pedido_id);
CREATE INDEX IF NOT EXISTS idx_reservas_estoque_tenant_produto ON reservas_estoque(tenant_id, produto_id);

-- Table: movimentacoes
CREATE TABLE IF NOT EXISTS movimentacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  produto_id UUID NOT NULL,
  deposito_id UUID NOT NULL REFERENCES depositos(id),
  tipo TEXT NOT NULL,
  motivo TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  custo_unitario INTEGER,
  observacao TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movimentacoes_tenant_id ON movimentacoes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_tenant_produto ON movimentacoes(tenant_id, produto_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_criado_em ON movimentacoes(criado_em);


-- ═══════════════════════════════════════════════════════════════════════════════
-- Database: order_service
-- ═══════════════════════════════════════════════════════════════════════════════

\c order_service;

-- Table: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  numero INTEGER NOT NULL,
  cliente_id UUID,
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT,
  cliente_cpf_cnpj TEXT,
  origem TEXT NOT NULL DEFAULT 'MANUAL',
  canal_origem TEXT,
  pedido_externo_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'RASCUNHO',
  status_pagamento TEXT NOT NULL DEFAULT 'PENDENTE',
  metodo_pagamento TEXT,
  parcelas INTEGER NOT NULL DEFAULT 1,
  valor_produtos NUMERIC(12, 2) NOT NULL DEFAULT 0,
  valor_desconto NUMERIC(12, 2) NOT NULL DEFAULT 0,
  valor_frete NUMERIC(12, 2) NOT NULL DEFAULT 0,
  valor_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  observacao TEXT,
  endereco_entrega JSONB,
  rastreamento TEXT,
  codigo_rastreio TEXT,
  transportadora TEXT,
  prazo_entrega INTEGER,
  data_aprovacao TIMESTAMPTZ,
  data_separacao TIMESTAMPTZ,
  data_faturamento TIMESTAMPTZ,
  data_envio TIMESTAMPTZ,
  data_entrega TIMESTAMPTZ,
  data_cancelamento TIMESTAMPTZ,
  motivo_cancelamento TEXT,
  nota_fiscal_id UUID,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_pedidos_tenant_numero ON pedidos(tenant_id, numero);
CREATE INDEX IF NOT EXISTS idx_pedidos_tenant_id ON pedidos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_status_pagamento ON pedidos(status_pagamento);
CREATE INDEX IF NOT EXISTS idx_pedidos_canal_origem ON pedidos(canal_origem);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_criado_em ON pedidos(criado_em);

-- Table: itens_pedidos
CREATE TABLE IF NOT EXISTS itens_pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL,
  variacao_id UUID,
  sku TEXT NOT NULL,
  titulo TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  valor_unitario NUMERIC(12, 2) NOT NULL,
  valor_desconto NUMERIC(12, 2) NOT NULL DEFAULT 0,
  valor_total NUMERIC(12, 2) NOT NULL,
  peso NUMERIC(10, 3),
  largura NUMERIC(10, 2),
  altura NUMERIC(10, 2),
  comprimento NUMERIC(10, 2),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itens_pedidos_pedido_id ON itens_pedidos(pedido_id);
CREATE INDEX IF NOT EXISTS idx_itens_pedidos_produto_id ON itens_pedidos(produto_id);

-- Table: historicos_pedidos
CREATE TABLE IF NOT EXISTS historicos_pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  status_anterior TEXT,
  status_novo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  usuario_id UUID,
  dados_extras JSONB,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historicos_pedidos_pedido_id ON historicos_pedidos(pedido_id);
CREATE INDEX IF NOT EXISTS idx_historicos_pedidos_tenant_id ON historicos_pedidos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_historicos_pedidos_criado_em ON historicos_pedidos(criado_em);

-- Table: pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  tipo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDENTE',
  valor NUMERIC(12, 2) NOT NULL,
  parcelas INTEGER NOT NULL DEFAULT 1,
  gateway TEXT,
  transacao_externa_id TEXT,
  dados_gateway JSONB,
  data_pagamento TIMESTAMPTZ,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pagamentos_pedido_id ON pagamentos(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_tenant_id ON pagamentos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);

-- Table: devolucoes
CREATE TABLE IF NOT EXISTS devolucoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  motivo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'SOLICITADA',
  valor_reembolso NUMERIC(12, 2) NOT NULL,
  codigo_rastreio_retorno TEXT,
  observacao TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_devolucoes_pedido_id ON devolucoes(pedido_id);
CREATE INDEX IF NOT EXISTS idx_devolucoes_tenant_id ON devolucoes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_devolucoes_status ON devolucoes(status);

-- Table: itens_devolucoes
CREATE TABLE IF NOT EXISTS itens_devolucoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  devolucao_id UUID NOT NULL REFERENCES devolucoes(id) ON DELETE CASCADE,
  item_pedido_id UUID NOT NULL REFERENCES itens_pedidos(id) ON DELETE CASCADE,
  quantidade INTEGER NOT NULL,
  motivo TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itens_devolucoes_devolucao_id ON itens_devolucoes(devolucao_id);
CREATE INDEX IF NOT EXISTS idx_itens_devolucoes_item_pedido_id ON itens_devolucoes(item_pedido_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- End of migrations
-- ═══════════════════════════════════════════════════════════════════════════════
