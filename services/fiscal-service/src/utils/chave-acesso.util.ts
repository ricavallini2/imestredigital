/**
 * Utilitário para geração de Chave de Acesso da NF-e.
 * A chave de acesso possui 44 dígitos numéricos no formato:
 * UF(2) + AAMM(4) + CNPJ(14) + MOD(2) + SERIE(3) + NUMERO(9) + TEMISSAO(1) + CNUMERICO(8) + CDV(1)
 */

/** Parâmetros para geração da chave de acesso */
interface ParametrosChaveAcesso {
  /** UF do emitente (ex: 'SP') */
  uf: string;
  /** Ano de emissão */
  ano: number;
  /** Mês de emissão (1-12) */
  mes: number;
  /** CNPJ do emitente (14 dígitos) */
  cnpj: string;
  /** Tipo da nota: NFE, NFCE, NFSE */
  tipo: string;
  /** Série da nota */
  serie: string;
  /** Número da nota */
  numero: number;
}

/**
 * Tabela de códigos UF do IBGE para uso na chave de acesso.
 */
const CODIGOS_UF: Record<string, string> = {
  AC: '12', AL: '27', AP: '16', AM: '13', BA: '29',
  CE: '23', DF: '53', ES: '32', GO: '52', MA: '21',
  MT: '51', MS: '50', MG: '31', PA: '15', PB: '25',
  PR: '41', PE: '26', PI: '22', RJ: '33', RN: '24',
  RS: '43', RO: '11', RR: '14', SC: '42', SP: '35',
  SE: '28', TO: '17',
};

/**
 * Gera a chave de acesso da NF-e com 44 dígitos.
 * Inclui cálculo do dígito verificador (módulo 11).
 *
 * @param params - Parâmetros para geração da chave
 * @returns Chave de acesso com 44 dígitos
 */
export function gerarChaveAcesso(params: ParametrosChaveAcesso): string {
  // Código UF (2 dígitos)
  const codigoUf = CODIGOS_UF[params.uf.toUpperCase()] || '35';

  // AAMM (4 dígitos)
  const anoAbreviado = (params.ano % 100).toString().padStart(2, '0');
  const mes = params.mes.toString().padStart(2, '0');

  // CNPJ (14 dígitos)
  const cnpj = params.cnpj.replace(/\D/g, '').padStart(14, '0');

  // Modelo (2 dígitos): 55=NF-e, 65=NFC-e
  const modelo = params.tipo === 'NFCE' ? '65' : '55';

  // Série (3 dígitos)
  const serie = params.serie.padStart(3, '0');

  // Número (9 dígitos)
  const numero = params.numero.toString().padStart(9, '0');

  // Tipo de emissão (1 dígito): 1=Normal
  const tipoEmissao = '1';

  // Código numérico aleatório (8 dígitos)
  const codigoNumerico = Math.floor(Math.random() * 99999999)
    .toString()
    .padStart(8, '0');

  // Monta chave sem dígito verificador (43 dígitos)
  const chaveSemDv = `${codigoUf}${anoAbreviado}${mes}${cnpj}${modelo}${serie}${numero}${tipoEmissao}${codigoNumerico}`;

  // Calcula dígito verificador (módulo 11)
  const dv = calcularDigitoVerificador(chaveSemDv);

  return `${chaveSemDv}${dv}`;
}

/**
 * Calcula o dígito verificador da chave de acesso usando módulo 11.
 * Pesos de 2 a 9 da direita para a esquerda, repetindo.
 *
 * @param chave - Chave de 43 dígitos sem DV
 * @returns Dígito verificador (0-9)
 */
function calcularDigitoVerificador(chave: string): string {
  let soma = 0;
  let peso = 2;

  // Percorre da direita para a esquerda
  for (let i = chave.length - 1; i >= 0; i--) {
    soma += parseInt(chave[i], 10) * peso;
    peso = peso >= 9 ? 2 : peso + 1;
  }

  const resto = soma % 11;
  const dv = resto < 2 ? 0 : 11 - resto;

  return dv.toString();
}

/**
 * Valida se uma chave de acesso possui formato correto.
 *
 * @param chave - Chave de acesso a validar
 * @returns true se a chave é válida
 */
export function validarChaveAcesso(chave: string): boolean {
  // Deve ter exatamente 44 dígitos numéricos
  if (!/^\d{44}$/.test(chave)) {
    return false;
  }

  // Valida dígito verificador
  const chaveSemDv = chave.substring(0, 43);
  const dvInformado = chave.substring(43, 44);
  const dvCalculado = calcularDigitoVerificador(chaveSemDv);

  return dvInformado === dvCalculado;
}

/**
 * Extrai informações da chave de acesso.
 *
 * @param chave - Chave de acesso de 44 dígitos
 * @returns Informações extraídas da chave
 */
export function extrairInfoChaveAcesso(chave: string): {
  uf: string;
  anoMes: string;
  cnpj: string;
  modelo: string;
  serie: string;
  numero: string;
  tipoEmissao: string;
  codigoNumerico: string;
  digitoVerificador: string;
} | null {
  if (!validarChaveAcesso(chave)) {
    return null;
  }

  // Encontra nome da UF pelo código
  const codigoUf = chave.substring(0, 2);
  const uf = Object.entries(CODIGOS_UF).find(([_, cod]) => cod === codigoUf)?.[0] || '';

  return {
    uf,
    anoMes: chave.substring(2, 6),
    cnpj: chave.substring(6, 20),
    modelo: chave.substring(20, 22),
    serie: chave.substring(22, 25),
    numero: chave.substring(25, 34),
    tipoEmissao: chave.substring(34, 35),
    codigoNumerico: chave.substring(35, 43),
    digitoVerificador: chave.substring(43, 44),
  };
}
