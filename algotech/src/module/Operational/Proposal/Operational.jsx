import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useUser } from "../../../service/UserContext";
import { notify } from "../../utils/toastify";
import ManageOperational from "../Service/MangeOperational";
import ManageSellers from "../../Sellers/Service/ManageSellers";
import MaskCpf from "../../utils/MaskCpf";
import CheckSummaryProposal from "../components/CheckSummaryProposal";

const Operacional = () => {
  const { user, token } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    aguardando_digitacao: false,
    pendente_digitacao: false,
    contrato_em_digitacao: false,
    aceite_feito_analise_banco: false,
    contrato_pendente_banco: false,
    aguardando_pagamento: false,
    contrato_pago: false,
    description: "",
    number_proposal: "",
  });

  // Busca os detalhes da proposta
  const getDetailsProposal = async () => {
    try {
      const api = new ManageOperational(user?.id);
      const response = await api.getProposalDetails(token, id);
      setDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      notify("Erro ao carregar os detalhes da proposta", { type: "error" });
      setDetails({ data: [] }); // Define details como vazio em caso de erro
      setLoading(false);
    }
  };

  // Busca os dados da proposta
  const getProposal = async () => {
    try {
      const api = new ManageSellers(user?.id);
      const response = await api.getProposalById(id, token);
      setProposal(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      notify("Erro ao carregar a proposta", { type: "error" });
      setLoading(false);
    }
  };

  // Atualiza o formData com os detalhes da proposta
  useEffect(() => {
    if (details && details.length > 0) {
      const proposalDetails = details[0];
      setFormData({
        aguardando_digitacao: proposalDetails.aguardando_digitacao,
        pendente_digitacao: proposalDetails.pendente_digitacao,
        contrato_em_digitacao: proposalDetails.contrato_em_digitacao,
        aceite_feito_analise_banco: proposalDetails.aceite_feito_analise_banco,
        contrato_pendente_banco: proposalDetails.contrato_pendente_banco,
        aguardando_pagamento: proposalDetails.aguardando_pagamento,
        contrato_pago: proposalDetails.contrato_pago,
        description: proposalDetails.description || "",
        number_proposal: proposalDetails.number_proposal || "",
      });
    } else {
      // Define valores padrão se não houver details
      setFormData({
        aguardando_digitacao: false,
        pendente_digitacao: false,
        contrato_em_digitacao: false,
        aceite_feito_analise_banco: false,
        contrato_pendente_banco: false,
        aguardando_pagamento: false,
        contrato_pago: false,
        description: "",
        number_proposal: "",
      });
    }
  }, [details]);

  // Busca os dados ao carregar o componente
  useEffect(() => {
    getProposal();
    getDetailsProposal();
  }, [id]);

  // Atualiza o status da proposta
  const handleStatusChange = (statusKey) => {
    setFormData((prevFormData) => {
      const newFormData = {
        aguardando_digitacao: false,
        pendente_digitacao: false,
        contrato_em_digitacao: false,
        aceite_feito_analise_banco: false,
        contrato_pendente_banco: false,
        aguardando_pagamento: false,
        contrato_pago: false,
      };
      newFormData[statusKey] = !prevFormData[statusKey];
      return { ...prevFormData, ...newFormData };
    });
  };

  // Envia o status da proposta
  const postStatusProposal = async () => {
    try {
      const api = new ManageOperational(user?.id);
      const newFormData = {
        ...formData,
        number_proposal: formData.number_proposal
          ? Number(formData.number_proposal)
          : null,
      };

      const response = await api.postStatusProposal(token, id, newFormData);

      notify("Status alterado com sucesso", { type: "success" });
      getDetailsProposal(); // Atualiza os detalhes após o envio
    } catch (error) {
      if (
        error.status_code === 409 &&
        error.message_id === "proposal_summary_and_validated_fields"
      ) {
        setIsModalOpen(true); // Só abre a modal
      } else {
        notify("Erro ao alterar o status", { type: "error" });
      }
    }
  };

  // Formata a data para o formato dd/MM/yyyy, HH:mm
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!proposal) {
    return <div>Nenhuma proposta encontrada.</div>;
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

  // Extrai a descrição e os relatórios do details, se disponível
  const description =
    details && details.length > 0 ? details[0].description : "";
  const reports = details && details.length > 0 ? details[0].reports : [];

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Proposta</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/operational" className="hover:text-bg-gray-200">
              <strong>Gerenciamento Operacional</strong>
            </Link>
          </ol>
        </nav>
      </div>

      {/* Status da Proposta */}
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
          ].map((status) => (
            <label key={status.key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData[status.key]}
                onChange={() => handleStatusChange(status.key)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
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

      {/* Relatório de Descrições */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Histórico de Status</h2>
        {reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                    Data
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                    Descrição
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                    Usuário
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                      {formatDate(report.created_at)}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                      {report.description}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                      {report["user_description:"]}{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-700">Nenhum histórico disponível.</p>
        )}
      </div>

      {/* Dados da Proposta */}
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
        <p>{description}</p>

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

export default Operacional;
