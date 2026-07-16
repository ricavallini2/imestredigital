/**
 * Controller de Usuários.
 *
 * Gerencia os usuários dentro do tenant do usuário logado.
 * Consulta do próprio perfil é livre; a GESTÃO (criar, editar, permissões,
 * desativar) é restrita a admin e gerente.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  CriarUsuarioDto,
  AtualizarUsuarioDto,
  DefinirPermissoesDto,
} from '../../dtos/usuario/criar-usuario.dto';

@ApiTags('usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  /**
   * Catálogo de módulos e ações do RBAC.
   * Rota estática declarada ANTES de ':id' para não ser capturada por ela.
   */
  @Get('permissoes/modulos')
  @ApiOperation({ summary: 'Listar módulos e ações disponíveis para permissão' })
  obterCatalogo() {
    return this.usuarioService.obterCatalogo();
  }

  /** Perfil + permissões do usuário logado (a UI usa para liberar/ocultar ações). */
  @Get('me')
  @ApiOperation({ summary: 'Perfil e permissões do usuário logado' })
  async obterMe(@TenantId() tenantId: string, @CurrentUser('usuarioId') usuarioId: string) {
    return this.usuarioService.obterMe(tenantId, usuarioId);
  }

  /** Lista todos os usuários do tenant */
  @Get()
  @ApiOperation({ summary: 'Listar usuários da empresa' })
  async listar(@TenantId() tenantId: string) {
    return this.usuarioService.listarPorTenant(tenantId);
  }

  /** Detalhe de um usuário com a matriz de permissões */
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'gerente')
  @ApiOperation({ summary: 'Detalhe do usuário com permissões' })
  async obter(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.usuarioService.obterPorId(tenantId, id);
  }

  /** Cria um novo usuário no tenant */
  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'gerente')
  @ApiOperation({ summary: 'Criar usuário na empresa' })
  async criar(@TenantId() tenantId: string, @Body() dto: CriarUsuarioDto) {
    return this.usuarioService.criar(tenantId, dto);
  }

  /** Atualiza dados do usuário (nome, cargo, status, senha, liberação) */
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'gerente')
  @ApiOperation({ summary: 'Atualizar usuário' })
  async atualizar(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: AtualizarUsuarioDto,
  ) {
    return this.usuarioService.atualizar(tenantId, id, dto);
  }

  /** Substitui a matriz de permissões do usuário */
  @Put(':id/permissoes')
  @UseGuards(RolesGuard)
  @Roles('admin', 'gerente')
  @ApiOperation({ summary: 'Definir permissões do usuário por módulo' })
  async definirPermissoes(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: DefinirPermissoesDto,
  ) {
    return this.usuarioService.definirPermissoes(tenantId, id, dto);
  }

  /** Desativa um usuário (soft delete) */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles('admin', 'gerente')
  @ApiOperation({ summary: 'Desativar usuário' })
  async desativar(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('usuarioId') solicitanteId: string,
  ) {
    return this.usuarioService.desativar(tenantId, id, solicitanteId);
  }
}
