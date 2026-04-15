/**
 * Módulo de Usuários.
 *
 * Gerencia usuários dentro de um tenant:
 * - CRUD de usuários
 * - Convites para novos usuários
 * - Atribuição de cargos
 */

import { Module } from '@nestjs/common';

import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
