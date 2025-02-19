import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ManageTablesFinance from "../Service/ManageTablesFinance";
import ManageBankers from "../Service/ManageBankers";
import { notify } from "../../utils/toastify";
import { useUser } from "../../../service/UserContext";
import { FaSearch, FaTrash, FaUpload } from "react-icons/fa";

const RegisterTablesFinance = () => {
  const { id: bankerId } = useParams();
  const { user, token } = useUser();
  const [financialAgreements, setFinancialAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState("");
  const [financialAgreementsId, setFinancialAgreementsId] = useState("");
  const [file, setFile] = useState(null);
  const [issueDate, setIssueDate] = useState("");

  useEffect(() => {
    const fetchFinancialAgreements = async () => {
      try {
        setLoading(true);
        const usersApi = new ManageBankers(user?.id);
        const response = await usersApi.getBankersById(bankerId, token);
        if (response && response.data.length > 0) {
          setFinancialAgreements(response.data[0].financial_agreements || []);
        }
      } catch (error) {
        notify("Erro ao carregar convênios", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialAgreements();
  }, [bankerId, token, user]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Função para importar a tabela com o template de comissão
  const handleSubmitImportTables = async (e) => {
    e.preventDefault();
    if (!selectedAgreement) {
      notify("Selecione um convênio antes de importar", { type: "warning" });
      return;
    }
    if (!file) {
      notify("Selecione um arquivo .xlsx para importar", { type: "warning" });
      return;
    }
    if (!issueDate) {
      notify("Selecione uma data de emissão", { type: "warning" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("financialagreements_id", selectedAgreement);
      formData.append("file", file);
      formData.append("issue_date", issueDate);

      const tablesApi = new ManageTablesFinance(user?.id);
      await tablesApi.importTablesFinance(formData, token);

      notify("Tabelas financeiras importadas com sucesso", { type: "success" });
    } catch (error) {
      notify("Erro ao importar tabelas financeiras", { type: "error" });
    }
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Importar tabelas</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/finance" className="hover:text-gray-200">
              <strong>Bancos</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Importar tabela de comissão
          </h2>
          <p className="text-white text-sm">
            Segue importação com o template de comissão.
          </p>
        </div>

        <div className="mb-4">
          <label className="text-white block mb-2">
            <strong>Selecione um Convênio</strong>:
          </label>
          <select
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
            value={selectedAgreement}
            onChange={(e) => setSelectedAgreement(e.target.value)}
          >
            <option value="">Selecione...</option>
            {financialAgreements.map((agreement) => (
              <option
                key={agreement.id_financialagreements}
                value={agreement.id_financialagreements}
              >
                {agreement.financialagreements_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-white block mb-2">
            <strong>Data de Emissão:</strong>
          </label>
          <input
            type="date"
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-white block mb-2">
            Selecione um arquivo (.xlsx)
          </label>
          <input
            type="file"
            accept=".xlsx"
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
            onChange={handleFileChange}
          />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
          onClick={handleSubmitImportTables}
        >
          <FaUpload className="mr-2" /> Importar Tabela
        </button>
      </div>
    </div>
  );
};

export default RegisterTablesFinance;
