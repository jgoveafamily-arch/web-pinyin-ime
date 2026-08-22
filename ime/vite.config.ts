import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listens on all local IPs
    port: 3000, // Or whatever port your project defaults to
    hmr: {
      clientPort: 443, // Routes WebSocket connections through Codespaces' HTTPS proxy
    },
  },
});
