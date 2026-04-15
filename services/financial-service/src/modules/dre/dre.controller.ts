/**
 * Controlador de DRE.
 * Endpoints para geração de relatórios.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { DreService } from './dre.service';
import { GerarDreDTO } from '../../dtos/dre/gerar-dre.dto';

@ApiTags('dre')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/dre')
export class DreController {
  constructor(private dreService: DreService) {}

  /**
   * Gera DRE para um período.
   */
  @Post('gerar')
  @ApiOperation({ summary: 'Gerar DRE para um período' })
  async gerar(@Request() req: any, @Body() dto: GerarDreDTO) {
    return this.dreService.gerarDre(
      req.tenantId,
      dto.mes,
      dto.ano,
    );
  }

  /**
   * Lista DREs geradas.
   */
  @Get()
  @ApiOperation({ summary: 'Listar DREs geradas' })
  async listar(
    @Request() req: any,
    @Query('ano') ano?: string,
  ) {
    return this.dreService.listarDres(
      req.tenantId,
      ano ? parseInt(ano) : undefined,
    );
  }

  /**
   * Compara dois períodos.
   */
  @Post('comparar')
  @ApiOperation({ summary: 'Comparar DRE de dois períodos' })
  async comparar(
    @Request() req: any,
    @Body() dto: {
      ano1: number;
      mes1: number;
      ano2: number;
      mes2: number;
    },
  ) {
    return this.dreService.compararPeriodos(
      req.tenantId,
      dto.ano1,
      dto.mes1,
      dto.ano2,
      dto.mes2,
    );
  }
}
