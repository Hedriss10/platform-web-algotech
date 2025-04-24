import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { notify } from "../../utils/toastify";
import { useUser } from "../../../service/UserContext";
import ManageSellers from "../Service/ManageSellers";
import MaskCpf from "../../utils/MaskCpf";

const PreviewProposalById = () => {
  const { user, token } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProposal = async () => {
    try {
      const api = new ManageSellers(user?.id);
      const response = await api.getProposalById(id, token);
      setProposal(response.data); // Armazena os dados da proposta no estado
      setLoading(false); // Finaliza o loading
    } catch (error) {
      console.error(error);
      notify("Erro ao carregar a proposta", { type: "error" });
      setLoading(false); // Finaliza o loading mesmo em caso de erro
    }
  };

  useEffect(() => {
    getProposal(); // Chama a função ao montar o componente
  }, [id]); // Dependência: se o id mudar, a função será chamada novamente

  if (loading) {
    return <div>Carregando...</div>; // Exibe um loading enquanto os dados são carregados
  }

  if (!proposal) {
    return <div>Nenhuma proposta encontrada.</div>; // Exibe uma mensagem se não houver dados
  }

  const { image_urls, proposal: proposalData } = proposal;
  const {
    nome,
    cpf,
    data_nascimento,
    email,
    telefone,
    endereco,
    bairro,
    cidade,
    uf_cidade,
    cep,
    nome_mae,
    nome_pai,
    rg_documento,
    orgao_emissor,
    data_emissao,
    naturalidade,
    uf_naturalidade,
    tipo_beneficio,
    matricula,
    salario_liquido,
    valor_operacao,
    margem,
    tipo_operacao,
    tipo_pagamento,
    banker_name,
    agencia_banco,
    numero_conta,
    nome_tabela,
    prazo_inicio,
    prazo_fim,
    observe,
  } = proposalData;

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Proposta</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/sellers" className="hover:text-bg-gray-200">
              <strong>Lista de Propostas</strong>
            </Link>
          </ol>
        </nav>
      </div>

      {/* Dados da Proposta */}
      <div className="bg-white p-6 rounded-lg shadow-md">
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
              <strong>Data de Nascimento:</strong> {data_nascimento}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Telefone:</strong> {telefone}
            </p>
            <p>
              <strong>Endereço:</strong> {endereco}, {bairro}, {cidade} -{" "}
              {uf_cidade}
            </p>
            <p>
              <strong>CEP:</strong> {cep}
            </p>
          </div>
          <div>
            <p>
              <strong>Nome da Mãe:</strong> {nome_mae}
            </p>
            <p>
              <strong>Nome do Pai:</strong> {nome_pai}
            </p>
            <p>
              <strong>RG:</strong> {rg_documento}
            </p>
            <p>
              <strong>Órgão Emissor:</strong> {orgao_emissor}
            </p>
            <p>
              <strong>Data de Emissão:</strong> {data_emissao}
            </p>
            <p>
              <strong>Naturalidade:</strong> {naturalidade} - {uf_naturalidade}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">
          Detalhes da Proposta:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Tipo de Benefício:</strong> {tipo_beneficio}
            </p>
            <p>
              <strong>Matrícula:</strong> {matricula}
            </p>
            <p>
              <strong>Salário Líquido:</strong> R$ {salario_liquido}
            </p>
            <p>
              <strong>Valor da Operação:</strong> R$ {valor_operacao}
            </p>
            <p>
              <strong>Margem:</strong> R$ {margem}
            </p>
            <p>
              <strong>Prazos:</strong> {prazo_inicio} a {prazo_fim}
            </p>
          </div>
          <div>
            <p>
              <strong>Tipo de Operação:</strong> {tipo_operacao}
            </p>
            <p>
              <strong>Tipo de Pagamento:</strong> {tipo_pagamento}
            </p>
            <p>
              <strong>Banco:</strong> {banker_name}
            </p>
            <p>
              <strong>Agência:</strong> {agencia_banco}
            </p>
            <p>
              <strong>Número da Conta:</strong> {numero_conta}
            </p>
            <p>
              <strong>Tabela:</strong> {nome_tabela}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">Observações:</h2>
        <p>{observe}</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">
          Documentos Anexados:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(image_urls).map(
            ([key, urls]) =>
              urls.length > 0 && (
                <div key={key}>
                  <h3 className="font-semibold">
                    {key.replace(/_/g, " ").toUpperCase()}
                  </h3>
                  {urls.map((url, index) => (
                    <div key={index} className="mt-2">
                      <img
                        src={url}
                        alt={`${key}_${index}`}
                        className="w-full h-auto rounded-lg shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewProposalById;
