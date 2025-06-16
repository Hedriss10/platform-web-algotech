import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { notify } from "@module/utils/toastify";
import { useUser } from "../../../service/UserContext";
import ManageSellers from "@module/Sellers/Service/ManageSellers";
import ManageFinance from "@module/Finance/Service/ManageFinance";
import ManageTablesFinance from "@module/Finance/Service/ManageTablesFinance";
import ManageBankers from "@module/Finance/Service/ManageBankers";
import ManageProposal from "@module/Sellers/ui/forms/ManageProposal";

const RegisterProposal = () => {
  const { user, token } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cpf: null,
    nome: null,
    data_nascimento: null,
    genero: null,
    email: null,
    naturalidade: null,
    cidade_naturalidade: null,
    uf_naturalidade: null,
    cep: null,
    data_emissao: null,
    uf_cidade: null,
    rg_documento: null,
    orgao_emissor: null,
    uf_emissor: null,
    nome_mae: null,
    nome_pai: null,
    bairro: null,
    endereco: null,
    numero_endereco: null,
    complemento_endereco: null,
    cidade: null,
    valor_salario: null,
    salario_liquido: null,
    telefone: null,
    telefone_residencial: null,
    telefone_comercial: null,
    tipo_pagamento: null,
    agencia_banco: null,
    pix_chave: null,
    numero_conta: null,
    agencia_dv: null,
    agencia_op: null,
    tipo_conta: null,
    senha_servidor: null,
    matricula: null,
    data_dispacho: null,
    margem: null,
    prazo_inicio: null,
    prazo_fim: null,
    valor_operacao: null,
    loan_operation_id: null,
    tables_finance_id: null,
    financial_agreements_id: null,
    benefit_id: null,
    observe: null,
  });

  // Estados para os arquivos
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

  // Estados para os dados buscados
  const [bankers, setBankers] = useState([]);
  const [financialAgreements, setFinancialAgreements] = useState([]);
  const [tablesFinance, setTablesFinance] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loanOperations, setLoanOperations] = useState([]);
  const [bank_id, setbank_id] = useState(null);

  // Função para aplicar a máscara de CPF
  const MaskCpf = (cpf) => {
    if (!cpf) return ""; // Se for null, retorna vazio
    return cpf
      .replace(/\D/g, "") // Remove tudo que não é dígito
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto após os 3 primeiros dígitos
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto após os 6 primeiros dígitos
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca um hífen antes dos últimos 2 dígitos
  };

  // Busca os bancos
  const handleBankers = async () => {
    try {
      const userApi = new ManageBankers(user?.id, null, 1, 100);
      const response = await userApi.getAllBankers();
      setBankers(response.data);
    } catch (error) {
      notify("Erro ao procurar o banco", { type: "warning" });
    }
  };

  // Busca os convênios com base no ID do banco
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

  // Busca os benefícios
  const handleBenefit = async () => {
    try {
      const usersApi = new ManageFinance(user?.id);
      const response = await usersApi.getAllBenefits(token);
      setBenefits(response.data);
    } catch (error) {
      notify("Carregue o benefício", { type: "warning" });
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

  // Atualiza os dados do formulário
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
    } else if (name === "margem") {
      const normalized = value.replace(",", ".").replace(/[^\d.]/g, "");
      setFormData({
        ...formData,
        [name]: normalized,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value.trim() === "" ? null : value,
      });
    }
  };

  // handle number format change for valor operação
  const handleNumberFormatChange = (values, sourceInfo) => {
    const { floatValue } = values;
    const { name } = sourceInfo.event.target;
    setFormData({
      ...formData,
      [name]: floatValue || null,
    });
  };

  // Atualiza os arquivos
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: selectedFiles[0],
    }));
  };

  // Envia o formulário
  const prepareDataForBackend = (formDataToSend, data) => {
    for (const key in data) {
      if (data[key] === null || data[key] === "") {
        formDataToSend.append(key, ""); // Envia string vazia para campos nulos ou vazios
      } else {
        formDataToSend.append(key, data[key]); // Adiciona o valor normal
      }
    }
  };

  const registerProposal = async () => {
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
      const response = await usersApi.postProposal(formDataToSend, token);

      // Notifica sucesso e redireciona
      notify("Proposta cadastrada com sucesso!", { type: "success" });
      navigate("/sellers");
    } catch (error) {
      // Notifica erro
      notify("Erro ao cadastrar a proposta", { type: "error" });
      console.error("Erro ao enviar dados:", error);
    }
  };

  // Busca os dados iniciais ao montar o componente
  useEffect(() => {
    handleBankers();
    handleBenefit();
    handleLoanOperation();
  }, []);

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

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Cadastro de Proposta</h1>
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

      {/* Formulário de Cadastro */}
      <ManageProposal
        formData={formData}
        handleChange={handleChange}
        tablesFinance={tablesFinance}
        financialAgreements={financialAgreements}
        files={files}
        registerProposal={registerProposal}
        handleNumberFormatChange={handleNumberFormatChange}
        handleFileChange={handleFileChange}
        loanOperations={loanOperations}
        bankers={bankers}
        bank_id={bank_id}
      />
    </div>
  );
};

export default RegisterProposal;
