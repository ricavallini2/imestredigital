import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ContaMarketplace, PlataformaMarketplace } from '../../../generated/client'
import { ContaMarketplaceRepository } from '../conta-marketplace/conta-marketplace.repository'
import { ProdutorEventosService } from '../eventos/produtor-eventos.service'
import { CriptoToken } from '../../common/cripto-token'
import { CRIPTO_TOKEN } from '../cripto/cripto.module'
import { MercadoLivreConfig } from './mercado-livre.config'
import { MercadoLivreOAuthService } from './mercado-livre-oauth.service'
import { gerarState, validarState } from './oauth-state'

/**
 * Serviço da conexão OAuth do Mercado Livre por tenant.
 *
 * Fluxo:
 * 1. `gerarUrlAutorizacao(tenantId)` → URL com state assinado (tenantId+nonce).
 * 2. O seller autoriza no ML e é redirecionado para ML_REDIRECT_URI com ?code&state.
 * 3. `processarCallback(tenantId, code, state)` valida o state, troca o code por
 *    tokens, criptografa e cria/atualiza a ContaMarketplace da plataforma
 *    MERCADO_LIVRE (upsert por user_id do seller).
 */
@Injectable()
export class MercadoLivreContaService {
  private readonly logger = new Logger(MercadoLivreContaService.name)
  private readonly chaveState: string

  constructor(
    private readonly config: MercadoLivreConfig,
    private readonly oauth: MercadoLivreOAuthService,
    private readonly contaRepo: ContaMarketplaceRepository,
    private readonly produtorEventos: ProdutorEventosService,
    @Inject(CRIPTO_TOKEN) private readonly cripto: CriptoToken,
    private readonly configService: ConfigService,
  ) {
    // Chave para assinar o state do OAuth. Reusa MARKETPLACE_CRYPTO_KEY —
    // é apenas HMAC de um valor efêmero, não precisa de chave separada.
    this.chaveState = this.configService.get<string>(
      'MARKETPLACE_CRYPTO_KEY',
      'dev-marketplace-crypto-key',
    )
  }

  /**
   * Gera a URL de autorização do Mercado Livre para o tenant iniciar o OAuth.
   */
  gerarUrlAutorizacao(tenantId: string): { url: string; state: string } {
    if (!this.config.estaConfigurado()) {
      throw new BadRequestException(
        'Integração Mercado Livre não configurada (defina ML_CLIENT_ID/ML_CLIENT_SECRET).',
      )
    }

    const state = gerarState(tenantId, this.chaveState)
    const url = this.oauth.montarUrlAutorizacao(state)
    return { url, state }
  }

  /**
   * Processa o callback do OAuth: valida o state, troca o code por tokens e
   * persiste a conta (tokens criptografados). Retorna a conta (sem expor tokens).
   */
  async processarCallback(
    tenantId: string,
    code: string,
    state: string,
  ): Promise<{ id: string; idExterno: string; status: string }> {
    if (!code) {
      throw new BadRequestException('Parâmetro "code" ausente no callback')
    }

    // Valida o state e confere o vínculo com o tenant autenticado (anti-CSRF).
    const tenantDoState = validarState(state, this.chaveState)
    if (!tenantDoState) {
      throw new UnauthorizedException('State do OAuth inválido ou adulterado')
    }
    if (tenantDoState !== tenantId) {
      throw new UnauthorizedException(
        'State do OAuth não corresponde ao tenant autenticado',
      )
    }

    // Troca o code por tokens no Mercado Livre.
    const tokens = await this.oauth.trocarCodePorTokens(code)

    const accessTokenCifrado = this.cripto.criptografar(tokens.accessToken)
    const refreshTokenCifrado = this.cripto.criptografar(tokens.refreshToken)
    if (!accessTokenCifrado || !refreshTokenCifrado) {
      throw new Error('Falha ao criptografar tokens do Mercado Livre')
    }

    // Upsert por (tenant, plataforma, user_id do seller).
    const existente = await this.contaRepo.buscarPorPlataformaEUserId(
      PlataformaMarketplace.MERCADO_LIVRE,
      tokens.mlUserId,
    )

    let conta: ContaMarketplace
    if (existente && existente.tenantId === tenantId) {
      conta = await this.contaRepo.rotacionarTokens(existente.id, tenantId, {
        accessTokenCifrado,
        refreshTokenCifrado,
        tokenExpiraEm: tokens.expiraEm,
        idExterno: tokens.mlUserId,
        escopos: tokens.scope,
      })
      this.logger.log(
        `Conta Mercado Livre reconectada (tenant ${tenantId}, seller ${tokens.mlUserId})`,
      )
    } else {
      conta = await this.contaRepo.criar({
        tenantId,
        plataforma: PlataformaMarketplace.MERCADO_LIVRE,
        nome: `Mercado Livre - ${tokens.mlUserId}`,
        accessToken: accessTokenCifrado,
        refreshToken: refreshTokenCifrado,
        idExterno: tokens.mlUserId,
        tokenExpiraEm: tokens.expiraEm,
        configuracoes: tokens.scope ? { escopos: tokens.scope } : {},
      })
      this.logger.log(
        `Conta Mercado Livre conectada (tenant ${tenantId}, seller ${tokens.mlUserId})`,
      )
    }

    await this.produtorEventos.contaConectada(tenantId, {
      contaId: conta.id,
      marketplace: PlataformaMarketplace.MERCADO_LIVRE,
      sellerId: conta.idExterno,
    })

    return { id: conta.id, idExterno: conta.idExterno, status: conta.status }
  }
}
