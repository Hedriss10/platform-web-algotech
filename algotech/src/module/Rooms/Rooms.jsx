import React, { useState, useEffect } from "react";
import { useUser } from "../../service/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { notify } from "../utils/toastify";
import Icons from "../utils/Icons";
import ManageServiceRooms from "./service/ManageServiceRooms";
import TablesRooms from "./ui/tables/TablesRooms";
import Pagination from "../ui/Pagination/Pagination";

const Rooms = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // função para listar salas
  const loadRooms = async () => {
    setLoading(true);
    try {
      const usersApi = new ManageServiceRooms(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.getAllRooms();

      if (response && response.data) {
        setRooms(response.data);
        setTotalPages(response.metadata.total_pages);
      } else {
        throw new Error("Resposta da API inválida: data não encontrado");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar os usuários
  useEffect(() => {
    loadRooms();
  }, [currentPage, searchTerm, rowsPerPage]);

  // Deletar uma sala
  const handleDeleteRooms = async (id) => {
    try {
      const rooms = new ManageServiceRooms();
      await rooms.deleteRoom(id, token); // Passa o token
      notify("Sala deletado com sucesso", { type: "success" });
      loadRooms();
    } catch (error) {
      notify("Erro ao deletar sala", { type: "error" });
    }
  };

  // Editar uma sala
  const handleEditRooms = (id) => {
    try {
      navigate(`/rooms/update/${id}`);
    } catch (error) {
      console.log(error);
      notify("Error ao editar sala", { type: "error" });
    }
  };

  // Função para processar a sala
  const handleGetRoomByid = (id) => {
    try {
      navigate(`/rooms/${id}`);
    } catch (error) {
      notify("Error ao processar a sala", { type: "error" });
    }
  };

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
        <h1 className="text-2xl font-bold">Gerenciar Salas</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/rooms" className="hover:text-bg-gray-200">
              <strong>Salas</strong>
            </Link>
            <Link to="/newrooms" className="hover:text-bg-gray-200">
              <strong>Cadastrar Sala</strong>
            </Link>
          </ol>
        </nav>
      </div>

      {/* Card da Tabela */}
      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        {/* Título e Campo de Busca */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Listar Salas</h2>
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
        <TablesRooms
          rooms={rooms}
          loading={loading}
          handleGetRoomByid={handleGetRoomByid}
          handleDeleteRooms={handleDeleteRooms}
          handleEditRooms={handleEditRooms}
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

export default Rooms;
