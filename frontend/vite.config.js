import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Semua request yang dimulai dengan /api akan diarahkan ke backend
      "/api": {
        target: "http://localhost:3000", // Sesuaikan dengan port index.mjs kamu
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
