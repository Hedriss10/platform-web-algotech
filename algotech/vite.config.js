import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@module": path.resolve(__dirname, "src/module"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@service": path.resolve(__dirname, "src/Service"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@test": path.resolve(__dirname, "src/test"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  host: {
    port: 3000,
    localhost: true,
  },
  server: {
    host: true,
    port: 5173,
  },
});
