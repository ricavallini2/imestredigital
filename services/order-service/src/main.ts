/**
 * ═══════════════════════════════════════════════════════════════
 * iMestreDigital - Order Service (OMS) - Ponto de Entrada
 * ═══════════════════════════════════════════════════════════════
 *
 * Serviço responsável pela gestão completa de pedidos omnichannel.
 * Gerencia:
 * - Criação de pedidos (múltiplas origens: marketplace, ecommerce, loja física)
 * - Transições de status (workflow de pedido)
 * - Integração com inventory-service (reserva de estoque)
 * - Integração com fiscal-service (geração de NF-e)
 * - Integração com payment-service (processamento de pagamentos)
 * - Gestão de devoluções e reembolsos
 * - Rastreamento de envios
 *
 * Port: 3005
 * Kafka GroupId: order-service
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // ─── Configuração de API ────────────────────────────────
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ─── Validação Global ───────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── CORS ───────────────────────────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // ─── Swagger ────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('iMestreDigital - Gestão de Pedidos (OMS)')
    .setDescription(
      'API de Gestão de Pedidos Omnichannel. Gerencia criação, confirmação, ' +
      'separação, faturamento e envio de pedidos de múltiplos canais (marketplace, ' +
      'ecommerce, loja física). Integrado com inventory-service (reserva de estoque), ' +
      'fiscal-service (NF-e) e payment-service (pagamentos).'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('pedidos', 'Gerenciamento de pedidos')
    .addTag('pagamentos', 'Gestão de pagamentos')
    .addTag('devolucoes', 'Gestão de devoluções e reembolsos')
    .addTag('frete', 'Cálculo e rastreamento de frete')
    .addTag('estatisticas', 'Dashboard e KPIs')
    .addTag('health', 'Health checks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ─── Kafka (Redpanda) ────────────────────────────────────
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'order-service',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      },
      consumer: { groupId: 'order-service-group' },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 3005;
  await app.listen(port);
  console.log(`📦 Order Service (OMS) rodando na porta ${port}`);
  console.log(`📚 Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
