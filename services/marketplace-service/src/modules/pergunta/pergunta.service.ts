import { Injectable, Logger } from '@nestjs/common';
import { PerguntaRepository } from './pergunta.repository';
import { ContaMarketplaceRepository } from '../conta-marketplace/conta-marketplace.repository';
import { IntegracaoFactory } from '../integracao/integracao.factory';
import { ProdutorEventosService } from '../eventos/produtor-eventos.service';

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
      if (!conta) throw new Error('Conta não encontrada');

      const adapter = this.integracaoFactory.criar(conta.marketplace);
      const perguntasExternas = await adapter.listarPerguntas();

      let importadas = 0;
      for (const perguntaExterna of perguntasExternas) {
        const perguntaExistente = await this.repository.buscarPorId(
          perguntaExterna.id,
          tenantId,
        );

        if (!perguntaExistente) {
          await this.repository.criar({
            tenantId,
            contaMarketplaceId: contaId,
            anuncioId: perguntaExterna.anuncioId,
            marketplacePerguntaId: perguntaExterna.id,
            pergunta: perguntaExterna.pergunta,
            status: 'PENDENTE',
            compradorNome: perguntaExterna.compradorNome,
            dataEnvio: perguntaExterna.dataEnvio,
          });

          await this.produtorEventos.perguntaRecebida(tenantId, {
            perguntaId: perguntaExterna.id,
            marketplace: conta.marketplace,
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
      if (!pergunta) throw new Error('Pergunta não encontrada');

      const conta = await this.contaRepository.buscarPorId(
        pergunta.contaMarketplaceId,
        tenantId,
      );

      const adapter = this.integracaoFactory.criar(conta.marketplace);
      await adapter.responderPergunta(pergunta.marketplacePerguntaId, resposta);

      return this.repository.atualizar(perguntaId, {
        resposta,
        status: 'RESPONDIDA',
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
   * Sugere resposta com IA (placeholder)
   */
  async sugerirRespostaIA(pergunta: string): Promise<string> {
    // TODO: Integrar com serviço de IA
    this.logger.warn('Sugestão de resposta com IA ainda não implementada');
    return 'Resposta padrão - integração com IA pendente';
  }

  /**
   * Lista perguntas
   */
  async listar(tenantId: string, filtros?: any) {
    return this.repository.listar(tenantId, filtros);
  }
}
