import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get the Codespace domain if available
const codespaceName = process.env.CODESPACE_NAME;
const codeSpaceHost = codespaceName ? `${codespaceName}-3000.app.github.dev` : undefined;

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    hmr: codespaceName
      ? {
          host: codeSpaceHost,
          clientPort: 443,
          protocol: 'wss', // Uses Secure WebSockets for Codespaces
        }
      : true,
  },
});
