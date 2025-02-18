// TODO - Adicionar funcionalidade de busca e paginação
// TODO PUXAR A TABELA DE FINANCEIRO
// TODO AJUSTAR O ID DO CONVENIO PARA PUXAR AS TABRELAS DELE
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ManageTablesFinance from "../Service/ManageTablesFinance";
import ManageBankers from "../Service/ManageBankers";
import { notify } from "../../utils/toastify";
import { useUser } from "../../../service/UserContext";
import { FaSearch, FaTrash } from "react-icons/fa";

const TablesFinance = () => {
  const { bankerId, financialAgreementsId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [tablesFinance, setTablesFinance] = useState([]);
  const [bankerName, setBankerName] = useState("");
  const [bankerID, setBankerID] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // // Buscar dados do banco
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       setLoading(true);
  //       const usersApi = new ManageBankers(user?.id);
  //       const response = await usersApi.getBankersById(bankerId, token);
  //       console.log("Resposta do banco:", response);
  //       if (response && response.data.length > 0) {
  //         const bankData = response.data[0];
  //         setBankerName(bankData.name_bank || "");
  //         setBankerID(bankData.bank_id || "");
  //       }
  //     } catch (error) {
  //       notify("Erro ao carregar dados do banco", { type: "error" });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, [bankerId, token, user]);

  // Buscar tabelas financeiras
  useEffect(() => {
    const fetchTablesFinance = async () => {
      try {
        setLoading(true);
        const tablesApi = new ManageTablesFinance(user?.id);
        if (!bankerID || !financialAgreementsId) {
          throw new Error("bankerID ou financialAgreementsId não definidos");
        }
        const response = await tablesApi.getAllTablesFinance(bankerID, financialAgreementsId);
        console.log("Resposta da API:", response);
        if (response && Array.isArray(response.data)) {
          setTablesFinance(response.data);
          setTotalPages(Math.ceil(response.data.length / rowsPerPage));
        } else {
          console.error("Resposta da API inválida:", response);
          notify("Dados inválidos recebidos da API", { type: "error" });
        }
      } catch (error) {
        console.error("Erro ao buscar tabelas financeiras:", error);
        notify("Erro ao carregar tabelas financeiras", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchTablesFinance();
  }, [bankerID, financialAgreementsId, token, user, rowsPerPage]);

  // Deletar tabela financeira
  const handleDeleteTablesFinance = async (id) => {
    try {
      const tablesApi = new ManageTablesFinance(user?.id);
      await tablesApi.deleteTablesFinance(id, token);
      notify("Tabela deletada com sucesso", { type: "success" });
      const updatedTables = tablesFinance.filter((table) => table.id !== id);
      setTablesFinance(updatedTables);
    } catch (error) {
      notify("Erro ao deletar tabela", { type: "error" });
    }
  };

  // Manipulação da paginação
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filtro de busca
  const filteredTables = tablesFinance.filter((table) =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Dados paginados
  const paginatedTables = filteredTables.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      {/* Título e Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Tabelas</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/finance" className="hover:text-bg-gray-200">
              <strong>Bancos</strong>
            </Link>
            <Link to="/addtables" className="hover:text-bg-gray-200">
              <strong>Cadastrar Tabela</strong>
            </Link>
          </ol>
        </nav>
      </div>

      {/* Card da Tabela */}
      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        {/* Título e Campo de Busca */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Tabelas do {bankerName}
          </h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar tabela..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition duration-300">
              <FaSearch className="text-white" />
            </button>
          </div>
        </div>

        {/* Tabela de Financeiro */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Taxa
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Prazo Início
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Prazo Fim
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Tipo Tabela
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : paginatedTables.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Nenhuma tabela encontrada.
                  </td>
                </tr>
              ) : (
                paginatedTables.map((table) => (
                  <tr
                    key={table.id}
                    className="hover:bg-gray-550 transition duration-300"
                  >
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {table.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {table.tax || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {table.start_term || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {table.end_term || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {table.table_type || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition duration-300"
                          onClick={() => handleDeleteTablesFinance(table.id)}
                        >
                          <FaTrash className="text-white" />
                        </button>
                      </div>
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
                  disabled={currentPage === 1}
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
                  disabled={currentPage === totalPages}
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

export default TablesFinance;
