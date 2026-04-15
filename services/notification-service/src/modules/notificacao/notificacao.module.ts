/**
 * Módulo de Notificações.
 */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { NotificacaoService } from './notificacao.service';
import { NotificacaoController } from './notificacao.controller';
import { EmailModule } from '../email/email.module';
import { PushModule } from '../push/push.module';
import { WebhookModule } from '../webhook/webhook.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EmailModule,
    PushModule,
    WebhookModule,
  ],
  controllers: [NotificacaoController],
  providers: [NotificacaoService],
  exports: [NotificacaoService],
})
export class NotificacaoModule {}
