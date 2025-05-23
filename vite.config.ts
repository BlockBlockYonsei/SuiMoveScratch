import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    port: 4173, // 기본값
    host: true, // 외부 접근 허용
    allowedHosts: ["organizingui.onrender.com"], // <== 이 줄 추가
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ["suimovescratch.onrender.com"],
  },
});
