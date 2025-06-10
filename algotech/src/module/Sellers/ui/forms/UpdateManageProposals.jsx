import MaskCpf from "@module/utils/MaskCpf";
import renderAdditionalFields from "@module/Sellers/ui/forms/renderAdditionalFields";

const UpdateManageProposals = ({
  formData,
  handleChange,
  handleAddImage,
  files,
  bankers,
  loanOperations,
  financialAgreements,
  tablesFinance,
  toggleExpandPdf,
  pdfStates,
  updateProposal,
  bank_id,
  image_urls,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        <strong>Dados Pessoais:</strong>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>
            <strong>Nome</strong>
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>CPF:</strong>
          </label>
          <input
            type="text"
            name="cpf"
            value={MaskCpf(formData.cpf)}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label>
            <strong>Data Nacismento:</strong>
          </label>
          <input
            type="date"
            name="data_nascimento"
            id="data_nascimento"
            value={formData.data_nascimento}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>Genero:</strong>
          </label>
          <select
            name="genero"
            id="genero"
            value={formData.genero}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option className="text-gray-400">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>
        <div>
          <label>
            <strong>Email:</strong>
          </label>
          <input
            type="text"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>Naturalidade</strong>
          </label>
          <input
            type="text"
            name="naturalidade"
            id="naturalidade"
            value={formData.naturalidade}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>Cidade da Naturalidade:</strong>
          </label>
          <input
            type="text"
            name="cidade_naturalidade"
            id="cidade_naturalidade"
            value={formData.cidade_naturalidade}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>Estado:</strong>
          </label>
          <input
            type="text"
            name="uf_naturalidade"
            id="uf_naturalidade"
            value={formData.uf_naturalidade}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>Telefone:</strong>
          </label>
          <input
            type="text"
            name="telefone"
            id="telefone"
            value={formData.telefone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>Telefone Comercial:</strong>
          </label>
          <input
            type="text"
            name="telefone_comercial"
            id="telefone_comercial"
            value={formData.telefone_comercial}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      <br />
      <hr />
      {/* Endereço */}
      <h2 className="text-xl font-semibold mt-6 mb-4">
        <strong>Endereço:</strong>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>
            <strong>CEP:</strong>
          </label>
          <input
            type="text"
            name="cep"
            id="cep"
            value={formData.cep}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>UF Cidade:</strong>
          </label>
          <select
            name="uf_cidade"
            id="uf_cidade"
            value={formData.uf_cidade}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option className="text-gray-400">Selecione</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapa</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceara</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espirito Santo</option>
            <option value="GO">Goias</option>
            <option value="MA">Maranhao</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Para</option>
            <option value="PB">Paraiba</option>
            <option value="PR">Parana</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piaui</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondonia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">Sao Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>
        </div>
        <div>
          <label>
            <strong>Bairro:</strong>
          </label>
          <input
            type="text"
            name="bairro"
            id="bairro"
            value={formData.bairro}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>Endereço:</strong>
          </label>
          <input
            type="text"
            name="endereco"
            id="endereco"
            value={formData.endereco}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>Numero do Endereço:</strong>
          </label>
          <input
            type="text"
            name="numero_endereco"
            id="numero_endereco"
            value={formData.numero_endereco}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>Complemento de Endereço:</strong>
          </label>
          <input
            type="text"
            name="complemento_endereco"
            id="complemento_endereco"
            value={formData.complemento_endereco}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>Cidade:</strong>
          </label>
          <input
            type="text"
            name="cidade"
            id="cidade"
            value={formData.cidade}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      <br />
      <hr />
      {/* Documentação */}
      <h2 className="text-xl font-semibold mt-6 mb-4">
        <strong>Documentação:</strong>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>
            <strong>RG:</strong>
          </label>
          <input
            type="text"
            name="rg_documento"
            id="rg_documento"
            value={formData.rg_documento}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>Data de Emissão:</strong>
          </label>
          <input
            type="date"
            name="data_emissao"
            id="data_emissao"
            value={formData.data_emissao}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>Orgão Emissor:</strong>
          </label>
          <input
            type="text"
            name="orgao_emissor"
            id="orgao_emissor"
            value={formData.orgao_emissor}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>UF Emissor:</strong>
          </label>
          <select
            name="uf_emissor"
            id="uf_emissor"
            value={formData.uf_emissor}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option className="text-gray-400">Selecione</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapa</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceara</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espirito Santo</option>
            <option value="GO">Goias</option>
            <option value="MA">Maranhao</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Para</option>
            <option value="PB">Paraiba</option>
            <option value="PR">Parana</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piaui</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondonia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">Sao Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>
        </div>
        <div>
          <label>
            <strong>Nome do Pai:</strong>
          </label>
          <input
            type="text"
            name="nome_pai"
            id="nome_pai"
            value={formData.nome_pai}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>
            <strong>Nome da Mãe:</strong>
          </label>
          <input
            type="text"
            name="nome_mae"
            id="nome_mae"
            value={formData.nome_mae}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      <br />
      <hr />
      {/* Dados Financeiros  */}
      <h2 className="text-xl font-semibold mt-6 mb-4">
        <strong>Dados de Finaceiro:</strong>
      </h2>
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
        <div className="mt-4">
          {renderAdditionalFields({ formData, handleChange })}
        </div>
      </div>
      <br />
      <hr />
      <h2 className="text-xl font-semibold mt-6 mb-4">
        <strong>Dados da Operação:</strong>
      </h2>
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
      <br />
      <hr />
      <h2 className="text-xl font-semibold mt-6 mb-4">Observações:</h2>
      <p>{formData.observe}</p>
      <h2 className="text-xl font-semibold mt-6 mb-4">Documentos Anexados:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(image_urls).map(([key, urls]) =>
          urls.length > 0 ? (
            <div key={key}>
              <h3 className="font-semibold">
                {key.replace(/_/g, " ").toUpperCase()}
              </h3>
              {urls.map((url, index) => {
                const isPdf = url && url.toLowerCase().endsWith(".pdf");
                const filename = url
                  ? url.split("/").pop() || `${key}.pdf`
                  : `${key}.pdf`;
                return (
                  <div key={`${key}-${index}`} className="mt-2">
                    {isPdf ? (
                      <div className="border rounded-lg p-4 bg-gray-50">
                        {!pdfStates[url] ? (
                          <div>Carregando PDF...</div>
                        ) : pdfStates[url].error ? (
                          <p className="text-red-600">{pdfStates[url].error}</p>
                        ) : (
                          <div>
                            <div
                              onClick={() => toggleExpandPdf(url)}
                              className="cursor-pointer"
                            >
                              <iframe
                                src={pdfStates[url].blob}
                                className={`w-full transition-all duration-300 ${
                                  pdfStates[url].isExpanded
                                    ? "h-[80vh] max-h-[800px]"
                                    : "h-[400px]"
                                }`}
                                title={`${key}_${index}`}
                                style={{ border: "none" }}
                              />
                            </div>
                            <div className="flex justify-between mt-2">
                              <button
                                onClick={() => toggleExpandPdf(url)}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                              >
                                {pdfStates[url].isExpanded
                                  ? "Reduzir"
                                  : "Expandir"}
                              </button>
                              <button
                                onClick={() => downloadPdf(url, filename)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                              >
                                Baixar PDF
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <img
                        src={url}
                        alt={`${key}_${index}`}
                        className="w-full h-auto rounded-lg shadow-sm"
                        onError={() =>
                          console.error(`Erro ao carregar imagem: ${url}`)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : null,
        )}
      </div>
      <br />
      <hr />
      {/* Seção de Upload de Arquivos */}
      <h2 className="text-xl font-semibold mt-6 mb-4">
        <strong>Documentos</strong>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(files).map((key) => (
          <div key={key}>
            <label>{key.replace(/_/g, " ").toUpperCase()}</label>
            <input
              type="file"
              name={key}
              onChange={handleAddImage}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
      </div>

      {/* Botão de Envio */}
      <div className="mt-6">
        <button
          onClick={updateProposal}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Editar Proposta
        </button>
      </div>
    </div>
  );
};

export default UpdateManageProposals;
