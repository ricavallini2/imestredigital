/**
 * DTOs do módulo de Caixa (sessão de PDV / balcão).
 *
 * Todos os campos que o front já envia estão declarados aqui — com
 * `whitelist + forbidNonWhitelisted` ativos no ValidationPipe global
 * (main.ts), qualquer campo não declarado derruba a requisição com 400.
 */

import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsIn,
  Min,
  Max,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export const CATEGORIAS_MOVIMENTACAO_CAIXA = [
  'VENDA',
  'SUPRIMENTO',
  'SANGRIA',
  'DESPESA',
  'REEMBOLSO',
  'OUTROS',
] as const;

export const TIPOS_MOVIMENTACAO_CAIXA = ['ENTRADA', 'SAIDA'] as const;

/** Espelha o enum TipoPagamento do Prisma (schema.prisma). */
export const FORMAS_PAGAMENTO_CAIXA = [
  'DINHEIRO',
  'PIX',
  'CARTAO_CREDITO',
  'CARTAO_DEBITO',
  'BOLETO',
  'TRANSFERENCIA',
  'MARKETPLACE',
] as const;

export class AbrirCaixaDto {
  @IsString()
  @IsNotEmpty({ message: 'Informe o operador do caixa' })
  @MaxLength(120)
  operador: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor de abertura inválido' })
  @Min(0)
  valorAbertura: number;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  caixa?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacoes?: string;
}

export class FecharCaixaDto {
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor contado inválido' })
  @Min(0)
  valorContado: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacoes?: string;
}

export class RegistrarMovimentacaoCaixaDto {
  @IsIn(CATEGORIAS_MOVIMENTACAO_CAIXA as unknown as string[], {
    message: 'Categoria de movimentação inválida',
  })
  categoria: string;

  /**
   * Opcional e, na prática, ignorado: o tipo é derivado da categoria
   * (ver MAPA_TIPO_POR_CATEGORIA no service). Só é considerado para
   * OUTROS, única categoria sem sinal fixo. Declarado aqui porque o
   * contrato do front prevê o campo — sem a declaração, um envio
   * futuro tomaria 400 do forbidNonWhitelisted.
   */
  @IsOptional()
  @IsIn(TIPOS_MOVIMENTACAO_CAIXA as unknown as string[])
  tipo?: string;

  @IsString()
  @IsNotEmpty({ message: 'Informe a descrição da movimentação' })
  @MaxLength(300)
  descricao: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor inválido' })
  @Min(0.01, { message: 'O valor deve ser maior que zero' })
  valor: number;

  @IsOptional()
  @IsIn(FORMAS_PAGAMENTO_CAIXA as unknown as string[], { message: 'Forma de pagamento inválida' })
  formaPagamento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  pedidoNumero?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  operador?: string;
}

/**
 * Paginação do histórico.
 *
 * Defaults como propriedade de CLASSE (e não default de parâmetro no
 * controller): com `transform: true`, `@Query('pagina') p: number = 1`
 * receberia `+undefined = NaN` e o skip/take iria NaN → 500. Aqui o
 * class-transformer instancia a classe e os defaults valem de fato,
 * inclusive quando o front não manda nada (que é o caso hoje).
 */
export class ListarSessoesCaixaDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limite?: number = 30;
}
