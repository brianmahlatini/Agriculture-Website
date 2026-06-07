// Vite config defines the React dev server used by Docker and local development.
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    hmr: {
      clientPort: Number(process.env.VITE_HMR_CLIENT_PORT ?? 5173)
    }
  }
});
