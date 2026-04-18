import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContaMarketplace, PlataformaMarketplace, StatusConexao } from '../../../generated/client';

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
      },
    });
  }

  /**
   * Atualiza status
   */
  async atualizarStatus(
    id: string,
    tenantId: string,
    status: StatusConexao,
  ): Promise<ContaMarketplace> {
    return this.prisma.contaMarketplace.update({
      where: {
        id,
      },
      data: {
        status,
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
        status: StatusConexao.INATIVA,
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
