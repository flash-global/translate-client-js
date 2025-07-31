import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['verbose'], // IMPORTANT for expanded output
    environment: 'happy-dom',
    coverage: {
      enabled: true,
      reporter: ['text', 'html'], // optional: 'json', 'lcov', etc.
      reportsDirectory: './coverage',
      exclude: ['tests', 'node_modules', 'build', 'dist', 'vitest.config.js', 'webpack.config.js'],
    },
  },
});