/**
 * Controller de Usuários.
 *
 * Gerencia os usuários dentro do tenant do usuário logado.
 * Apenas admins e gerentes podem criar/editar outros usuários.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { UsuarioService } from './usuario.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantId } from '../auth/decorators/tenant-id.decorator';
import { CriarUsuarioDto } from '../../dtos/usuario/criar-usuario.dto';

@ApiTags('usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  /** Lista todos os usuários do tenant */
  @Get()
  @ApiOperation({ summary: 'Listar usuários da empresa' })
  async listar(@TenantId() tenantId: string) {
    return this.usuarioService.listarPorTenant(tenantId);
  }

  /** Cria (convida) um novo usuário para o tenant */
  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'gerente')
  @ApiOperation({ summary: 'Convidar novo usuário para a empresa' })
  async criar(
    @TenantId() tenantId: string,
    @Body() dto: CriarUsuarioDto,
  ) {
    return this.usuarioService.criar(tenantId, dto);
  }

  /** Desativa um usuário (soft delete) */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Desativar usuário' })
  async desativar(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.usuarioService.desativar(tenantId, id);
  }
}
