/**
 * Módulo raiz do Auth Service.
 *
 * Registra os módulos de autenticação, tenants e usuários.
 * Configura JWT globalmente para toda a aplicação.
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';

import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    // Variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Passport (estratégias de autenticação)
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT (configuração global)
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'dev-secret-trocar-em-producao'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRATION', '1h'),
          issuer: 'imestredigital',
          audience: 'imestredigital-api',
        },
      }),
    }),

    // Health checks
    TerminusModule,

    // Banco de dados
    PrismaModule,

    // Módulos de domínio
    AuthModule,
    TenantModule,
    UsuarioModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
