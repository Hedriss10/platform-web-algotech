import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ManageUser from "../User/Service/UsersApi";
import ManageRooms from "../Rooms/Service/ManageRooms";
import { notify } from "../utils/toastify";
import { useUser } from "../../service/UserContext";
import Icons from "../utils/Icons";

const UsersRooms = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [users, setUsers] = useState([]);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    loadRooms();
  }, [searchTerm]);

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

  const loadRooms = async () => {
    try {
      const roomsApi = new ManageRooms(user?.id);
      const response = await roomsApi.getAllRooms();
      setRooms(response.data || []);
    } catch (error) {
      notify("Erro ao carregar salas", { type: "error" });
    }
  };

  // Função para selecionar/deselecionar todos os usuários
  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]); // Desmarca todos se já estiverem selecionados
    } else {
      setSelectedUsers(users.map((user) => user.id)); // Seleciona todos
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAssignUsersToRoom = async () => {
    if (!selectedRoom || selectedUsers.length === 0) {
      notify("Selecione pelo menos um usuário e uma sala", { type: "error" });
      return;
    }

    try {
      const roomsApi = new ManageRooms(user?.id);
      const newRooms = {
        rooms_id: [selectedRoom].map((item) => parseInt(item, 10)),
      };

      await roomsApi.postRoomsUsers({ ids: selectedUsers, ...newRooms }, token);

      notify("Usuários adicionados à sala com sucesso!", { type: "success" });
      setSelectedUsers([]);
    } catch (error) {
      notify("Erro ao associar usuários à sala", { type: "error" });
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
              <strong>Cadastrar Usuários Na Sala</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg"
            placeholder="Buscar usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-white-500 transition duration-300"
            onChange={(e) => setSelectedRoom(e.target.value)}
            value={selectedRoom || ""}
          >
            <option value="" disabled>
              Selecione uma Sala
            </option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
          <button
            className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition duration-300"
            onClick={handleAssignUsersToRoom}
          >
            Associar Usuários
          </button>
        </div>
        <table className="min-w-full bg-gray-600 rounded-lg">
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
                Nome
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Cargo
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-300">
                  Carregando...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-200">{user.username}</td>
                  <td className="px-6 py-4 text-gray-200">{user.role}</td>
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

export default UsersRooms;
