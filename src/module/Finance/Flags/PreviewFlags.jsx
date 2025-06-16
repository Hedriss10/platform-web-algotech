import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../../service/UserContext";
import ManageReport from "../Report/Service/ManageReport";
import Icons from "../../utils/Icons";
import { notify } from "../../utils/toastify";

const PreviewFlags = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [flags, setFlags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);

  const loadFlags = async () => {
    setLoading(true);
    try {
      const usersApi = new ManageReport(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.getFlags();
      if (response && response.data) {
        setFlags(response.data);
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
    loadFlags();
  }, [currentPage, searchTerm, rowsPerPage]);

  // Função para apagar á flag especifica
  const handleDeleteFlags = async (id) => {
    if (selectedTables.length === 0) {
      notify("Nenhuma Flag selecionada", { type: "warning" });
      return;
    }

    try {
      const tablesApi = new ManageReport(user?.id);
      const data = { ids: selectedTables };
      await tablesApi.deleteFlags(data, token);
      notify("Flags deletadas com sucesso", { type: "success" });

      setFlags((prevTables) =>
        prevTables.filter((flags) => !selectedTables.includes(flags.id)),
      );
      setSelectedTables([]);
      loadFlags();
    } catch (error) {
      console.error("Erro ao deletar Flags:", error);
      notify("Erro ao deletar Flag", { type: "error" });
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
        <h1 className="text-2xl font-bold">Gerenciamento de Flags</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/newflag" className="hover:text-bg-gray-200">
              <strong>Cadastrar uma flag</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        {/* Cabeçalho com título e botão de importar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Lista de Flags</h2>
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
              onClick={handleDeleteFlags}
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
                    onChange={(e) => {
                      setSelectedTables(
                        e.target.checked ? flags.map((t) => t.id) : [],
                      );
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Taxa
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {loading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : flags.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Nenhum flag disponível.
                  </td>
                </tr>
              ) : (
                flags.map((flagsReport, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-550 transition duration-300"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTables.includes(flagsReport.id)}
                        onChange={(e) => {
                          setSelectedTables((prev) =>
                            e.target.checked
                              ? [...prev, flagsReport.id]
                              : prev.filter((id) => id !== flagsReport.id),
                          );
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {flagsReport.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      % {flagsReport.rate || "N/A"}
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

export default PreviewFlags;
