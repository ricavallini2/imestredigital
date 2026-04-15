/**
 * ═══════════════════════════════════════════════════════════════
 * iMestreDigital - Fiscal Service (Ponto de Entrada)
 * ═══════════════════════════════════════════════════════════════
 *
 * Microserviço responsável por toda a gestão fiscal e tributária:
 * - NF-e (Nota Fiscal Eletrônica)
 * - NFS-e (Nota Fiscal de Serviço Eletrônica)
 * - NFC-e (Nota Fiscal do Consumidor Eletrônica)
 * - Comunicação com SEFAZ
 * - SPED Fiscal e de Contribuições
 * - Classificação fiscal com IA (integração futura)
 * - Cálculo de impostos (ICMS, PIS, COFINS, IPI)
 * - Eventos de cancelamento e carta de correção
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { criarLogger } from '@imestredigital/logger';

async function bootstrap() {
  const logger = criarLogger({ servico: 'fiscal-service' });

  // Cria a aplicação NestJS
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // ─── Configuração de API ────────────────────────────────

  // Prefixo global: /api
  app.setGlobalPrefix('api');

  // Versionamento via URI: /api/v1/notas-fiscais
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ─── Validação Global ───────────────────────────────────

  // Valida automaticamente todos os DTOs de entrada
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
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
    .setTitle('iMestreDigital - Fiscal Service')
    .setDescription(
      'API de gestão fiscal e tributária. Gerencia NF-e, NFS-e, NFC-e, ' +
      'comunicação com SEFAZ, SPED, cálculo de impostos e classificação fiscal ' +
      'com IA do sistema iMestreDigital.'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('notas-fiscais', 'Gerenciamento de Notas Fiscais')
    .addTag('configuracao-fiscal', 'Configuração fiscal por tenant')
    .addTag('regras-fiscais', 'Regras de classificação fiscal')
    .addTag('sped', 'Geração de arquivos SPED')
    .addTag('sefaz', 'Comunicação com SEFAZ (consumo)')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // ─── Kafka (Microserviço) ───────────────────────────────

  // Conecta ao Kafka para produzir e consumir eventos de domínio
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'fiscal-service',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      },
      consumer: {
        groupId: 'fiscal-service-group',
      },
    },
  });

  await app.startAllMicroservices();

  // ─── Iniciar Servidor HTTP ──────────────────────────────

  const port = process.env.PORT || 3004;
  await app.listen(port);

  logger.info(`💰 Fiscal Service rodando na porta ${port}`);
  logger.info(`📚 Documentação disponível em http://localhost:${port}/api/docs`);
}

bootstrap();
