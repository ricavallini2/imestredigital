/**
 * Guard de autenticação JWT (Passport).
 *
 * Protege rotas que exigem autenticação. Usa a JwtStrategy do Passport
 * para validar a ASSINATURA e a expiração do token. Em caso de token
 * ausente/inválido/expirado, retorna 401 automaticamente.
 *
 * Uso nos controllers:
 *   @UseGuards(JwtAuthGuard)
 *   async minhaRota(@Req() req) {
 *     const { usuarioId, tenantId, cargo } = req.user;
 *   }
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
