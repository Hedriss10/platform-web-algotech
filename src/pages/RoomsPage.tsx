import Room from "../module/room/Room";

/**
 * Página só define a rota; UI e lógica de domínio ficam em `module/room/Room`.
 */
export default function RoomsPage() {
  return <Room />;
}
