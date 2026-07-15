import { UnauthorizedException } from '@nestjs/common'
import { ContaMarketplace, PlataformaMarketplace, StatusConexao } from '../../../generated/client'
import { CriptoToken } from '../../common/cripto-token'
import { MercadoLivreTokenService } from './mercado-livre-token.service'
import { MercadoLivreOAuthService } from './mercado-livre-oauth.service'
import { ContaMarketplaceRepository } from '../conta-marketplace/conta-marketplace.repository'
import { TokensML } from './mercado-livre-oauth.service'

describe('MercadoLivreTokenService (rotação atômica + lock)', () => {
  const chave = 'a'.repeat(64)
  const cripto = new CriptoToken(chave)
  const tenantId = 'tenant-1'
  const contaId = 'conta-1'

  let contaRepo: jest.Mocked<Pick<ContaMarketplaceRepository, 'buscarPorId' | 'rotacionarTokens' | 'atualizarStatus'>>
  let oauth: jest.Mocked<Pick<MercadoLivreOAuthService, 'renovarTokens'>>
  let service: MercadoLivreTokenService

  /** Monta uma conta com refresh token cifrado e expiração configurável. */
  function contaComRefresh(refreshPlano: string, expiraEmMs: number): ContaMarketplace {
    return {
      id: contaId,
      tenantId,
      plataforma: PlataformaMarketplace.MERCADO_LIVRE,
      nome: 'ML',
      accessToken: cripto.criptografar('access-antigo')!,
      refreshToken: cripto.criptografar(refreshPlano)!,
      idExterno: '123456',
      tokenExpiraEm: new Date(expiraEmMs),
      status: StatusConexao.ATIVA,
      ultimaSincronizacao: null,
      configuracoes: {},
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    } as ContaMarketplace
  }

  function tokensNovos(): TokensML {
    return {
      accessToken: 'access-novo',
      refreshToken: 'TG-refresh-NOVO',
      expiresIn: 21600,
      expiraEm: new Date(Date.now() + 21600 * 1000),
      scope: 'offline_access read write',
      mlUserId: '123456',
    }
  }

  beforeEach(() => {
    contaRepo = {
      buscarPorId: jest.fn(),
      rotacionarTokens: jest.fn().mockResolvedValue({} as ContaMarketplace),
      atualizarStatus: jest.fn().mockResolvedValue({} as ContaMarketplace),
    }
    oauth = { renovarTokens: jest.fn() }
    service = new MercadoLivreTokenService(
      contaRepo as unknown as ContaMarketplaceRepository,
      oauth as unknown as MercadoLivreOAuthService,
      cripto,
    )
  })

  it('access token válido (longe de expirar) é reusado sem refresh', async () => {
    const conta = contaComRefresh('TG-refresh-1', Date.now() + 60 * 60 * 1000)
    const access = await service.obterAccessTokenValido(conta)

    expect(access).toBe('access-antigo')
    expect(oauth.renovarTokens).not.toHaveBeenCalled()
  })

  it('refresh proativo quando falta < 30min: PERSISTE o novo refresh token cifrado', async () => {
    // Expira em 10 min → dentro da margem de 30 min.
    const conta = contaComRefresh('TG-refresh-1', Date.now() + 10 * 60 * 1000)
    contaRepo.buscarPorId.mockResolvedValue(conta)
    oauth.renovarTokens.mockResolvedValue(tokensNovos())

    const access = await service.obterAccessTokenValido(conta)

    expect(access).toBe('access-novo')
    expect(oauth.renovarTokens).toHaveBeenCalledWith('TG-refresh-1')
    expect(contaRepo.rotacionarTokens).toHaveBeenCalledTimes(1)

    // Verifica que o refresh persistido é o NOVO, e está CIFRADO (não texto plano).
    const args = contaRepo.rotacionarTokens.mock.calls[0][2]
    expect(cripto.estaCifrado(args.refreshTokenCifrado)).toBe(true)
    expect(cripto.estaCifrado(args.accessTokenCifrado)).toBe(true)
    expect(cripto.descriptografar(args.refreshTokenCifrado)).toBe('TG-refresh-NOVO')
    expect(cripto.descriptografar(args.accessTokenCifrado)).toBe('access-novo')
  })

  it('lock por conta: refreshes concorrentes disparam UMA só chamada ao ML', async () => {
    const conta = contaComRefresh('TG-refresh-1', Date.now() - 1000) // expirado
    contaRepo.buscarPorId.mockResolvedValue(conta)

    // renovarTokens resolve só depois de um tick, simulando latência de rede.
    let resolver!: (v: TokensML) => void
    oauth.renovarTokens.mockReturnValue(
      new Promise<TokensML>((r) => {
        resolver = r
      }),
    )

    // Dispara duas renovações concorrentes para a MESMA conta.
    const p1 = service.forcarRefresh(contaId, tenantId)
    const p2 = service.forcarRefresh(contaId, tenantId)

    resolver(tokensNovos())
    const [a1, a2] = await Promise.all([p1, p2])

    expect(a1).toBe('access-novo')
    expect(a2).toBe('access-novo')
    // O ponto central: refresh_token de uso único NÃO é queimado em paralelo.
    expect(oauth.renovarTokens).toHaveBeenCalledTimes(1)
    expect(contaRepo.rotacionarTokens).toHaveBeenCalledTimes(1)
  })

  it('falha no refresh do ML marca a conta como ERRO e propaga', async () => {
    const conta = contaComRefresh('TG-refresh-1', Date.now() - 1000)
    contaRepo.buscarPorId.mockResolvedValue(conta)
    oauth.renovarTokens.mockRejectedValue(new UnauthorizedException('refresh inválido'))

    await expect(service.forcarRefresh(contaId, tenantId)).rejects.toBeInstanceOf(
      UnauthorizedException,
    )
    expect(contaRepo.atualizarStatus).toHaveBeenCalledWith(
      contaId,
      tenantId,
      StatusConexao.ERRO,
    )
    expect(contaRepo.rotacionarTokens).not.toHaveBeenCalled()
  })

  it('conta sem refresh token lança e marca ERRO', async () => {
    const conta = contaComRefresh('TG-refresh-1', Date.now() - 1000)
    conta.refreshToken = null
    contaRepo.buscarPorId.mockResolvedValue(conta)

    await expect(service.forcarRefresh(contaId, tenantId)).rejects.toBeInstanceOf(
      UnauthorizedException,
    )
    expect(oauth.renovarTokens).not.toHaveBeenCalled()
    expect(contaRepo.atualizarStatus).toHaveBeenCalledWith(
      contaId,
      tenantId,
      StatusConexao.ERRO,
    )
  })
})
