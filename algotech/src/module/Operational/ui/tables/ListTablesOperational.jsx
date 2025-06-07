import Icons from "@module/utils/Icons";
import MaskCpf from "@module/utils/MaskCpf";

const ListTablesOperational = ({
  proposal,
  loading,
  handlePreviewProposal,
  handleUpdateProposal,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
        <thead className="bg-gray-500">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Nome do Cliente
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              CPF
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Operação
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Banco
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Vendedor
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Digitador
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Visualizar
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Editar
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-500">
          {loading ? (
            <tr>
              <td colSpan="9" className="px-6 py-4 text-center text-gray-300">
                Carregando...
              </td>
            </tr>
          ) : proposal.length === 0 ? (
            <tr>
              <td colSpan="9" className="px-6 py-4 text-center text-gray-300">
                Nenhuma proposta encontrada.
              </td>
            </tr>
          ) : (
            proposal.map((proposal) => (
              <tr
                key={proposal.id}
                className="hover:bg-gray-550 transition duration-300"
              >
                <td className="px-6 py-4 text-sm text-gray-200">
                  {proposal.nome_cliente || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {MaskCpf(proposal.cpf_cliente) || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {proposal.tipo_operacao || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {proposal.current_status || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {proposal.banco || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {proposal.nome_digitador || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {proposal.digitador_por || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300"
                      onClick={() => handlePreviewProposal(proposal.id)}
                    >
                      <Icons.MdOutlinePreview className="text-white" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    className={`p-2 rounded-lg transition duration-300 ${
                      proposal.current_status === "Contrato Pago"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-orange-600 hover:bg-orange-500"
                    }`}
                    onClick={() => {
                      if (proposal.current_status !== "Contrato Pago") {
                        handleUpdateProposal(proposal.id);
                      }
                    }}
                    disabled={proposal.current_status === "Contrato Pago"}
                  >
                    <Icons.FaEdit className="text-white" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListTablesOperational;
