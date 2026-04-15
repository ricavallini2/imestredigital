/**
 * Controller de Email.
 *
 * Endpoints para envio de emails simples, com template e em massa.
 */

import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { EmailService } from './email.service';
import { EnviarEmailDto } from '../../dtos/enviar-email.dto';

@ApiTags('email')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('enviar')
  @ApiOperation({
    summary: 'Envia um email simples',
    description: 'Envia um email para um destinatário com corpo HTML livre.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email enviado com sucesso',
    schema: {
      type: 'object',
      properties: {
        mensagemId: { type: 'string', example: '<uuid>@mail.gmail.com' },
      },
    },
  })
  async enviarEmail(
    @Body() dto: EnviarEmailDto,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const mensagemId = await this.emailService.enviarEmail(tenantId, {
      destinatario: dto.email,
      assunto: dto.assunto,
      corpo: dto.corpo,
      cc: dto.cc,
      bcc: dto.bcc,
    });

    return { mensagemId };
  }

  @Post('enviar-com-template')
  @ApiOperation({
    summary: 'Envia email usando um template pré-cadastrado',
    description: 'Envia email compilando um template Handlebars com variáveis.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email enviado com sucesso',
  })
  async enviarComTemplate(
    @Body()
    dto: {
      email: string;
      templateSlug: string;
      variaveis: Record<string, any>;
    },
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const mensagemId = await this.emailService.enviarComTemplate(tenantId, {
      destinatario: dto.email,
      templateSlug: dto.templateSlug,
      variaveisTemplate: dto.variaveis,
    });

    return { mensagemId };
  }

  @Post('enviar-massa')
  @ApiOperation({
    summary: 'Envia emails em massa',
    description: 'Envia o mesmo email para múltiplos destinatários.',
  })
  @ApiResponse({
    status: 200,
    description: 'Emails enviados',
    schema: {
      type: 'object',
      properties: {
        sucesso: { type: 'number' },
        falhas: { type: 'number' },
      },
    },
  })
  async enviarEmMassa(
    @Body()
    dto: {
      destinatarios: string[];
      assunto: string;
      corpo: string;
    },
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const resultado = await this.emailService.enviarEmMassa(
      tenantId,
      dto.destinatarios,
      dto.assunto,
      dto.corpo,
    );

    return resultado;
  }
}
