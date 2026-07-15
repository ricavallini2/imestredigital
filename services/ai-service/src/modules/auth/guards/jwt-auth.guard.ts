/**
 * Guard de autenticação JWT.
 *
 * Protege rotas que exigem autenticação usando a JwtStrategy do Passport.
 * Token ausente/inválido/expirado → 401.
 *
 * Uso nos controllers:
 *   @UseGuards(JwtAuthGuard)
 *   async minhaRota(@Request() req) {
 *     const { usuarioId, tenantId } = req.user
 *   }
 */

import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
