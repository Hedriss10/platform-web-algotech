import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useUser } from "../../service/UserContext";
import { notify } from "../utils/toastify";
import ManageOperational from "./Service/MangeOperational";
import Icons from "../utils/Icons";
import MaskCpf from "../utils/MaskCpf";

const mockFilterProposal = {
  current_status: "",
};

const PreviewOperational = () => {
  const { user, token } = useUser();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterValues, setFilterValues] = useState(mockFilterProposal);

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const applyFilter = () => {
    setSearchTerm(filterValues.current_status);
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };

  const loadOperational = async () => {
    setLoading(true);
    setProposal([]); // Limpa os dados ANTES de fazer a requisição

    try {
      const usersApi = new ManageOperational(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );

      const response = await usersApi.getListProposalOperational(token);

      if (response.empty) {
        notify("Nenhuma proposta encontrada", { type: "info" });
        setProposal([]);
        setTotalPages(1);
      } else {
        setProposal(response.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error("Erro ao carregar propostas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar os usuários
  useEffect(() => {
    loadOperational();
  }, [currentPage, searchTerm, rowsPerPage]);

  // Função para redirecionar a visualização da proposta
  const handlePreviewProposal = (id) => {
    try {
      navigate(`/operational/proposal/${id}`);
    } catch (error) {
      console.log(error);
      notify("Erro ao processar a Proposta", { type: "error" });
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

  // função para redirecionar para o update do proposal e verificando se ela está paga
  const handleUpdateProposal = (id) => {
    try {
      navigate(`/operational/proposal/update/${id}`);
    } catch (error) {
      console.log(error);
      notify("Error ao editar Proposta", { type: "error" });
    }
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      {/* Título e Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento Operacional</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
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
              placeholder="Buscar Proposta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition duration-300">
              <Icons.FaSearch className="text-white" />
            </button>
            <button
              className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition duration-300"
              onClick={openFilterModal}
            >
              <Icons.CiFilter className="text-white" />
            </button>
          </div>
        </div>

        {/* Modal de Filtro */}
        {isFilterModalOpen && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Filtrar Propostas</h2>
              <div className="space-y-4">
                <select
                  name="current_status"
                  value={filterValues.current_status}
                  onChange={(e) =>
                    setFilterValues({
                      ...filterValues,
                      current_status: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione o Status</option>
                  <option value="Aguardando Digitação">
                    Aguardando Digitação
                  </option>
                  <option value="Pendente de Digitação">
                    Pendente de Digitação
                  </option>
                  <option value="Contrato em Digitação">
                    Contrato em Digitação
                  </option>
                  <option value="Aguardando Pagamento">
                    Aguardando Pagamento
                  </option>
                  <option value="Aceite Feito - Análise Banco">
                    Aceite Feito - Análise Banco
                  </option>
                  <option value="Contrato Pendente - Banco">
                    Contrato Pendente - Banco
                  </option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  onClick={() => setIsFilterModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={applyFilter}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

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
                  Operação
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Banco
                </th>
                {/* <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Data de Criação
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Data da Digitação
                </th> */}
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Vendedor
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
                      {proposal.nome_cliente || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {MaskCpf(proposal.cpf_cliente) || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.tipo_operacao || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.current_status || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.banco || "N/A"}
                    </td>
                    {/* <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.data_criacao || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.digitado_as || "N/A"}
                    </td> */}
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.nome_digitador || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proposal.digitador_por || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300"
                          onClick={() => handlePreviewProposal(proposal.id)}
                        >
                          <Icons.MdOutlinePreview className="text-white" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className={`p-2 rounded-lg transition duration-300 ${
                          proposal.current_status === "Contrato Pago"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-orange-600 hover:bg-orange-500"
                        }`}
                        onClick={() => {
                          if (proposal.current_status !== "Contrato Pago") {
                            handleUpdateProposal(proposal.id);
                          }
                        }}
                        disabled={proposal.current_status === "Contrato Pago"}
                      >
                        <Icons.FaEdit className="text-white" />
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

export default PreviewOperational;
