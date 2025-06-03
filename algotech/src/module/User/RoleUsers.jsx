import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icons from "../utils/Icons";
import { useUser } from "../../service/UserContext";
import { notify } from "../utils/toastify";
import Roles from "./service/Roles";

const RoleUsers = () => {
  const [role, setRole] = useState("");
  const { user, token } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Função para carregar os cargos
  const loadRoles = async () => {
    setLoading(true);
    try {
      const apiRoles = new Roles(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await apiRoles.getAllRoles();

      if (response && response.data) {
        setRole(response.data);
        setTotalPages(response.metadata.total_pages);
      } else {
        throw new Error("Resposta da API inválida: data não encontrado");
      }
    } catch (error) {
      console.error(error); // Log do erro no console para depuração
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, [currentPage, searchTerm, rowsPerPage]);

  const [formData, setFormData] = useState({
    name: "",
  });

  // Função para mudar a página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Função para mudar o número de linhas por página
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  // Função para deletar um cargo
  const handleDeleteRole = async (id) => {
    try {
      const userApi = new Roles(user?.id);
      const response = await userApi.deleteRole(id, token);
      notify("Cargo criado com sucesso", { type: "success" });
    } catch (error) {
      notify("Error ao deletar o cargo", { type: "error" });
    } finally {
      loadRoles();
    }
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      {/* Título e Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Cargos</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/roles" className="hover:text-bg-gray-200">
              <strong>Cargos</strong>
            </Link>
            <Link to="/newrole" className="hover:text-bg-gray-200">
              <strong>Cadastrar Cargo</strong>
            </Link>
          </ol>
        </nav>
      </div>

      {/* Card da Tabela */}
      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        {/* Título e Campo de Busca */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Lista de Cargos</h2>
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
                  Deletar
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
              ) : role.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Nenhum cargo encontrado.
                  </td>
                </tr>
              ) : (
                role.map((roles) => (
                  <tr
                    key={roles.id}
                    className="hover:bg-gray-550 transition duration-300"
                  >
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {roles.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition duration-300"
                          onClick={() => handleDeleteRole(roles.id)}
                        >
                          <Icons.FaTrash className="text-white" />
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

export default RoleUsers;
