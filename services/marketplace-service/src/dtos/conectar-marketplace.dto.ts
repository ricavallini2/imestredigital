import { IsEnum, IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlataformaMarketplace } from '../../generated/client';

/**
 * DTO para conectar/autenticar conta de marketplace
 */
export class ConectarMarketplaceDto {
  @ApiProperty({
    enum: PlataformaMarketplace,
    description: 'Tipo de marketplace a conectar',
    example: 'MERCADO_LIVRE',
  })
  @IsEnum(PlataformaMarketplace)
  @IsNotEmpty()
  marketplace: PlataformaMarketplace;

  @ApiProperty({
    description: 'Código de autorização OAuth2 (para Mercado Livre)',
    example: 'TG-1234567890abcdef',
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({
    description: 'ID da loja (para Shopee)',
    example: '123456789',
  })
  @IsString()
  @IsOptional()
  shopId?: string;

  @ApiProperty({
    description: 'Refresh token para renovo de autenticação',
    example: 'refresh-token-xyz',
  })
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @ApiProperty({
    description: 'URI de redirecionamento para OAuth2',
    example: 'http://localhost:3007/api/v1/contas/callback/mercado-livre',
  })
  @IsUrl()
  @IsOptional()
  redirectUri?: string;
}
