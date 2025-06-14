import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true, // ✅ Add this line
        secure: false,
      },
    },
  },
  plugins: [
    tailwindcss(),
  ],
});
