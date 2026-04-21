import { Controller, Get, Post, Delete, Param, Body, Headers, HttpCode, BadRequestException, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContaMarketplaceService } from './conta-marketplace.service';
import { ConectarMarketplaceDto } from '../../dtos/conectar-marketplace.dto';
import { PlataformaMarketplace } from '../../../generated/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Controller para gerenciar contas marketplace
 * Endpoints para conectar, desconectar e gerenciar autenticação
 */
@ApiTags('Contas Marketplace')
@ApiBearerAuth()
@Controller('api/v1/contas')
export class ContaMarketplaceController {
  private readonly logger = new Logger(ContaMarketplaceController.name);

  constructor(private readonly service: ContaMarketplaceService) {}

  /**
   * Obtém URL de autenticação OAuth2
   */
  @Get('autenticacao-url/:marketplace')
  @ApiOperation({ summary: 'Obter URL de autenticação' })
  @ApiResponse({
    status: 200,
    description: 'URL de autenticação gerada com sucesso',
  })
  obterUrlAutenticacao(
    @Param('marketplace') marketplace: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    if (!Object.values(PlataformaMarketplace).includes(marketplace as PlataformaMarketplace)) {
      throw new BadRequestException(`Marketplace inválido: ${marketplace}`);
    }

    const state = uuidv4();
    const url = this.service.obterUrlAutenticacao(
      marketplace as PlataformaMarketplace,
      state,
    );

    return {
      marketplace,
      url,
      state,
    };
  }

  /**
   * Conecta nova conta marketplace
   */
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Conectar nova conta marketplace' })
  @ApiResponse({
    status: 201,
    description: 'Conta conectada com sucesso',
  })
  async conectar(
    @Body() dto: ConectarMarketplaceDto,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.service.conectar(tenantId, dto.marketplace, dto);
  }

  /**
   * Lista contas do tenant
   */
  @Get()
  @ApiOperation({ summary: 'Listar contas marketplace' })
  @ApiResponse({
    status: 200,
    description: 'Contas listadas com sucesso',
  })
  async listar(@Headers('x-tenant-id') tenantId: string) {
    return this.service.listar(tenantId);
  }

  /**
   * Obtém detalhes de uma conta
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes da conta' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da conta',
  })
  async obterPorId(
    @Param('id') contaId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.service.obterPorId(contaId, tenantId);
  }

  /**
   * Verifica status da conta
   */
  @Get(':id/status')
  @ApiOperation({ summary: 'Verificar status da conta' })
  @ApiResponse({
    status: 200,
    description: 'Status da conta',
  })
  async verificarStatus(
    @Param('id') contaId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.service.verificarStatus(contaId, tenantId);
  }

  /**
   * Renova token expirado
   */
  @Post(':id/renovar-token')
  @ApiOperation({ summary: 'Renovar token de autenticação' })
  @ApiResponse({
    status: 200,
    description: 'Token renovado com sucesso',
  })
  async renovarToken(
    @Param('id') contaId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    await this.service.renovarToken(contaId, tenantId);
    return { mensagem: 'Token renovado com sucesso' };
  }

  /**
   * Desconecta conta marketplace
   */
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Desconectar conta marketplace' })
  @ApiResponse({
    status: 204,
    description: 'Conta desconectada com sucesso',
  })
  async desconectar(
    @Param('id') contaId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    await this.service.desconectar(contaId, tenantId);
  }

  /**
   * Callback OAuth2 para Mercado Livre
   * Recebe o código de autorização e completa o fluxo
   */
  @Get('callback/mercado-livre')
  @ApiOperation({ summary: 'Callback OAuth2 Mercado Livre' })
  @ApiResponse({
    status: 200,
    description: 'Autenticação completada',
  })
  async callbackMercadoLivre(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    // Implementação do callback
    // Em produção, receber code como query parameter e processar
    return { mensagem: 'Callback OAuth2 Mercado Livre' };
  }
}
