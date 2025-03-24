import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { notify } from "../../../utils/toastify";
import { useUser } from "../../../../service/UserContext";
import ManageReport from "../Service/ManageReport";
import Icons from "../../../utils/Icons";
import MaskCpf from "../../../utils/MaskCpf";

const ProcessPayments = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [sellers, setSellers] = useState([]);
  const [flags, setFlags] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasReport, setHasReport] = useState(false);

  // Estados para controlar a modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlagId, setSelectedFlagId] = useState(null);
  const [decisionMaker, setDecisionMaker] = useState(false);

  // Função para carregar os vendedores
  const loadSellers = async () => {
    setLoading(true);
    try {
      const usersApi = new ManageReport(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.getAllReportSellers(hasReport);
      if (response && response.data) {
        setSellers(response.data);
        setTotalPages(response.metadata?.total_pages || 1);
      } else {
        setSellers([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Erro ao carregar vendedores:", error);
      setSellers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, [currentPage, searchTerm, rowsPerPage, hasReport]);

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
    if (selectedUsers.length === 0) {
      notify("Selecione pelo menos um usuário.", { type: "warning" });
      return;
    }
    if (!selectedFlagId) {
      notify("Selecione uma flag.", { type: "warning" });
      return;
    }

    const payload = {
      user_id: selectedUsers, // Array de IDs dos usuários selecionados
      decision_maker: decisionMaker,
      flag_id: Number(selectedFlagId),
    };

    try {
      const usersApi = new ManageReport(
        user?.id,
        searchTerm,
        currentPage,
        rowsPerPage,
      );
      const response = await usersApi.postPayment(payload, token);
      if (response && response.data) {
        setSellers(response.data);
        setTotalPages(response.metadata?.total_pages || 1);
        notify("Pagamento processado com sucesso!", { type: "success" });
        setIsModalOpen(false);
        navigate("/preview-payments");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      notify("Erro ao processar pagamento.", { type: "error" });
    }
  };

  // Função para abrir a modal e carregar as flags
  const openModal = async () => {
    if (selectedUsers.length === 0) {
      notify("Selecione pelo menos um usuário.", { type: "warning" });
      return;
    }
    await loadFlags(); // Carrega as flags antes de abrir a modal
    setIsModalOpen(true);
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

  // Função para lidar com a mudança do checkbox de filtro
  const handleCheckboxChange = (e) => {
    setHasReport(e.target.checked);
    loadSellers(); // Recarrega os vendedores com o novo filtro
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
      <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white">
            Confirmar Pagamento
          </h2>
          <div className="mt-4">
            <label className="block text-sm text-white mb-2">
              Selecione a Flag:
            </label>
            <select
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={selectedFlagId}
              onChange={(e) => setSelectedFlagId(e.target.value)}
            >
              <option value="">Selecione uma flag</option>
              {flags.map((flag) => (
                <option key={flag.id} value={flag.id}>
                  {flag.name} {/* flag name */}
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
            <br />
          </label>
          <p className="text-sm text-white mt-2">
            <strong>
              Observação: Ao marca a tomada de decicão, o vendedor que não está
              em um relatório de comisssão recebera o pagamento.
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
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/report" className="hover:text-bg-gray-200">
              <strong>Gerenciamento de Relatório</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Lista de vendedores
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Lista de vendedores que contém propostas pagas e associadas nos
            relatórios importados.
          </p>
        </div>

        {/* Checkbox e campo de busca */}
        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={hasReport}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-sm text-white">
              Filtrar por vendedores que estão em relatórios
            </span>
          </label>
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
              className="p-2 bg-green-600 rounded-lg hover:bg-green-500 transition duration-300"
              onClick={openModal}
            >
              <Icons.MdPayments className="text-white" />
            </button>
          </div>
        </div>

        {/* Tabela de usuários */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setSelectedUsers(
                        e.target.checked ? sellers.map((t) => t.id) : [],
                      );
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Cargo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : sellers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Nenhum relatório disponível.
                  </td>
                </tr>
              ) : (
                sellers.map((seller, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-550 transition duration-300"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(seller.id)}
                        onChange={(e) => {
                          setSelectedUsers((prev) =>
                            e.target.checked
                              ? [...prev, seller.id]
                              : prev.filter((id) => id !== seller.id),
                          );
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {seller.username || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {MaskCpf(seller.cpf) || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {seller.role || "N/A"}
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
                >
                  Próxima
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Modal de Pagamento */}
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
