import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Obtient le chemin absolu du fichier courant et son dossier
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuration Vite
export default defineConfig({
  plugins: [react()], // Plugin React pour Vite
  test: {
    environment: 'jsdom',           // Environnement de test simulant un navigateur
    setupFiles: './src/app/test/setup.js', // Script de configuration avant les tests
    globals: true,                  // Permet l'utilisation des variables globales pour les tests
    coverage: {
      reporter: ["text", "html"],
    }
  },
  resolve: {
    alias: {                       // Alias pour simplifier les imports dans le projet
      '@layout': resolve(__dirname, './src/app/layout'),
      '@services': resolve(__dirname, './src/app/services'),
      '@components': resolve(__dirname, './src/app/components'),
      '@pages': resolve(__dirname, './src/app/pages'),
    }
  },
} as UserConfig)
