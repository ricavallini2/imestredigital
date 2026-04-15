/**
 * Módulo de Autenticação.
 *
 * Responsável por:
 * - Login (email + senha)
 * - Registro de novos tenants
 * - Emissão de tokens JWT (access + refresh)
 * - Validação de tokens
 * - Recuperação de senha
 */

import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TenantModule } from '../tenant/tenant.module';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [TenantModule, UsuarioModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
