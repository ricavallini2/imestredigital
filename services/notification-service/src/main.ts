/**
 * ═══════════════════════════════════════════════════════════════
 * iMestreDigital - Notification Service (Ponto de Entrada)
 * ═══════════════════════════════════════════════════════════════
 *
 * Serviço responsável por gerenciar todas as notificações do sistema.
 * Canais suportados:
 * - Email (SMTP/Nodemailer)
 * - Push (Firebase Cloud Messaging)
 * - SMS (placeholder para Twilio)
 * - Webhooks (HTTP com assinatura HMAC-SHA256)
 * - Internas (no banco de dados)
 *
 * Integra-se com Kafka para ouvir eventos de outros serviços
 * e dispara notificações automaticamente.
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
    .setTitle('iMestreDigital - Notificações')
    .setDescription(
      'API de gerenciamento de notificações. Suporta ' +
      'email, push notifications, SMS, webhooks e notificações internas. ' +
      'Integrado com Kafka para processar eventos do sistema.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('notificacoes', 'Gerenciamento de notificações do usuário')
    .addTag('email', 'Envio de notificações por email')
    .addTag('push', 'Envio de notificações push')
    .addTag('webhooks', 'Configuração e monitoramento de webhooks')
    .addTag('templates', 'Gerenciamento de templates de notificações')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ─── Kafka ──────────────────────────────────────────────
  // Híbrido: HTTP API + Kafka Consumer
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notification-service',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      },
      consumer: { groupId: 'notification-service-group' },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 3009;
  await app.listen(port);
  console.log(`📧 Notification Service rodando na porta ${port}`);
  console.log(`📚 Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
