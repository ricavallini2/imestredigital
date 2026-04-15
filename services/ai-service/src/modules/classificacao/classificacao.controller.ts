/**
 * Controller de Classificação Fiscal
 *
 * Rotas:
 * - POST   /classificacao/ncm
 * - POST   /classificacao/cfop
 * - POST   /classificacao/produto/:id
 * - GET    /classificacao/validar-ncm/:ncm
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ClassificacaoService } from './classificacao.service';

@ApiTags('Classificação')
@ApiBearerAuth()
@Controller('classificacao')
export class ClassificacaoController {
  constructor(private service: ClassificacaoService) {}

  /**
   * Sugere NCM para um produto
   */
  @Post('ncm')
  @ApiOperation({
    summary: 'Sugerir NCM',
    description: 'Sugere Nomenclatura Comum do Mercosul baseado na descrição',
  })
  @ApiResponse({
    status: 200,
    description: 'NCM sugerido',
    schema: {
      example: {
        ncm: '84729000',
        descricao: 'Peças e acessórios de máquinas',
        confianca: 0.9,
        aliquotas: {
          icms: 'Variável',
          pis: '1.65%',
          cofins: '7.6%',
        },
        observacoes: 'Consulte seu contador para confirmação definitiva',
      },
    },
  })
  async sugerirNcm(
    @Request() req,
    @Body() dados: { descricao: string; categoria?: string },
  ) {
    return this.service.sugerirNcm(
      req.tenantId,
      dados.descricao,
      dados.categoria,
    );
  }

  /**
   * Sugere CFOP para uma operação
   */
  @Post('cfop')
  @ApiOperation({
    summary: 'Sugerir CFOP',
    description: 'Sugere Código Fiscal de Operação baseado na operação',
  })
  @ApiResponse({
    status: 200,
    description: 'CFOP sugerido',
  })
  async sugerirCfop(
    @Request() req,
    @Body()
    dados: {
      operacao: 'VENDA_INTERNA' | 'VENDA_ESTADUAL' | 'VENDA_EXPORTACAO';
      ufOrigem: string;
      ufDestino: string;
    },
  ) {
    return this.service.sugerirCfop(
      req.tenantId,
      dados.operacao,
      dados.ufOrigem,
      dados.ufDestino,
    );
  }

  /**
   * Classifica um produto completamente
   */
  @Post('produto/:id')
  @ApiOperation({
    summary: 'Classificar produto',
    description: 'Classifica um produto (NCM e CFOP)',
  })
  @ApiResponse({
    status: 200,
    description: 'Produto classificado',
  })
  async classificarProduto(
    @Request() req,
    @Param('id') produtoId: string,
    @Body() dados: { descricao: string; categoria?: string },
  ) {
    return this.service.classificarProduto(req.tenantId, produtoId, dados);
  }

  /**
   * Valida um NCM
   */
  @Get('validar-ncm/:ncm')
  @ApiOperation({
    summary: 'Validar NCM',
    description: 'Verifica se um NCM é válido na tabela TIPI',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado da validação',
  })
  async validarNcm(@Param('ncm') ncm: string) {
    return this.service.validarNcm(ncm);
  }
}
