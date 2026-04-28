import LoanOperations from "../module/loan-operation/LoanOperations";

/**
 * Página só define a rota; UI e lógica de domínio ficam em `module/loan-operation/LoanOperations`.
 */
export default function LoanOperationsPage() {
  return <LoanOperations />;
}
