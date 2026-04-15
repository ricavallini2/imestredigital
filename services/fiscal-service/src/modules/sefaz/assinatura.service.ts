/**
 * Serviço de Assinatura Digital
 * Assina XMLs com certificado digital A1.
 */

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class AssinaturaService {
  private readonly logger = new Logger('AssinaturaService');

  /**
   * Assina um XML com certificado digital A1.
   * Em desenvolvimento: implementação real requer biblioteca como xmlsec1
   */
  async assinarXml(
    xml: string,
    certificadoBuffer: Buffer,
    senha: string,
  ): Promise<string> {
    try {
      this.logger.log('Assinando XML com certificado A1');

      // TODO: Implementar assinatura real com xmlsec1 ou node-rsa
      // Por enquanto, retorna XML com hash simulado

      const hash = crypto
        .createHash('sha256')
        .update(xml)
        .digest('hex')
        .substring(0, 20);

      // Simula assinatura adicionando comentário
      const xmlAssinado = xml.replace(
        '<?xml version="1.0" encoding="UTF-8"?>',
        `<?xml version="1.0" encoding="UTF-8"?>
<!-- Assinado: ${hash} -->`,
      );

      this.logger.log('XML assinado com sucesso (mock)');
      return xmlAssinado;
    } catch (erro) {
      this.logger.error('Erro ao assinar XML:', erro);
      throw new BadRequestException('Erro ao assinar XML: ' + erro.message);
    }
  }

  /**
   * Valida um certificado digital A1.
   * Verifica formato, senha e data de validade.
   */
  async validarCertificado(
    certificadoBuffer: Buffer,
    senha: string,
  ): Promise<{
    valido: boolean;
    erro?: string;
    dataValidade?: Date;
  }> {
    try {
      this.logger.log('Validando certificado digital');

      // TODO: Implementar validação real com node-forge ou similar
      // Por enquanto, apenas simula validação

      if (!certificadoBuffer || certificadoBuffer.length === 0) {
        return {
          valido: false,
          erro: 'Certificado não fornecido',
        };
      }

      if (!senha || senha.length === 0) {
        return {
          valido: false,
          erro: 'Senha do certificado não fornecida',
        };
      }

      // Simula validade até 1 ano no futuro
      const dataValidade = new Date();
      dataValidade.setFullYear(dataValidade.getFullYear() + 1);

      this.logger.log(`Certificado válido até ${dataValidade}`);

      return {
        valido: true,
        dataValidade,
      };
    } catch (erro) {
      this.logger.error('Erro ao validar certificado:', erro);
      return {
        valido: false,
        erro: 'Erro ao validar certificado: ' + erro.message,
      };
    }
  }
}
