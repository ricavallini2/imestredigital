/**
 * Módulo Kafka Consumer.
 *
 * Escuta eventos de outros serviços e dispara notificações automaticamente.
 */
import { Module } from '@nestjs/common';
import { NotificacaoConsumerService } from './notificacao-consumer.service';
import { NotificacaoModule } from '../notificacao/notificacao.module';

@Module({
  imports: [NotificacaoModule],
  providers: [NotificacaoConsumerService],
})
export class KafkaModule {}
