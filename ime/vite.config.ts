import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: true, // or '0.0.0.0'
    hmr: {
      clientPort: 443,
    }
  }
})

