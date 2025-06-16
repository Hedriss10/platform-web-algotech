import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ManageBankers from "./Service/ManageBankers";
import { notify } from "../utils/toastify";
import { useUser } from "../../service/UserContext";
import Icons from "../utils/Icons";

const PreviewFinance = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [bankers, setBankers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadBankers = async () => {
    setLoading(true);
    try {
      const usersApi = new ManageBankers(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.getAllBankers();
      setBankers(response.data);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Efeito para carregar os usuários
  useEffect(() => {
    loadBankers();
  }, [currentPage, searchTerm, rowsPerPage]);

  // passando o handle preview bankers passando o id e entrando em nova rota
  const handlePreviewBankers = async (id) => {
    try {
      navigate(`/bank/${id}`);
    } catch (error) {
      notify("Erro ao processar o Banco", { type: "error" });
    }
  };

  // Função para deletar o banks
  const handleDeleteBankers = async (id) => {
    try {
      const usersApi = new ManageBankers(user?.id);
      await usersApi.deleteBankers(id, token); // Passa o token
      notify("Banco deletado com sucesso", { type: "success" });
      loadBankers();
    } catch (error) {
      notify("Error ao deletar banco", { type: "error" });
    }
  };

  // função para redirecionar para o update do banks
  const handlerEditBankers = (id) => {
    try {
      navigate(`/bank/update/${id}`);
    } catch (error) {
      console.log(error);
      notify("Error ao editar banco", { type: "error" });
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
      {/* Título e Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Bancos</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/newbank" className="hover:text-bg-gray-200">
              <strong>Cadastrar banco</strong>
            </Link>
          </ol>
        </nav>
      </div>

      {/* Card da Tabela */}
      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        {/* Título e Campo de Busca */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Lista de Bancos</h2>
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

        {/* Tabela de Usuários */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Criado em
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Visualizar
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Editar
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Apagar
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
              ) : bankers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Nenhum banco encontrado.
                  </td>
                </tr>
              ) : (
                bankers.map((banker) => (
                  <tr
                    key={banker.id}
                    className="hover:bg-gray-550 transition duration-300"
                  >
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {banker.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {banker.create_at}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300"
                          onClick={() => handlePreviewBankers(banker.id)}
                        >
                          <Icons.MdOutlinePreview className="text-white" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="p-2 bg-orange-600 rounded-lg hover:bg-orange-500 transition duration-300"
                        onClick={() => handlerEditBankers(banker.id)}
                      >
                        <Icons.FaEdit className="text-white" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition duration-300"
                        onClick={() => handleDeleteBankers(banker.id)}
                      >
                        <Icons.FaTrash className="text-white" />
                      </button>
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

export default PreviewFinance;
