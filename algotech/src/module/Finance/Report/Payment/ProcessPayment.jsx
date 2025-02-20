/// TODO REALIZAR PAGAMENTO 
/// TODO CONSUMIR A FLAG REGISTRADA 
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { notify } from "../../../utils/toastify";
import { useUser } from "../../../../service/UserContext";
import ManageReport from "../Service/ManageReport";
import Icons from "../../../utils/Icons";
import MaskCpf from "../../../utils/MaskCpf";

const ProcessPayments = () => {
  const { user, token } = useUser();
  const [sellers, setImports] = useState([]);
  const [flags , setFlags] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [has_report, sethas_report] = useState(true);

  // Função para carregar os usuários que foram aprovados no check
  const loadSellers = async () => {
    setLoading(true); // Ativar o estado de carregamento
    try {
      const usersApi = new ManageReport(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.getAllReportSellers(has_report);
      if (response && response.data) {
        setImports(response.data);
        setTotalPages(response.metadata?.total_pages || 1);
      } else {
        // Se não houver dados, limpa a tabela
        setImports([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      // Em caso de erro (como 404), limpa a tabela
      setImports([]);
      setTotalPages(1);
    } finally {
      setLoading(false); // Desativar o estado de carregamento
    }
  };

  useEffect(() => {
    loadSellers();
  }, [currentPage, searchTerm, rowsPerPage, has_report]); // Adicionando has_report como dependência


  // flag para controlar o carregamento
  const handleFlas = async () => {
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
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setFlags([]);
      setTotalPages(1);
    }
  }


  // Função para mudar a página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Função para mudar o número de linhas por página
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  // Função para lidar com a mudança do checkbox
  const handleCheckboxChange = (e) => {
    sethas_report(e.target.checked);
    loadSellers(); // Chama a API novamente para atualizar a tabela
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Processar pagamento de comissão</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/report" className="hover:text-bg-gray-200">
              <strong>Gerenciamento de Relatório</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Lista de vendedores
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Lista de vendedores que contém propostas pagas e associadas nos relatórios importados.
          </p>
        </div>

        {/* Checkbox e campo de busca */}
        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={has_report}
              onChange={handleCheckboxChange} // Usando a função handleCheckboxChange
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-sm text-white">Filtrar por vendedores que não estão em relatórios</span>
          </label>
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
          </div>
        </div>

        {/* Tabela de usuários */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setSelectedTables(
                        e.target.checked ? sellers.map((t) => t.id) : [],
                      );
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Cargo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : sellers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Nenhum relatório disponível.
                  </td>
                </tr>
              ) : (
                sellers.map((sellersCheck, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-550 transition duration-300"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTables.includes(sellersCheck.id)}
                        onChange={(e) => {
                          setSelectedTables((prev) =>
                            e.target.checked
                              ? [...prev, sellersCheck.id]
                              : prev.filter((id) => id !== sellersCheck.id),
                          );
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {sellersCheck.username || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {MaskCpf(sellersCheck.cpf) || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {sellersCheck.role || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

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
    </div>
  );
};

export default ProcessPayments;