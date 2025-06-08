import CheckSummaryProposal from "@module/operational/components/CheckSummaryProposal";

const StatusProposal = ({
  formData,
  setFormData,
  handleStatusChange,
  setIsModalOpen,
  isModalOpen,
  postStatusProposal,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Status da Proposta:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "aguardando_digitacao", label: "Aguardando Digitação" },
          { key: "pendente_digitacao", label: "Pendente Digitação" },
          { key: "contrato_em_digitacao", label: "Contrato em Digitação" },
          {
            key: "aceite_feito_analise_banco",
            label: "Aceite Feito (Análise Banco)",
          },
          {
            key: "contrato_pendente_banco",
            label: "Contrato Pendente Banco",
          },
          { key: "aguardando_pagamento", label: "Aguardando Pagamento" },
          { key: "contrato_pago", label: "Contrato Pago" },
          { key: "contrato_reprovado", label: "Contrato Reprovado" },
        ].map((status) => (
          <label key={status.key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData[status.key]}
              onChange={() => handleStatusChange(status.key)}
              className="form-checkbox h-5The w-5 text-blue-600 rounded"
            />
            <span>{status.label}</span>
          </label>
        ))}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Descrição:
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Digite uma descrição..."
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Número da Proposta:
        </label>
        <input
          type="number"
          value={formData.number_proposal}
          onChange={(e) =>
            setFormData({ ...formData, number_proposal: e.target.value })
          }
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite o número da proposta"
        />
      </div>

      <button
        onClick={postStatusProposal}
        className="mt-6 p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300 text-white w-full"
      >
        Enviar Status
      </button>
      {isModalOpen && (
        <CheckSummaryProposal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default StatusProposal;
