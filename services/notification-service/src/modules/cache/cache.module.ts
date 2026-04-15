/**
 * Módulo de Cache com Redis.
 */
import { Global, Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Determina se deve usar Redis ou cache em memória
        const redisHost = configService.get('REDIS_HOST');
        const redisPort = configService.get('REDIS_PORT', 6379);

        if (redisHost) {
          // Configuração com Redis
          return {
            store: 'redis' as any,
            host: redisHost,
            port: redisPort,
            db: configService.get('REDIS_DB', 0),
            ttl: 300, // 5 minutos padrão
          };
        }

        // Fallback: cache em memória
        return {
          ttl: 300,
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheServiceModule {}
