import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/drissbrtn.github2.io/', // <--- ASSUREZ-VOUS QUE CETTE LIGNE EST PRÉSENTE ET CORRECTE
  plugins: [react( ),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
