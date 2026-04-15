/**
 * Decorator @TenantId() — atalho para extrair o ID do tenant
 * do usuário autenticado. Simplifica o código dos controllers.
 *
 * Uso:
 *   async listarProdutos(@TenantId() tenantId: string) {
 *     return this.produtoService.listarPorTenant(tenantId);
 *   }
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.tenantId;
  },
);
