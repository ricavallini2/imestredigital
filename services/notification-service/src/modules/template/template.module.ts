/**
 * Módulo de Templates de Notificação.
 */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
