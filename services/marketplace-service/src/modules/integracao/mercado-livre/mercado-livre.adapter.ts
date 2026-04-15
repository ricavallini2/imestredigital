import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  IIntegracaoMarketplace,
  TokensAuth,
  PedidoExterno,
  AnuncioExterno,
  PerguntaExterna,
  MetricasAnuncio,
  DadosCriarAnuncio,
  DadosAtualizarAnuncio,
} from '../integracao-base.interface';

/**
 * Adapter de integração com Mercado Livre
 * Implementação da API Mercado Livre v2 com OAuth2
 */
@Injectable()
export class MercadoLivreAdapter implements IIntegracaoMarketplace {
  private readonly logger = new Logger(MercadoLivreAdapter.name);
  private readonly apiUrl = 'https://api.mercadolibre.com';
  private readonly authUrl = 'https://auth.mercadolibre.com.br';
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private client: AxiosInstance;
  private accessToken: string;

  constructor(private readonly configService: ConfigService) {
    this.clientId =
      this.configService.get('MERCADO_LIVRE_CLIENT_ID') || 'mock-client-id';
    this.clientSecret =
      this.configService.get('MERCADO_LIVRE_CLIENT_SECRET') ||
      'mock-client-secret';
    this.redirectUri =
      this.configService.get('MERCADO_LIVRE_REDIRECT_URI') ||
      'http://localhost:3007/api/v1/contas/callback/mercado-livre';

    this.initializeClient();
  }

  /**
   * Inicializa cliente HTTP
   */
  private initializeClient() {
    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: 30000,
    });

    // Interceptor para adicionar token nos requests
    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.params = config.params || {};
        config.params.access_token = this.accessToken;
      }
      return config;
    });
  }

  /**
   * Gera URL de autorização para OAuth2
   */
  getOAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      platform_id: 'MP',
      redirect_uri: this.redirectUri,
      state,
    });

    return `${this.authUrl}/authorization?${params.toString()}`;
  }

  /**
   * Autentica usando código de autorização OAuth2
   */
  async autenticar(credenciais: { code: string }): Promise<TokensAuth> {
    try {
      this.logger.log('Iniciando autenticação OAuth2 com Mercado Livre');

      const response = await axios.post(`${this.authUrl}/oauth/token`, {
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: credenciais.code,
        redirect_uri: this.redirectUri,
      });

      this.accessToken = response.data.access_token;

      const tokens: TokensAuth = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
      };

      this.logger.log('Autenticação com Mercado Livre realizada com sucesso');
      return tokens;
    } catch (erro) {
      this.logger.error(
        `Erro ao autenticar com Mercado Livre: ${erro.message}`,
      );
      throw erro;
    }
  }

  /**
   * Renova token de autenticação
   */
  async renovarToken(refreshToken: string): Promise<TokensAuth> {
    try {
      this.logger.log('Renovando token do Mercado Livre');

      const response = await axios.post(`${this.authUrl}/oauth/token`, {
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
      });

      this.accessToken = response.data.access_token;

      const tokens: TokensAuth = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || refreshToken,
        expiresIn: response.data.expires_in,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
      };

      this.logger.log('Token renovado com sucesso');
      return tokens;
    } catch (erro) {
      this.logger.error(`Erro ao renovar token: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Lista pedidos do Mercado Livre
   */
  async listarPedidos(filtros?: any): Promise<PedidoExterno[]> {
    try {
      this.logger.log('Listando pedidos do Mercado Livre');

      // Em desenvolvimento, retornar dados mock realistas
      const pedidosMock: PedidoExterno[] = [
        {
          id: 'ml-1001',
          numeroMarketplace: '1001',
          status: 'enviado',
          statusMarketplace: 'paid_and_ready_to_ship',
          comprador: {
            nome: 'João Silva',
            cpf: '12345678900',
            email: 'joao@example.com',
            telefone: '11999999999',
          },
          itens: [
            {
              id: 'item-1',
              sku: 'PROD-001',
              titulo: 'Camiseta Básica',
              quantidade: 2,
              preco: 29.99,
              precoTotal: 59.98,
            },
          ],
          valorTotal: 89.98,
          valorFrete: 30.0,
          enderecoEntrega: {
            rua: 'Rua A',
            numero: '123',
            bairro: 'Bairro X',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01234-567',
          },
          dataVenda: new Date('2024-03-20'),
          dataAprovacao: new Date('2024-03-20'),
          prazoEnvio: new Date('2024-03-25'),
        },
      ];

      return pedidosMock;
    } catch (erro) {
      this.logger.error(`Erro ao listar pedidos: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Obtém um pedido específico
   */
  async obterPedido(pedidoId: string): Promise<PedidoExterno> {
    try {
      this.logger.log(`Obtendo pedido: ${pedidoId}`);

      // Mock response
      return {
        id: pedidoId,
        numeroMarketplace: pedidoId,
        status: 'enviado',
        statusMarketplace: 'paid_and_ready_to_ship',
        comprador: {
          nome: 'Maria Silva',
          email: 'maria@example.com',
        },
        itens: [
          {
            id: 'item-1',
            sku: 'PROD-002',
            titulo: 'Produto Teste',
            quantidade: 1,
            preco: 99.99,
            precoTotal: 99.99,
          },
        ],
        valorTotal: 129.99,
        valorFrete: 30.0,
        enderecoEntrega: {
          rua: 'Rua B',
          numero: '456',
          bairro: 'Bairro Y',
          cidade: 'Rio de Janeiro',
          estado: 'RJ',
          cep: '20000-000',
        },
        dataVenda: new Date(),
      };
    } catch (erro) {
      this.logger.error(`Erro ao obter pedido: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Cria novo anúncio no Mercado Livre
   */
  async criarAnuncio(dados: DadosCriarAnuncio): Promise<AnuncioExterno> {
    try {
      this.logger.log(`Criando anúncio: ${dados.titulo}`);

      // Mock response com dados realistas
      return {
        id: `ml-item-${Date.now()}`,
        sku: dados.sku,
        titulo: dados.titulo,
        descricao: dados.descricao,
        preco: dados.preco,
        precoPromocional: dados.precoPromocional,
        estoque: dados.estoque,
        status: 'active',
        url: `https://www.mercadolivre.com.br/p/ml-item-${Date.now()}`,
        categoria: dados.categoria,
        fotos: dados.fotos,
        atributos: dados.atributos || {},
        metricas: {
          visitas: 0,
          vendas: 0,
          perguntas: 0,
        },
      };
    } catch (erro) {
      this.logger.error(`Erro ao criar anúncio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Atualiza anúncio no Mercado Livre
   */
  async atualizarAnuncio(
    anuncioId: string,
    dados: DadosAtualizarAnuncio,
  ): Promise<void> {
    try {
      this.logger.log(`Atualizando anúncio: ${anuncioId}`);

      // Simulação de atualização
      if (dados.titulo) {
        this.logger.debug(`Título atualizado: ${dados.titulo}`);
      }
      if (dados.preco) {
        this.logger.debug(`Preço atualizado: ${dados.preco}`);
      }

      this.logger.log(`Anúncio ${anuncioId} atualizado com sucesso`);
    } catch (erro) {
      this.logger.error(`Erro ao atualizar anúncio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Pausa um anúncio
   */
  async pausarAnuncio(anuncioId: string): Promise<void> {
    try {
      this.logger.log(`Pausando anúncio: ${anuncioId}`);

      // Simulação de pausa
      this.logger.log(`Anúncio ${anuncioId} pausado`);
    } catch (erro) {
      this.logger.error(`Erro ao pausar anúncio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Reativa anúncio pausado
   */
  async reativarAnuncio(anuncioId: string): Promise<void> {
    try {
      this.logger.log(`Reativando anúncio: ${anuncioId}`);

      // Simulação de reativação
      this.logger.log(`Anúncio ${anuncioId} reativado`);
    } catch (erro) {
      this.logger.error(`Erro ao reativar anúncio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Encerra um anúncio
   */
  async encerrarAnuncio(anuncioId: string): Promise<void> {
    try {
      this.logger.log(`Encerrando anúncio: ${anuncioId}`);

      // Simulação de encerramento
      this.logger.log(`Anúncio ${anuncioId} encerrado`);
    } catch (erro) {
      this.logger.error(`Erro ao encerrar anúncio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Atualiza estoque
   */
  async atualizarEstoque(anuncioId: string, quantidade: number): Promise<void> {
    try {
      this.logger.log(`Atualizando estoque do anúncio ${anuncioId}: ${quantidade}`);

      // Simulação de atualização
      this.logger.log(`Estoque atualizado com sucesso`);
    } catch (erro) {
      this.logger.error(`Erro ao atualizar estoque: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Atualiza preço
   */
  async atualizarPreco(
    anuncioId: string,
    preco: number,
    precoPromocional?: number,
  ): Promise<void> {
    try {
      this.logger.log(
        `Atualizando preço do anúncio ${anuncioId}: ${preco}`,
      );

      // Simulação de atualização
      this.logger.log(`Preço atualizado com sucesso`);
    } catch (erro) {
      this.logger.error(`Erro ao atualizar preço: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Envia rastreio para pedido
   */
  async enviarRastreio(pedidoId: string, codigoRastreio: string): Promise<void> {
    try {
      this.logger.log(
        `Enviando rastreio para pedido ${pedidoId}: ${codigoRastreio}`,
      );

      // Simulação de envio
      this.logger.log(`Rastreio enviado com sucesso`);
    } catch (erro) {
      this.logger.error(`Erro ao enviar rastreio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Lista perguntas
   */
  async listarPerguntas(filtros?: any): Promise<PerguntaExterna[]> {
    try {
      this.logger.log('Listando perguntas do Mercado Livre');

      const perguntasMock: PerguntaExterna[] = [
        {
          id: 'pergunta-1',
          anuncioId: 'anuncio-1',
          pergunta: 'Qual é o prazo de entrega?',
          status: 'pending',
          compradorNome: 'Pedro',
          dataEnvio: new Date(),
        },
      ];

      return perguntasMock;
    } catch (erro) {
      this.logger.error(`Erro ao listar perguntas: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Responde pergunta
   */
  async responderPergunta(perguntaId: string, resposta: string): Promise<void> {
    try {
      this.logger.log(`Respondendo pergunta ${perguntaId}`);

      // Simulação de resposta
      this.logger.log(`Pergunta respondida com sucesso`);
    } catch (erro) {
      this.logger.error(`Erro ao responder pergunta: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Obtém métricas de anúncio
   */
  async obterMetricas(anuncioId: string): Promise<MetricasAnuncio> {
    try {
      this.logger.log(`Obtendo métricas do anúncio: ${anuncioId}`);

      return {
        anuncioId,
        visitas: Math.floor(Math.random() * 1000),
        vendas: Math.floor(Math.random() * 50),
        perguntas: Math.floor(Math.random() * 20),
        conversao: Math.random() * 10,
        dataAtualizacao: new Date(),
      };
    } catch (erro) {
      this.logger.error(`Erro ao obter métricas: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Obtém categorias disponíveis
   */
  async obterCategorias(): Promise<Array<{ id: string; nome: string }>> {
    try {
      this.logger.log('Obtendo categorias do Mercado Livre');

      return [
        { id: 'cat-1', nome: 'Eletrônicos' },
        { id: 'cat-2', nome: 'Roupas' },
        { id: 'cat-3', nome: 'Livros' },
        { id: 'cat-4', nome: 'Móveis' },
        { id: 'cat-5', nome: 'Esportes' },
      ];
    } catch (erro) {
      this.logger.error(`Erro ao obter categorias: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Obtém atributos de categoria
   */
  async obterAtributosCategoria(
    categoriaId: string,
  ): Promise<Array<{ id: string; nome: string; obrigatorio: boolean }>> {
    try {
      this.logger.log(`Obtendo atributos da categoria: ${categoriaId}`);

      return [
        { id: 'attr-1', nome: 'Marca', obrigatorio: true },
        { id: 'attr-2', nome: 'Modelo', obrigatorio: false },
        { id: 'attr-3', nome: 'Cor', obrigatorio: true },
        { id: 'attr-4', nome: 'Tamanho', obrigatorio: false },
      ];
    } catch (erro) {
      this.logger.error(`Erro ao obter atributos: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Valida credenciais
   */
  async validarCredenciais(credenciais: Record<string, any>): Promise<boolean> {
    try {
      this.logger.log('Validando credenciais do Mercado Livre');

      // Simulação de validação
      return true;
    } catch (erro) {
      this.logger.error(`Erro ao validar credenciais: ${erro.message}`);
      return false;
    }
  }
}
