import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // The existing local API URL is stored in Client/client/.env.
  envDir: './client',
  plugins: [react(), tailwindcss()],
})
