/**
 * Regra Fiscal Controller
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegraFiscalService } from './regra-fiscal.service';
import { CriarRegraFiscalDto, AtualizarRegraFiscalDto } from '../../dtos/regra-fiscal.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@ApiTags('regras-fiscais')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('v1/regras-fiscais')
export class RegraFiscalController {
  constructor(private readonly service: RegraFiscalService) {}

  /**
   * Cria uma regra fiscal.
   *
   * Restrita a admin|gerente.
   */
  @Post()
  @Roles('admin', 'gerente')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar regra fiscal' })
  @ApiResponse({ status: 201, description: 'Regra fiscal criada' })
  async criar(@Req() req: any, @Body() dto: CriarRegraFiscalDto) {
    return this.service.criarRegra(req.tenantId, dto);
  }

  /**
   * Lista regras fiscais.
   */
  @Get()
  @ApiOperation({ summary: 'Listar regras fiscais' })
  @ApiResponse({ status: 200, description: 'Lista de regras fiscais' })
  async listar(
    @Req() req: any,
    @Query('pagina') pagina: number = 1,
    @Query('limite') limite: number = 20,
  ) {
    return this.service.listar(req.tenantId, pagina, limite);
  }

  /**
   * Obtém uma regra fiscal por ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obter regra fiscal por ID' })
  @ApiResponse({ status: 200, description: 'Regra fiscal encontrada' })
  async obterPorId(@Req() req: any, @Param('id') regraId: string) {
    return this.service.obterPorId(req.tenantId, regraId);
  }

  /**
   * Atualiza uma regra fiscal.
   */
  @Put(':id')
  @Roles('admin', 'gerente')
  @ApiOperation({ summary: 'Atualizar regra fiscal' })
  @ApiResponse({ status: 200, description: 'Regra fiscal atualizada' })
  async atualizar(
    @Req() req: any,
    @Param('id') regraId: string,
    @Body() dto: AtualizarRegraFiscalDto,
  ) {
    return this.service.atualizar(req.tenantId, regraId, dto);
  }

  /**
   * Remove uma regra fiscal.
   */
  @Delete(':id')
  @Roles('admin', 'gerente')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover regra fiscal' })
  async remover(@Req() req: any, @Param('id') regraId: string) {
    await this.service.remover(req.tenantId, regraId);
  }

  /**
   * Sugere classificação fiscal com IA.
   */
  @Post('sugerir-classificacao')
  @ApiOperation({ summary: 'Sugerir classificação fiscal com IA' })
  @ApiResponse({
    status: 200,
    description: 'Sugestões de classificação',
  })
  async sugerirClassificacao(@Req() req: any, @Body() body: { descricaoProduto: string }) {
    return this.service.sugerirClassificacao(req.tenantId, body.descricaoProduto);
  }
}
