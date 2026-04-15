/**
 * Ponto de entrada do AI Service do iMestreDigital
 *
 * Este serviço é responsável por:
 * - Processamento de requisições de IA (Chat, análises, previsões)
 * - Consumo de eventos Kafka de outros serviços
 * - Geração de insights automáticos
 * - Classificação fiscal e sugestões de produtos
 *
 * Port: 3008
 */

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Prefixo global e versionamento
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Habilitando CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Configuração do Swagger / OpenAPI
  if (process.env.SWAGGER_ENABLED !== 'false') {
    const config = new DocumentBuilder()
      .setTitle('iMestreAI - API de Inteligência Artificial')
      .setDescription(
        'Serviço de IA do iMestreDigital: Assistente conversacional, análises, previsões de demanda e sugestões inteligentes',
      )
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('Assistente', 'iMestreAI - Chat e processamento de comandos')
      .addTag('Insights', 'Análises e insights automáticos')
      .addTag('Previsão', 'Previsão de demanda e ponto de reposição')
      .addTag('Classificação', 'Classificação fiscal (NCM/CFOP)')
      .addTag('Sugestões', 'Sugestões de preço, descrição e respostas')
      .addTag('Saúde', 'Health check e status do serviço')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(
      process.env.SWAGGER_PATH || '/docs',
      app,
      document,
    );

    logger.log(
      `Swagger disponível em http://localhost:${process.env.PORT || 3008}/docs`,
    );
  }

  const port = process.env.PORT || 3008;
  await app.listen(port);

  logger.log(`✓ AI Service rodando na porta ${port}`);
  logger.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`✓ LLM Provider: ${process.env.OPENAI_MODEL || 'gpt-4'}`);
}

bootstrap().catch((err) => {
  console.error('Erro ao inicializar aplicação:', err);
  process.exit(1);
});
