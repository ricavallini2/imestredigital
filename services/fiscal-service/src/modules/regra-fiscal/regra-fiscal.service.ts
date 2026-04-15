/**
 * Regra Fiscal Service
 * Gerencia regras de classificação fiscal (NCM, CFOP, impostos).
 */

import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { CriarRegraFiscalDto, AtualizarRegraFiscalDto } from '../../dtos/regra-fiscal.dto';
import { RegraFiscalRepository } from './regra-fiscal.repository';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class RegraFiscalService {
  private readonly logger = new Logger('RegraFiscalService');

  constructor(
    private readonly repository: RegraFiscalRepository,
    private readonly cache: CacheService,
  ) {}

  /**
   * Cria uma regra fiscal.
   */
  async criarRegra(tenantId: string, dados: CriarRegraFiscalDto) {
    try {
      this.logger.log(`Criando regra fiscal NCM ${dados.ncm} para tenant ${tenantId}`);

      // Valida NCM (8 dígitos)
      if (!dados.ncm || dados.ncm.length !== 8 || !/^\d+$/.test(dados.ncm)) {
        throw new BadRequestException('NCM deve ter exatamente 8 dígitos');
      }

      const regra = await this.repository.criar(tenantId, dados);

      // Limpa cache de regras
      await this.cache.remover(`regra:${tenantId}:${dados.ncm}`);

      return regra;
    } catch (erro) {
      this.logger.error('Erro ao criar regra fiscal:', erro);
      throw erro;
    }
  }

  /**
   * Obtém uma regra fiscal por ID.
   */
  async obterPorId(tenantId: string, regraId: string) {
    try {
      const regra = await this.repository.obterPorId(tenantId, regraId);
      if (!regra) {
        throw new NotFoundException('Regra fiscal não encontrada');
      }

      return regra;
    } catch (erro) {
      this.logger.error('Erro ao obter regra fiscal:', erro);
      throw erro;
    }
  }

  /**
   * Lista regras fiscais.
   */
  async listar(tenantId: string, pagina: number = 1, limite: number = 20) {
    try {
      return await this.repository.listar(tenantId, pagina, limite);
    } catch (erro) {
      this.logger.error('Erro ao listar regras fiscais:', erro);
      throw erro;
    }
  }

  /**
   * Atualiza uma regra fiscal.
   */
  async atualizar(
    tenantId: string,
    regraId: string,
    dados: AtualizarRegraFiscalDto,
  ) {
    try {
      this.logger.log(`Atualizando regra fiscal ${regraId}`);

      const regraExistente = await this.repository.obterPorId(tenantId, regraId);
      if (!regraExistente) {
        throw new NotFoundException('Regra fiscal não encontrada');
      }

      const regra = await this.repository.atualizar(tenantId, regraId, dados);

      // Limpa cache
      await this.cache.remover(`regra:${tenantId}:${regraExistente.ncm}`);
      await this.cache.remover(`regra:${tenantId}:${dados.ncm}`);

      return regra;
    } catch (erro) {
      this.logger.error('Erro ao atualizar regra fiscal:', erro);
      throw erro;
    }
  }

  /**
   * Remove uma regra fiscal.
   */
  async remover(tenantId: string, regraId: string) {
    try {
      this.logger.log(`Removendo regra fiscal ${regraId}`);

      const regraExistente = await this.repository.obterPorId(tenantId, regraId);
      if (!regraExistente) {
        throw new NotFoundException('Regra fiscal não encontrada');
      }

      const regra = await this.repository.remover(tenantId, regraId);

      // Limpa cache
      await this.cache.remover(`regra:${tenantId}:${regraExistente.ncm}`);

      return regra;
    } catch (erro) {
      this.logger.error('Erro ao remover regra fiscal:', erro);
      throw erro;
    }
  }

  /**
   * Busca a regra fiscal aplicável (com cache).
   */
  async buscarRegraAplicavel(
    tenantId: string,
    ncm: string,
    ufOrigem?: string,
    ufDestino?: string,
    regimeTributario?: string,
  ) {
    try {
      const cacheKey = `regra:${tenantId}:${ncm}:${ufOrigem}:${ufDestino}:${regimeTributario}`;
      const cached = await this.cache.obter(cacheKey);
      if (cached) {
        return cached;
      }

      const regra = await this.repository.buscarRegraAplicavel(
        tenantId,
        ncm,
        ufOrigem,
        ufDestino,
        regimeTributario,
      );

      if (regra) {
        // Cache por 24 horas
        await this.cache.armazenar(cacheKey, regra, 86400);
      }

      return regra;
    } catch (erro) {
      this.logger.error('Erro ao buscar regra aplicável:', erro);
      throw erro;
    }
  }

  /**
   * Sugere classificação fiscal com IA (integração futura).
   * Por enquanto, retorna sugestão mock.
   */
  async sugerirClassificacao(tenantId: string, descricaoProduto: string) {
    try {
      this.logger.log(
        `Sugerindo classificação para: "${descricaoProduto}"`,
      );

      // TODO: Integrar com AI Engine para sugerir NCM/CFOP
      // Por enquanto, retorna sugestão mock

      return {
        descricao: descricaoProduto,
        sugestoes: [
          {
            ncm: '12345678',
            cfop: '5102',
            confianca: 0.85,
            descricao: 'Sugestão de classificação (mock)',
          },
        ],
        mensagem:
          'Classificação com IA em desenvolvimento. Use a sugestão acima como referência.',
      };
    } catch (erro) {
      this.logger.error('Erro ao sugerir classificação:', erro);
      throw erro;
    }
  }
}
