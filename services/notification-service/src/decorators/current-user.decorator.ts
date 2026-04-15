/**
 * Decorator @CurrentUser() para extrair dados do usuário
 * autenticado diretamente nos parâmetros do controller.
 *
 * Uso:
 *   async meuMetodo(@CurrentUser() usuario: UsuarioAutenticado) {
 *     console.log(usuario.tenantId, usuario.email);
 *   }
 *
 *   // Ou extrair campo específico:
 *   async meuMetodo(@CurrentUser('tenantId') tenantId: string) { }
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (campo: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Se um campo específico foi solicitado, retorna apenas ele
    return campo ? user?.[campo] : user;
  },
);
