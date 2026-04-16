import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    // Tailwind antes do React: o pipeline processa o CSS de entrada corretamente
    plugins: [tailwindcss(), react()],
    resolve: {
        extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
        tsconfigPaths: true,
    },
    server: {
        host: true,
        // Porta dedicada: evita abrir por engano outro Vite que já use 5173 (template antigo em cache).
        port: 5174,
        strictPort: false,
        open: false,
        // Reduz cache agressivo do browser ao mudar rotas/entry durante o dev
        headers: {
            "Cache-Control": "no-store",
        },
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
        // React 19 + plugin-react podem injetar `react/compiler-runtime`; incluir evita
        // pedidos a chunks antigos (504 "Outdated Optimize Dep") após mudanças no lockfile.
        include: [
            "react",
            "react/jsx-runtime",
            "react-dom",
            "react-dom/client",
            "react/compiler-runtime",
            "react-router-dom",
            "axios",
            "react-toastify",
        ],
    },
});
