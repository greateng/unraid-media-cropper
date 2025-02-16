import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './', // Ensures the correct root directory
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
