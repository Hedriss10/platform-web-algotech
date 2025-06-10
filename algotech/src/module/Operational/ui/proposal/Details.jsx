import MaskCpf from "@module/utils/MaskCpf";

const DetaisProposal = ({
  nome,
  cpf,
  data_nascimento,
  email,
  telefone,
  endereco,
  bairro,
  tipo_beneficio,
  matricula,
  cidade,
  uf_cidade,
  cep,
  data_emissao,
  nome_mae,
  nome_pai,
  orgao_emissor,
  rg_documento,
  naturalidade,
  uf_naturalidade,
  image_urls,
  toggleExpandPdf,
  downloadPdf,
  salario_liquido,
  valor_operacao,
  margem,
  banker_name,
  agencia_banco,
  numero_conta,
  nome_tabela,
  tipo_operacao,
  tipo_pagamento,
  description,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Dados do Cliente:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Nome:</strong> {nome}
          </p>
          <p>
            <strong>CPF:</strong> {MaskCpf(cpf)}
          </p>
          <p>
            <strong>Data de Nascimento:</strong>{" "}
            {data_nascimento || "Não informado"}
          </p>
          <p>
            <strong>Email:</strong> {email || "Não informado"}
          </p>
          <p>
            <strong>Telefone:</strong> {telefone || "Não informado"}
          </p>
          <p>
            <strong>Endereço:</strong>{" "}
            {endereco
              ? `${endereco}, ${bairro}, ${cidade} - ${uf_cidade}`
              : "Não informado"}
          </p>
          <p>
            <strong>CEP:</strong> {cep || "Não informado"}
          </p>
        </div>
        <div>
          <p>
            <strong>Nome da Mãe:</strong> {nome_mae || "Não informado"}
          </p>
          <p>
            <strong>Nome do Pai:</strong> {nome_pai || "Não informado"}
          </p>
          <p>
            <strong>RG:</strong> {rg_documento || "Não informado"}
          </p>
          <p>
            <strong>Órgão Emissor:</strong> {orgao_emissor || "Não informado"}
          </p>
          <p>
            <strong>Data de Emissão:</strong> {data_emissao || "Não informado"}
          </p>
          <p>
            <strong>Naturalidade:</strong>{" "}
            {naturalidade
              ? `${naturalidade} - ${uf_naturalidade}`
              : "Não informado"}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-4">Detalhes da Proposta:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Tipo de Benefício:</strong>{" "}
            {tipo_beneficio || "Não informado"}
          </p>
          <p>
            <strong>Matrícula:</strong> {matricula || "Não informado"}
          </p>
          <p>
            <strong>Salário Líquido:</strong>{" "}
            {salario_liquido ? `R$ ${salario_liquido}` : "Não informado"}
          </p>
          <p>
            <strong>Valor da Operação:</strong>{" "}
            {valor_operacao ? `R$ ${valor_operacao}` : "Não informado"}
          </p>
          <p>
            <strong>Margem:</strong> {margem ? `R$ ${margem}` : "Não informado"}
          </p>
        </div>
        <div>
          <p>
            <strong>Tipo de Operação:</strong>{" "}
            {tipo_operacao || "Não informado"}
          </p>
          <p>
            <strong>Tipo de Pagamento:</strong>{" "}
            {tipo_pagamento || "Não informado"}
          </p>
          <p>
            <strong>Banco:</strong> {banker_name || "Não informado"}
          </p>
          <p>
            <strong>Agência:</strong> {agencia_banco || "Não informado"}
          </p>
          <p>
            <strong>Número da Conta:</strong> {numero_conta || "Não informado"}
          </p>
          <p>
            <strong>Tabela:</strong> {nome_tabela || "Não informado"}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-4">Observações:</h2>
      <p>{description || "Nenhuma observação disponível."}</p>

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
    </div>
  );
};

export default DetaisProposal;
