import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useUser } from "../../../service/UserContext";
import { notify } from "@module/utils/toastify";
import ManageSellers from "@module/Sellers/Service/ManageSellers";
import ManageFinance from "@module/Finance/Service/ManageFinance";
import ManageTablesFinance from "@module/Finance/Service/ManageTablesFinance";
import ManageBankers from "@module/Finance/Service/ManageBankers";
import UploadFilesProposal from "@module/Operational/ui/forms/UplaodFilesProposal";
import DataOperationProposal from "@module/Operational/ui/forms/DataOpertationProposal";
import AddressProposal from "@module/Operational/ui/forms/AddreessProposal";
import DataUsers from "@module/Operational/ui/forms/DataUsers";
import DocumentProposal from "@module/Operational/ui/forms/DocumentProposal";
import ProposalFinance from "@module/Operational/ui/forms/FinanceProposal";
import UploadProposalDocument from "@module/Operational/ui/forms/UploadProposalDocument";
import MaskCpf from "@module/utils/MaskCpf";

const UpdateOperational = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, token } = useUser();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loanOperations, setLoanOperations] = useState([]);
  const [bankers, setBankers] = useState([]);
  const [financialAgreements, setFinancialAgreements] = useState([]);
  const [tablesFinance, setTablesFinance] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [bank_id, setBankId] = useState("");
  const [formData, setFormData] = useState({
    cpf: "",
    nome: "",
    data_nascimento: "",
    genero: "",
    email: "",
    naturalidade: "",
    cidade_naturalidade: "",
    uf_naturalidade: "",
    cep: "",
    data_emissao: "",
    uf_cidade: "",
    rg_documento: "",
    orgao_emissor: "",
    uf_emissor: "",
    nome_mae: "",
    nome_pai: "",
    bairro: "",
    endereco: "",
    numero_endereco: "",
    complemento_endereco: "",
    cidade: "",
    valor_salario: "",
    salario_liquido: "",
    telefone: "",
    telefone_residencial: "",
    telefone_comercial: "",
    observe: "",
    tipo_pagamento: "",
    agencia_banco: "",
    pix_chave: "",
    numero_conta: "",
    agencia_dv: "",
    agencia_op: "",
    tipo_conta: "",
    senha_servidor: "",
    matricula: "",
    data_dispacho: "",
    margem: "",
    prazo_inicio: "",
    prazo_fim: "",
    valor_operacao: "",
    loan_operation_id: "",
    tables_finance_id: "",
    financial_agreements_id: "",
    benefit_id: "",
    banker_name: "",
    tipo_beneficio: "",
    tipo_operacao: "",
    nome_tabela: "",
  });
  const [pdfStates, setPdfStates] = useState({});
  const [files, setFiles] = useState({
    extrato_consignacoes: null,
    contracheque: null,
    rg_cnh_completo: null,
    rg_verso: null,
    rg_frente: null,
    comprovante_residencia: null,
    selfie: null,
    detalhamento_inss: null,
  });

  // Funções de Busca de Dados
  const fetchProposal = async () => {
    try {
      const api = new ManageSellers(user?.id);
      const response = await api.getProposalById(id, token);
      setProposal(response.data);
    } catch (error) {
      console.error("Erro ao carregar proposta:", error);
      notify("Erro ao carregar a proposta", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchBankers = async () => {
    try {
      const api = new ManageBankers(user?.id);
      const response = await api.getAllBankers();
      setBankers(response.data);
    } catch (error) {
      notify("Erro ao carregar bancos", { type: "warning" });
    }
  };

  const fetchBenefits = async () => {
    try {
      const api = new ManageFinance(user?.id);
      const response = await api.getAllBenefits(token);
      setBenefits(response.data);
    } catch (error) {
      notify("Erro ao carregar benefícios", { type: "warning" });
    }
  };

  const fetchLoanOperations = async () => {
    try {
      const api = new ManageFinance(user?.id);
      const response = await api.getAllLoanOperation(token);
      setLoanOperations(response.data);
    } catch (error) {
      notify("Erro ao carregar operações de empréstimo", { type: "warning" });
    }
  };

  const fetchFinancialAgreements = async (bankId) => {
    try {
      const api = new ManageBankers(user?.id);
      const response = await api.getBankersById(bankId);
      setFinancialAgreements(response.data[0]?.financial_agreements || []);
    } catch (error) {
      notify("Erro ao carregar convênios", { type: "warning" });
    }
  };

  const fetchTablesFinance = async (financialAgreementId) => {
    try {
      const api = new ManageTablesFinance(user?.id);
      const response = await api.getAllTablesFinance(financialAgreementId);
      setTablesFinance(response.data);
    } catch (error) {
      notify("Erro ao carregar tabelas financeiras", { type: "warning" });
    }
  };

  // Funções de Manipulação de PDF
  const fetchPdfBlob = async (url) => {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok)
        throw new Error(`Erro ao carregar PDF: ${response.status}`);
      const blob = await response.blob();
      if (blob.size < 1000 || blob.type !== "application/pdf") {
        throw new Error("PDF inválido");
      }
      return URL.createObjectURL(blob);
    } catch (error) {
      notify(`Erro ao carregar PDF: ${error.message}`, { type: "error" });
      return null;
    }
  };

  const initializePdfs = async () => {
    const image_urls = proposal?.image_urls || {};
    const newPdfStates = {};
    for (const [key, urls] of Object.entries(image_urls)) {
      for (const url of urls) {
        if (url?.toLowerCase().endsWith(".pdf")) {
          const blobUrl = await fetchPdfBlob(url);
          newPdfStates[url] = {
            numPages: 1,
            pageNumber: 1,
            blob: blobUrl,
            error: blobUrl ? null : "Erro ao carregar PDF",
            isExpanded: false,
          };
        }
      }
    }
    setPdfStates(newPdfStates);
  };

  const togglePdfExpand = (url) => {
    setPdfStates((prev) => ({
      ...prev,
      [url]: { ...prev[url], isExpanded: !prev[url]?.isExpanded },
    }));
  };

  const downloadPdf = async (url, filename) => {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
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

  // Manipulação de Formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      const rawValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, cpf: rawValue }));
    } else if (name === "bank_id") {
      setBankId(value);
      setFormData((prev) => ({
        ...prev,
        bank_id: value,
        financial_agreements_id: "",
        tables_finance_id: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNumberFormatChange = (values, name) => {
    const { floatValue } = values;
    setFormData((prev) => ({
      ...prev,
      [name]: floatValue !== undefined ? floatValue : "",
    }));
  };

  const handleAddImage = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
  };

  const prepareDataForBackend = (formDataToSend, data) => {
    for (const key in data) {
      formDataToSend.append(key, data[key] ?? "");
    }
  };

  const updateProposal = async () => {
    try {
      const formDataToSend = new FormData();
      prepareDataForBackend(formDataToSend, formData);
      for (const key in files) {
        if (files[key]) {
          formDataToSend.append(key, files[key]);
        }
      }
      const api = new ManageSellers(user?.id);
      await api.updateProposal(id, formDataToSend, token);
      notify("Proposta editada com sucesso!", { type: "success" });
      navigate("/operational");
    } catch (error) {
      notify("Erro ao editar a proposta", { type: "error" });
      console.error("Erro ao enviar dados:", error);
    }
  };

  // Efeitos
  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchProposal(),
        fetchBankers(),
        fetchBenefits(),
        fetchLoanOperations(),
      ]);
    };
    fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (proposal) {
      const { proposal: proposalData } = proposal;
      setFormData({
        cpf: proposalData.cpf || "",
        nome: proposalData.nome || "",
        data_nascimento: proposalData.data_nascimento || "",
        email: proposalData.email || "",
        genero: proposalData.genero || "",
        endereco: proposalData.endereco || "",
        bairro: proposalData.bairro || "",
        cidade: proposalData.cidade || "",
        uf_cidade: proposalData.uf_cidade || "",
        cep: proposalData.cep || "",
        nome_mae: proposalData.nome_mae || "",
        nome_pai: proposalData.nome_pai || "",
        rg_documento: proposalData.rg_documento || "",
        orgao_emissor: proposalData.orgao_emissor || "",
        data_emissao: proposalData.data_emissao || "",
        numero_endereco: proposalData.numero_endereco || "",
        complemento_endereco: proposalData.complemento_endereco || "",
        telefone: proposalData.telefone || "",
        telefone_comercial: proposalData.telefone_comercial || "",
        naturalidade: proposalData.naturalidade || "",
        valor_salario: proposalData.valor_salario || "",
        uf_naturalidade: proposalData.uf_naturalidade || "",
        cidade_naturalidade: proposalData.cidade_naturalidade || "",
        tipo_beneficio: proposalData.tipo_beneficio || "",
        data_dispacho: proposalData.data_dispacho || "",
        matricula: proposalData.matricula || "",
        salario_liquido: proposalData.salario_liquido || "",
        valor_operacao: proposalData.valor_operacao || "",
        margem: proposalData.margem || "",
        tipo_operacao: proposalData.tipo_operacao || "",
        tipo_pagamento: proposalData.tipo_pagamento || "",
        banker_name: proposalData.banker_name || "",
        agencia_banco: proposalData.agencia_banco || "",
        numero_conta: proposalData.numero_conta || "",
        nome_tabela: proposalData.nome_tabela || "",
        prazo_inicio: proposalData.prazo_inicio || "",
        prazo_fim: proposalData.prazo_fim || "",
        observe: proposalData.observe || "",
      });
      setBankId(proposalData.bank_id || "");
    }
  }, [proposal]);

  useEffect(() => {
    if (proposal?.image_urls) {
      initializePdfs();
    }
    return () => {
      Object.values(pdfStates).forEach((state) => {
        if (state.blob) URL.revokeObjectURL(state.blob);
      });
    };
  }, [proposal]);

  useEffect(() => {
    if (bank_id) {
      fetchFinancialAgreements(bank_id);
    }
  }, [bank_id]);

  useEffect(() => {
    if (formData.financial_agreements_id) {
      fetchTablesFinance(formData.financial_agreements_id);
    }
  }, [formData.financial_agreements_id]);

  // Renderização
  if (loading) return <div>Carregando...</div>;
  if (!proposal) return <div>Nenhuma proposta encontrada.</div>;

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Proposta</h1>
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            <strong>Dados Pessoais:</strong>
          </h2>
          <DataUsers formData={formData} handleChange={handleChange} />
          <hr />
          <h2 className="text-xl font-semibold mt-6 mb-4">
            <strong>Endereço:</strong>
          </h2>
          <AddressProposal formData={formData} handleChange={handleChange} />
          <hr />
          <h2 className="text-xl font-semibold mt-6 mb-4">
            <strong>Documentação:</strong>
          </h2>
          <DocumentProposal formData={formData} handleChange={handleChange} />
          <hr />
          <h2 className="text-xl font-semibold mt-6 mb-4">
            <strong>Dados Financeiros:</strong>
          </h2>
          <ProposalFinance formData={formData} handleChange={handleChange} />
          <hr />
          <h2 className="text-xl font-semibold mt-6 mb-4">
            <strong>Dados da Operação:</strong>
          </h2>
          <DataOperationProposal
            formData={formData}
            handleChange={handleChange}
            tablesFinance={tablesFinance}
            financialAgreements={financialAgreements}
            loanOperations={loanOperations}
            bank_id={bank_id}
            bankers={bankers}
            handleNumberFormatChange={handleNumberFormatChange}
          />
          <hr />
          <h2 className="text-xl font-semibold mt-6 mb-4">Observações:</h2>
          <p>{formData.observe || "Nenhuma observação disponível."}</p>
          <h2 className="text-xl font-semibold mt-6 mb-4">
            Documentos Anexados:
          </h2>
          <UploadProposalDocument
            image_urls={proposal?.image_urls || {}}
            pdfStates={pdfStates}
            toggleExpandPdf={togglePdfExpand}
            downloadPdf={downloadPdf}
          />
          <hr />
          <h2 className="text-xl font-semibold mt-6 mb-4">
            <strong>Editar Documentos</strong>
          </h2>
          <UploadFilesProposal files={files} handleAddImage={handleAddImage} />
          <hr />
          <div className="mt-6">
            <button
              onClick={updateProposal}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Editar Proposta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOperational;
