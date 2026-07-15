import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContaMarketplace, PlataformaMarketplace, StatusConexao, Prisma } from '../../../generated/client';

/**
 * Repository para operações de banco de dados de ContaMarketplace
 * Encapsula queries do Prisma
 */
@Injectable()
export class ContaMarketplaceRepository {
  private readonly logger = new Logger(ContaMarketplaceRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria nova conta marketplace
   */
  async criar(dados: {
    tenantId: string;
    plataforma: PlataformaMarketplace;
    nome: string;
    accessToken: string;
    refreshToken?: string;
    idExterno: string;
    tokenExpiraEm?: Date;
    configuracoes?: Record<string, any>;
  }): Promise<ContaMarketplace> {
    return this.prisma.contaMarketplace.create({
      data: {
        tenantId: dados.tenantId,
        plataforma: dados.plataforma,
        nome: dados.nome,
        accessToken: dados.accessToken,
        refreshToken: dados.refreshToken,
        idExterno: dados.idExterno,
        tokenExpiraEm: dados.tokenExpiraEm,
        configuracoes: dados.configuracoes || {},
        status: StatusConexao.ATIVA,
      },
    });
  }

  /**
   * Busca conta por ID
   */
  async buscarPorId(id: string, tenantId: string): Promise<ContaMarketplace | null> {
    return this.prisma.contaMarketplace.findFirst({
      where: {
        id,
        tenantId,
      },
    });
  }

  /**
   * Busca todas as contas do tenant
   */
  async listarPorTenant(tenantId: string): Promise<ContaMarketplace[]> {
    return this.prisma.contaMarketplace.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  /**
   * Busca contas ativas do tenant
   */
  async listarAtivas(tenantId: string): Promise<ContaMarketplace[]> {
    return this.prisma.contaMarketplace.findMany({
      where: {
        tenantId,
        status: StatusConexao.ATIVA,
      },
    });
  }

  /**
   * Busca conta por marketplace e sellerId
   */
  async buscarPorMarketplaceeSellerId(
    tenantId: string,
    plataforma: PlataformaMarketplace,
    idExterno: string,
  ): Promise<ContaMarketplace | null> {
    return this.prisma.contaMarketplace.findFirst({
      where: {
        tenantId,
        plataforma,
        idExterno,
      },
    });
  }

  /**
   * Atualiza conta (escopo por tenant via updateMany + where composto).
   */
  async atualizar(
    id: string,
    tenantId: string,
    dados: Partial<ContaMarketplace>,
  ): Promise<ContaMarketplace> {
    await this.prisma.contaMarketplace.updateMany({
      where: { id, tenantId },
      data: { ...dados },
    });
    return this.buscarPorIdOuFalha(id, tenantId);
  }

  /**
   * Atualiza tokens (escopo por tenant).
   */
  async atualizarTokens(
    id: string,
    tenantId: string,
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number,
  ): Promise<ContaMarketplace> {
    const tokenExpiraEm = expiresIn
      ? new Date(Date.now() + expiresIn * 1000)
      : null;

    await this.prisma.contaMarketplace.updateMany({
      where: { id, tenantId },
      data: {
        accessToken,
        refreshToken: refreshToken || undefined,
        tokenExpiraEm,
      },
    });
    return this.buscarPorIdOuFalha(id, tenantId);
  }

  /**
   * Rotaciona tokens do Mercado Livre de forma atômica (escopo por tenant).
   *
   * Persiste access + refresh + expiração + status ATIVA numa única gravação.
   * Como o refresh_token do ML é de uso único, esta gravação DEVE ocorrer ANTES
   * de o novo access token ser usado — quem chama garante a ordem e o lock.
   *
   * Os tokens recebidos aqui JÁ devem estar criptografados (o serviço cifra
   * antes de chamar). O repository não conhece a chave de criptografia.
   */
  async rotacionarTokens(
    id: string,
    tenantId: string,
    dados: {
      accessTokenCifrado: string
      refreshTokenCifrado: string
      tokenExpiraEm: Date
      idExterno?: string
      escopos?: string
    },
  ): Promise<ContaMarketplace> {
    const configuracoes: Prisma.InputJsonValue | undefined = dados.escopos
      ? { escopos: dados.escopos, atualizadoTokenEm: new Date().toISOString() }
      : undefined

    await this.prisma.contaMarketplace.updateMany({
      where: { id, tenantId },
      data: {
        accessToken: dados.accessTokenCifrado,
        refreshToken: dados.refreshTokenCifrado,
        tokenExpiraEm: dados.tokenExpiraEm,
        status: StatusConexao.ATIVA,
        ...(dados.idExterno ? { idExterno: dados.idExterno } : {}),
        ...(configuracoes ? { configuracoes } : {}),
      },
    })
    return this.buscarPorIdOuFalha(id, tenantId)
  }

  /**
   * Busca conta por user_id (idExterno) do seller no marketplace, SEM tenant.
   *
   * Uso exclusivo do webhook do Mercado Livre, que chega sem JWT e identifica a
   * conta apenas pelo user_id do seller. A resposta carrega o tenantId, que passa
   * a escopar todo o processamento subsequente.
   */
  async buscarPorPlataformaEUserId(
    plataforma: PlataformaMarketplace,
    idExterno: string,
  ): Promise<ContaMarketplace | null> {
    return this.prisma.contaMarketplace.findFirst({
      where: { plataforma, idExterno },
    })
  }

  /**
   * Atualiza status (escopo por tenant).
   */
  async atualizarStatus(
    id: string,
    tenantId: string,
    status: StatusConexao,
  ): Promise<ContaMarketplace> {
    await this.prisma.contaMarketplace.updateMany({
      where: { id, tenantId },
      data: { status },
    });
    return this.buscarPorIdOuFalha(id, tenantId);
  }

  /**
   * Atualiza última sincronização (escopo por tenant).
   */
  async atualizarUltimaSincronizacao(
    id: string,
    tenantId: string,
  ): Promise<ContaMarketplace> {
    await this.prisma.contaMarketplace.updateMany({
      where: { id, tenantId },
      data: { ultimaSincronizacao: new Date() },
    });
    return this.buscarPorIdOuFalha(id, tenantId);
  }

  /**
   * Desconecta conta (soft delete via status, escopo por tenant).
   */
  async deletar(id: string, tenantId: string): Promise<void> {
    await this.prisma.contaMarketplace.updateMany({
      where: { id, tenantId },
      data: { status: StatusConexao.INATIVA },
    });
  }

  /**
   * Busca por id garantindo o tenant; lança se não encontrada.
   */
  private async buscarPorIdOuFalha(
    id: string,
    tenantId: string,
  ): Promise<ContaMarketplace> {
    const conta = await this.buscarPorId(id, tenantId);
    if (!conta) {
      throw new NotFoundException('Conta marketplace não encontrada');
    }
    return conta;
  }

  /**
   * Conta anúncios ativos
   */
  async contarAnunciosAtivos(contaId: string): Promise<number> {
    return this.prisma.anuncioMarketplace.count({
      where: {
        contaMarketplaceId: contaId,
      },
    });
  }

  /**
   * Conta pedidos pendentes
   */
  async contarPedidosPendentes(contaId: string): Promise<number> {
    return this.prisma.pedidoMarketplace.count({
      where: {
        contaMarketplaceId: contaId,
        sincronizado: false,
      },
    });
  }
}
