import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ManageProfit from "../../Profit/Service/ManageProfit";
import { useUser } from "../../../service/UserContext";
import Icons from "../../utils/Icons";

const RankingSellers = () => {
  const { user, token } = useUser();
  const [contract, setContract] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadProfit = async () => {
    setLoading(true);
    try {
      const usersApi = new ManageProfit(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.getProfitSellers(token);
      setContract(response.data);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfit();
  }, [currentPage, searchTerm, rowsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ranking de Vendedores</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/sellers" className="hover:text-bg-gray-200">
              <strong>Gerenciamento de Propostas</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Lista de ranking de vendedores
          </h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar Contrato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition duration-300">
              <Icons.FaSearch className="text-white" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Posição
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : contract.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Nenhum contrato encontrado.
                  </td>
                </tr>
              ) : (
                contract.map((contractItem, index) => {
                  const isLast = index >= contract.length - 2;
                  return (
                    <tr
                      key={contractItem.id || contractItem.username + index}
                      className={`hover:bg-gray-550 transition duration-300 ${
                        isLast ? "bg-red-400" : ""
                      }`}
                    >
                      <td
                        className={`px-6 py-4 text-sm ${isLast ? "text-red-300" : "text-gray-200"}`}
                      >
                        <strong>{contractItem.username}</strong>
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${isLast ? "text-red-300" : "text-gray-200"}`}
                      >
                        <strong>{contractItem.posicao}</strong>
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${isLast ? "text-red-300" : "text-gray-200"}`}
                      >
                        <strong>{contractItem.total_ranking}</strong>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

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

export default RankingSellers;
