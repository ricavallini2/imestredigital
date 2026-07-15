module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    // Apenas .ts passa pelo ts-jest; o Prisma client gerado (.js em
    // ../generated) é consumido como está (evita o warning "Got a `.js` file
    // to compile while `allowJs` is not set").
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/', '/generated/'],
  // Executa em processo único (sem fork de workers): o ts-jest faz type-check
  // completo por suite e, com o grafo de tipos do Prisma, rodar em paralelo
  // estoura a heap do worker. Serial é estável e rápido o bastante aqui.
  maxWorkers: 1,
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/node_modules/**',
    '!**/generated/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
}
