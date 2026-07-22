import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.jpg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'LA PODEROSA - Plataforma de Medios Digitales',
        short_name: 'La Poderosa',
        description: 'Tu plataforma de medios digitales. Escucha en vivo, noticias, eventos y más.',
        theme_color: '#000000',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'logo-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})