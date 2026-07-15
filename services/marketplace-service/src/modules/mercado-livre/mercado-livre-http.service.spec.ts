import axios from 'axios'
import { ContaMarketplace, PlataformaMarketplace, StatusConexao } from '../../../generated/client'
import { MercadoLivreHttpService } from './mercado-livre-http.service'
import { MercadoLivreConfig } from './mercado-livre.config'
import { MercadoLivreTokenService } from './mercado-livre-token.service'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

/** Instância axios fake com um request() controlável. */
function criarInstanciaFake() {
  return { request: jest.fn() }
}

function criarConta(): ContaMarketplace {
  return {
    id: 'conta-1',
    tenantId: 'tenant-1',
    plataforma: PlataformaMarketplace.MERCADO_LIVRE,
    nome: 'ML',
    accessToken: 'cifrado',
    refreshToken: 'cifrado',
    idExterno: '123456',
    tokenExpiraEm: new Date(Date.now() + 3600_000),
    status: StatusConexao.ATIVA,
    ultimaSincronizacao: null,
    configuracoes: {},
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  } as ContaMarketplace
}

/** Cria um erro no formato AxiosError com status e headers opcionais. */
function erroAxios(status: number, headers: Record<string, string> = {}) {
  return { isAxiosError: true, response: { status, headers, data: {} } }
}

describe('MercadoLivreHttpService', () => {
  let instancia: ReturnType<typeof criarInstanciaFake>
  let tokenService: jest.Mocked<
    Pick<MercadoLivreTokenService, 'obterAccessTokenValido' | 'forcarRefresh'>
  >
  let service: MercadoLivreHttpService

  beforeEach(() => {
    jest.clearAllMocks()
    axiosMock.isAxiosError.mockImplementation(
      (payload: unknown): payload is import('axios').AxiosError =>
        Boolean((payload as { isAxiosError?: boolean })?.isAxiosError),
    )

    instancia = criarInstanciaFake()
    axiosMock.create.mockReturnValue(instancia as never)

    tokenService = {
      obterAccessTokenValido: jest.fn().mockResolvedValue('access-token-atual'),
      forcarRefresh: jest.fn().mockResolvedValue('access-token-novo'),
    }

    const config = { apiUrl: 'https://api.mercadolibre.com' } as MercadoLivreConfig
    service = new MercadoLivreHttpService(
      config,
      tokenService as unknown as MercadoLivreTokenService,
    )
  })

  it('GET injeta Authorization: Bearer com o token da conta', async () => {
    instancia.request.mockResolvedValueOnce({ data: { id: 1 } })

    const resultado = await service.get(criarConta(), '/orders/1')

    expect(resultado).toEqual({ id: 1 })
    const cfg = instancia.request.mock.calls[0][0]
    expect(cfg.headers.Authorization).toBe('Bearer access-token-atual')
    expect(cfg.method).toBe('GET')
    expect(cfg.url).toBe('/orders/1')
  })

  it('429 aplica backoff e repete até suceder', async () => {
    // Sem esperar de verdade nos backoffs.
    const dormir = jest
      .spyOn(service as unknown as { dormir: (ms: number) => Promise<void> }, 'dormir')
      .mockResolvedValue(undefined)

    instancia.request
      .mockRejectedValueOnce(erroAxios(429))
      .mockRejectedValueOnce(erroAxios(429))
      .mockResolvedValueOnce({ data: { ok: true } })

    const resultado = await service.get(criarConta(), '/items/search')

    expect(resultado).toEqual({ ok: true })
    expect(instancia.request).toHaveBeenCalledTimes(3)
    // Backoff exponencial: 1000ms, depois 2000ms.
    expect(dormir).toHaveBeenNthCalledWith(1, 1000)
    expect(dormir).toHaveBeenNthCalledWith(2, 2000)
  })

  it('429 respeita Retry-After (em segundos) quando presente', async () => {
    const dormir = jest
      .spyOn(service as unknown as { dormir: (ms: number) => Promise<void> }, 'dormir')
      .mockResolvedValue(undefined)

    instancia.request
      .mockRejectedValueOnce(erroAxios(429, { 'retry-after': '5' }))
      .mockResolvedValueOnce({ data: { ok: true } })

    await service.get(criarConta(), '/items/search')

    // 5s do Retry-After → 5000ms (em vez do backoff base de 1000ms).
    expect(dormir).toHaveBeenNthCalledWith(1, 5000)
  })

  it('429 persistente desiste após o máximo de tentativas', async () => {
    jest
      .spyOn(service as unknown as { dormir: (ms: number) => Promise<void> }, 'dormir')
      .mockResolvedValue(undefined)

    instancia.request.mockRejectedValue(erroAxios(429))

    await expect(service.get(criarConta(), '/x')).rejects.toMatchObject({
      response: { status: 429 },
    })
    // 1 tentativa inicial + 4 retries = 5 chamadas.
    expect(instancia.request).toHaveBeenCalledTimes(5)
  })

  it('401 força refresh UMA vez e repete com o token novo', async () => {
    instancia.request
      .mockRejectedValueOnce(erroAxios(401))
      .mockResolvedValueOnce({ data: { ok: true } })

    const resultado = await service.get(criarConta(), '/orders/1')

    expect(resultado).toEqual({ ok: true })
    expect(tokenService.forcarRefresh).toHaveBeenCalledTimes(1)
    // A repetição usa o token novo do refresh.
    const segundaCfg = instancia.request.mock.calls[1][0]
    expect(segundaCfg.headers.Authorization).toBe('Bearer access-token-novo')
  })

  it('401 duas vezes seguidas (mesmo após refresh) propaga o erro', async () => {
    instancia.request.mockRejectedValue(erroAxios(401))

    await expect(service.get(criarConta(), '/orders/1')).rejects.toMatchObject({
      response: { status: 401 },
    })
    // Refresh tentado só UMA vez (não entra em loop).
    expect(tokenService.forcarRefresh).toHaveBeenCalledTimes(1)
    expect(instancia.request).toHaveBeenCalledTimes(2)
  })
})
