import { useEffect } from "react";
import { notify } from "@module/utils/toastify";
import { useUser } from "../../../../service/UserContext";
import ManageBankers from "@module/Finance/Service/ManageBankers";

const FiltersListProposal = ({
  filterValues,
  setFilterValues,
  setIsFilterModalOpen,
  applyFilter,
  bankers,
  financialAgreements,
  setFinancialAgreements,
  loadingBankers,
}) => {
  const { user, token } = useUser();

  const loadFinancialAgreements = async (bankId) => {
    if (!bankId) {
      setFinancialAgreements([]);
      return;
    }
    try {
      const userApi = new ManageBankers(user?.id, token);
      const response = await userApi.getBankersById(bankId);
      // Tentar diferentes estruturas de resposta
      let agreements = [];
      if (Array.isArray(response.data)) {
        agreements = response.data[0]?.financial_agreements || [];
      } else if (Array.isArray(response.data.data)) {
        agreements = response.data.data[0]?.financial_agreements || [];
      } else if (response.data?.financial_agreements) {
        agreements = response.data.financial_agreements;
      }
      setFinancialAgreements(agreements);
      if (agreements.length === 0) {
        notify("Nenhum convênio disponível para este banco", { type: "info" });
      }
    } catch (error) {
      notify("Erro ao carregar os convênios", { type: "warning" });
      setFinancialAgreements([]);
    }
  };

  useEffect(() => {
    loadFinancialAgreements(filterValues.selectedBankId);
  }, [filterValues.selectedBankId]);

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Filtrar Propostas</h2>
        <div className="space-y-4">
          <select
            name="current_status"
            value={filterValues.current_status || ""}
            onChange={(e) =>
              setFilterValues({
                ...filterValues,
                current_status: e.target.value,
              })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o Status</option>
            <option value="Aguardando Digitação">Aguardando Digitação</option>
            <option value="Pendente de Digitação">Pendente de Digitação</option>
            <option value="Contrato em Digitação">Contrato em Digitação</option>
            <option value="Aguardando Pagamento">Aguardando Pagamento</option>
            <option value="Aceite Feito - Análise Banco">
              Aceite Feito - Análise Banco
            </option>
            <option value="Contrato Pendente - Banco">
              Contrato Pendente - Banco
            </option>
            <option value="Contrato Pago">Contrato Pago</option>
            <option value="Contrato Reprovado">Contrato Reprovado</option>
          </select>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Inicial
            </label>
            <input
              type="date"
              value={filterValues.start_date || ""}
              onChange={(e) =>
                setFilterValues({
                  ...filterValues,
                  start_date: e.target.value,
                })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Final
            </label>
            <input
              type="date"
              value={filterValues.end_date || ""}
              onChange={(e) =>
                setFilterValues({
                  ...filterValues,
                  end_date: e.target.value,
                })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Banco
            </label>
            {loadingBankers ? (
              <div className="w-full px-4 py-2 border rounded-lg bg-gray-100">
                Carregando bancos...
              </div>
            ) : (
              <select
                name="selectedBankId"
                value={filterValues.selectedBankId || ""}
                onChange={(e) =>
                  setFilterValues({
                    ...filterValues,
                    selectedBankId: e.target.value,
                    selectedAgreementId: "",
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o Banco</option>
                {Array.isArray(bankers) && bankers.length > 0 ? (
                  bankers.map((banker) => (
                    <option key={banker.id} value={banker.id}>
                      {banker.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Nenhum banco disponível
                  </option>
                )}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Convênio
            </label>
            {filterValues.selectedBankId && financialAgreements.length === 0 ? (
              <div className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500">
                Nenhum convênio disponível
              </div>
            ) : (
              <select
                name="selectedAgreementId"
                value={filterValues.selectedAgreementId || ""}
                onChange={(e) =>
                  setFilterValues({
                    ...filterValues,
                    selectedAgreementId: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!filterValues.selectedBankId}
              >
                <option value="">Selecione o Convênio</option>
                {Array.isArray(financialAgreements) &&
                  financialAgreements.map((agreement) => (
                    <option
                      key={agreement.id_financialagreements}
                      value={agreement.id_financialagreements}
                    >
                      {agreement.financialagreements_name}
                    </option>
                  ))}
              </select>
            )}
          </div>
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
  );
};

export default FiltersListProposal;
