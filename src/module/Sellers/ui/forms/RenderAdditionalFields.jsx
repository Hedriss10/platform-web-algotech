// src/module/Sellers/ui/forms/RenderAdditionalFields.jsx

const renderAdditionalFields = ({ formData, handleChange }) => {
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

export default renderAdditionalFields;
