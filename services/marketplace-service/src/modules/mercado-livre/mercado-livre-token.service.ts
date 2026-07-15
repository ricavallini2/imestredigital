import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ContaMarketplace, StatusConexao } from '../../../generated/client'
import { ContaMarketplaceRepository } from '../conta-marketplace/conta-marketplace.repository'
import { CriptoToken } from '../../common/cripto-token'
import { CRIPTO_TOKEN } from '../cripto/cripto.module'
import { MercadoLivreOAuthService, TokensML } from './mercado-livre-oauth.service'

/** Antecedência mínima para refresh proativo (30 min antes de expirar). */
const MARGEM_REFRESH_MS = 30 * 60 * 1000

/**
 * Gerência do ciclo de vida dos tokens do Mercado Livre por conta.
 *
 * Responsabilidades centrais e CRÍTICAS:
 *
 * 1. Rotação atômica do refresh_token (uso único no ML): a cada refresh, o novo
 *    refresh_token é persistido (criptografado) ANTES de qualquer uso do novo
 *    access token. Se a gravação falhar, não seguimos com o access novo.
 *
 * 2. Lock por conta (contaId): refreshes concorrentes da MESMA conta são
 *    serializados por um mutex em memória (Map de Promises). Sem isso, duas
 *    requisições simultâneas poderiam usar o mesmo refresh_token de uso único —
 *    a segunda invalidaria a primeira e derrubaria a conexão.
 *
 * Observação de escopo: o lock é por processo. Em cluster multi-réplica, um lock
 * distribuído (Redis) seria necessário; aqui, o marketplace-service roda como
 * instância única e o mutex em memória é suficiente e correto para o objetivo.
 */
@Injectable()
export class MercadoLivreTokenService {
  private readonly logger = new Logger(MercadoLivreTokenService.name)

  /** Mutex por conta: contaId → Promise em andamento do refresh. */
  private readonly locks = new Map<string, Promise<string>>()

  constructor(
    private readonly contaRepo: ContaMarketplaceRepository,
    private readonly oauth: MercadoLivreOAuthService,
    @Inject(CRIPTO_TOKEN) private readonly cripto: CriptoToken,
  ) {}

  /**
   * Retorna um access token VÁLIDO para a conta, renovando proativamente se
   * estiver a menos de 30 min de expirar. Descriptografa antes de devolver.
   */
  async obterAccessTokenValido(conta: ContaMarketplace): Promise<string> {
    if (this.precisaRenovar(conta)) {
      this.logger.log(
        `Access token da conta ${conta.id} próximo de expirar — refresh proativo`,
      )
      return this.renovarComLock(conta.id, conta.tenantId)
    }

    const access = this.cripto.descriptografar(conta.accessToken)
    if (!access) {
      // Sem access utilizável em memória — força refresh.
      return this.renovarComLock(conta.id, conta.tenantId)
    }
    return access
  }

  /**
   * Força um refresh (ex.: após 401 do ML) e retorna o novo access token.
   * Sempre passa pelo lock por conta.
   */
  async forcarRefresh(contaId: string, tenantId: string): Promise<string> {
    this.logger.log(`Refresh forçado da conta ${contaId}`)
    return this.renovarComLock(contaId, tenantId)
  }

  /**
   * Indica se o access token deve ser renovado (expira em < 30 min ou já expirou).
   */
  private precisaRenovar(conta: ContaMarketplace): boolean {
    if (!conta.tokenExpiraEm) return true
    return conta.tokenExpiraEm.getTime() - Date.now() <= MARGEM_REFRESH_MS
  }

  /**
   * Serializa o refresh por conta. Se já há um refresh em andamento para a
   * mesma conta, aguarda o mesmo resultado em vez de disparar outro (que
   * queimaria o refresh_token de uso único em paralelo).
   */
  private renovarComLock(contaId: string, tenantId: string): Promise<string> {
    const emAndamento = this.locks.get(contaId)
    if (emAndamento) {
      this.logger.debug(`Refresh já em andamento para conta ${contaId} — reusando`)
      return emAndamento
    }

    const promessa = this.executarRefresh(contaId, tenantId).finally(() => {
      this.locks.delete(contaId)
    })
    this.locks.set(contaId, promessa)
    return promessa
  }

  /**
   * Executa a rotação de tokens de fato:
   * 1. relê a conta (garante refresh_token mais recente sob o lock);
   * 2. descriptografa o refresh_token atual;
   * 3. chama o ML (refresh);
   * 4. criptografa e PERSISTE os novos tokens atomicamente;
   * 5. só então retorna o novo access token.
   */
  private async executarRefresh(contaId: string, tenantId: string): Promise<string> {
    const conta = await this.contaRepo.buscarPorId(contaId, tenantId)
    if (!conta) {
      throw new UnauthorizedException('Conta de marketplace não encontrada para refresh')
    }

    const refreshAtual = this.cripto.descriptografar(conta.refreshToken)
    if (!refreshAtual) {
      await this.marcarErro(contaId, tenantId)
      throw new UnauthorizedException(
        `Conta ${contaId} sem refresh_token — reautenticação manual necessária`,
      )
    }

    let novos: TokensML
    try {
      novos = await this.oauth.renovarTokens(refreshAtual)
    } catch (erro) {
      // Refresh inválido/expirado → conexão quebrada, exige novo OAuth.
      await this.marcarErro(contaId, tenantId)
      throw erro
    }

    // Persiste ANTES de usar o novo access token (rotação atômica).
    await this.persistirNovosTokens(contaId, tenantId, novos)

    this.logger.log(`Tokens da conta ${contaId} rotacionados com sucesso`)
    return novos.accessToken
  }

  /**
   * Criptografa e grava os novos tokens numa única operação atômica.
   */
  private async persistirNovosTokens(
    contaId: string,
    tenantId: string,
    novos: TokensML,
  ): Promise<void> {
    const accessTokenCifrado = this.cripto.criptografar(novos.accessToken)
    const refreshTokenCifrado = this.cripto.criptografar(novos.refreshToken)

    if (!accessTokenCifrado || !refreshTokenCifrado) {
      throw new Error('Falha ao criptografar tokens do Mercado Livre')
    }

    await this.contaRepo.rotacionarTokens(contaId, tenantId, {
      accessTokenCifrado,
      refreshTokenCifrado,
      tokenExpiraEm: novos.expiraEm,
      escopos: novos.scope,
    })
  }

  /**
   * Marca a conta como ERRO quando o refresh falha de forma irrecuperável.
   */
  private async marcarErro(contaId: string, tenantId: string): Promise<void> {
    try {
      await this.contaRepo.atualizarStatus(contaId, tenantId, StatusConexao.ERRO)
    } catch (erro) {
      this.logger.error(
        `Falha ao marcar conta ${contaId} como ERRO: ${(erro as Error).message}`,
      )
    }
  }
}
