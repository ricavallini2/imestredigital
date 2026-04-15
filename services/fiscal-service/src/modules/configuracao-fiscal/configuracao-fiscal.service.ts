/**
 * Configuração Fiscal Service
 * Gerencia configurações fiscais por tenant.
 */

import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { AtualizarConfiguracaoFiscalDto } from '../../dtos/configuracao-fiscal.dto';
import { ConfiguracaoFiscalRepository } from './configuracao-fiscal.repository';
import { AssinaturaService } from '../sefaz/assinatura.service';

@Injectable()
export class ConfiguracaoFiscalService {
  private readonly logger = new Logger('ConfiguracaoFiscalService');

  constructor(
    private readonly repository: ConfiguracaoFiscalRepository,
    private readonly assinatura: AssinaturaService,
  ) {}

  /**
   * Obtém configuração fiscal de um tenant.
   */
  async obterConfiguracao(tenantId: string) {
    try {
      const config = await this.repository.obter(tenantId);
      if (!config) {
        throw new NotFoundException('Configuração fiscal não encontrada');
      }

      // Não retorna certificado no GET
      const { certificadoDigital, senhaCertificado, ...dadosSeguros } = config as any;

      return dadosSeguros;
    } catch (erro) {
      this.logger.error('Erro ao obter configuração:', erro);
      throw erro;
    }
  }

  /**
   * Atualiza configuração fiscal.
   */
  async atualizarConfiguracao(tenantId: string, dados: AtualizarConfiguracaoFiscalDto) {
    try {
      this.logger.log(`Atualizando configuração fiscal do tenant ${tenantId}`);

      const configExistente = await this.repository.obter(tenantId);
      if (!configExistente) {
        // Cria nova configuração
        return await this.repository.criar(tenantId, dados);
      }

      // Atualiza existente
      return await this.repository.atualizar(tenantId, dados);
    } catch (erro) {
      this.logger.error('Erro ao atualizar configuração:', erro);
      throw erro;
    }
  }

  /**
   * Faz upload de certificado digital A1 (.p12 ou .pfx).
   */
  async uploadCertificado(
    tenantId: string,
    certificadoBuffer: Buffer,
    senha: string,
  ) {
    try {
      this.logger.log(`Upload de certificado para tenant ${tenantId}`);

      // Valida o certificado
      const validacao = await this.assinatura.validarCertificado(
        certificadoBuffer,
        senha,
      );

      if (!validacao.valido) {
        throw new BadRequestException(validacao.erro);
      }

      // Armazena certificado criptografado
      await this.repository.armazenarCertificado(
        tenantId,
        certificadoBuffer,
        senha,
        validacao.dataValidade,
      );

      this.logger.log(
        `Certificado armazenado com validade até ${validacao.dataValidade}`,
      );

      return {
        sucesso: true,
        mensagem: 'Certificado armazenado com sucesso',
        validadeCertificado: validacao.dataValidade,
      };
    } catch (erro) {
      this.logger.error('Erro ao fazer upload de certificado:', erro);
      throw erro;
    }
  }

  /**
   * Verifica validade do certificado.
   */
  async verificarValidadeCertificado(tenantId: string) {
    try {
      const config = await this.repository.obter(tenantId);
      if (!config || !config.certificadoDigital) {
        throw new NotFoundException('Certificado não encontrado');
      }

      const agora = new Date();
      const validade = config.validadeCertificado;

      if (!validade) {
        throw new BadRequestException('Data de validade do certificado não registrada');
      }

      const diasRestantes = Math.floor(
        (validade.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24),
      );

      return {
        valido: diasRestantes > 0,
        validadeCertificado: validade,
        diasRestantes,
        mensagem:
          diasRestantes > 0
            ? `Certificado válido por mais ${diasRestantes} dias`
            : 'Certificado expirado',
      };
    } catch (erro) {
      this.logger.error('Erro ao verificar validade do certificado:', erro);
      throw erro;
    }
  }
}
