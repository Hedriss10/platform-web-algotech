import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useUser } from "../../../service/UserContext";
import { notify } from "@module/utils/toastify";
import ManageOperational from "@module/Operational/Service/MangeOperational";
import ManageSellers from "@module/Sellers/Service/ManageSellers";
import DetaisProposal from "@module/Operational/ui/proposal/Details";
import HistoryProposal from "@module/Operational/ui/proposal/HistoryProposal";
import StatusProposal from "@module/Operational/ui/proposal/StatusProposal";
import formatDate from "@module/utils/FormatData";

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
  const [pdfStates, setPdfStates] = useState({});

  // Busca os detalhes da proposta
  const getDetailsProposal = async () => {
    try {
      const api = new ManageOperational(user?.id);
      const response = await api.getProposalDetails(token, id);
      setDetails(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      if (error.response?.status === 404) {
        setDetails({ data: [], reports: [], description: "" });
      } else {
        notify("Erro inesperado ao carregar os detalhes da proposta", {
          type: "error",
        });
        setDetails({ data: [], reports: [], description: "" });
      }
    } finally {
      setLoading(false);
    }
  };

  // Busca os dados da proposta
  const getProposal = async () => {
    try {
      const api = new ManageSellers(user?.id);
      const response = await api.getProposalById(id, token);
      setProposal(response.data);
    } catch (error) {
      console.error("Erro ao buscar proposta:", error);
      notify("Erro ao carregar a proposta", { type: "error" });
      setProposal(null);
    } finally {
      setLoading(false);
    }
  };

  // Busca o blob do PDF com autenticação
  const fetchPdfBlob = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok)
        throw new Error(
          `Erro ao carregar PDF: ${response.status} - ${response.statusText}`,
        );
      const blob = await response.blob();
      if (blob.size < 1000) {
        throw new Error("PDF inválido: tamanho do arquivo muito pequeno");
      }
      if (blob.type !== "application/pdf") {
        throw new Error(
          `PDF inválido: tipo de arquivo incorreto (${blob.type})`,
        );
      }
      const blobUrl = URL.createObjectURL(blob);
      return blobUrl;
    } catch (error) {
      notify(`Erro ao carregar PDF: ${error.message}`, { type: "error" });
      return null;
    }
  };

  // Inicializa pdfStates para PDFs
  useEffect(() => {
    if (proposal?.image_urls) {
      const initializePdfs = async () => {
        const newPdfStates = {};
        for (const [key, urls] of Object.entries(proposal.image_urls)) {
          for (const url of urls) {
            if (url && url.toLowerCase().endsWith(".pdf")) {
              const blobUrl = await fetchPdfBlob(url);
              newPdfStates[url] = {
                numPages: 1,
                pageNumber: 1,
                blob: blobUrl,
                error: blobUrl
                  ? null
                  : "Erro ao carregar PDF: arquivo inválido ou não encontrado",
                isExpanded: false, // Novo estado para expansão
              };
            }
          }
        }
        setPdfStates(newPdfStates);
      };
      initializePdfs();
    }
    // Cleanup
    return () => {
      Object.values(pdfStates).forEach((state) => {
        if (state.blob) {
          URL.revokeObjectURL(state.blob);
        }
      });
    };
  }, [proposal, token]);

  // Atualiza o formData com os detalhes da proposta
  useEffect(() => {
    if (details && details.length > 0) {
      const proposalDetails = details[0];
      setFormData({
        aguardando_digitacao: proposalDetails.aguardando_digitacao || false,
        pendente_digitacao: proposalDetails.pendente_digitacao || false,
        contrato_em_digitacao: proposalDetails.contrato_em_digitacao || false,
        aceite_feito_analise_banco:
          proposalDetails.aceite_feito_analise_banco || false,
        contrato_pendente_banco:
          proposalDetails.contrato_pendente_banco || false,
        aguardando_pagamento: proposalDetails.aguardando_pagamento || false,
        contrato_pago: proposalDetails.contrato_pago || false,
        contrato_reprovado: proposalDetails.contrato_reprovado || false,
        description: proposalDetails.description || "",
        number_proposal: proposalDetails.number_proposal || "",
      });
    } else {
      setFormData({
        aguardando_digitacao: false,
        pendente_digitacao: false,
        contrato_em_digitacao: false,
        aceite_feito_analise_banco: false,
        contrato_pendente_banco: false,
        aguardando_pagamento: false,
        contrato_pago: false,
        contrato_reprovado: false,
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
        contrato_reprovado: false,
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
      getDetailsProposal();
    } catch (error) {
      if (
        error.status_code === 409 &&
        error.message_id === "proposal_summary_and_validated_fields"
      ) {
        setIsModalOpen(true);
      } else {
        notify("Erro ao alterar o status", { type: "error" });
      }
    }
  };

  // Função para expandir/recolher o PDF
  const toggleExpandPdf = (url) => {
    setPdfStates((prev) => ({
      ...prev,
      [url]: {
        ...prev[url],
        isExpanded: !prev[url].isExpanded,
      },
    }));
  };

  // Função para baixar o PDF
  const downloadPdf = async (url, filename) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok)
        throw new Error(`Erro ao baixar PDF: ${response.status}`);
      const blob = await response.blob();
      if (blob.size < 1000 || blob.type !== "application/pdf") {
        throw new Error("Arquivo inválido para download");
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename || "documento.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      notify(`Erro ao baixar PDF: ${error.message}`, { type: "error" });
    }
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
      <StatusProposal
        formData={formData}
        setFormsData={setFormData}
        handleStatusChange={handleStatusChange}
        setFormData={setFormData}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        postStatusProposal={postStatusProposal}
      />
      {/* Relatório de Descrições */}
      <HistoryProposal reports={reports} formatDate={formatDate} />

      {/* Dados da Proposta */}
      <DetaisProposal
        nome={nome}
        cpf={cpf}
        data_nascimento={data_nascimento}
        email={email}
        telefone={telefone}
        endereco={endereco}
        bairro={bairro}
        cidade={cidade}
        uf_cidade={uf_cidade}
        cep={cep}
        data_emissao={data_emissao}
        nome_mae={nome_mae}
        nome_pai={nome_pai}
        orgao_emissor={orgao_emissor}
        rg_documento={rg_documento}
        naturalidade={naturalidade}
        uf_naturalidade={uf_naturalidade}
        image_urls={image_urls}
        toggleExpandPdf={toggleExpandPdf}
        downloadPdf={downloadPdf}
        salario_liquido={salario_liquido}
        valor_operacao={valor_operacao}
        margem={margem}
        banker_name={banker_name}
        agencia_banco={agencia_banco}
        numero_conta={numero_conta}
        nome_tabela={nome_tabela}
        tipo_operacao={tipo_operacao}
        tipo_pagamento={tipo_pagamento}
        description={description}
      />
    </div>
  );
};

export default Operacional;
