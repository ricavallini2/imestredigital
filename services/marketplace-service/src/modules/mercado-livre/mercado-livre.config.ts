import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/**
 * Configuração da aplicação Mercado Livre (credenciais de app, compartilhadas
 * entre todos os tenants). Lê ML_CLIENT_ID / ML_CLIENT_SECRET / ML_REDIRECT_URI.
 *
 * Os valores são credenciais de APLICAÇÃO (não de seller) — é seguro mantê-los
 * em memória e compartilhá-los entre requisições de tenants diferentes. Cada
 * seller conecta via OAuth (tokens por conta, criptografados no banco).
 */
@Injectable()
export class MercadoLivreConfig {
  private readonly logger = new Logger(MercadoLivreConfig.name)

  /** Base da API REST do Mercado Livre. */
  readonly apiUrl = 'https://api.mercadolibre.com'

  /** Site de autorização (Brasil). O redirect final é o ML_REDIRECT_URI. */
  readonly authUrl = 'https://auth.mercadolivre.com.br'

  /** Endpoint de troca/renovação de tokens (mesmo host da API, não do auth). */
  readonly tokenUrl = 'https://api.mercadolibre.com/oauth/token'

  readonly clientId: string
  readonly clientSecret: string
  readonly redirectUri: string

  constructor(private readonly config: ConfigService) {
    this.clientId = this.config.get<string>('ML_CLIENT_ID', '')
    this.clientSecret = this.config.get<string>('ML_CLIENT_SECRET', '')
    this.redirectUri = this.config.get<string>(
      'ML_REDIRECT_URI',
      'http://localhost:3007/api/v1/contas/mercadolivre/callback',
    )

    if (!this.clientId || !this.clientSecret) {
      this.logger.warn(
        'ML_CLIENT_ID/ML_CLIENT_SECRET ausentes — o fluxo OAuth do Mercado Livre ' +
          'não funcionará até configurá-los no .env.',
      )
    }
  }

  /**
   * Indica se a app tem credenciais mínimas para operar o OAuth.
   */
  estaConfigurado(): boolean {
    return Boolean(this.clientId && this.clientSecret)
  }
}
