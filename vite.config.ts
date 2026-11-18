import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const port = Number(process.env.PORT ?? 5173);
const basePath = process.env.BASE_PATH ?? '/';
const buildVersion = process.env.VITE_BUILD_SHA ?? 'dev';

export default defineConfig({
  base: basePath,
  define: {
    __BUILD_VERSION__: JSON.stringify(buildVersion),
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    host: '0.0.0.0',
    fs: {
      strict: false,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
  },
});
