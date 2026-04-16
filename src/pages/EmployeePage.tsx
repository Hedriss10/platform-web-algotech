import Employee from "../module/employee/Employee";

/**
 * Página só define a rota; UI e lógica de domínio ficam em `module/employee/Employee`.
 */
export default function EmployeePage() {
  return <Employee />;
}
