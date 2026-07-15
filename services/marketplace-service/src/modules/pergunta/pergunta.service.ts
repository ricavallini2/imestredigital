import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PerguntaRepository } from './pergunta.repository';
import { ContaMarketplaceRepository } from '../conta-marketplace/conta-marketplace.repository';
import { IntegracaoFactory } from '../integracao/integracao.factory';
import { ProdutorEventosService } from '../eventos/produtor-eventos.service';
import { StatusPerguntaMarketplace, Prisma } from '../../../generated/client';

/**
 * Serviço de gerenciamento de perguntas do marketplace
 */
@Injectable()
export class PerguntaService {
  private readonly logger = new Logger(PerguntaService.name);

  constructor(
    private readonly repository: PerguntaRepository,
    private readonly contaRepository: ContaMarketplaceRepository,
    private readonly integracaoFactory: IntegracaoFactory,
    private readonly produtorEventos: ProdutorEventosService,
  ) {}

  /**
   * Importa perguntas do marketplace
   */
  async importarPerguntas(tenantId: string, contaId: string) {
    try {
      this.logger.log(`Importando perguntas para conta ${contaId}`);

      const conta = await this.contaRepository.buscarPorId(contaId, tenantId);
      if (!conta) throw new NotFoundException('Conta não encontrada');

      const adapter = this.integracaoFactory.criar(conta.plataforma);
      const perguntasExternas = await adapter.listarPerguntas();

      let importadas = 0;
      for (const perguntaExterna of perguntasExternas) {
        // Deduplicação pelo id externo, dentro do tenant.
        const perguntaExistente = await this.repository.buscarPorIdExterno(
          tenantId,
          perguntaExterna.id,
        );

        if (!perguntaExistente) {
          await this.repository.criar({
            tenantId,
            contaMarketplaceId: contaId,
            anuncioId: perguntaExterna.anuncioId,
            idExterno: perguntaExterna.id,
            pergunta: perguntaExterna.pergunta,
            status: StatusPerguntaMarketplace.PENDENTE,
            compradorNome: perguntaExterna.compradorNome,
            dataEnvio: perguntaExterna.dataEnvio,
          });

          await this.produtorEventos.perguntaRecebida(tenantId, {
            perguntaId: perguntaExterna.id,
            marketplace: conta.plataforma,
            pergunta: perguntaExterna.pergunta,
            compradorNome: perguntaExterna.compradorNome,
          });

          importadas++;
        }
      }

      return { importadas };
    } catch (erro) {
      this.logger.error(`Erro ao importar perguntas: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Responde pergunta
   */
  async responder(tenantId: string, perguntaId: string, resposta: string) {
    try {
      const pergunta = await this.repository.buscarPorId(perguntaId, tenantId);
      if (!pergunta) throw new NotFoundException('Pergunta não encontrada');

      const conta = await this.contaRepository.buscarPorId(
        pergunta.contaMarketplaceId,
        tenantId,
      );
      if (!conta) throw new NotFoundException('Conta não encontrada');

      const adapter = this.integracaoFactory.criar(conta.plataforma);
      await adapter.responderPergunta(pergunta.idExterno, resposta);

      return this.repository.atualizar(perguntaId, tenantId, {
        resposta,
        status: StatusPerguntaMarketplace.RESPONDIDA,
        dataResposta: new Date(),
      });
    } catch (erro) {
      this.logger.error(`Erro ao responder pergunta: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Lista perguntas pendentes
   */
  async listarPendentes(tenantId: string) {
    return this.repository.listarPendentes(tenantId);
  }

  /**
   * Conta perguntas pendentes
   */
  async contarPendentes(tenantId: string): Promise<number> {
    return this.repository.contarPendentes(tenantId);
  }

  /**
   * Sugere resposta com IA (placeholder — integração real na Fase 3)
   */
  async sugerirRespostaIA(perguntaId: string): Promise<{ sugestao: string }> {
    this.logger.warn(
      `Sugestão de resposta com IA ainda não implementada (pergunta ${perguntaId})`,
    );
    return { sugestao: 'Resposta padrão - integração com IA pendente' };
  }

  /**
   * Lista perguntas do tenant (filtros opcionais por anúncio/id).
   */
  async listar(
    tenantId: string,
    filtros?: { anuncioId?: string; id?: string },
  ) {
    const where: Prisma.PerguntaMarketplaceWhereInput = {};
    if (filtros?.anuncioId) where.anuncioId = filtros.anuncioId;
    if (filtros?.id) where.id = filtros.id;
    return this.repository.listar(tenantId, where);
  }
}
