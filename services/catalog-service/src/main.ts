/**
 * Ponto de entrada do Microserviço de Catálogo.
 *
 * Inicializa o servidor HTTP (NestJS) e configura:
 * - Validação global de DTOs
 * - Documentação Swagger
 * - Prefixo de API versionado
 * - Health checks
 * - Conexão com Kafka para eventos
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { criarLogger } from '@imestredigital/logger';

async function bootstrap() {
  const logger = criarLogger({ servico: 'catalog-service' });

  // Cria a aplicação NestJS
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // ─── Configuração de API ────────────────────────────────

  // Prefixo global: /api
  app.setGlobalPrefix('api');

  // Versionamento via URI: /api/v1/produtos
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ─── Validação Global ───────────────────────────────────

  // Valida automaticamente todos os DTOs de entrada
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Remove campos não declarados no DTO
      forbidNonWhitelisted: true, // Rejeita requisições com campos extras
      transform: true,          // Transforma tipos automaticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── CORS ───────────────────────────────────────────────

  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // ─── Swagger / Documentação da API ──────────────────────

  const swaggerConfig = new DocumentBuilder()
    .setTitle('iMestreDigital - Catálogo de Produtos')
    .setDescription(
      'API do microserviço de catálogo. Gerencia produtos, variações, ' +
      'categorias e marcas do sistema iMestreDigital.'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('produtos', 'Gerenciamento de produtos')
    .addTag('categorias', 'Gerenciamento de categorias')
    .addTag('marcas', 'Gerenciamento de marcas')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // ─── Kafka (Microserviço) ───────────────────────────────

  // Conecta ao Kafka para produzir e consumir eventos de domínio
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'catalog-service',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      },
      consumer: {
        groupId: 'catalog-service-group',
      },
    },
  });

  await app.startAllMicroservices();

  // ─── Iniciar Servidor HTTP ──────────────────────────────

  const port = process.env.PORT || 3010;
  await app.listen(port);

  logger.info({ port }, `🚀 Catalog Service rodando na porta ${port}`);
  logger.info({ port }, `📚 Documentação disponível em http://localhost:${port}/api/docs`);
}

bootstrap();
