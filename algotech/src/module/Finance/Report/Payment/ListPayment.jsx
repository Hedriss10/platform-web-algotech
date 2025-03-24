import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../../../service/UserContext";
import { notify } from "../../../utils/toastify";
import ManageReport from "../Service/ManageReport";
import Icons from "../../../utils/Icons";
import MaskCpf from "../../../utils/MaskCpf";

const ListPayment = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [reportsSellers, setReportsSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]); // Estado para armazenar IDs selecionados

  // Função para carregar os pagamentos
  const loadPaymentsUsers = async () => {
    setLoading(true);
    try {
      const usersApi = new ManageReport(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.getProcessPayments();
      if (response && response.data) {
        setReportsSellers(response.data);
        setTotalPages(response.metadata?.total_pages || 1);
      } else {
        throw new Error("Resposta da API inválida: data não encontrado");
      }
    } catch (error) {
      console.error("Erro ao carregar tabelas financeiras:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentsUsers();
  }, [currentPage, searchTerm, rowsPerPage]);

  // Função para deletar pagamentos
  const handleDeletePayment = async () => {
    try {
      if (selectedIds.length === 0) {
        notify("Nenhum pagamento selecionado", { type: "warning" });
        return;
      }
      const usersApi = new ManageReport(user?.id);
      const payload = { ids: selectedIds };
      const response = await usersApi.deletePayments(payload, token);

      if (response) {
        notify("Pagamentos deletados com sucesso!", { type: "success" });
        loadPaymentsUsers(); // Recarrega a lista após a exclusão
        setSelectedIds([]); // Limpa os IDs selecionados
      }
    } catch (error) {
      console.error("Erro ao deletar pagamentos:", error);
      notify("Erro ao deletar pagamentos", { type: "error" });
    }
  };

  // Função para selecionar/deselecionar IDs
  const handleSelectId = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id)); // Remove o ID se já estiver selecionado
    } else {
      setSelectedIds([...selectedIds, id]); // Adiciona o ID se não estiver selecionado
    }
  };

  // Função para selecionar/deselecionar todos os IDs da página atual
  const handleSelectAll = () => {
    const allIdsOnPage = reportsSellers.map((payment) => payment.id); // Pega todos os IDs da página atual

    if (selectedIds.length === allIdsOnPage.length) {
      // Se todos já estiverem selecionados, limpa a seleção
      setSelectedIds([]);
    } else {
      // Caso contrário, seleciona todos
      setSelectedIds(allIdsOnPage);
    }
  };

  // Função para mudar a página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Função para mudar o número de linhas por página
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Relatórios</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/report" className="hover:text-bg-gray-200">
              <strong>Gerenciar Relatórios</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        {/* Cabeçalho com título e botão de importar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            Lista de Pagamentos
          </h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition duration-300">
              <Icons.FaSearch className="text-white" />
            </button>
            <button
              className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition duration-300"
              onClick={handleDeletePayment}
            >
              <Icons.FaTrash className="text-white" />
            </button>
          </div>
        </div>

        {/* Tabela de convênios */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === reportsSellers.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Vendedor
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Número da Proposta
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Código da Tabela
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Taxa de comissão
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Valor Base
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Taxa de Repasse
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Código de Tabela
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Repasse de comissão
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Valor da Operação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {loading ? (
                <tr>
                  <td
                    colSpan="12"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : reportsSellers.length === 0 ? (
                <tr>
                  <td
                    colSpan="12"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Nenhum pagamento disponível.
                  </td>
                </tr>
              ) : (
                reportsSellers.map((ListPayment, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-550 transition duration-300"
                  >
                    <td className="px-6 py-4 text-sm text-gray-200">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(ListPayment.id)}
                        onChange={() => handleSelectId(ListPayment.id)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {ListPayment.username || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {MaskCpf(ListPayment.cpf) || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {ListPayment.number_proposal || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {ListPayment.table_code || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {ListPayment.taxe_comission || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {ListPayment.value_base || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      % {ListPayment.taxe_repasse || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {ListPayment.table_code || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      R$ {ListPayment.comission || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      R$ {ListPayment.value_operation || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex justify-between items-center mt-6">
          <div>
            <select
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>
          </div>
          <nav>
            <ul className="flex space-x-2">
              <li>
                <button
                  className={`px-4 py-2 bg-gray-600 text-white rounded-lg ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-500"
                  } transition duration-300`}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1}>
                  <button
                    className={`px-4 py-2 ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-600 text-white hover:bg-gray-500"
                    } rounded-lg transition duration-300`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  className={`px-4 py-2 bg-gray-600 text-white rounded-lg ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-500"
                  } transition duration-300`}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Próxima
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ListPayment;
