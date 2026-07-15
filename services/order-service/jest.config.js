module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    // Apenas TypeScript passa pelo ts-jest. O client Prisma gerado (.js em
    // ../generated) e node_modules são deixados como estão (evita o warning
    // "Got a `.js` file to compile while `allowJs` is not set").
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/', '/generated/'],
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/node_modules/**',
    '!**/generated/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
