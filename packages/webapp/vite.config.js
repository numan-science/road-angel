import { defineConfig } from "vite";
import dns from "dns";
import path from "path";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import macrosPlugin from 'vite-plugin-babel-macros';

dns.setDefaultResultOrder("verbatim");
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
    port: 3000
  },
  plugins: [react(), mkcert(), macrosPlugin()],
  build: {
    target: "es2020",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
});