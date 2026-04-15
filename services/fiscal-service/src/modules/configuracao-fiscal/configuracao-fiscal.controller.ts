/**
 * Configuração Fiscal Controller
 */

import {
  Controller,
  Get,
  Put,
  Post,
  Req,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { ConfiguracaoFiscalService } from './configuracao-fiscal.service';
import { AtualizarConfiguracaoFiscalDto } from '../../dtos/configuracao-fiscal.dto';

@ApiTags('configuracao-fiscal')
@ApiBearerAuth()
@Controller('v1/configuracao-fiscal')
export class ConfiguracaoFiscalController {
  constructor(private readonly service: ConfiguracaoFiscalService) {}

  /**
   * Obtém configuração fiscal do tenant.
   */
  @Get()
  @ApiOperation({ summary: 'Obter configuração fiscal' })
  async obter(@Req() req: any) {
    return this.service.obterConfiguracao(req.tenantId);
  }

  /**
   * Atualiza configuração fiscal.
   */
  @Put()
  @ApiOperation({ summary: 'Atualizar configuração fiscal' })
  async atualizar(@Req() req: any, @Body() dto: AtualizarConfiguracaoFiscalDto) {
    return this.service.atualizarConfiguracao(req.tenantId, dto);
  }

  /**
   * Faz upload de certificado digital.
   */
  @Post('certificado')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('certificado'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Fazer upload de certificado digital' })
  async uploadCertificado(
    @Req() req: any,
    @UploadedFile() arquivo: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!arquivo) {
      throw new Error('Arquivo de certificado é obrigatório');
    }

    const senha = body.senha;
    if (!senha) {
      throw new Error('Senha do certificado é obrigatória');
    }

    return this.service.uploadCertificado(
      req.tenantId,
      arquivo.buffer,
      senha,
    );
  }

  /**
   * Verifica validade do certificado.
   */
  @Get('certificado/validar')
  @ApiOperation({ summary: 'Verificar validade do certificado' })
  async validarCertificado(@Req() req: any) {
    return this.service.verificarValidadeCertificado(req.tenantId);
  }
}
