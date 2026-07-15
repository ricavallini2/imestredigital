/**
 * Serviço de Produtos (COMPLETO).
 *
 * Lógica de negócio do domínio de produtos com:
 * - Publicação de eventos no Kafka
 * - Cache Redis com invalidação automática
 * - Isolamento por tenant
 * - Logging estruturado
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { ProdutoRepository } from './produto.repository';
import { VariacaoService } from './variacao.service';
import { ProducerService } from '../../events/producer.service';
import { CacheService } from '../cache/cache.service';
import { CriarProdutoDto } from '../../dtos/produto/criar-produto.dto';
import { AtualizarProdutoDto } from '../../dtos/produto/atualizar-produto.dto';
import { ListarProdutosDto } from '../../dtos/produto/listar-produtos.dto';
import { TOPICOS_CATALOGO } from '../../config/kafka.config';

@Injectable()
export class ProdutoService {
  constructor(
    private readonly produtoRepository: ProdutoRepository,
    private readonly variacaoService: VariacaoService,
    private readonly producer: ProducerService,
    private readonly cache: CacheService,
  ) {}

  /**
   * Cria um novo produto no catálogo.
   *
   * Fluxo:
   * 1. Verifica se SKU já existe para o tenant
   * 2. Persiste no banco
   * 3. Publica evento PRODUTO_CRIADO no Kafka
   * 4. Invalida cache de listagem do tenant
   *
   * @param tenantId - ID do tenant (empresa)
   * @param dto - Dados do produto
   * @returns Produto criado com ID gerado
   */
  async criar(tenantId: string, dto: CriarProdutoDto) {
    // Verifica unicidade do SKU no tenant
    const skuExistente = await this.produtoRepository.buscarPorSku(tenantId, dto.sku);
    if (skuExistente) {
      throw new BadRequestException(`SKU "${dto.sku}" já está cadastrado nesta empresa`);
    }

    // Persiste no banco
    const produto = await this.produtoRepository.criar(tenantId, dto);

    // Publica evento para outros serviços
    await this.producer.publicar(
      TOPICOS_CATALOGO.PRODUTO_CRIADO,
      tenantId,
      TOPICOS_CATALOGO.PRODUTO_CRIADO,
      {
        produtoId: produto.id,
        sku: produto.sku,
        nome: produto.nome,
        precoVenda: produto.precoVenda,
        categoriaId: produto.categoriaId,
      },
    );

    // Invalida todas as páginas de listagem do tenant
    await this.cache.invalidarPorPrefixo(this.cache.gerarChave(tenantId, 'produtos-lista'));

    console.log(`✅ Produto criado: ${produto.sku} [tenant: ${tenantId}]`);
    return produto;
  }

  /**
   * Lista produtos com paginação e filtros.
   * Resultado é cacheado por 2 minutos para otimizar performance.
   */
  async listar(tenantId: string, filtros: ListarProdutosDto) {
    // Para listagens com filtros, não usa cache (muitas variações)
    if (filtros.busca || filtros.status || filtros.categoriaId) {
      return this.produtoRepository.listar(tenantId, filtros);
    }

    // Listagem padrão (sem filtros): usa cache por página/limite.
    // A chave inclui pagina+limite para não servir a página 1 em todas as páginas.
    const pagina = filtros.pagina ?? 1;
    const limite = filtros.itensPorPagina ?? 20;
    const chaveCache = this.cache.gerarChave(tenantId, 'produtos-lista', `${pagina}:${limite}`);
    return this.cache.obterOuCarregar(
      chaveCache,
      () => this.produtoRepository.listar(tenantId, filtros),
      120, // 2 minutos
    );
  }

  /**
   * Busca um produto pelo ID com cache.
   * Cache individual por produto: 5 minutos.
   */
  async buscarPorId(tenantId: string, id: string) {
    const chaveCache = this.cache.gerarChave(tenantId, 'produto', id);

    const produto = await this.cache.obterOuCarregar(
      chaveCache,
      () => this.produtoRepository.buscarPorId(tenantId, id),
      300, // 5 minutos
    );

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return produto;
  }

  /**
   * Atualiza um produto existente.
   * Publica eventos específicos dependendo do que mudou.
   */
  async atualizar(tenantId: string, id: string, dto: AtualizarProdutoDto) {
    // Busca produto atual (verifica existência)
    const produtoAtual = await this.buscarPorId(tenantId, id);

    // Separa as variações e a galeria de imagens embutidas (não são colunas do
    // produto) do restante. O front envia ambos no mesmo PUT; persistir isso na
    // tabela `produtos` quebraria o update — extraímos antes de mandar os escalares.
    const { variacoes, imagens, ...dadosProduto } = dto;

    // Persiste atualização dos campos escalares do produto.
    const produtoAtualizado = await this.produtoRepository.atualizar(tenantId, id, dadosProduto);

    // Upsert em lote das variações embutidas (reuso da lógica dos endpoints
    // dedicados). Só quando o campo foi enviado — array vazio também é tratado
    // (não altera nada) pelo VariacaoService.
    if (variacoes !== undefined) {
      await this.variacaoService.salvarLoteEmbutido(tenantId, id, variacoes);
    }

    // Substitui a galeria de imagens quando enviada (array vazio = remove todas).
    // A 1ª imagem (ou principal:true) vira a capa; ordem preservada.
    if (imagens !== undefined) {
      await this.produtoRepository.substituirImagens(tenantId, id, imagens);
    }

    // Publica evento genérico de atualização (campos escalares alterados).
    await this.producer.publicar(
      TOPICOS_CATALOGO.PRODUTO_ATUALIZADO,
      tenantId,
      TOPICOS_CATALOGO.PRODUTO_ATUALIZADO,
      {
        produtoId: id,
        camposAlterados: Object.keys(dadosProduto),
      },
    );

    // Se o preço mudou, publica evento específico de preço
    if (dadosProduto.precoVenda && dadosProduto.precoVenda !== (produtoAtual.precoVenda as any)) {
      await this.producer.publicar(
        TOPICOS_CATALOGO.PRECO_ALTERADO,
        tenantId,
        TOPICOS_CATALOGO.PRECO_ALTERADO,
        {
          produtoId: id,
          sku: produtoAtual.sku,
          precoAnterior: produtoAtual.precoVenda,
          precoNovo: dadosProduto.precoVenda,
        },
      );
    }

    // Invalida caches relacionados (item + todas as páginas de listagem)
    await this.cache.invalidar(this.cache.gerarChave(tenantId, 'produto', id));
    await this.cache.invalidarPorPrefixo(this.cache.gerarChave(tenantId, 'produtos-lista'));

    console.log(`✏️ Produto atualizado: ${id} [tenant: ${tenantId}]`);

    // Quando variações foram tocadas, relê do banco (sem cache) para devolver o
    // produto já com a lista de variações atualizada. Caso contrário, devolve o
    // resultado do update (que já inclui categoria/marca/imagens).
    if (variacoes !== undefined) {
      return this.produtoRepository.buscarPorId(tenantId, id);
    }
    return produtoAtualizado;
  }

  /**
   * Remove um produto (soft delete).
   * Marca como 'descontinuado' e publica evento.
   */
  async remover(tenantId: string, id: string) {
    const produto = await this.buscarPorId(tenantId, id);

    await this.produtoRepository.remover(tenantId, id);

    // Publica evento de remoção
    await this.producer.publicar(
      TOPICOS_CATALOGO.PRODUTO_REMOVIDO,
      tenantId,
      TOPICOS_CATALOGO.PRODUTO_REMOVIDO,
      {
        produtoId: id,
        sku: produto.sku,
      },
    );

    // Invalida caches (item + todas as páginas de listagem)
    await this.cache.invalidar(this.cache.gerarChave(tenantId, 'produto', id));
    await this.cache.invalidarPorPrefixo(this.cache.gerarChave(tenantId, 'produtos-lista'));

    console.log(`🗑️ Produto removido: ${id} [tenant: ${tenantId}]`);
  }

  /**
   * Busca produtos por lista de IDs.
   * Usado internamente por outros serviços via Kafka.
   */
  async buscarPorIds(tenantId: string, ids: string[]) {
    return this.produtoRepository.buscarPorIds(tenantId, ids);
  }

  /**
   * Estatísticas do catálogo do tenant.
   *
   * Monta o contrato consumido pelo frontend (dashboard/produtos):
   *   { total, ativos, inativos, rascunhos, esgotados, descontinuados,
   *     semEstoque, estoqueMinimo, valorCatalogo, receitaTotal,
   *     margemMedia, categorias[] }
   *
   * IMPORTANTE (fronteira de domínio): saldo de estoque e receita realizada
   * NÃO são fonte do catálogo — pertencem ao inventory-service e ao
   * order/financial-service. Aqui expomos as métricas honestas do catálogo:
   *  - `valorCatalogo`: somatório do preço de venda dos produtos ATIVO
   *    (valor de tabela do catálogo, independente de saldo em estoque).
   *  - `margemMedia`: margem percentual média ponderada pelos preços ATIVO,
   *    calculada de (precoVenda - precoCusto) / precoVenda.
   *  - `semEstoque`, `estoqueMinimo`, `receitaTotal`: retornados como 0 por
   *    não serem calculáveis a partir do catálogo; a UI faz fallback seguro.
   *
   * Resultado é cacheado por 1 minuto.
   */
  async obterEstatisticas(tenantId: string) {
    const chaveCache = this.cache.gerarChave(tenantId, 'produtos-estatisticas');
    return this.cache.obterOuCarregar(
      chaveCache,
      async () => {
        const { porStatus, precosAtivos, porCategoria, categorias } =
          await this.produtoRepository.agregarEstatisticas(tenantId);

        // Contagem por status (default 0 para status ausentes).
        const contagem: Record<string, number> = {};
        let total = 0;
        for (const linha of porStatus) {
          const qtd = linha._count._all;
          contagem[linha.status] = qtd;
          total += qtd;
        }

        const ativos = contagem.ATIVO ?? 0;

        // Valor de catálogo = somatório do preço de venda dos ATIVO.
        const somaVenda = Number(precosAtivos._sum.precoVenda ?? 0);
        const somaCusto = Number(precosAtivos._sum.precoCusto ?? 0);

        // Margem média percentual: (venda - custo) / venda * 100.
        // Ponderada pelos totais para evitar viés de itens de baixo valor.
        const margemMedia = somaVenda > 0 ? ((somaVenda - somaCusto) / somaVenda) * 100 : 0;

        // Distribuição por categoria com nome resolvido, ordenada desc por total.
        const nomePorId = new Map(categorias.map((c) => [c.id, c.nome]));
        const categoriasDistribuicao = porCategoria
          .map((c) => ({
            nome: nomePorId.get(c.categoriaId) ?? 'Sem categoria',
            total: c._count._all,
          }))
          .sort((a, b) => b.total - a.total);

        return {
          total,
          ativos,
          inativos: contagem.INATIVO ?? 0,
          rascunhos: contagem.RASCUNHO ?? 0,
          esgotados: contagem.ESGOTADO ?? 0,
          descontinuados: contagem.DESCONTINUADO ?? 0,
          // Fronteira de domínio: saldo/receita não são do catálogo (ver docstring).
          semEstoque: 0,
          estoqueMinimo: 0,
          valorCatalogo: Number(somaVenda.toFixed(2)),
          receitaTotal: 0,
          margemMedia: Number(margemMedia.toFixed(1)),
          categorias: categoriasDistribuicao,
        };
      },
      60, // 1 minuto
    );
  }
}
