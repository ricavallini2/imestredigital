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
    const cargosExigidos = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se não há cargos definidos, permite acesso
    if (!cargosExigidos || cargosExigidos.length === 0) {
      return true;
    }

    // Obtém o usuário da requisição (injetado pelo JwtAuthGuard/JwtStrategy)
    const request = context.switchToHttp().getRequest();
    const cargoBruto = request.user?.cargo ?? request.cargo ?? '';

    // Comparação case-insensitive: o cargo pode chegar em qualquer caixa
    // (JWT usa lowercase; o banco grava UPPERCASE). Normaliza ambos os
    // lados para evitar bypass ou falso negativo por diferença de caixa.
    const cargoUsuario = String(cargoBruto).toLowerCase();
    const permitido = cargosExigidos.some((cargo) => cargo.toLowerCase() === cargoUsuario);

    if (!permitido) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este recurso. ' +
          `Cargo necessário: ${cargosExigidos.join(' ou ')}`,
      );
    }

    return true;
  }
}
