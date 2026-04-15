/**
 * ═══════════════════════════════════════════════════════════════
 * Tipos do Catálogo de Produtos
 * ═══════════════════════════════════════════════════════════════
 */

/** Status possíveis de um produto */
export enum StatusProduto {
  RASCUNHO = 'rascunho',
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  DESCONTINUADO = 'descontinuado',
}

/** Produto completo com relacionamentos */
export interface Produto {
  id: string;
  tenantId: string;
  sku: string;
  gtin?: string;
  nome: string;
  descricao: string;
  descricaoCurta?: string;
  status: StatusProduto;

  // Dados fiscais
  ncm: string;
  cest?: string;
  origem: number;

  // Preços (em centavos)
  precoCusto: number;
  precoVenda: number;
  precoPromocional?: number;

  // Dimensões
  peso: number;      // gramas
  altura: number;    // cm
  largura: number;   // cm
  comprimento: number; // cm

  // SEO
  tags: string[];
  metaTitulo?: string;
  metaDescricao?: string;

  // Relacionamentos
  categoriaId: string;
  categoria?: Categoria;
  marcaId?: string;
  marca?: Marca;
  imagens?: ImagemProduto[];
  variacoes?: VariacaoProduto[];

  // Timestamps
  criadoEm: string;
  atualizadoEm: string;
}

/** Imagem de produto */
export interface ImagemProduto {
  id: string;
  produtoId: string;
  url: string;
  urlMiniatura?: string;
  altText?: string;
  ordem: number;
  principal: boolean;
}

/** Variação de produto */
export interface VariacaoProduto {
  id: string;
  produtoId: string;
  sku: string;
  gtin?: string;
  nome: string;
  precoVenda?: number;
  peso?: number;
  atributos?: AtributoVariacao[];
  imagens?: ImagemVariacao[];
}

/** Atributo de variação (ex: Cor=Azul) */
export interface AtributoVariacao {
  id: string;
  nome: string;
  valor: string;
}

/** Imagem de variação */
export interface ImagemVariacao {
  id: string;
  url: string;
  ordem: number;
}

/** Categoria de produto (com hierarquia) */
export interface Categoria {
  id: string;
  tenantId: string;
  nome: string;
  slug: string;
  nivel: number;
  ativa: boolean;
  categoriaPaiId?: string;
  subcategorias?: Categoria[];
}

/** Marca de produto */
export interface Marca {
  id: string;
  tenantId: string;
  nome: string;
  slug: string;
  logoUrl?: string;
  ativa: boolean;
}

/** Dados para criar um produto */
export interface CriarProdutoInput {
  sku: string;
  gtin?: string;
  nome: string;
  descricao: string;
  descricaoCurta?: string;
  categoriaId: string;
  marcaId?: string;
  ncm: string;
  cest?: string;
  origem: number;
  precoCusto: number;
  precoVenda: number;
  precoPromocional?: number;
  peso: number;
  altura: number;
  largura: number;
  comprimento: number;
  tags?: string[];
}
