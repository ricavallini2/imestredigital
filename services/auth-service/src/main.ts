/**
 * ═══════════════════════════════════════════════════════════════
 * iMestreDigital - Auth Service (Ponto de Entrada)
 * ═══════════════════════════════════════════════════════════════
 *
 * Serviço responsável por toda autenticação e autorização do sistema.
 * Gerencia:
 * - Registro de tenants (empresas)
 * - Criação e login de usuários
 * - Emissão e validação de JWT (access + refresh tokens)
 * - Controle de permissões (RBAC)
 * - Convite de usuários para um tenant
 * - Recuperação e troca de senha
 *
 * Este é o serviço mais crítico do sistema — todos os outros
 * dependem dele para validar tokens e identificar o tenant.
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
    .setTitle('iMestreDigital - Autenticação')
    .setDescription(
      'API de autenticação e autorização. Gerencia tenants, usuários, ' +
      'tokens JWT e permissões do sistema iMestreDigital.'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Login, registro e gerenciamento de tokens')
    .addTag('tenants', 'Gerenciamento de empresas/tenants')
    .addTag('usuarios', 'Gerenciamento de usuários')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ─── Kafka ──────────────────────────────────────────────
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth-service',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      },
      consumer: { groupId: 'auth-service-group' },
    },
  });

  // Kafka is optional in dev — don't crash if broker is unavailable
  app.startAllMicroservices().catch((err) => {
    console.warn('⚠️  Kafka indisponível (modo dev sem broker):', err?.message ?? err);
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🔐 Auth Service rodando na porta ${port}`);
  console.log(`📚 Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
