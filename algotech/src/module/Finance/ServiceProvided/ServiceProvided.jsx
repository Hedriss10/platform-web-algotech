import { useEffect, useState, useMemo, useRef, useCallback, memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../../service/UserContext";
import { notify } from "../../utils/toastify";
import ManageReport from "../Report/Service/ManageReport";
import Icons from "../../utils/Icons";
import MaskCpf from "../../utils/MaskCpf";
import { NumericFormat } from "react-number-format";

// Função utilitária para converter string monetária em número
const parseCurrency = (value) => {
  if (value == null) return 0;
  if (typeof value !== "string") return Number(value) || 0;
  const cleanValue = value.replace(/[^\d,]/g, "").replace(",", ".");
  return Number(cleanValue) || 0;
};

// Função de debounce
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Componente isolado para o input de cada proposta
const ProposalInput = ({ proposalId, onValueChange }) => {
  const [localValue, setLocalValue] = useState("");
  const inputRef = useRef(null);

  const handleChange = useCallback(
    (values) => {
      console.log("handleChange chamado:", { proposalId, values });
      const { floatValue } = values;
      setLocalValue(floatValue ?? "");
      onValueChange(proposalId, floatValue ?? "");
    },
    [proposalId, onValueChange],
  );

  const handleFocus = useCallback(() => {
    console.log("Input recebeu foco:", { proposalId });
  }, [proposalId]);

  const handleBlur = useCallback(() => {
    console.log("Input perdeu foco:", { proposalId });
  }, [proposalId]);

  // Manter foco após rerenderizações
  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      inputRef.current.focus();
    }
  }, [localValue]);

  return (
    <div className="mt-2">
      <NumericFormat
        getInputRef={inputRef}
        value={localValue}
        onValueChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        decimalScale={2}
        allowNegative={false}
        allowLeadingZeros
        placeholder="R$ 0,00"
        className="ml-2 px-2 py-1 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

// Memoizar o componente
const MemoizedProposalInput = memo(ProposalInput);

const ServiceProvided = () => {
  const { user, token } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operationValues, setOperationValues] = useState({});

  const handleListProposalPayments = async () => {
    if (!user?.id) {
      console.warn("Usuário não autenticado. ID do usuário não disponível.");
      notify("Usuário não autenticado.", { type: "error" });
      setProposal([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const usersApi = new ManageReport(
        user.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      console.log("Parâmetros enviados para API:", {
        userId: user.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      });
      const response = await usersApi.getPaymentsProposal();
      console.log("Resposta da API:", response);
      if (response && response.data) {
        const validProposals = response.data.filter(
          (item) => item.proposal_id != null && item.proposal_id !== "",
        );
        console.log("Propostas recebidas:", validProposals);
        const ids = validProposals.map((item) => item.proposal_id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
          console.warn("Atenção: IDs duplicados encontrados!", ids);
        }
        setProposal(validProposals);
        setTotalPages(response.metadata?.total_pages || 1);
      } else {
        console.warn("Nenhum dado retornado pela API.");
        setProposal([]);
      }
    } catch (error) {
      console.error("Erro ao carregar tabelas financeiras:", error);
      notify("Erro ao carregar propostas.", { type: "error" });
      setProposal([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleListProposalPayments();
  }, [currentPage, searchTerm, rowsPerPage, user?.id]);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleSelectId = (id) => {
    if (id == null) return;
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    const allIdsOnPage = proposal.map((payment) => payment.proposal_id);
    setSelectedIds(
      selectedIds.length === allIdsOnPage.length ? [] : allIdsOnPage,
    );
  };

  const handlePayment = async () => {
    try {
      if (selectedIds.length === 0) {
        notify("Selecione pelo menos uma proposta.", { type: "warning" });
        return;
      }

      const values = selectedIds.map((id) => operationValues[id]);
      if (values.some((val) => val == null || val <= 0)) {
        notify("Preencha todos os valores de operação com números válidos.", {
          type: "warning",
        });
        return;
      }

      const payload = {
        proposal_id: selectedIds,
        user_id: [user?.id],
        valor_operacao: selectedIds.map((id) => Number(operationValues[id])),
      };

      console.log("Payload enviado:", payload);

      const usersApi = new ManageReport(user?.id);
      const response = await usersApi.postPaymentsProvided(payload, token);

      if (response && response.data) {
        notify("Pagamento processado com sucesso!", { type: "success" });
        setIsModalOpen(false);
        setSelectedIds([]);
        setOperationValues({});
        handleListProposalPayments();
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      notify("Erro ao processar pagamento.", { type: "error" });
    }
  };

  const handleDeletePayment = async () => {
    try {
      if (selectedIds.length === 0) {
        notify("Nenhum pagamento selecionado.", { type: "warning" });
        return;
      }
      const usersApi = new ManageReport(user?.id);
      const payload = { ids: selectedIds };
      const response = await usersApi.deletePayments(payload, token);

      if (response) {
        notify("Pagamentos deletados com sucesso!", { type: "success" });
        handleListProposalPayments();
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Erro ao deletar pagamentos:", error);
      notify("Erro ao deletar pagamentos.", { type: "error" });
    }
  };

  const openModal = () => {
    if (selectedIds.length === 0) {
      notify("Selecione pelo menos uma proposta.", { type: "warning" });
      return;
    }
    const initialValues = selectedIds.reduce((acc, id) => {
      acc[id] = "";
      return acc;
    }, {});
    setOperationValues(initialValues);
    setIsModalOpen(true);
  };

  const PaymentModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    const selectedProposals = useMemo(
      () => proposal.filter((p) => selectedIds.includes(p.proposal_id)),
      [proposal, selectedIds],
    );

    const handleValueChange = useCallback(
      debounce((proposalId, value) => {
        console.log("handleValueChange chamado:", { proposalId, value });
        setOperationValues((prev) => ({
          ...prev,
          [proposalId]: value,
        }));
      }, 300),
      [],
    );

    return (
      <div className="fixed inset-0 bg-whitesmoke bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold text-white">
            Confirmar Pagamento
          </h2>
          <p className="text-gray-200 mt-2">
            Você selecionou {selectedIds.length} proposta(s) para pagamento.
          </p>
          {selectedProposals.length > 0 ? (
            <ul className="mt-4 max-h-40 overflow-y-auto">
              {selectedProposals.map((proposal) => (
                <li key={proposal.proposal_id} className="text-gray-300 mb-4">
                  <div>
                    Proposta #{proposal.number_proposal || "N/A"} -{" "}
                    {proposal.proposal_name}
                  </div>
                  <div className="text-gray-200">
                    Valor Base:{" "}
                    {proposal.valor_base != null ? (
                      <NumericFormat
                        value={parseCurrency(proposal.valor_base)}
                        displayType="text"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale
                      />
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <MemoizedProposalInput
                    proposalId={proposal.proposal_id}
                    onValueChange={handleValueChange}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300 mt-4">
              Nenhuma proposta válida selecionada.
            </p>
          )}
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

  // Memoizar o PaymentModal
  const MemoizedPaymentModal = memo(PaymentModal);

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Listagem de propostas pagas</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
          </ol>
        </nav>
        <div className="bg-gray-700 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Lista de Pagamentos
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
              <button
                className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition duration-300"
                onClick={handleDeletePayment}
              >
                <Icons.FaTrash className="text-white" />
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
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === proposal.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                    Nome do Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                    Número da Proposta
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                    Valor Operação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500">
                {loading ? (
                  <tr key="loading">
                    <td
                      colSpan="12"
                      className="px-6 py-4 text-center text-gray-300"
                    >
                      Carregando...
                    </td>
                  </tr>
                ) : proposal.length === 0 ? (
                  <tr key="empty">
                    <td
                      colSpan="12"
                      className="px-6 py-4 text-center text-gray-300"
                    >
                      Nenhum pagamento disponível.
                    </td>
                  </tr>
                ) : (
                  proposal.map((ListPayment) => (
                    <tr
                      key={ListPayment.proposal_id}
                      className="hover:bg-gray-550 transition duration-300"
                    >
                      <td className="px-6 py-4 text-sm text-gray-200">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(
                            ListPayment.proposal_id,
                          )}
                          onChange={() =>
                            handleSelectId(ListPayment.proposal_id)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-200">
                        {ListPayment.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-200">
                        {MaskCpf(ListPayment.cpf) || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-200">
                        {ListPayment.proposal_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-200">
                        {ListPayment.number_proposal || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-200">
                        {ListPayment.valor_base || "N/A"}
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
                <li key="prev">
                  <button
                    className={`px-4 py-2 bg-gray-600 text-white rounded-lg ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-500"
                    } transition duration-300`}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={`page-${i + 1}`}>
                    <button
                      className={`px-4 py-2 ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-600 text-white hover:bg-gray-500"
                      } rounded-lg transition duration-300`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li key="next">
                  <button
                    className={`px-4 py-2 bg-gray-600 text-white rounded-lg ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-500"
                    } transition duration-300`}
                    onClick={() => setCurrentPage(currentPage + 1)}
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
      <MemoizedPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePayment}
      />
    </div>
  );
};

export default ServiceProvided;
