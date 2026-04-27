import Banker from "../module/banker/Banker";

/**
 * Página só define a rota; UI e lógica de domínio ficam em `module/banker/Banker`.
 */
export default function BankerPage() {
  return <Banker />;
}
