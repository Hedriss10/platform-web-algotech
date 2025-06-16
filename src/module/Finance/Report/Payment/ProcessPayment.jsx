import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { notify } from "../../../utils/toastify";
import { useUser } from "../../../../service/UserContext";
import ManageReport from "../Service/ManageReport";
import Icons from "../../../utils/Icons";

const ProcessPayments = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [proposal, setProposal] = useState([]);
  const [flags, setFlags] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlagId, setSelectedFlagId] = useState(null);
  const [decisionMaker, setDecisionMaker] = useState(false);

  // Função para carregar as propostas
  const loadProposal = async () => {
    setLoading(true);
    try {
      const usersApi = new ManageReport(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.getAllReportProposal();
      if (response && response.data) {
        setProposal(response.data);
        setTotalPages(response.metadata?.total_pages || 1);
        console.log("Estrutura de proposal:", response.data); // Log para depuração
      } else {
        setProposal([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Erro ao carregar propostas:", error);
      setProposal([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposal();
  }, [currentPage, searchTerm, rowsPerPage]);

  // Logar estado após atualização
  useEffect(() => {
    console.log("Estado atual - Selected Items:", selectedItems);
  }, [selectedItems]);

  // Função para carregar as flags
  const loadFlags = async () => {
    try {
      const usersApi = new ManageReport(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.getFlags();
      if (response && response.data) {
        setFlags(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar flags:", error);
      setFlags([]);
    }
  };

  // Função para processar o pagamento
  const handlePayment = async () => {
    try {
      if (selectedItems.length === 0) {
        notify("Selecione pelo menos uma proposta.", { type: "warning" });
        return;
      }
      if (!selectedFlagId) {
        notify("Selecione uma flag.", { type: "warning" });
        return;
      }

      const payload = {
        payments: selectedItems.map((item) => ({
          user_id: item.user_id,
          proposal_id: item.proposal_id,
          flag_id: Number(selectedFlagId),
        })),
      };

      const usersApi = new ManageReport(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.postPayment(payload, token);
      if (response && response.data) {
        setPayments(response.data);
        setTotalPages(response.metadata?.total_pages || 1);
        notify("Pagamento processado com sucesso!", { type: "success" });
        setIsModalOpen(false);
        setSelectedItems([]);
        setSelectedFlagId(null);
        setDecisionMaker(false);
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      notify("Erro ao processar pagamento.", { type: "error" });
      setPayments([]);
    }
  };

  // Função para abrir a modal e carregar as flags
  const openModal = async () => {
    if (selectedItems.length === 0) {
      notify("Selecione pelo menos uma proposta.", { type: "warning" });
      return;
    }
    await loadFlags();
    setIsModalOpen(true);
  };

  // Função para lidar com a seleção da checkbox
  const handleCheckboxChange = (e, prop) => {
    const proposalId = prop.proposal_id;
    const userId = prop.user_id;

    setSelectedItems((prev) => {
      if (e.target.checked) {
        if (
          !prev.some(
            (item) =>
              item.proposal_id === proposalId && item.user_id === userId,
          )
        ) {
          return [...prev, { user_id: userId, proposal_id: proposalId }];
        }
        return prev;
      } else {
        return prev.filter(
          (item) =>
            !(item.proposal_id === proposalId && item.user_id === userId),
        );
      }
    });
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

  // Componente da Modal
  const PaymentModal = ({
    isOpen,
    onClose,
    onConfirm,
    flags,
    selectedFlagId,
    setSelectedFlagId,
    decisionMaker,
    setDecisionMaker,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-whitesmoke flex items-center justify-center">
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold text-white">
            Confirmar Pagamento
          </h2>
          <div className="mt-4">
            <label className="block text-sm text-white mb-2">
              Selecione a Flag:
            </label>
            <select
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={selectedFlagId || ""}
              onChange={(e) => setSelectedFlagId(e.target.value)}
            >
              <option value="">Selecione uma flag</option>
              {flags.map((flag) => (
                <option key={flag.id} value={flag.id}>
                  {flag.name}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              checked={decisionMaker}
              onChange={(e) => setDecisionMaker(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-sm text-white">Tomada de Decisão</span>
          </label>
          <p className="text-sm text-white mt-2">
            <strong>
              Observação: Ao marcar a tomada de decisão, o vendedor que não está
              em um relatório de comissão receberá o pagamento.
            </strong>
          </p>
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition duration-300"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition duration-300"
              onClick={onConfirm}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Processar pagamento de comissão</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <li>
              <Link to="/home" className="hover:text-gray-200">
                <strong>Home</strong>
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/report" className="hover:text-gray-200">
                <strong>Gerenciamento de Relatório</strong>
              </Link>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Lista de propostas associadas
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Lista de propostas pagas e associadas nos relatórios importados.
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition duration-300">
              <Icons.FaSearch className="text-white" />
            </button>
            <button
              className="p-2 bg-green-600 rounded-lg hover:bg-green-500 transition duration-300"
              onClick={openModal}
            >
              <Icons.MdPayments className="text-white" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newItems = proposal
                          .filter(
                            (p) => p.user_id != null && p.proposal_id != null,
                          )
                          .map((p) => ({
                            user_id: p.user_id,
                            proposal_id: p.proposal_id,
                          }));
                        setSelectedItems(newItems);
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                    checked={
                      proposal.length > 0 &&
                      selectedItems.length ===
                        proposal.filter(
                          (p) => p.user_id != null && p.proposal_id != null,
                        ).length
                    }
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Digitador
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Nome do Cliente
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Tipo de Operação
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Tabela
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Flat
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Valor da Operação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : proposal.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Nenhuma proposta encontrada.
                  </td>
                </tr>
              ) : (
                proposal.map((prop, index) => (
                  <tr
                    key={`${prop.proposal_id}-${index}`}
                    className="hover:bg-gray-550 transition duration-300"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.some(
                          (item) =>
                            item.proposal_id === prop.proposal_id &&
                            item.user_id === prop.user_id,
                        )}
                        onChange={(e) => handleCheckboxChange(e, prop)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {prop.digitador || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {prop.nome}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {prop.operacao}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {prop.tabela}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      %{prop.rate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {prop.valor_operacao}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePayment}
        flags={flags}
        selectedFlagId={selectedFlagId}
        setSelectedFlagId={setSelectedFlagId}
        decisionMaker={decisionMaker}
        setDecisionMaker={setDecisionMaker}
      />
    </div>
  );
};

export default ProcessPayments;
