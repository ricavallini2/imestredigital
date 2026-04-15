/**
 * Controller de Previsão
 *
 * Rotas:
 * - POST   /previsao/demanda
 * - POST   /previsao/categoria
 * - POST   /previsao/ponto-reposicao
 * - GET    /previsao
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { PrevisaoService } from './previsao.service';

@ApiTags('Previsão')
@ApiBearerAuth()
@Controller('previsao')
export class PrevisaoController {
  constructor(private service: PrevisaoService) {}

  /**
   * Prevê demanda de um produto
   */
  @Post('demanda')
  @ApiOperation({
    summary: 'Prever demanda de produto',
    description: 'Calcula previsão de demanda baseada em histórico de vendas',
  })
  @ApiResponse({
    status: 200,
    description: 'Previsão calculada',
    schema: {
      example: {
        quantidadePrevista: 250,
        confianca: 0.85,
        tendencia: 'ALTA',
        metodo: 'COMBINADA',
        notas: 'Previsão baseada em 90 dias de histórico',
      },
    },
  })
  async preverDemanda(
    @Request() req,
    @Body() dados: { produtoId: string; diasFuturos?: number },
  ) {
    return this.service.preverDemanda(
      req.tenantId,
      dados.produtoId,
      dados.diasFuturos || 30,
    );
  }

  /**
   * Prevê demanda por categoria
   */
  @Post('categoria')
  @ApiOperation({
    summary: 'Prever demanda de categoria',
    description:
      'Calcula previsão agregada para uma categoria de produtos',
  })
  @ApiResponse({
    status: 200,
    description: 'Previsão de categoria',
  })
  async preverCategoria(
    @Request() req,
    @Body() dados: { categoriaId: string; diasFuturos?: number },
  ) {
    return this.service.preverDemandaCategoria(
      req.tenantId,
      dados.categoriaId,
      dados.diasFuturos || 30,
    );
  }

  /**
   * Calcula ponto de reposição (quando reabastecer)
   */
  @Post('ponto-reposicao')
  @ApiOperation({
    summary: 'Calcular ponto de reposição',
    description:
      'Determina quando e quanto reabastecer um produto',
  })
  @ApiResponse({
    status: 200,
    description: 'Ponto de reposição calculado',
    schema: {
      example: {
        pontoReposicao: 95,
        estoqueSugerido: 395,
        leadTimeDias: 7,
        demandaMedia: 10,
        estoqueSeguranca: 15,
      },
    },
  })
  async calcularPontoReposicao(
    @Request() req,
    @Body() dados: { produtoId: string },
  ) {
    return this.service.calcularPontoReposicao(
      req.tenantId,
      dados.produtoId,
    );
  }

  /**
   * Lista previsões
   */
  @Get()
  @ApiOperation({
    summary: 'Listar previsões',
    description: 'Retorna previsões geradas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de previsões',
  })
  async listar(
    @Request() req,
    @Query('produtoId') produtoId?: string,
    @Query('pagina') pagina: number = 0,
    @Query('limite') limite: number = 20,
  ) {
    return this.service.listarPrevisoes(req.tenantId, {
      produtoId,
      limite,
      offset: pagina * limite,
    });
  }
}
