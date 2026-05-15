import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

function normalizeDaycovalProxyTarget(raw: string): string {
    let u = raw.trim().replace(/\/$/, "");
    const suffix = "/varejo/consignado";
    if (u.endsWith(suffix)) {
        u = u.slice(0, -suffix.length);
    }
    return u.replace(/\/$/, "");
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    const daycovalApiKey =
        env.VITE_DAYCOVAL_API_KEY || env.DAYCOVAL_API_KEY || "";
    /** Ex.: http://api-daycoval.test ou URL completa com sufixo (normalizamos para evitar `/varejo/consignado` duplicado). */
    const daycovalTargetRaw =
        env.VITE_DAYCOVAL_API_TARGET ||
        env.DAYCOVAL_BASE_URL ||
        "http://api-daycoval.test";
    const daycovalTarget = normalizeDaycovalProxyTarget(daycovalTargetRaw);

    /** Espelho do que já foi lido pelo `loadEnv` ao iniciar o Vite — o cliente não tem acesso à chave. */
    const daycovalProxyReady = Boolean(daycovalApiKey);

    const daycovalLoginCliente =
        env.VITE_DAYCOVAL_LOGIN_USUARIO || env.DAYCOVAL_LOGIN_USUARIO || "";
    const daycovalTimeoutMs = Math.max(
        5000,
        Math.round(
            Number(
                env.VITE_DAYCOVAL_TIMEOUT_SECONDS ||
                env.DAYCOVAL_TIMEOUT_SECONDS ||
                "30"
            ) * 1000
        )
    );

    return {
        define: {
            "import.meta.env.VITE_DAYCOVAL_PROXY_READY": JSON.stringify(
                daycovalProxyReady ? "1" : ""
            ),
            "import.meta.env.VITE_DAYCOVAL_LOGIN_USUARIO": JSON.stringify(
                daycovalLoginCliente
            ),
            "import.meta.env.VITE_DAYCOVAL_TIMEOUT_MS": JSON.stringify(
                String(daycovalTimeoutMs)
            ),
        },
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
                // Daycoval: deve vir antes de `/api` genérico (prefix mais específico).
                ...(daycovalApiKey
                    ? {
                        "/api/daycoval": {
                            target: daycovalTarget,
                            changeOrigin: true,
                            secure: daycovalTarget.startsWith("https:"),
                            rewrite: (p) =>
                                p.replace(/^\/api\/daycoval/, "/varejo/consignado"),
                            configure(proxy) {
                                proxy.on("proxyReq", (proxyReq) => {
                                    proxyReq.setHeader(
                                        "apikey",
                                        daycovalApiKey
                                    );
                                });
                            },
                        },
                    }
                    : {}),
                // Proxy para API principal (contorna CORS/preflight em desenvolvimento)
                "/api": {
                    // TODO: alterar quando for realizar o deploy
                    target: "http://31.97.165.27:8005",
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
    };
});
