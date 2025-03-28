const CheckSummaryProposal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay escuro */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose} // Fecha a modal ao clicar no overlay
      ></div>

      {/* Conteúdo da Modal */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Atenção</h3>
        <p className="text-gray-700 mb-4">
          Faltam alguns campos obrigatórios na proposta. Por favor, preencha-os:
        </p>

        {/* Campos obrigatórios */}
        <label className="font-bold">Campos:</label>
        <ul className="space-y-2">
          <li className="space-y-2">Número da proposta</li>
          <li className="space-y-2">Código da proposta</li>
          <li className="space-y-2">Valor da operação</li>
          <li className="space-y-2">Prazo início e fim</li>
          <li className="space-y-2">Tabela e convênio</li>
        </ul>

        {/* <div className="space-y-4">
          <input
            type="text"
            placeholder="Campo exemplo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}

        {/* Botões */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Fechar
          </button>
          {/* Se precisar de um botão "Salvar", descomente e ajuste */}
          {/* <button
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Salvar
            </button> */}
        </div>
      </div>
    </div>
  );
};

export default CheckSummaryProposal;
