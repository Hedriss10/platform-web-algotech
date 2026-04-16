import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };

type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error("[ErrorBoundary]", error, info.componentStack);
    }

    render(): ReactNode {
        if (this.state.error) {
            return (
                <div
                    style={{
                        minHeight: "100vh",
                        padding: 24,
                        fontFamily: "system-ui, sans-serif",
                        background: "#0a0a0a",
                        color: "#fafafa",
                    }}
                >
                    <h1 style={{ fontSize: "1.25rem", marginBottom: 12 }}>
                        Erro ao renderizar a aplicação
                    </h1>
                    <pre
                        style={{
                            whiteSpace: "pre-wrap",
                            fontSize: 13,
                            color: "#fca5a5",
                        }}
                    >
                        {this.state.error.message}
                    </pre>
                    <button
                        type="button"
                        style={{
                            marginTop: 16,
                            padding: "8px 16px",
                            cursor: "pointer",
                        }}
                        onClick={() => globalThis.location.reload()}
                    >
                        Recarregar página
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
