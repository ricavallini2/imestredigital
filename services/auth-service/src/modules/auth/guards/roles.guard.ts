/**
 * Guard de autorização baseada em cargos (RBAC).
 *
 * Verifica se o usuário possui o cargo necessário para
 * acessar determinada rota. Usado em conjunto com o
 * decorator @Roles().
 *
 * Exemplo de uso:
 *   @UseGuards(JwtAuthGuard, RolesGuard)
 *   @Roles('admin', 'gerente')
 *   async apenasAdmins() { ... }
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Busca os cargos exigidos pelo decorator @Roles()
    const cargosExigidos = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se não há cargos definidos, permite acesso
    if (!cargosExigidos || cargosExigidos.length === 0) {
      return true;
    }

    // Obtém o usuário da requisição (injetado pelo JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Verifica se o cargo do usuário está na lista permitida
    if (!cargosExigidos.includes(user.cargo)) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este recurso. ' +
        `Cargo necessário: ${cargosExigidos.join(' ou ')}`
      );
    }

    return true;
  }
}
