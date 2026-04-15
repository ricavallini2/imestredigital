/**
 * ═══════════════════════════════════════════════════════════════
 * iMestreDigital - Inventory Service (Estoque)
 * ═══════════════════════════════════════════════════════════════
 *
 * Gerencia todo o estoque do sistema:
 * - Saldo de estoque por produto e depósito
 * - Movimentações (entrada, saída, transferência, ajuste)
 * - Reservas de estoque para pedidos
 * - Alertas de estoque mínimo
 * - Multi-depósito com localização física
 *
 * Consome eventos do Catalog Service (produto criado/removido)
 * e publica eventos de estoque para Order e Marketplace services.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('iMestreDigital - Estoque')
    .setDescription('API de gerenciamento de estoque multi-depósito')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('estoque', 'Saldos e movimentações de estoque')
    .addTag('depositos', 'Gerenciamento de depósitos')
    .addTag('movimentacoes', 'Histórico de movimentações')
    .build();

  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  // Kafka consumer
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'inventory-service',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      },
      consumer: { groupId: 'inventory-service-group' },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 3011;
  await app.listen(port);
  console.log(`📦 Inventory Service rodando na porta ${port}`);
}

bootstrap();
