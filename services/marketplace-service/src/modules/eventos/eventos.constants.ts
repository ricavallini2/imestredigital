/**
 * Token de injeção do cliente Kafka produtor.
 *
 * Vive em arquivo próprio para evitar import circular entre
 * eventos.module.ts e produtor-eventos.service.ts (o ciclo fazia o
 * token chegar `undefined` no @Inject e derrubava a DI no bootstrap).
 */
export const KAFKA_SERVICE = 'KAFKA_SERVICE';
