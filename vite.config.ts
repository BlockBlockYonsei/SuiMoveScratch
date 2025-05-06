import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // This enables processing CSS with Tailwind
    // without requiring PostCSS configuration
    preprocessorOptions: {
      tailwindcss: {},
    },
  },
});
