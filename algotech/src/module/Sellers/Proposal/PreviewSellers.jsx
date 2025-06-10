import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { notify } from "../../utils/toastify";
import { useUser } from "../../../service/UserContext";
import Icons from "@module/utils/Icons";
import ManageSellers from "@module/Sellers/Service/ManageSellers";
import TablesProposal from "@module/Sellers/ui/tables/TablesProposal";
import Pagination from "@module/ui/Pagination/Pagination";

const PreviewProposal = () => {
  const { user, token } = useUser();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadProposal = async () => {
    setLoading(true);
    try {
      const usersApi = new ManageSellers(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.getAllProposal(token);
      setProposal(response.data);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Efeito para carregar os usuários
  useEffect(() => {
    loadProposal();
  }, [currentPage, searchTerm, rowsPerPage]);

  // Função para deletar o proposal
  const handleDeleteProposal = async (id) => {
    try {
      const usersApi = new ManageSellers(user?.id);
      await usersApi.deleteProposal(id, token); // Passa o token
      notify("Proposta deletada com sucesso", { type: "success" });
      loadProposal();
    } catch (error) {
      notify("Error ao deletar Proposta.", { type: "error" });
    }
  };

  // Função para redirecionar a visualização da proposta
  const handlePreviewProposal = (id) => {
    try {
      navigate(`/proposal/${id}`);
    } catch (error) {
      console.log(error);
      notify("Erro ao processar a Proposta", { type: "error" });
    }
  };

  // função para redirecionar para o update do proposal e verificando se ela está paga
  const handleUpdateProposal = (id) => {
    try {
      navigate(`/proposal/update/${id}`);
    } catch (error) {
      console.log(error);
      notify("Error ao editar Proposta", { type: "error" });
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
        <h1 className="text-2xl font-bold">Gerenciar Propostas</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/proposal" className="hover:text-bg-gray-200">
              <strong>Cadastrar Proposta</strong>
            </Link>
          </ol>
        </nav>
      </div>

      {/* Card da Tabela */}
      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        {/* Título e Campo de Busca */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Lista de Propostas
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
        <TablesProposal
          proposal={proposal}
          loading={loading}
          handlePreviewProposal={handlePreviewProposal}
          handleUpdateProposal={handleUpdateProposal}
          handleDeleteProposal={handleDeleteProposal}
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

export default PreviewProposal;
