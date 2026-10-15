import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 相对 base，便于部署到 GitHub Pages 等子路径静态托管
export default defineConfig({
  base: './',
  plugins: [react()],
});
