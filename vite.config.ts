import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
        tsconfigPaths: true,
    },
    server: {
        host: true,
        port: 5173,
        open: false, // Não abre o browser automaticamente
        strictPort: false, // Tenta outra porta se a 5173 estiver ocupada
        proxy: {
            // Proxy para API principal (contorna CORS/preflight em desenvolvimento)
            "/api": {
                // TODO: alterar quando for realizar o deploy
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
                // Backend local em HTTP — não validar certificado TLS do target
                secure: false,
            },
        },
    },
    build: {
        target: "esnext",
        minify: "esbuild",
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (
                        id.includes("node_modules/react/") ||
                        id.includes("node_modules/react-dom/") ||
                        id.includes("node_modules/react-router")
                    ) {
                        return "vendor";
                    }
                    if (
                        id.includes("node_modules/react-icons/") ||
                        id.includes("node_modules/react-toastify/")
                    ) {
                        return "ui";
                    }
                },
            },
        },
    },
    optimizeDeps: {
        include: [
            "react",
            "react-dom",
            "react-router-dom",
            "axios",
            "react-toastify",
        ],
    },
});
