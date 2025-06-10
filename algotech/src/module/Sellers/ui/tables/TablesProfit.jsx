import MaskCpf from "@module/utils/MaskCpf";

const TablesProfit = ({ contract, loading }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
        <thead className="bg-gray-500">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Usuário
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              CPF
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Valor da Operação
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Expectativa Esperada
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
                Nenhuma contrato encontrado.
              </td>
            </tr>
          ) : (
            contract.map((contract) => (
              <tr
                key={contract.id}
                className="hover:bg-gray-550 transition duration-300"
              >
                <td className="px-6 py-4 text-sm text-gray-200">
                  {contract.name_seller}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {contract.nome_proposal}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {MaskCpf(contract.cpf_proposal)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  R$ {contract.valor_operacao}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  R$ {contract.ganho_esperado}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablesProfit;
