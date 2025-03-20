import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ManageTablesFinance from "../Service/ManageTablesFinance";
import { notify } from "../../utils/toastify";
import { useUser } from "../../../service/UserContext";
import Icons from "../../utils/Icons";

const TablesFinance = () => {
  const { bankerId, financialAgreementsId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [tablesFinance, setTablesFinance] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);

  // Buscar tabela financeira
  const loadTablesFinance = async () => {
    setLoading(true);
    try {
      const usersApi = new ManageTablesFinance(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.getAllTablesFinance(
        financialAgreementsId,
      );

      console.log("RETORNO DA API DAS TABELAS", response);
      if (response && response.data) {
        setTablesFinance(response.data);
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
    loadTablesFinance();
  }, [currentPage, searchTerm, rowsPerPage]);

  // Deletar tabelas financeiras em lote
  const handleDeleteTablesFinance = async () => {
    if (selectedTables.length === 0) {
      notify("Nenhuma tabela selecionada", { type: "warning" });
      return;
    }

    try {
      const tablesApi = new ManageTablesFinance(user?.id);
      const data = { ids: selectedTables };
      await tablesApi.deleteTablesFinance(financialAgreementsId, data, token);
      notify("Tabelas deletadas com sucesso", { type: "success" });

      setTablesFinance((prevTables) =>
        prevTables.filter((table) => !selectedTables.includes(table.id)),
      );

      setSelectedTables([]);
    } catch (error) {
      console.error("Erro ao deletar tabelas:", error);
      notify("Erro ao deletar tabelas", { type: "error" });
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
        <h1 className="text-2xl font-bold">Gerenciar Tabelas</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/finance" className="hover:text-gray-200">
              <strong>Bancos</strong>
            </Link>
            <Link
              to={`/addtables/${financialAgreementsId}`}
              className="hover:text-gray-200"
            >
              <strong>Cadastrar Tabela</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Tabelas Registradas
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
              <Icons.FaSearch className="text-white" />
            </button>
            <button
              className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition duration-300"
              onClick={handleDeleteTablesFinance}
            >
              <Icons.FaTrash className="text-white" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setSelectedTables(
                        e.target.checked ? tablesFinance.map((t) => t.id) : [],
                      );
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Flat
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
                  Código
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Taxa Inicio
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Taxa Fim
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : tablesFinance.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Nenhuma tabela encontrada.
                  </td>
                </tr>
              ) : (
                tablesFinance.map((table) => (
                  <tr
                    key={table.id}
                    className="hover:bg-gray-550 transition duration-300"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTables.includes(table.id)}
                        onChange={(e) => {
                          setSelectedTables((prev) =>
                            e.target.checked
                              ? [...prev, table.id]
                              : prev.filter((id) => id !== table.id),
                          );
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {table.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {table.rate || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {table.start_term || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {table.end_term || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {table.type_table || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {table.table_code || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {table.start_rate + "%" || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {table.end_rate + "%" || "N/A"}
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

export default TablesFinance;
