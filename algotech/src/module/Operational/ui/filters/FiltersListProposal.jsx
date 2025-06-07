
const FiltersListPrposal = ({
    filterValues,
    setFilterValues,
    setIsFilterModalOpen,
    applyFilter
}) => {
  return (
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
              value={filterValues.start_date}
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
              value={filterValues.end_date}
              onChange={(e) =>
                setFilterValues({
                  ...filterValues,
                  end_date: e.target.value,
                })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
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

export default FiltersListPrposal;
