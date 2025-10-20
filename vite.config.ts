import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    // Base can be overridden at build time: `vite build --base=/REPO_NAME/`
    base: '/',
    build: {
      outDir: 'dist'
    },
    server: {
      port: 5173
    },
    preview: {
      port: 5173
    },
    test: {
      environment: 'node'
    }
  };
});
