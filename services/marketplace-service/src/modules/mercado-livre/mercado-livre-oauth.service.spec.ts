import { UnauthorizedException } from '@nestjs/common'
import axios from 'axios'
import { MercadoLivreOAuthService } from './mercado-livre-oauth.service'
import { MercadoLivreConfig } from './mercado-livre.config'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

/** Config fake com credenciais previsíveis. */
function criarConfig(): MercadoLivreConfig {
  return {
    apiUrl: 'https://api.mercadolibre.com',
    authUrl: 'https://auth.mercadolivre.com.br',
    tokenUrl: 'https://api.mercadolibre.com/oauth/token',
    clientId: 'APP-ID',
    clientSecret: 'APP-SECRET',
    redirectUri: 'https://app.local/callback',
    estaConfigurado: () => true,
  } as MercadoLivreConfig
}

describe('MercadoLivreOAuthService', () => {
  let service: MercadoLivreOAuthService

  beforeEach(() => {
    jest.clearAllMocks()
    // isAxiosError é usado no tratamento de erro — preserva comportamento real.
    axiosMock.isAxiosError.mockImplementation(
      (payload: unknown): payload is import('axios').AxiosError =>
        Boolean((payload as { isAxiosError?: boolean })?.isAxiosError),
    )
    service = new MercadoLivreOAuthService(criarConfig())
  })

  it('montarUrlAutorizacao inclui client_id, redirect_uri e state', () => {
    const url = service.montarUrlAutorizacao('meu-state')
    expect(url).toContain('https://auth.mercadolivre.com.br/authorization?')
    expect(url).toContain('response_type=code')
    expect(url).toContain('client_id=APP-ID')
    expect(url).toContain('redirect_uri=https%3A%2F%2Fapp.local%2Fcallback')
    expect(url).toContain('state=meu-state')
  })

  it('trocarCodePorTokens: envia grant_type=authorization_code e normaliza a resposta', async () => {
    axiosMock.post.mockResolvedValueOnce({
      data: {
        access_token: 'APP_USR-access-1',
        token_type: 'bearer',
        expires_in: 21600,
        scope: 'offline_access read write',
        user_id: 123456,
        refresh_token: 'TG-refresh-1',
      },
    })

    const tokens = await service.trocarCodePorTokens('CODE-XYZ')

    expect(axiosMock.post).toHaveBeenCalledTimes(1)
    const [url, corpo, cfg] = axiosMock.post.mock.calls[0]
    expect(url).toBe('https://api.mercadolibre.com/oauth/token')
    expect(String(corpo)).toContain('grant_type=authorization_code')
    expect(String(corpo)).toContain('code=CODE-XYZ')
    expect(cfg?.headers?.['Content-Type']).toBe('application/x-www-form-urlencoded')

    expect(tokens.accessToken).toBe('APP_USR-access-1')
    expect(tokens.refreshToken).toBe('TG-refresh-1')
    expect(tokens.mlUserId).toBe('123456')
    expect(tokens.expiresIn).toBe(21600)
    expect(tokens.expiraEm.getTime()).toBeGreaterThan(Date.now())
  })

  it('renovarTokens: envia grant_type=refresh_token com o refresh atual', async () => {
    axiosMock.post.mockResolvedValueOnce({
      data: {
        access_token: 'APP_USR-access-2',
        token_type: 'bearer',
        expires_in: 21600,
        user_id: 123456,
        refresh_token: 'TG-refresh-2',
      },
    })

    const tokens = await service.renovarTokens('TG-refresh-1')

    const [, corpo] = axiosMock.post.mock.calls[0]
    expect(String(corpo)).toContain('grant_type=refresh_token')
    expect(String(corpo)).toContain('refresh_token=TG-refresh-1')
    // O ML retorna um NOVO refresh_token (uso único).
    expect(tokens.refreshToken).toBe('TG-refresh-2')
    expect(tokens.accessToken).toBe('APP_USR-access-2')
  })

  it('mapeia 400 do ML para UnauthorizedException (code/refresh inválido)', async () => {
    axiosMock.post.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 400, data: { error: 'invalid_grant' } },
    })

    await expect(service.trocarCodePorTokens('CODE-RUIM')).rejects.toBeInstanceOf(
      UnauthorizedException,
    )
  })
})
