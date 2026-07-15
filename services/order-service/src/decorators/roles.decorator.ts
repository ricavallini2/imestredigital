/**
 * Decorator @Roles() para definir quais cargos podem
 * acessar uma rota específica.
 *
 * Uso:
 *   @Roles('admin')              → Apenas administradores
 *   @Roles('admin', 'gerente')   → Admin ou gerente
 */

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
