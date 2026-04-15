/**
 * Controller de Tenants (Empresas).
 *
 * Endpoints para gerenciamento do tenant do usuário logado.
 * Todas as rotas exigem autenticação.
 */

import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantId } from '../auth/decorators/tenant-id.decorator';
import { AtualizarTenantDto } from '../../dtos/tenant/atualizar-tenant.dto';

@ApiTags('tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  /** Retorna dados do tenant do usuário logado */
  @Get('meu')
  @ApiOperation({ summary: 'Obter dados da minha empresa' })
  async meuTenant(@TenantId() tenantId: string) {
    return this.tenantService.buscarPorId(tenantId);
  }

  /** Atualiza dados do tenant (apenas admin) */
  @Put('meu')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Atualizar dados da minha empresa' })
  async atualizar(
    @TenantId() tenantId: string,
    @Body() dto: AtualizarTenantDto,
  ) {
    return this.tenantService.atualizar(tenantId, dto);
  }
}
