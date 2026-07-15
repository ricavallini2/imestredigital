/**
 * WebhookFiscalService — processa gatilhos assíncronos do provedor fiscal.
 *
 * O provedor (Focus NFe) chama a URL pública de webhook a cada mudança de
 * status de um documento. Como esse POST NÃO carrega o nosso JWT, o serviço
 * resolve o tenant a partir da própria nota (pela `ref`, que é o id da
 * NotaFiscal no nosso domínio) antes de aplicar a atualização — mantendo o
 * isolamento multi-tenant mesmo sem contexto de request.
 *
 * A atualização de estado é delegada ao NotaFiscalService
 * (`aplicarResultadoProvedor`), o mesmo caminho usado pela emissão síncrona,
 * para não duplicar regra de transição nem publicação de eventos Kafka.
 */

import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { NotaFiscalService } from '../../nota-fiscal/nota-fiscal.service';
import { WebhookFocusNFeDto } from './webhook-focus-nfe.dto';
import { mapearRespostaFocus } from '../focus-nfe/focus-nfe.mapper';

@Injectable()
export class WebhookFiscalService {
  private readonly logger = new Logger(WebhookFiscalService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notaFiscalService: NotaFiscalService,
  ) {}

  /**
   * Processa um gatilho da Focus NFe. Retorna sempre um resumo (não lança em
   * fluxo normal) para que o endpoint responda 200 rapidamente e o provedor
   * não fique reenviando — falhas de mapeamento são logadas.
   */
  async processarFocusNFe(
    payload: WebhookFocusNFeDto,
  ): Promise<{ processado: boolean; motivo?: string }> {
    const ref = payload.ref;
    if (!ref) {
      this.logger.warn('Webhook Focus NFe sem ref — ignorado');
      return { processado: false, motivo: 'ref ausente no payload' };
    }

    // A `ref` é o id da NotaFiscal. Resolve o tenant sem exigir JWT.
    const nota = await this.prisma.notaFiscal.findUnique({
      where: { id: ref },
      select: { id: true, tenantId: true, status: true },
    });

    if (!nota) {
      this.logger.warn(`Webhook Focus NFe: nota ref=${ref} não encontrada`);
      return { processado: false, motivo: 'nota não encontrada' };
    }

    const resultado = mapearRespostaFocus(
      {
        status: payload.status,
        status_sefaz: payload.status_sefaz,
        mensagem_sefaz: payload.mensagem_sefaz,
        chave_nfe: payload.chave_nfe,
        cnpj_emitente: payload.cnpj_emitente,
        caminho_xml_nota_fiscal: payload.caminho_xml_nota_fiscal,
        caminho_danfe: payload.caminho_danfe,
        caminho_xml_cancelamento: payload.caminho_xml_cancelamento,
        ref,
      },
      ref,
    );

    this.logger.log(
      `Webhook Focus NFe: ref=${ref} tenant=${nota.tenantId} status=${resultado.status}`,
    );

    await this.notaFiscalService.aplicarResultadoProvedor(nota.tenantId, nota.id, resultado);

    return { processado: true };
  }
}
