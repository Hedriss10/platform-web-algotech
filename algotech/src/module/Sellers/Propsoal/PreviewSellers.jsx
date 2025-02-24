import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { notify } from "../../utils/toastify";
import { useUser } from "../../../service/UserContext";
import MaskCpf from "../../utils/MaskCpf";
import Icons from "../../utils/Icons";
import ManageSellers from "../Service/ManageSellers";


const PreviewProposal = () => {
  const { user, token } = useUser();
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

  // passando o handle preview bankers passando o id e entrando em nova rota
  const handlePreviewProposal = async (id) => {
    try {
      navigate(`/proposal/${id}`);
    } catch (error) {
      notify("Erro ao processar a Proposta", { type: "error" });
    }
  };

  // Função para deletar o banks
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

  // função para redirecionar para o update do banks
  const handleUpdateProposal = (id) => {
    console.log("Edit proposal")
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
          <h2 className="text-xl font-semibold text-white">Lista de Propostas</h2>
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
                  Nome do Cliente
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Criado Em
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Atualizado Por
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white"> 
                  Tipo da operação
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Atualizado Em
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Digitador
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Visualizar
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Editar
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
              ) : proposal.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Nenhuma proposta encontrada.
                  </td>
                </tr>
              ) : (
                proposal.map((proposal) => (
                  <tr
                    key={proposal.id}
                    className="hover:bg-gray-550 transition duration-300"
                  >
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.client_proposal}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {MaskCpf(proposal.cpf)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.created_at}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.current_status || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.status_updated_by_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.type_operation || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.updated_at || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.username}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300"
                          onClick={() => handlePreviewBankers(proposal.id)}
                        >
                          <Icons.MdOutlinePreview className="text-white" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="p-2 bg-orange-600 rounded-lg hover:bg-orange-500 transition duration-300"
                        onClick={() => handleUpdateProposal(proposal.id)}
                      >
                        <Icons.FaEdit className="text-white" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition duration-300"
                        onClick={() => handleDeleteProposal(proposal.id)}
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

export default PreviewProposal;
