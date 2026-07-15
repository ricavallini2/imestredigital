/**
 * Módulo Kafka Consumer.
 *
 * Escuta eventos de outros serviços e dispara notificações automaticamente.
 * Os handlers ficam em um CONTROLLER (`@EventPattern`) porque os produtores
 * publicam via `emit()` — que só é entregue a `@EventPattern`, nunca a
 * `@MessagePattern`.
 */
import { Module } from '@nestjs/common'
import { NotificacaoEventosController } from './notificacao-eventos.controller'
import { NotificacaoModule } from '../notificacao/notificacao.module'

@Module({
  imports: [NotificacaoModule],
  controllers: [NotificacaoEventosController],
})
export class KafkaModule {}
