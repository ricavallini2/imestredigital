/**
 * Módulo de Push Notifications.
 */
import { Module } from '@nestjs/common';
import { PushService } from './push.service';
import { PushController } from './push.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [PushController],
  providers: [PushService],
  exports: [PushService],
})
export class PushModule {}
