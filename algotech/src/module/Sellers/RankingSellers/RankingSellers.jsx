import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../../service/UserContext";
import ManageProfit from "@module/Profit/Service/ManageProfit";
import Icons from "@module/utils/Icons";
import Pagination from "@module/ui/Pagination/Pagination";
import TablesRankingSellers from "@module/Sellers/ui/tables/TablesRankingSellers";

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

        {/* Lista de raking de sellers */}
        <TablesRankingSellers contract={contract} loading={loading} />

        {/* Paginação */}
        <Pagination
          rowsPerPage={rowsPerPage}
          handlePageChange={handlePageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default RankingSellers;
