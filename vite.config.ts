import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/sass/variable.scss";`
      },
    },
  },
});
