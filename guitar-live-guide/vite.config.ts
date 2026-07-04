import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-azul-sem-nome.png', 'logo-e-nome.png', 'logo-azul-com-frase.png', 'somente-nome.png'],
      manifest: {
        name: 'Perfos',
        short_name: 'Perfos',
        description: 'Live repertoire guide for guitarists',
        theme_color: '#000007',
        background_color: '#000007',
        display: 'standalone',
        icons: [
          {
            src: 'logo-azul-sem-nome.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo-azul-sem-nome.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: [],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/firebase')) return 'firebase'
        },
      },
    },
  },
})
