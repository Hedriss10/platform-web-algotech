import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { notify } from "../../utils/toastify";
import { useUser } from "../../../service/UserContext";
import ManageSellers from "../../Sellers/Service/ManageSellers";
import ManageFinance from "../../Finance/Service/ManageFinance";
import ManageTablesFinance from "../../Finance/Service/ManageTablesFinance";
import ManageBankers from "../../Finance/Service/ManageBankers";

// Estilo para o PDF (mantido para compatibilidade, caso volte a usar @react-pdf/renderer)
const styles = {
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
};

const UpdateOperational = () => {
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

  const handleRemoveImage = (name, index) => {
    setProposal((prevProposal) => {
      const updatedUrls = prevProposal.image_urls[name].filter(
        (_, i) => i !== index,
      );
      return {
        ...prevProposal,
        image_urls: {
          ...prevProposal.image_urls,
          [name]: updatedUrls,
        },
      };
    });
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
      navigate("/operational");
    } catch (error) {
      // Notifica erro
      notify("Erro ao editar a proposta", { type: "error" });
      console.error("Erro ao enviar dados:", error);
    }
  };

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
            <div className="mt-4">{renderAdditionalFields()}</div>
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
                    {table.end_term} | Taxas: {table.start_rate} á{" "}
                    {table.end_rate}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <br />
          <hr />
          <h2 className="text-xl font-semibold mt-6 mb-4">Observações:</h2>
          <p>{formData.observe}</p>
          <h2 className="text-xl font-semibold mt-6 mb-4">
            Documentos Anexados:
          </h2>
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
                              <p className="text-red-600">
                                {pdfStates[url].error}
                              </p>
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
      </div>
    </div>
  );
};

export default UpdateOperational;
