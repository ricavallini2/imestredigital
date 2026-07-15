/**
 * Testes do XML de evento (Etapa 0 fiscal).
 *
 * Cobre as correções:
 * - #5 chNFe usa a chave de acesso real de 44 dígitos (não mais UUID truncado).
 * - #6 tpEvento: cancelamento = 110111, carta de correção = 110110.
 */

import { XmlBuilderService } from './xml-builder.service';

describe('XML de evento — chNFe e tpEvento', () => {
  const builder = new XmlBuilderService();
  const config: any = { ambienteSefaz: 'HOMOLOGACAO' };
  const CHAVE = '35240100000000000000550010000000011000000017';

  it('cancelamento usa tpEvento 110111 e a chave de acesso real', async () => {
    const evento: any = {
      tipo: 'CANCELAMENTO',
      sequencia: 1,
      dataEvento: new Date('2026-01-15T12:00:00.000Z'),
      justificativa: 'Cancelamento por erro de digitacao no pedido',
    };

    const xml = await builder.gerarXmlEvento(evento, CHAVE, config);

    expect(xml).toContain('<tpEvento>110111</tpEvento>');
    expect(xml).toContain(`<chNFe>${CHAVE}</chNFe>`);
    // Não pode usar o tpEvento antigo/errado nem chave truncada.
    expect(xml).not.toContain('<tpEvento>110110</tpEvento>');
    expect(xml).not.toContain('<tpEvento>110105</tpEvento>');
  });

  it('carta de correção usa tpEvento 110110 e a chave de acesso real', async () => {
    const evento: any = {
      tipo: 'CARTA_CORRECAO',
      sequencia: 2,
      dataEvento: new Date('2026-01-16T12:00:00.000Z'),
      justificativa: 'Correcao de informacao complementar da nota fiscal',
    };

    const xml = await builder.gerarXmlEvento(evento, CHAVE, config);

    expect(xml).toContain('<tpEvento>110110</tpEvento>');
    expect(xml).toContain(`<chNFe>${CHAVE}</chNFe>`);
    expect(xml).not.toContain('<tpEvento>110111</tpEvento>');
  });
});
