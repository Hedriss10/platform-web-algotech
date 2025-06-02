import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ManageUser from "./Service/ManageServiceUser";
import { notify } from "../utils/toastify";
import { useUser } from "../../service/UserContext";
import Icons from "../utils/Icons";
import TablesUsers from "./ui/tables/TablesUsers";
import Pagination from "../ui/Pagination/Pagination";

const ManageUsers = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Função para carregar os usuários
  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersApi = new ManageUser(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.getAllUsers();

      if (response && response.data) {
        setUsers(response.data); // Use response.data
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

  // Efeito para carregar os usuários
  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, rowsPerPage]);

  // Função para deletar um usuário
  const handleDeleteUser = async (id) => {
    try {
      const usersApi = new ManageUser();
      await usersApi.deleteUser(id, token); // Passa o token
      notify("Usuário deletado com sucesso", { type: "success" });
      loadUsers();
    } catch (error) {
      notify("Erro ao deletar usuário", { type: "error" });
    }
  };

  // Função para bloquear um usuário
  const handleBlockUser = async (id) => {
    try {
      const usersApi = new ManageUser();
      await usersApi.updateUser(id, { is_block: true }, token); // Passa o token
      notify("Usuário bloqueado com sucesso", { type: "success" });
      loadUsers();
    } catch (error) {
      notify("Error ao bloquear usário", { type: "error" });
    }
  };

  // função para redirecionar para o update do users
  const handleEditUser = (id) => {
    try {
      navigate(`/users/update/${id}`);
    } catch (error) {
      console.log(error);
      notify("Error ao editar usuário", { type: "error" });
    }
  };

  // Função para resetar a senha
  const handleResetPassword = async (e, userId) => {
    e.preventDefault();

    try {
      const usersApi = new ManageUser(user?.id);
      const payload = { id: userId };
      await usersApi.resetPassword(payload, token);
      notify("Senha resetada com sucesso", { type: "success" });
      loadUsers();
    } catch (error) {
      console.log(error);
      notify("Erro ao resetar senha", { type: "error" });
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
        <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/users" className="hover:text-bg-gray-200">
              <strong>Usuários</strong>
            </Link>
          </ol>
        </nav>
      </div>

      {/* Card da Tabela */}
      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        {/* Título e Campo de Busca */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Lista de Usuários
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
          </div>
        </div>

        {/* Tabela de Usuários */}
        <TablesUsers
          users={users}
          loading={loading}
          handleEditUser={handleEditUser}
          handleDeleteUser={handleDeleteUser}
          handleBlockUser={handleBlockUser}
          handleResetPassword={handleResetPassword}
        />

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

export default ManageUsers;
