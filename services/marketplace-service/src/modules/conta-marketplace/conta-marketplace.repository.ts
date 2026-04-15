import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContaMarketplace, TipoMarketplace, StatusContaMarketplace } from '@prisma/client';

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
    marketplace: TipoMarketplace;
    nome: string;
    accessToken: string;
    refreshToken?: string;
    sellerId: string;
    tokenExpiraEm?: Date;
    configuracoes?: Record<string, any>;
  }): Promise<ContaMarketplace> {
    return this.prisma.contaMarketplace.create({
      data: {
        tenantId: dados.tenantId,
        marketplace: dados.marketplace,
        nome: dados.nome,
        accessToken: dados.accessToken,
        refreshToken: dados.refreshToken,
        sellerId: dados.sellerId,
        tokenExpiraEm: dados.tokenExpiraEm,
        configuracoes: dados.configuracoes || {},
        status: StatusContaMarketplace.ATIVA,
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
        createdAt: 'desc',
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
        status: StatusContaMarketplace.ATIVA,
      },
    });
  }

  /**
   * Busca conta por marketplace e sellerId
   */
  async buscarPorMarketplaceeSellerId(
    tenantId: string,
    marketplace: TipoMarketplace,
    sellerId: string,
  ): Promise<ContaMarketplace | null> {
    return this.prisma.contaMarketplace.findFirst({
      where: {
        tenantId,
        marketplace,
        sellerId,
      },
    });
  }

  /**
   * Atualiza conta
   */
  async atualizar(
    id: string,
    tenantId: string,
    dados: Partial<ContaMarketplace>,
  ): Promise<ContaMarketplace> {
    return this.prisma.contaMarketplace.update({
      where: {
        id,
      },
      data: {
        ...dados,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Atualiza tokens
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

    return this.prisma.contaMarketplace.update({
      where: {
        id,
      },
      data: {
        accessToken,
        refreshToken: refreshToken || undefined,
        tokenExpiraEm,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Atualiza status
   */
  async atualizarStatus(
    id: string,
    tenantId: string,
    status: StatusContaMarketplace,
  ): Promise<ContaMarketplace> {
    return this.prisma.contaMarketplace.update({
      where: {
        id,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Atualiza última sincronização
   */
  async atualizarUltimaSincronizacao(
    id: string,
    tenantId: string,
  ): Promise<ContaMarketplace> {
    return this.prisma.contaMarketplace.update({
      where: {
        id,
      },
      data: {
        ultimaSincronizacao: new Date(),
      },
    });
  }

  /**
   * Deleta conta (soft delete ou hard delete)
   */
  async deletar(id: string, tenantId: string): Promise<void> {
    await this.prisma.contaMarketplace.update({
      where: {
        id,
      },
      data: {
        status: StatusContaMarketplace.INATIVA,
      },
    });
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
