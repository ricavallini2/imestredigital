import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  // ========================================================================
  // CONFIGURAÇÕES GLOBAIS
  // ========================================================================

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Validação global
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

  // ========================================================================
  // MICROSERVIÇO KAFKA
  // ========================================================================

  const kafkaBrokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: kafkaBrokers,
        clientId: process.env.KAFKA_CLIENT_ID || 'marketplace-service',
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID || 'marketplace-service-group',
        allowAutoTopicCreation: true,
      },
    },
  });

  // ========================================================================
  // SWAGGER
  // ========================================================================

  if (process.env.SWAGGER_ENABLE !== 'false') {
    const config = new DocumentBuilder()
      .setTitle('Marketplace Service API')
      .setDescription(
        'API para integração com principais marketplaces brasileiros (Mercado Livre, Shopee, Amazon, Magalu, Americanas)',
      )
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('Contas Marketplace', 'Gerenciar conexões com marketplaces')
      .addTag('Anúncios', 'Gerenciar anúncios nos marketplaces')
      .addTag('Pedidos', 'Gerenciar pedidos importados dos marketplaces')
      .addTag('Perguntas', 'Gerenciar perguntas dos compradores')
      .addTag('Sincronização', 'Controlar sincronização de dados')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    logger.log('Swagger disponível em: http://localhost:3007/api/docs');
  }

  // ========================================================================
  // INICIAR SERVIDOR
  // ========================================================================

  await app.startAllMicroservices();

  const port = parseInt(process.env.PORT || '3007', 10);
  await app.listen(port);

  logger.log(`Marketplace Service rodando na porta ${port}`);
  logger.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`Kafka Brokers: ${kafkaBrokers.join(', ')}`);
}

bootstrap().catch((error) => {
  console.error('Erro ao inicializar aplicação:', error);
  process.exit(1);
});
