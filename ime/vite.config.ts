import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: false, // Turn off HMR completely
    watch: {
      usePolling: false, // Prevents polling loops on virtual file systems
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
});
