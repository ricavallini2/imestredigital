/**
 * Controlador de Recorrências.
 * Endpoints para lançamentos recorrentes.
 */

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { RecorrenciaService } from './recorrencia.service';
import { CriarRecorrenciaDTO } from '../../dtos/recorrencia/criar-recorrencia.dto';

@ApiTags('recorrencias')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/recorrencias')
export class RecorrenciaController {
  constructor(private recorrenciaService: RecorrenciaService) {}

  /**
   * Cria uma nova recorrência.
   */
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Criar nova recorrência' })
  async criar(@Request() req: any, @Body() dto: CriarRecorrenciaDTO) {
    return this.recorrenciaService.criar({
      tenantId: req.tenantId,
      ...dto,
    });
  }

  /**
   * Lista recorrências ativas.
   */
  @Get()
  @ApiOperation({ summary: 'Listar recorrências ativas' })
  async listar(@Request() req: any) {
    return this.recorrenciaService.listar(req.tenantId);
  }

  /**
   * Busca recorrência por ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obter recorrência por ID' })
  async buscarPorId(@Request() req: any, @Param('id') id: string) {
    return this.recorrenciaService.buscarPorId(id, req.tenantId);
  }

  /**
   * Gera lançamentos de recorrências vencidas.
   */
  @Post('gerar')
  @ApiOperation({ summary: 'Gerar lançamentos de recorrências vencidas' })
  async gerarLancamentos(@Request() req: any) {
    return this.recorrenciaService.gerarLancamentosRecorrentes(req.tenantId);
  }

  /**
   * Desativa recorrência.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Desativar recorrência' })
  async desativar(@Request() req: any, @Param('id') id: string) {
    return this.recorrenciaService.desativar(id, req.tenantId);
  }
}
