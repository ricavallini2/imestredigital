/**
 * DTO para atualização de produto.
 *
 * Todos os campos são opcionais, permitindo atualização parcial.
 * Herda as validações do DTO de criação via PartialType.
 */

import { PartialType } from '@nestjs/swagger';

import { CriarProdutoDto } from './criar-produto.dto';

export class AtualizarProdutoDto extends PartialType(CriarProdutoDto) {}
