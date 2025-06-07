const DataOperationProposal = ({
  formData,
  handleChange,
  tablesFinance,
  financialAgreements,
  handleChange,
  loanOperations,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label>
          <strong>Margem:</strong>
        </label>
        <input
          type="text"
          name="margem"
          id="margem"
          value={formData.margem}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Prazo Início:</strong>
        </label>
        <input
          type="text"
          name="prazo_inicio"
          id="prazo_inicio"
          onChange={handleChange}
          value={formData.prazo_inicio}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Prazo Fim:</strong>
        </label>
        <input
          type="text"
          name="prazo_fim"
          id="prazo_fim"
          onChange={handleChange}
          value={formData.prazo_fim}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Valor da Operação:</strong>
        </label>
        <input
          type="number"
          name="valor_operacao"
          id="valor_operacao"
          onChange={handleChange}
          value={formData.valor_operacao}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Tipo de Operação:</strong>
        </label>
        <select
          name="loan_operation_id"
          id="loan_operation_id"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={formData.loan_operation_id}
        >
          <option>Selecione a operação</option>
          {loanOperations.map((loan) => (
            <option key={loan.id} value={loan.id}>
              {loan.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>
          <strong>Selecione o Banco:</strong>
        </label>
        <select
          name="bank_id"
          id="bank_id"
          onChange={handleChange}
          value={bank_id}
          className="w-full p-2 border rounded"
        >
          <option>Selecione o banco</option>
          {bankers.map((bank) => (
            <option key={bank.id} value={bank.id}>
              {bank.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>
          <strong>Selecio o Convênio:</strong>
        </label>
        <select
          name="financial_agreements_id"
          id="financial_agreements_id"
          onChange={handleChange}
          value={formData.financial_agreements_id}
          className="w-full p-2 border rounded"
        >
          <option>Selecione o Convênio</option>
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
      <div>
        <label>
          <strong>Selecione a Tabela:</strong>
        </label>
        <select
          name="tables_finance_id"
          id="tables_finance_id"
          className="w-full p-2 border rounded"
          value={formData.tables_finance_id}
          onChange={handleChange}
        >
          <option>Selecione a Tabela:</option>
          {tablesFinance.map((table) => (
            <option key={table.id} value={table.id}>
              Nome: {table.name} | Prazos: {table.start_tem}
              {table.end_term} | Taxas: {table.start_rate} á {table.end_rate}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DataOperationProposal;
