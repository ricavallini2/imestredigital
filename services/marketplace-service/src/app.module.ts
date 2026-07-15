import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CacheModule } from './modules/cache/cache.module';
import { CriptoModule } from './modules/cripto/cripto.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { ContaMarketplaceModule } from './modules/conta-marketplace/conta-marketplace.module';
import { AnuncioModule } from './modules/anuncio/anuncio.module';
import { PedidoMarketplaceModule } from './modules/pedido-marketplace/pedido-marketplace.module';
import { PerguntaModule } from './modules/pergunta/pergunta.module';
import { SincronizacaoModule } from './modules/sincronizacao/sincronizacao.module';
import { IntegracaoModule } from './modules/integracao/integracao.module';
import { MercadoLivreModule } from './modules/mercado-livre/mercado-livre.module';
import { VitrineModule } from './modules/vitrine/vitrine.module';
import { TenantMiddleware } from './middlewares/tenant.middleware';
import { JwtStrategy } from './auth/jwt.strategy';
import { resolverJwtSecret } from './common/jwt-secret';

/**
 * Módulo raiz da aplicação
 * Configuração centralizada de todos os submódulos
 */
@Module({
  imports: [
    // Configuração e variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Passport (estratégia padrão JWT)
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT global — usado pelo TenantMiddleware para verificar a assinatura dos tokens.
    // resolverJwtSecret aplica o fail-fast canônico: produção sem JWT_SECRET
    // derruba o bootstrap; em dev, usa um segredo default com warn explícito.
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: resolverJwtSecret(config.get<string>('JWT_SECRET')),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION', '1h'),
        },
      }),
    }),

    // Módulos de infraestrutura
    PrismaModule,
    CacheModule,
    CriptoModule,
    EventosModule,
    HealthModule,

    // Módulos de negócio
    ContaMarketplaceModule,
    AnuncioModule,
    PedidoMarketplaceModule,
    PerguntaModule,
    SincronizacaoModule,
    IntegracaoModule,
    MercadoLivreModule,
    VitrineModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule implements NestModule {
  /**
   * Aplica o TenantMiddleware a todas as rotas HTTP protegidas.
   * Exclui health check (probe do Docker em '/health') e docs do Swagger.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.ALL },
        { path: 'health/(.*)', method: RequestMethod.ALL },
        { path: 'api/docs', method: RequestMethod.ALL },
        { path: 'api/docs/(.*)', method: RequestMethod.ALL },
        // Webhook do Mercado Livre é PÚBLICO (o ML chama sem JWT).
        { path: 'api/v1/webhooks/mercadolivre', method: RequestMethod.ALL },
        { path: 'api/v1/webhooks/mercadolivre/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('api/*')
  }
}
