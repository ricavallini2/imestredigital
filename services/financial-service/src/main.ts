/**
 * ═══════════════════════════════════════════════════════════════
 * iMestreDigital - Financial Service (Ponto de Entrada)
 * ═══════════════════════════════════════════════════════════════
 *
 * Serviço responsável por toda a gestão financeira do sistema.
 * Gerencia:
 * - Contas bancárias e financeiras
 * - Lançamentos (contas a pagar/receber)
 * - Categorias financeiras hierárquicas
 * - Recorrências automáticas
 * - Fluxo de caixa
 * - Demonstração de Resultado do Exercício (DRE)
 * - Conciliação bancária
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
    .setTitle('iMestreDigital - Gestão Financeira')
    .setDescription(
      'API de gestão financeira completa. Gerencia contas, ' +
      'lançamentos, fluxo de caixa, DRE e conciliação bancária ' +
      'do sistema iMestreDigital.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('contas', 'Gestão de contas financeiras')
    .addTag('lancamentos', 'Contas a pagar/receber')
    .addTag('categorias', 'Categorias financeiras')
    .addTag('recorrencias', 'Lançamentos recorrentes')
    .addTag('fluxo-caixa', 'Fluxo de caixa e projeções')
    .addTag('dre', 'Demonstração de Resultado')
    .addTag('conciliacao', 'Conciliação bancária')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ─── Kafka ──────────────────────────────────────────────
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'financial-service',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      },
      consumer: { groupId: process.env.KAFKA_GROUP_ID || 'financial-service-group' },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 3006;
  await app.listen(port);
  console.log(`💰 Financial Service rodando na porta ${port}`);
  console.log(`📚 Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
