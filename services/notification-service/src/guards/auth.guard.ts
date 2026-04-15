/**
 * Guard de autenticação JWT.
 *
 * Protege rotas que exigem autenticação.
 * Usa a JwtStrategy do Passport para validar o token.
 *
 * Uso nos controllers:
 *   @UseGuards(JwtAuthGuard)
 *   async minhaRota(@Request() req) {
 *     const { tenantId, usuarioId } = req.user;
 *   }
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
