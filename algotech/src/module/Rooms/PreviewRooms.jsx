import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { notify } from "../utils/toastify";
import { useUser } from "../../service/UserContext";
import Icons from "../utils/Icons";
import ManageRooms from "../Rooms/Service/ManageRooms";

const PreviewRooms = () => {
  const { id } = useParams(); // Captura o id da sala da URL
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // Estado para armazenar os IDs dos usuários selecionados
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Função para carregar os usuários da sala
  const loadUsersRooms = async (id) => {
    setLoading(true);
    try {
      const usersApi = new ManageRooms(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.getAllUsersRooms(id);

      if (response && response.data) {
        setUsersInRoom(response.data);
        setTotalPages(response.metadata.total_pages);
      } else {
        throw new Error("Resposta da API inválida: data não encontrado");
      }
    } catch (error) {
      console.error(error);
      notify("Erro ao carregar usuários da sala", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar um ou mais usuários da sala
  const handleDeleteUsersRooms = async (roomId, userIds) => {
    try {
      const rooms = new ManageRooms(user?.id);
      const roomsUsers = { ids: userIds }; // Passa todos os IDs dos usuários
      await rooms.deleteUsersRooms(roomId, roomsUsers, token); // Passa o id da sala, os IDs dos usuários e o token
      notify("Usuário(s) deletado(s) da sala com sucesso", { type: "success" });
      setSelectedUsers([]); // Limpa a seleção de usuários
      setUsersInRoom((prevUsers) =>
        prevUsers.filter((user) => !userIds.includes(user.id)),
      ); /// TODO codigo perfomatico
    } catch (error) {
      notify("Erro ao deletar usuário(s) da sala", { type: "error" });
    }
  };

  // Função para selecionar/deselecionar um usuário
  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId)); // Remove o ID se já estiver selecionado
    } else {
      setSelectedUsers([...selectedUsers, userId]); // Adiciona o ID se não estiver selecionado
    }
  };

  // Função para selecionar/deselecionar todos os usuários
  const handleSelectAllUsers = () => {
    if (selectedUsers.length === usersInRoom.length) {
      setSelectedUsers([]); // Desmarca todos se já estiverem selecionados
    } else {
      setSelectedUsers(usersInRoom.map((user) => user.id)); // Seleciona todos
    }
  };

  // Função para deletar usuários selecionados em lote
  const handleDeleteSelectedUsers = () => {
    if (selectedUsers.length === 0) {
      notify("Nenhum usuário selecionado", { type: "warning" });
      return;
    }
    handleDeleteUsersRooms(id, selectedUsers);
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

  // Carrega os usuários da sala quando o componente é montado ou quando o id, currentPage, rowsPerPage ou searchTerm mudam
  useEffect(() => {
    if (id) {
      loadUsersRooms(id);
    }
  }, [id, currentPage, rowsPerPage, searchTerm]);

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      {/* Título e Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Lista de Usuário</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/rooms" className="hover:text-bg-gray-200">
              <strong>Salas</strong>
            </Link>
            <Link to="/usersrooms" className="hover:text-bg-gray-200">
              <strong>Cadastrar usuarios na sala</strong>
            </Link>
          </ol>
        </nav>
      </div>

      {/* Título e Campo de Busca */}
      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
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
            {/* Botão para deletar usuários selecionados */}
            <button
              className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition duration-300"
              onClick={handleDeleteSelectedUsers}
            >
              <Icons.FaTrash className="text-white" />
            </button>
          </div>
        </div>

        {/* Tabela de usuários que estão na sala */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === usersInRoom.length}
                    onChange={handleSelectAllUsers}
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Sala
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Cargo
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
              ) : usersInRoom.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Nenhum usuário encontrado na sala.
                  </td>
                </tr>
              ) : (
                usersInRoom.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-550 transition duration-300"
                  >
                    <td className="px-6 py-4 text-sm text-gray-200">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {user.room_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {user.role}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition duration-300"
                          onClick={() => handleDeleteUsersRooms(id, [user.id])}
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

export default PreviewRooms;
