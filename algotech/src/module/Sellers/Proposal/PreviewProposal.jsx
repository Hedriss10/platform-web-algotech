import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { notify } from "../../utils/toastify";
import { useUser } from "../../../service/UserContext";
import ManageSellers from "../Service/ManageSellers";
import MaskCpf from "../../utils/MaskCpf";

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

const PreviewProposalById = () => {
  const { user, token } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfStates, setPdfStates] = useState({}); // { url: { numPages, pageNumber, blob, error, isExpanded } }

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
      console.error("Erro ao buscar PDF:", error.message);
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

  // Busca os dados ao carregar o componente
  useEffect(() => {
    getProposal();
  }, [id]);

  // Formata a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR");
  };

  // Função para lidar com o carregamento do PDF
  const onDocumentLoadSuccess =
    (url) =>
    ({ numPages }) => {
      setPdfStates((prev) => ({
        ...prev,
        [url]: { ...prev[url], numPages, error: null },
      }));
    };

  // Função para mudar a página do PDF
  const changePage = (url, offset) => {
    setPdfStates((prev) => {
      const current = prev[url] || { pageNumber: 1, numPages: 1 };
      const newPageNumber = Math.min(
        Math.max(current.pageNumber + offset, 1),
        current.numPages,
      );
      return {
        ...prev,
        [url]: { ...current, pageNumber: newPageNumber },
      };
    });
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
                      {report.user_description}
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
              <strong>Data de Emissão:</strong>{" "}
              {data_emissao || "Não informado"}
            </p>
            <p>
              <strong>Naturalidade:</strong>{" "}
              {naturalidade
                ? `${naturalidade} - ${uf_naturalidade}`
                : "Não informado"}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">
          Detalhes da Proposta:
        </h2>
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
              <strong>Margem:</strong>{" "}
              {margem ? `R$ ${margem}` : "Não informado"}
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
              <strong>Número da Conta:</strong>{" "}
              {numero_conta || "Não informado"}
            </p>
            <p>
              <strong>Tabela:</strong> {nome_tabela || "Não informado"}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">Observações:</h2>
        <p>{description || "Nenhuma observação disponível."}</p>

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
      </div>
    </div>
  );
};

export default PreviewProposalById;
