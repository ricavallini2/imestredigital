import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { ContaMarketplaceRepository } from './conta-marketplace.repository';
import { IntegracaoFactory } from '../integracao/integracao.factory';
import { ProdutorEventosService } from '../eventos/produtor-eventos.service';
import { CacheService } from '../cache/cache.service';
import { TipoMarketplace, StatusContaMarketplace } from '@prisma/client';
import { MercadoLivreAdapter } from '../integracao/mercado-livre/mercado-livre.adapter';

/**
 * Serviço de gerenciamento de contas marketplace
 * Handles authentication, token renewal, and connection status
 */
@Injectable()
export class ContaMarketplaceService {
  private readonly logger = new Logger(ContaMarketplaceService.name);

  constructor(
    private readonly repository: ContaMarketplaceRepository,
    private readonly integracaoFactory: IntegracaoFactory,
    private readonly produtorEventos: ProdutorEventosService,
    private readonly cacheService: CacheService,
    private readonly mercadoLivreAdapter: MercadoLivreAdapter,
  ) {}

  /**
   * Obtém URL de autenticação OAuth2 do Mercado Livre
   */
  obterUrlAutenticacao(marketplace: TipoMarketplace, state: string): string {
    if (marketplace === TipoMarketplace.MERCADO_LIVRE) {
      return this.mercadoLivreAdapter.getOAuthUrl(state);
    }

    throw new Error(`OAuth URL não disponível para ${marketplace}`);
  }

  /**
   * Conecta nova conta marketplace
   */
  async conectar(
    tenantId: string,
    marketplace: TipoMarketplace,
    credenciais: Record<string, any>,
  ) {
    try {
      this.logger.log(
        `Conectando nova conta ${marketplace} para tenant ${tenantId}`,
      );

      // Verificar se conta já existe
      const contaExistente = await this.repository.buscarPorMarketplaceeSellerId(
        tenantId,
        marketplace,
        credenciais.sellerId || `seller-${Date.now()}`,
      );

      if (contaExistente) {
        throw new ConflictException(
          `Conta ${marketplace} já existe para este seller`,
        );
      }

      // Obter adapter do marketplace
      const adapter = this.integracaoFactory.criar(marketplace);

      // Autenticar
      const tokens = await adapter.autenticar(credenciais);

      // Salvar no banco
      const conta = await this.repository.criar({
        tenantId,
        marketplace,
        nome: credenciais.nome || `${marketplace} - ${new Date().toLocaleDateString('pt-BR')}`,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        sellerId: credenciais.sellerId || `seller-${Date.now()}`,
        tokenExpiraEm: tokens.expiresAt,
      });

      // Publicar evento
      await this.produtorEventos.contaConectada(tenantId, {
        contaId: conta.id,
        marketplace,
        sellerId: conta.sellerId,
      });

      this.logger.log(`Conta ${marketplace} conectada com sucesso`);

      return conta;
    } catch (erro) {
      this.logger.error(`Erro ao conectar conta: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Desconecta conta marketplace
   */
  async desconectar(contaId: string, tenantId: string) {
    try {
      const conta = await this.repository.buscarPorId(contaId, tenantId);

      if (!conta) {
        throw new NotFoundException('Conta não encontrada');
      }

      await this.repository.atualizarStatus(
        contaId,
        tenantId,
        StatusContaMarketplace.INATIVA,
      );

      // Limpar cache
      await this.cacheService.deleteByPattern(`marketplace:conta:${contaId}*`);

      // Publicar evento
      await this.produtorEventos.contaDesconectada(tenantId, {
        contaId,
        marketplace: conta.marketplace,
      });

      this.logger.log(`Conta ${contaId} desconectada`);
    } catch (erro) {
      this.logger.error(`Erro ao desconectar conta: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Renova token expirado
   */
  async renovarToken(contaId: string, tenantId: string) {
    try {
      const conta = await this.repository.buscarPorId(contaId, tenantId);

      if (!conta) {
        throw new NotFoundException('Conta não encontrada');
      }

      if (!conta.refreshToken) {
        throw new Error('Refresh token não disponível');
      }

      const adapter = this.integracaoFactory.criar(conta.marketplace);
      const novoTokens = await adapter.renovarToken(conta.refreshToken);

      await this.repository.atualizarTokens(
        contaId,
        tenantId,
        novoTokens.accessToken,
        novoTokens.refreshToken,
        novoTokens.expiresIn,
      );

      this.logger.log(`Token renovado para conta ${contaId}`);
    } catch (erro) {
      // Se falhar renovo, marcar como erro de token
      await this.repository.atualizarStatus(
        contaId,
        tenantId,
        StatusContaMarketplace.ERRO_TOKEN,
      );

      this.logger.error(`Erro ao renovar token: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Verifica status e renovação de tokens se necessário
   */
  async verificarStatus(contaId: string, tenantId: string) {
    try {
      const conta = await this.repository.buscarPorId(contaId, tenantId);

      if (!conta) {
        throw new NotFoundException('Conta não encontrada');
      }

      // Se token vai expirar em menos de 1 hora, renovar
      if (conta.tokenExpiraEm && conta.tokenExpiraEm < new Date(Date.now() + 3600000)) {
        await this.renovarToken(contaId, tenantId);
      }

      return {
        id: conta.id,
        marketplace: conta.marketplace,
        status: conta.status,
        tokenExpiraEm: conta.tokenExpiraEm,
        ultimaSincronizacao: conta.ultimaSincronizacao,
      };
    } catch (erro) {
      this.logger.error(`Erro ao verificar status: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Lista contas do tenant
   */
  async listar(tenantId: string) {
    return this.repository.listarPorTenant(tenantId);
  }

  /**
   * Obtém conta por ID
   */
  async obterPorId(contaId: string, tenantId: string) {
    const conta = await this.repository.buscarPorId(contaId, tenantId);

    if (!conta) {
      throw new NotFoundException('Conta não encontrada');
    }

    return conta;
  }

  /**
   * Lista contas ativas
   */
  async listarAtivas(tenantId: string) {
    return this.repository.listarAtivas(tenantId);
  }
}
