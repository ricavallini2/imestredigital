/**
 * Módulo raiz do Inventory Service.
 */

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';

import { PrismaModule } from './modules/prisma/prisma.module';
import { EstoqueModule } from './modules/estoque/estoque.module';
import { DepositoModule } from './modules/deposito/deposito.module';
import { MovimentacaoModule } from './modules/movimentacao/movimentacao.module';
import { HealthController } from './controllers/health.controller';
import { TenantMiddleware } from './middlewares/tenant.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET || 'dev-secret-trocar-em-producao' }),
    TerminusModule,
    PrismaModule,
    EstoqueModule,
    DepositoModule,
    MovimentacaoModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
