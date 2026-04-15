/**
 * Controller de Templates de Notificação.
 *
 * Endpoints para CRUD de templates e preview/renderização.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { TemplateService } from './template.service';
import { CriarTemplateDto, AtualizarTemplateDto } from '../../dtos/criar-template.dto';

@ApiTags('templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um novo template',
    description: 'Cria um novo template de notificação com suporte a Handlebars.',
  })
  @ApiResponse({
    status: 201,
    description: 'Template criado com sucesso',
  })
  async criar(
    @Body() dto: CriarTemplateDto,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const template = await this.templateService.criar(tenantId, dto);

    return template;
  }

  @Get()
  @ApiOperation({
    summary: 'Lista todos os templates',
    description: 'Lista todos os templates de notificação do tenant.',
  })
  @ApiResponse({
    status: 200,
    description: 'Templates listados com sucesso',
    isArray: true,
  })
  async listar(@Request() req: any) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const templates = await this.templateService.listar(tenantId);

    return templates;
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Obtém um template por slug',
  })
  @ApiResponse({
    status: 200,
    description: 'Template obtido com sucesso',
  })
  async buscarPorSlug(
    @Param('slug') slug: string,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const template = await this.templateService.buscarPorSlug(tenantId, slug);

    return template;
  }

  @Put(':slug')
  @ApiOperation({
    summary: 'Atualiza um template',
  })
  @ApiResponse({
    status: 200,
    description: 'Template atualizado com sucesso',
  })
  async atualizar(
    @Param('slug') slug: string,
    @Body() dto: AtualizarTemplateDto,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const template = await this.templateService.atualizar(tenantId, slug, dto);

    return template;
  }

  @Delete(':slug')
  @ApiOperation({
    summary: 'Deleta um template',
  })
  @ApiResponse({
    status: 200,
    description: 'Template deletado com sucesso',
  })
  async deletar(
    @Param('slug') slug: string,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const deletado = await this.templateService.deletar(tenantId, slug);

    return { deletado };
  }

  @Post(':slug/renderizar')
  @ApiOperation({
    summary: 'Renderiza um template com variáveis (preview)',
    description:
      'Compila e renderiza um template com as variáveis fornecidas. Útil para preview.',
  })
  @ApiResponse({
    status: 200,
    description: 'Template renderizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        assunto: { type: 'string' },
        conteudo: { type: 'string' },
        erros: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async renderizar(
    @Param('slug') slug: string,
    @Body() dto: { variaveis: Record<string, any> },
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const resultado = await this.templateService.renderizar(
      tenantId,
      slug,
      dto.variaveis,
    );

    return resultado;
  }
}
