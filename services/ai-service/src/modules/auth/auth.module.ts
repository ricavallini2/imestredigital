/**
 * Módulo de autenticação/autorização.
 *
 * Registra globalmente:
 * - PassportModule (defaultStrategy 'jwt')
 * - JwtModule (segredo resolvido via fail-fast em jwt-secret.ts)
 * - JwtStrategy (validação de assinatura + payload)
 *
 * Exporta JwtModule/PassportModule para que o TenantMiddleware e os
 * controllers possam reutilizar a mesma configuração de verificação.
 */

import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from './strategies/jwt.strategy'
import { resolverJwtSecret } from '../../common/jwt-secret'

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: resolverJwtSecret(config.get<string>('JWT_SECRET')),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION', '1h'),
        },
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
