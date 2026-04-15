/**
 * Controller do SPED (Sistema Público de Escrituração Digital).
 * Endpoints para geração de arquivos SPED Fiscal e Contribuições.
 */

import { Controller, Post, Body, Req, Res, Logger, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { SpedService } from './sped.service';
import { GerarSpedDto } from '../../dtos/gerar-sped.dto';

@ApiTags('SPED')
@ApiBearerAuth()
@Controller('sped')
export class SpedController {
  private readonly logger = new Logger('SpedController');

  constructor(private readonly spedService: SpedService) {}

  /**
   * Gera arquivo SPED Fiscal (EFD ICMS/IPI) para um período.
   * Retorna o arquivo TXT para download.
   */
  @Post('fiscal')
  @ApiOperation({ summary: 'Gerar SPED Fiscal (ICMS/IPI)' })
  @ApiResponse({ status: 200, description: 'Arquivo SPED Fiscal gerado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou configuração fiscal ausente' })
  async gerarSpedFiscal(
    @Req() req: any,
    @Body() dados: GerarSpedDto,
    @Res() res: Response,
  ) {
    try {
      const tenantId = req.tenantId;
      this.logger.log(`Gerando SPED Fiscal - Tenant: ${tenantId}, Período: ${dados.mes}/${dados.ano}`);

      const resultado = await this.spedService.gerarSpedFiscal(tenantId, {
        mes: dados.mes,
        ano: dados.ano,
      });

      // Retorna como arquivo TXT para download
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${resultado.nomeArquivo}"`);
      res.setHeader('X-Total-Registros', resultado.totalRegistros.toString());
      res.setHeader('X-Hash-Arquivo', resultado.hash);

      return res.status(HttpStatus.OK).send(resultado.conteudo);
    } catch (erro) {
      this.logger.error('Erro ao gerar SPED Fiscal:', erro);
      return res.status(HttpStatus.BAD_REQUEST).json({
        mensagem: erro.message,
      });
    }
  }

  /**
   * Gera arquivo SPED Contribuições (EFD PIS/COFINS) para um período.
   * Retorna o arquivo TXT para download.
   */
  @Post('contribuicoes')
  @ApiOperation({ summary: 'Gerar SPED Contribuições (PIS/COFINS)' })
  @ApiResponse({ status: 200, description: 'Arquivo SPED Contribuições gerado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou configuração fiscal ausente' })
  async gerarSpedContribuicoes(
    @Req() req: any,
    @Body() dados: GerarSpedDto,
    @Res() res: Response,
  ) {
    try {
      const tenantId = req.tenantId;
      this.logger.log(`Gerando SPED Contribuições - Tenant: ${tenantId}, Período: ${dados.mes}/${dados.ano}`);

      const resultado = await this.spedService.gerarSpedContribuicoes(tenantId, {
        mes: dados.mes,
        ano: dados.ano,
      });

      // Retorna como arquivo TXT para download
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${resultado.nomeArquivo}"`);
      res.setHeader('X-Total-Registros', resultado.totalRegistros.toString());
      res.setHeader('X-Hash-Arquivo', resultado.hash);

      return res.status(HttpStatus.OK).send(resultado.conteudo);
    } catch (erro) {
      this.logger.error('Erro ao gerar SPED Contribuições:', erro);
      return res.status(HttpStatus.BAD_REQUEST).json({
        mensagem: erro.message,
      });
    }
  }

  /**
   * Gera SPED Fiscal e retorna como JSON (sem download).
   * Útil para pré-visualização no frontend.
   */
  @Post('fiscal/preview')
  @ApiOperation({ summary: 'Pré-visualizar SPED Fiscal (retorna JSON)' })
  @ApiResponse({ status: 200, description: 'Preview do SPED Fiscal gerado' })
  async previewSpedFiscal(@Req() req: any, @Body() dados: GerarSpedDto) {
    const tenantId = req.tenantId;

    const resultado = await this.spedService.gerarSpedFiscal(tenantId, {
      mes: dados.mes,
      ano: dados.ano,
    });

    return {
      nomeArquivo: resultado.nomeArquivo,
      totalRegistros: resultado.totalRegistros,
      periodo: resultado.periodo,
      hash: resultado.hash,
      linhas: resultado.conteudo.split('\r\n').length,
    };
  }

  /**
   * Gera SPED Contribuições e retorna como JSON (sem download).
   * Útil para pré-visualização no frontend.
   */
  @Post('contribuicoes/preview')
  @ApiOperation({ summary: 'Pré-visualizar SPED Contribuições (retorna JSON)' })
  @ApiResponse({ status: 200, description: 'Preview do SPED Contribuições gerado' })
  async previewSpedContribuicoes(@Req() req: any, @Body() dados: GerarSpedDto) {
    const tenantId = req.tenantId;

    const resultado = await this.spedService.gerarSpedContribuicoes(tenantId, {
      mes: dados.mes,
      ano: dados.ano,
    });

    return {
      nomeArquivo: resultado.nomeArquivo,
      totalRegistros: resultado.totalRegistros,
      periodo: resultado.periodo,
      hash: resultado.hash,
      linhas: resultado.conteudo.split('\r\n').length,
    };
  }
}
