/**
 * ═══════════════════════════════════════════════════════════════
 * iMestreDigital - Customer Service (CRM) (Ponto de Entrada)
 * ═══════════════════════════════════════════════════════════════
 *
 * Serviço responsável por gerenciamento de clientes (CRM):
 * - Cadastro e manutenção de clientes (PF/PJ)
 * - Gerenciamento de endereços e contatos
 * - Histórico de interações (timeline)
 * - Segmentação dinâmica de clientes
 * - Importação em lote de clientes
 * - Sincronização com eventos de pedidos e devoluções via Kafka
 *
 * Porta: 3012
 * Banco de dados: PostgreSQL (customer_service)
 * Cache: Redis
 * Message Broker: Kafka
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Nota: controllers já usam path completo 'api/v1/...'
  // Não usar setGlobalPrefix + enableVersioning para evitar duplicação

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
    .setTitle('iMestreDigital - Gerenciamento de Clientes (CRM)')
    .setDescription(
      'API de gerenciamento de clientes do iMestreDigital. ' +
      'Gerencia clientes (PF/PJ), endereços, contatos, interações, ' +
      'segmentação e importação em lote de clientes.'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('clientes', 'Gerenciamento de clientes (CRUD)')
    .addTag('enderecos', 'Gerenciamento de endereços de entrega/cobrança')
    .addTag('contatos', 'Gerenciamento de contatos dentro da empresa cliente')
    .addTag('interacoes', 'Histórico de interações (timeline)')
    .addTag('segmentos', 'Segmentação dinâmica de clientes')
    .addTag('importacao', 'Importação em lote de clientes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ─── Kafka (Microserviço) ───────────────────────────────
  // Ativa modo híbrido: HTTP + Kafka consumer
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'customer-service',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      },
      consumer: { groupId: 'customer-service-group' },
    },
  });

  // Kafka is optional in dev — don't crash if broker is unavailable
  app.startAllMicroservices().catch((err) => {
    console.warn('⚠️  Kafka indisponível (modo dev sem broker):', err?.message ?? err);
  });

  const port = process.env.PORT || 3012;
  await app.listen(port);
  console.log(`📊 Customer Service (CRM) rodando na porta ${port}`);
  console.log(`📚 Documentação: http://localhost:${port}/api/docs`);
}

bootstrap();
