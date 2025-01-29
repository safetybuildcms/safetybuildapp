import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Allows global `describe`, `it`, `expect` without imports
    environment: 'jsdom', // Simulates a browser-like environment
    setupFiles: './vitest.setup.ts', // File for global test setups,
    reporter: ['text', 'html'] // Outputs coverage in text and HTML formats
  }
})
