// src/module/Sellers/Proposal/UpdateProposal.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { notify } from "@module/utils/toastify";
import { useUser } from "../../../service/UserContext";
import ManageSellers from "@module/Sellers/Service/ManageSellers";
import ManageFinance from "@module/Finance/Service/ManageFinance";
import ManageTablesFinance from "@module/Finance/Service/ManageTablesFinance";
import ManageBankers from "@module/Finance/Service/ManageBankers";
import UpdateManageProposals from "@module/Sellers/ui/forms/UpdateManageProposals";

const UpdateProposal = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtém o ID da proposta da URL
  const { user, token } = useUser(); // Obtém o usuário e o token do contexto
  const [proposal, setProposal] = useState(null); // Estado para armazenar os dados da proposta
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [loanOperations, setLoanOperations] = useState([]);
  const [bankers, setBankers] = useState([]);
  const [financialAgreements, setFinancialAgreements] = useState([]);
  const [tablesFinance, setTablesFinance] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [bank_id, setbank_id] = useState(null);
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
  });

  const [pdfStates, setPdfStates] = useState({});

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
      console.error("Erro ao buscar PDF:", error.message);
      notify(`Erro ao carregar PDF: ${error.message}`, { type: "error" });
      return null;
    }
  };

  // files
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

  // Função para buscar os dados da proposta pelo ID
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

  const handleBenefit = async () => {
    try {
      const usersApi = new ManageFinance(user?.id);
      const response = await usersApi.getAllBenefits(token);
      setBenefits(response.data);
    } catch (error) {
      notify("Carregue o benefício", { type: "warning" });
    }
  };

  const MaskCpf = (cpf) => {
    if (!cpf) return ""; // Se for null, retorna vazio
    return cpf
      .replace(/\D/g, "") // Remove tudo que não é dígito
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto após os 3 primeiros dígitos
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto após os 6 primeiros dígitos
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca um hífen antes dos últimos 2 dígitos
  };

  const handleBankers = async () => {
    try {
      const userApi = new ManageBankers(user?.id);
      const response = await userApi.getAllBankers();
      setBankers(response.data);
    } catch (error) {
      notify("Erro ao procurar o banco", { type: "warning" });
    }
  };

  // Busca as operações de empréstimo
  const handleLoanOperation = async () => {
    try {
      const usersApi = new ManageFinance(user?.id);
      const response = await usersApi.getAllLoanOperation(token);
      setLoanOperations(response.data);
    } catch (error) {
      notify("Carregue a operação", { type: "warning" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cpf") {
      const maskedValue = MaskCpf(value);
      setFormData({
        ...formData,
        [name]: maskedValue.replace(/\D/g, ""),
      });
    } else if (name === "bank_id") {
      setbank_id(value);
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value.trim() === "" ? null : value,
      });
    }
  };

  const togglePdfExpand = (url) => {
    setPdfStates((prevStates) => ({
      ...prevStates,
      [url]: {
        ...prevStates[url],
        isExpanded: !prevStates[url].isExpanded,
      },
    }));
  };

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

  // Preenche o formData com os dados da proposta quando ela é carregada
  useEffect(() => {
    if (proposal) {
      const { proposal: proposalData } = proposal;
      const {
        nome,
        cpf,
        data_nascimento,
        email,
        telefone,
        genero,
        endereco,
        bairro,
        cidade,
        uf_cidade,
        cep,
        nome_mae,
        nome_pai,
        numero_endereco,
        rg_documento,
        orgao_emissor,
        data_emissao,
        telefone_comercial,
        complemento_endereco,
        valor_salario,
        cidade_naturalidade,
        naturalidade,
        uf_naturalidade,
        tipo_beneficio,
        matricula,
        salario_liquido,
        valor_operacao,
        margem,
        tipo_operacao,
        tipo_pagamento,
        data_dispacho,
        banker_name,
        agencia_banco,
        numero_conta,
        nome_tabela,
        prazo_inicio,
        prazo_fim,
        observe,
      } = proposalData;

      setFormData({
        cpf,
        nome,
        data_nascimento,
        email,
        genero,
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
        numero_endereco,
        complemento_endereco,
        telefone,
        telefone_comercial,
        naturalidade,
        valor_salario,
        uf_naturalidade,
        cidade_naturalidade,
        tipo_beneficio,
        data_dispacho,
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
      });
    }
  }, [proposal]);

  const image_urls = proposal?.image_urls || [];

  // Inicializa pdfStates para PDFs
  useEffect(() => {
    if (image_urls) {
      const initializePdfs = async () => {
        const newPdfStates = {};
        for (const [key, urls] of Object.entries(image_urls)) {
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

  // financialAgreements
  const handleFinancialAgreements = async (bankId) => {
    try {
      const userApi = new ManageBankers(user?.id);
      const response = await userApi.getBankersById(bankId);
      setFinancialAgreements(response.data[0].financial_agreements);
    } catch (error) {
      notify("Carregue o convênio", { type: "warning" });
    }
  };

  // Busca as tabelas financeiras com base no ID do convênio
  const handleTablesFinance = async (financialAgreementId) => {
    try {
      const userApi = new ManageTablesFinance(user?.id);
      const response = await userApi.getAllTablesFinance(financialAgreementId);
      setTablesFinance(response.data);
    } catch (error) {
      notify("Carregue a tabela", { type: "warning" });
    }
  };

  // Combine os useEffect para evitar a alteração da ordem dos hooks
  useEffect(() => {
    if (bank_id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        financial_agreements_id: "",
        tables_finance_id: "",
      }));
      handleFinancialAgreements(bank_id);
    }
  }, [bank_id]);

  useEffect(() => {
    if (formData.financial_agreements_id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        tables_finance_id: "",
      }));
      handleTablesFinance(formData.financial_agreements_id);
    }
  }, [formData.financial_agreements_id]);

  useEffect(() => {
    if (bank_id) {
      handleFinancialAgreements(bank_id);
    }
  }, [bank_id]);

  // Busca a proposta ao montar o componente
  useEffect(() => {
    getProposal();
    handleBankers();
    handleBenefit();
    handleLoanOperation();
  }, [id]);

  // Exibe um loading enquanto os dados são carregados
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Exibe uma mensagem se não houver dados da proposta
  if (!proposal) {
    return <div>Nenhuma proposta encontrada.</div>;
  }

  const handleAddImage = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: selectedFiles[0],
    }));
  };

  const prepareDataForBackend = (formDataToSend, data) => {
    for (const key in data) {
      if (data[key] === null || data[key] === "") {
        formDataToSend.append(key, ""); // Envia string vazia para campos nulos ou vazios
      } else {
        formDataToSend.append(key, data[key]); // Adiciona o valor normal
      }
    }
  };

  const handleNumberFormatChange = (values, name) => {
    const { floatValue } = values;
    setFormData((prev) => ({
      ...prev,
      [name]: floatValue !== undefined ? floatValue : "",
    }));
  };

  const updateProposal = async () => {
    try {
      const formDataToSend = new FormData();

      // Prepara os dados do formulário
      prepareDataForBackend(formDataToSend, formData);

      // Adiciona os arquivos
      for (const key in files) {
        if (files[key]) {
          formDataToSend.append(key, files[key]);
        }
      }

      // Envia os dados para o backend
      const usersApi = new ManageSellers(user?.id);
      const response = await usersApi.updateProposal(id, formDataToSend, token);

      // Notifica sucesso e redireciona
      notify("Proposta Editada com sucesso!", { type: "success" });
      navigate("/sellers");
    } catch (error) {
      // Notifica erro
      notify("Erro ao editar a proposta", { type: "error" });
      console.error("Erro ao enviar dados:", error);
    }
  };

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
        <UpdateManageProposals
          formData={formData}
          handleChange={handleChange}
          handleAddImage={handleAddImage}
          files={files}
          bankers={bankers}
          loanOperations={loanOperations}
          financialAgreements={financialAgreements}
          tablesFinance={tablesFinance}
          toggleExpandPdf={togglePdfExpand}
          pdfStates={pdfStates}
          updateProposal={updateProposal}
          bank_id={bank_id}
          image_urls={image_urls}
          handleNumberFormatChange={handleNumberFormatChange}
        />
      </div>
    </div>
  );
};

export default UpdateProposal;
