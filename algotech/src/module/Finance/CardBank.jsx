import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../../service/UserContext";
import { notify } from "../utils/toastify";
import ManageBankers from "./Service/ManageBankers";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { MdOutlinePreview } from "react-icons/md";

const CardBank = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [financialAgreements, setFinancialAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [bankerName, setBankerName] = useState("");
  const [bankerID, setBankerID] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const usersApi = new ManageBankers(user?.id);
        const response = await usersApi.getBankersById(id, token);
        if (response && response.data.length > 0) {
          const bankData = response.data[0];
          setBankerName(bankData.name_bank || "");
          setBankerID(bankData.banker_id || "");
          setFinancialAgreements(bankData.financial_agreements || []);
        }
      } catch (error) {
        notify("Erro ao carregar dados do banco", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, token, user]);

  const handleTablesFinance = async (agreementId) => {
    navigate(`/tablesfinance/${bankerID || id}/${agreementId}`); // fallback to agreementId
  };

  // Função para apagar o convenio do banco especifico
  const handleDeleteFinacialAgreements = async (id) => {
    try {
      const usersApi = new ManageBankers(user?.id);
      await usersApi.deleteFinancialAgreementsBankers(id, token);
      notify("Convênio deletado com sucesso", { type: "success" });
      const updatedAgreements = financialAgreements.filter(
        (agreement) => agreement.id !== id,
      );
      setFinancialAgreements(updatedAgreements);
    } catch (error) {
      notify("Erro ao deletar convênio", { type: "error" });
    }
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{bankerName}</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/finance" className="hover:text-bg-gray-200">
              <strong>Lista de Bancos</strong>
            </Link>
          </ol>
        </nav>
      </div>
      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-white">
          Convênios Financeiros
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Tabelas
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
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : financialAgreements.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-300"
                  >
                    Nenhum convênio disponível.
                  </td>
                </tr>
              ) : (
                financialAgreements.map((agreement, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-550 transition duration-300"
                  >
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {agreement.financialagreements_name || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300"
                        onClick={() =>
                          handleTablesFinance(agreement.id_financialagreements)
                        }
                      >
                        <MdOutlinePreview className="text-white" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition duration-300"
                        onClick={() =>
                          handleDeleteFinacialAgreements(
                            agreement.id_financialagreements,
                          )
                        }
                      >
                        <FaTrash className="text-white" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CardBank;
