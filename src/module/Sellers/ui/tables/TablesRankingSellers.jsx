// src/module/Sellers/ui/tables/TablesRankingSellers.jsx
const TablesRankingSellers = ({ contract, loading }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
        <thead className="bg-gray-500">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Usuário
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Posição
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-500">
          {loading ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-300">
                Carregando...
              </td>
            </tr>
          ) : contract.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-300">
                Nenhum contrato encontrado.
              </td>
            </tr>
          ) : (
            contract.map((contractItem, index) => {
              const isLast = index >= contract.length - 2;
              return (
                <tr
                  key={contractItem.id || contractItem.username + index}
                  className={`hover:bg-gray-550 transition duration-300 ${
                    isLast ? "bg-red-400" : ""
                  }`}
                >
                  <td
                    className={`px-6 py-4 text-sm ${isLast ? "text-red-300" : "text-gray-200"}`}
                  >
                    <strong>{contractItem.username}</strong>
                  </td>
                  <td
                    className={`px-6 py-4 text-sm ${isLast ? "text-red-300" : "text-gray-200"}`}
                  >
                    <strong>{contractItem.posicao}</strong>
                  </td>
                  <td
                    className={`px-6 py-4 text-sm ${isLast ? "text-red-300" : "text-gray-200"}`}
                  >
                    <strong>{contractItem.total_ranking}</strong>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablesRankingSellers;
