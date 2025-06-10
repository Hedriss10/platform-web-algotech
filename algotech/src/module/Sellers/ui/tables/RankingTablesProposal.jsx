const RankingTablesProposal = ({ loading, tables }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
        <thead className="bg-gray-500">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Banco
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Tabela
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Código
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Prazo Início
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Prazo Fim
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
          ) : tables.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-300">
                Nenhuma tabela encontrada.
              </td>
            </tr>
          ) : (
            tables.map((tables) => (
              <tr
                key={tables.id}
                className="hover:bg-gray-550 transition duration-300"
              >
                <td className="px-6 py-4 text-sm text-gray-200">
                  {tables.name_banker}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {tables.table}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {tables.table_code}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {tables.start_rate}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {tables.end_rate}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RankingTablesProposal;
