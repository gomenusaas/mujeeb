import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The provider app reuses the customer app's public assets (company logos, icons).
export default defineConfig({
  plugins: [react()],
  publicDir: '../app/public',
  server: { port: 5174 },
})
