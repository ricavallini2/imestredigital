import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import axios from 'axios'
import { MercadoLivreConfig } from './mercado-livre.config'

/**
 * Resposta padrão do endpoint de token do Mercado Livre.
 * Documentado em docs/pesquisa/mercado-livre-api.md (seção 1.1).
 */
export interface RespostaTokenML {
  access_token: string
  token_type: string
  expires_in: number // segundos (6h = 21600)
  scope?: string
  user_id: number
  refresh_token: string
}

/**
 * Tokens normalizados para persistência interna.
 */
export interface TokensML {
  accessToken: string
  refreshToken: string
  expiresIn: number
  /** Momento absoluto de expiração do access token. */
  expiraEm: Date
  scope?: string
  /** user_id do seller no Mercado Livre (vira idExterno da ContaMarketplace). */
  mlUserId: string
}

/**
 * Serviço de OAuth do Mercado Livre — chamadas de baixo nível ao endpoint
 * de token (troca de code e refresh).
 *
 * NÃO lida com persistência, criptografia ou lock — apenas fala com o ML e
 * normaliza a resposta. A orquestração (rotação atômica, lock por conta) fica
 * no ContaMarketplaceService, conforme a regra de refresh_token de USO ÚNICO.
 */
@Injectable()
export class MercadoLivreOAuthService {
  private readonly logger = new Logger(MercadoLivreOAuthService.name)
  /** Timeout curto: o endpoint de token deve responder rápido. */
  private readonly timeoutMs = 10_000

  constructor(private readonly config: MercadoLivreConfig) {}

  /**
   * Monta a URL de autorização OAuth2 (Authorization Code Grant).
   *
   * @param state Estado opaco anti-CSRF (deve conter tenantId + nonce e ser
   *              validável no callback).
   */
  montarUrlAutorizacao(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      state,
    })
    return `${this.config.authUrl}/authorization?${params.toString()}`
  }

  /**
   * Troca o `code` recebido no callback por access/refresh tokens.
   */
  async trocarCodePorTokens(code: string): Promise<TokensML> {
    this.logger.log('Trocando authorization code por tokens no Mercado Livre')

    const corpo = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      code,
      redirect_uri: this.config.redirectUri,
    })

    return this.requisitarToken(corpo, 'troca de code')
  }

  /**
   * Renova os tokens usando o refresh_token atual.
   *
   * ATENÇÃO: o refresh_token do ML é de USO ÚNICO — a resposta traz um NOVO
   * refresh_token que INVALIDA o anterior. Quem chama DEVE persistir o novo
   * refresh_token atomicamente. Este método apenas executa a chamada.
   */
  async renovarTokens(refreshToken: string): Promise<TokensML> {
    this.logger.log('Renovando tokens do Mercado Livre (refresh_token)')

    const corpo = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: refreshToken,
    })

    return this.requisitarToken(corpo, 'refresh de token')
  }

  /**
   * Executa a chamada ao endpoint de token e normaliza a resposta/erros.
   */
  private async requisitarToken(
    corpo: URLSearchParams,
    contexto: string,
  ): Promise<TokensML> {
    try {
      const { data } = await axios.post<RespostaTokenML>(
        this.config.tokenUrl,
        corpo.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          timeout: this.timeoutMs,
        },
      )

      return this.normalizar(data)
    } catch (erro) {
      const status =
        axios.isAxiosError(erro) && erro.response ? erro.response.status : undefined
      const detalhe =
        axios.isAxiosError(erro) && erro.response
          ? JSON.stringify(erro.response.data)
          : (erro as Error).message

      this.logger.error(`Falha na ${contexto} (status ${status ?? '?'}): ${detalhe}`)

      // 400/401 no fluxo OAuth = code/refresh inválido ou expirado.
      if (status === 400 || status === 401) {
        throw new UnauthorizedException(
          `Autorização do Mercado Livre inválida ou expirada (${contexto}).`,
        )
      }
      throw erro
    }
  }

  /**
   * Converte a resposta bruta do ML para o formato interno.
   */
  private normalizar(data: RespostaTokenML): TokensML {
    const expiresIn = data.expires_in ?? 21_600
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn,
      expiraEm: new Date(Date.now() + expiresIn * 1000),
      scope: data.scope,
      mlUserId: String(data.user_id),
    }
  }
}
