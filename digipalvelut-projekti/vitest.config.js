import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // ⬅️ Makes DOM APIs like onMount available
  },
});
