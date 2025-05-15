import tailwindcss from '@tailwindcss/vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from '@tanstack/start/config'

export default defineConfig({
  tsr: {
    appDirectory: 'src/app',
  },
  server: {
    preset: 'vercel',
  },
  vite: {
    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
})
