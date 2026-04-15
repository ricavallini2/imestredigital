/**
 * Controller de Autenticação.
 *
 * Endpoints públicos (sem JWT):
 * - POST /auth/registrar → Cria tenant + usuário admin
 * - POST /auth/login → Retorna access_token + refresh_token
 * - POST /auth/refresh → Renova o access_token
 * - POST /auth/esqueci-senha → Envia email de recuperação
 * - POST /auth/redefinir-senha → Redefine com token
 *
 * Endpoints autenticados:
 * - GET /auth/perfil → Retorna dados do usuário logado
 * - POST /auth/trocar-senha → Troca senha do usuário logado
 */

import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegistrarDto } from '../../dtos/auth/registrar.dto';
import { LoginDto } from '../../dtos/auth/login.dto';
import { RefreshTokenDto } from '../../dtos/auth/refresh-token.dto';
import { TrocarSenhaDto } from '../../dtos/auth/trocar-senha.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registra uma nova empresa (tenant) no sistema.
   * Cria automaticamente o usuário administrador do tenant.
   * Retorna os tokens de acesso para login imediato.
   */
  @Post('registrar')
  @ApiOperation({ summary: 'Registrar nova empresa + usuário admin' })
  @ApiResponse({ status: 201, description: 'Empresa registrada com sucesso' })
  @ApiResponse({ status: 409, description: 'Email ou CNPJ já cadastrado' })
  async registrar(@Body() dto: RegistrarDto) {
    return this.authService.registrar(dto);
  }

  /**
   * Realiza login com email e senha.
   * Retorna access_token (curta duração) e refresh_token (longa duração).
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login com email e senha' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Renova o access_token usando um refresh_token válido.
   * O refresh_token anterior é invalidado (rotação de tokens).
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token' })
  @ApiResponse({ status: 200, description: 'Token renovado' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido ou expirado' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  /**
   * Retorna os dados do usuário autenticado.
   * Inclui informações do tenant e permissões.
   */
  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Dados do perfil' })
  async perfil(@Request() req: any) {
    return this.authService.obterPerfil(req.user.usuarioId);
  }

  /**
   * Troca a senha do usuário logado.
   * Exige a senha atual para confirmação.
   */
  @Post('trocar-senha')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trocar senha do usuário logado' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 400, description: 'Senha atual incorreta' })
  async trocarSenha(@Request() req: any, @Body() dto: TrocarSenhaDto) {
    return this.authService.trocarSenha(req.user.usuarioId, dto);
  }
}
