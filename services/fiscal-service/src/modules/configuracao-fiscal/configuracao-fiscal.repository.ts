/**
 * Repositório de Configuração Fiscal
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarConfiguracaoFiscalDto } from '../../dtos/configuracao-fiscal.dto';

@Injectable()
export class ConfiguracaoFiscalRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtém configuração fiscal de um tenant.
   */
  async obter(tenantId: string) {
    return this.prisma.configuracaoFiscal.findUnique({
      where: { tenantId },
    });
  }

  /**
   * Cria configuração fiscal inicial.
   */
  async criar(tenantId: string, dados: AtualizarConfiguracaoFiscalDto) {
    return this.prisma.configuracaoFiscal.create({
      data: {
        tenantId,
        ...dados,
      },
    });
  }

  /**
   * Atualiza configuração fiscal.
   */
  async atualizar(tenantId: string, dados: AtualizarConfiguracaoFiscalDto) {
    return this.prisma.configuracaoFiscal.update({
      where: { tenantId },
      data: dados,
    });
  }

  /**
   * Armazena certificado digital (criptografado).
   */
  async armazenarCertificado(
    tenantId: string,
    certificadoBuffer: Buffer,
    senha: string,
    dataValidade: Date,
  ) {
    return this.prisma.configuracaoFiscal.update({
      where: { tenantId },
      data: {
        certificadoDigital: certificadoBuffer,
        senhaCertificado: senha, // TODO: Criptografar
        validadeCertificado: dataValidade,
      },
    });
  }

  /**
   * Obtém certificado (desencriptado).
   */
  async obterCertificado(tenantId: string) {
    const config = await this.obter(tenantId);
    if (!config || !config.certificadoDigital) {
      return null;
    }

    return {
      buffer: config.certificadoDigital,
      senha: config.senhaCertificado,
      validade: config.validadeCertificado,
    };
  }
}
