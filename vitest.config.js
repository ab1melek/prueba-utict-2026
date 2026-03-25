// eslint-disable-next-line import/no-unresolved
const { defineConfig } = require('vitest/config');

const aux = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov', 'cobertura'],
      reportsDirectory: './coverage',
      include: ['src/**/*.js'],
      exclude: [
        'node_modules/**',
        'e2e/**',
        'src/db/**',
        '**/migrations/**',
        '**/seeders/**',
        '**/config/**',
      ],
    },
    include: ['**/*.{e2e,test,spec}.?(c|m)[jt]s?(x)'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    globals: true,
    setupFiles: './e2e/test/setup.js',
  },
});

module.exports = aux;
