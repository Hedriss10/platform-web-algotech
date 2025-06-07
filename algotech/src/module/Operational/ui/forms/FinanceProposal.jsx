const renderAdditionalFields = () => {
  const tipoPagamento = formData.tipo_pagamento
    ? formData.tipo_pagamento.toLowerCase()
    : "";
  switch (tipoPagamento) {
    case "pix":
      return (
        <div className="space-y-4">
          {" "}
          {/* Espaçamento entre as linhas */}
          <div className="flex gap-4">
            {" "}
            {/* Primeira linha */}
            <div className="flex-1">
              <label>
                <strong>Chave Pix:</strong>
              </label>
              <input
                type="text"
                name="pix_chave"
                value={formData.pix_chave}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label>
                <strong>Senha do Contra Cheque:</strong>
              </label>
              <input
                type="password"
                name="senha_servidor"
                value={formData.senha_servidor}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="flex gap-4">
            {" "}
            {/* Segunda linha */}
            <div className="flex-1">
              <label>
                <strong>Matrícula:</strong>
              </label>
              <input
                type="text"
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label>
                <strong>Data do Despacho:</strong>
              </label>
              <input
                type="date"
                name="data_dispacho"
                value={formData.data_dispacho}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      );
    case "credito_em_conta":
    case "ordem_pagamento":
      return (
        <div className="space-y-4">
          {" "}
          {/* Espaçamento entre as linhas */}
          <div className="flex gap-4">
            {" "}
            {/* Primeira linha */}
            <div className="flex-1">
              <label>
                <strong>Número da Conta:</strong>
              </label>
              <input
                type="text"
                name="numero_conta"
                value={formData.numero_conta}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label>
                <strong>Agência do Banco do Cliente:</strong>
              </label>
              <input
                type="text"
                name="agencia_op"
                value={formData.agencia_op}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label>
                <strong>Dígito Verificador:</strong>
              </label>
              <input
                type="text"
                name="agencia_dv"
                value={formData.agencia_dv}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="flex gap-4">
            {" "}
            {/* Segunda linha */}
            <div className="flex-1">
              <label>
                <strong>Tipo de Conta:</strong>
              </label>
              <input
                type="text"
                name="tipo_conta"
                value={formData.tipo_conta}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label>
                <strong>Senha do Contra Cheque:</strong>
              </label>
              <input
                type="password"
                name="senha_servidor"
                value={formData.senha_servidor}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label>
                <strong>Matrícula:</strong>
              </label>
              <input
                type="text"
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="flex gap-4">
            {" "}
            {/* Terceira linha */}
            <div className="flex-1">
              <label>
                <strong>Data do Despacho:</strong>
              </label>
              <input
                type="date"
                name="data_dispacho"
                value={formData.data_dispacho}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const ProposalFinance = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label>
          <strong>Valor do Salario:</strong>
        </label>
        <input
          type="number"
          name="valor_salario"
          id="valor_salario"
          value={formData.valor_salario}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Salário Liquido:</strong>
        </label>
        <input
          type="text"
          name="salario_liquido"
          id="salario_liquido"
          value={formData.salario_liquido}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Tipo do Pagamento:</strong>
        </label>
        <select
          name="tipo_pagamento"
          id="tipo_pagamento"
          value={formData.tipo_pagamento}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option className="text-gray-400">Selecione</option>
          <option value="Pix" className="text-gray-400">
            Pix
          </option>
          <option value="credito_em_conta" className="text-gray-400">
            Crédito em Conta
          </option>
          <option value="ordem_pagamento" className="text-gray-400">
            Ordem de Pagamento
          </option>
        </select>
      </div>
      <div className="mt-4">{renderAdditionalFields()}</div>
    </div>
  );
};

export default ProposalFinance;
