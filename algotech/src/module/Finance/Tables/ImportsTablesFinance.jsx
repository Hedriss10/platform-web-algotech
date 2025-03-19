import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ManageBankers from "../Service/ManageBankers";
import { notify } from "../../utils/toastify";
import { useUser } from "../../../service/UserContext";
import { FaUpload } from "react-icons/fa";
import * as XLSX from "xlsx";

const ImportsTablesFianance = () => {
  const user = useUser();
  const [bankers, setBankers] = useState([]);
  const [financialAgreements, setFinancialAgreements] = useState([]);
  const [bank_id, setbank_id] = useState(null);
  const [selectedAgreement, setSelectedAgreement] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]); // Colunas selecionadas
  const [columnFilters, setColumnFilters] = useState({}); // Filtros por coluna
  const [rowLimit, setRowLimit] = useState(100); // Limite de linhas a serem processadas

  // Carrega a lista de bancos
  const loadBankers = async () => {
    try {
      const userApi = new ManageBankers(user?.id);
      const response = await userApi.getAllBankers();
      setBankers(response.data);
    } catch (error) {
      notify("Erro ao procurar o banco", { type: "warning" });
    }
  };

  // Carrega os convênios do banco selecionado
  const handleFinancialAgreements = async (bankId) => {
    try {
      const userApi = new ManageBankers(user?.id);
      const response = await userApi.getBankersById(bankId);
      setFinancialAgreements(response.data[0].financial_agreements);
    } catch (error) {
      notify("Carregue o convênio", { type: "warning" });
    }
  };

  // Manipula a seleção do arquivo
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Processa o arquivo Excel e atualiza o estado da tabela
  const handleSubmitImportTables = async () => {
    if (!file) {
      notify("Por favor, selecione um arquivo.", { type: "warning" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Limita o número de linhas processadas
      const limitedData = jsonData.slice(0, rowLimit + 1); // +1 para incluir o cabeçalho
      setTableData(limitedData);
      setSelectedColumns(limitedData[0].map((_, index) => index)); // Seleciona todas as colunas por padrão
    };
    reader.readAsArrayBuffer(file);
  };

  // Atualiza as colunas selecionadas
  const handleColumnSelection = (columnIndex) => {
    if (selectedColumns.includes(columnIndex)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== columnIndex)); // Remove a coluna
    } else {
      setSelectedColumns([...selectedColumns, columnIndex]); // Adiciona a coluna
    }
  };

  // Atualiza os filtros de coluna
  const handleFilterChange = (columnIndex, value) => {
    setColumnFilters((prevFilters) => ({
      ...prevFilters,
      [columnIndex]: value,
    }));
  };

  // Filtra os dados da tabela com base nas colunas e filtros selecionados
  const getFilteredData = () => {
    if (tableData.length === 0) return [];

    const headers = tableData[0];
    const rows = tableData.slice(1);

    return rows.filter((row) =>
      selectedColumns.every((colIndex) => {
        const filterValue = columnFilters[colIndex];
        if (!filterValue) return true; // Sem filtro aplicado
        return String(row[colIndex])
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }),
    );
  };

  // Efeito para carregar os convênios quando o banco é selecionado
  useEffect(() => {
    if (bank_id) {
      setFinancialAgreements([]);
      setSelectedAgreement("");
      handleFinancialAgreements(bank_id);
    }
  }, [bank_id]);

  // Efeito para carregar os bancos ao montar o componente
  useEffect(() => {
    loadBankers();
  }, []);

  return (
    <div className="flex-1 p-4 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Tabelas</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/importablesfinance" className="hover:text-gray-200">
              <strong>Gerenciamento de Tabelas</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Importar tabela de comissão
          </h2>
          <p className="text-white text-sm">
            Segue importação com o template de comissão.
          </p>
        </div>

        <div className="mb-4">
          <label className="text-white block mb-2">
            <strong>Selecione o Banco</strong>:
          </label>
          <select
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
            value={bank_id}
            onChange={(e) => setbank_id(e.target.value)}
          >
            <option value="">Selecione...</option>
            {bankers.map((banker) => (
              <option key={banker.id} value={banker.id}>
                {banker.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-white block mb-2">
            <strong>Selecione um Convênio</strong>:
          </label>
          <select
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
            value={selectedAgreement}
            onChange={(e) => setSelectedAgreement(e.target.value)}
          >
            <option value="">Selecione...</option>
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

        <div className="mb-4">
          <label className="text-white block mb-2">
            <strong>Data de Emissão:</strong>
          </label>
          <input
            type="date"
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-white block mb-2">
            Selecione um arquivo (.xlsx)
          </label>
          <input
            type="file"
            accept=".xlsx"
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-4">
          <label className="text-white block mb-2">
            <strong>Limite de Linhas:</strong>
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
            value={rowLimit}
            onChange={(e) => setRowLimit(Number(e.target.value))}
            min="1"
          />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
          onClick={handleSubmitImportTables}
        >
          <FaUpload className="mr-2" /> Importar Tabela
        </button>
      </div>

      {tableData.length > 0 && (
        <div className="mt-6 bg-gray-700 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Tabela Importada
          </h2>

          {/* Seleção de colunas */}
          <div className="mb-4">
            <label className="text-white block mb-2">
              <strong>Selecione as Colunas:</strong>
            </label>
            <div className="flex flex-wrap gap-2">
              {tableData[0].map((header, index) => (
                <label key={index} className="flex items-center text-white">
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(index)}
                    onChange={() => handleColumnSelection(index)}
                    className="mr-2"
                  />
                  {header}
                </label>
              ))}
            </div>
          </div>

          {/* Filtros de coluna */}
          <div className="mb-4">
            <label className="text-white block mb-2">
              <strong>Filtros por Coluna:</strong>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tableData[0].map(
                (header, index) =>
                  selectedColumns.includes(index) && (
                    <div key={index} className="flex flex-col">
                      <label className="text-white mb-1">{header}</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
                        placeholder={`Filtrar por ${header}`}
                        value={columnFilters[index] || ""}
                        onChange={(e) =>
                          handleFilterChange(index, e.target.value)
                        }
                      />
                    </div>
                  ),
              )}
            </div>
          </div>

          {/* Tabela responsiva */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-600 text-white">
              <thead>
                <tr>
                  {tableData[0].map(
                    (header, index) =>
                      selectedColumns.includes(index) && (
                        <th
                          key={index}
                          className="px-4 py-2 border border-gray-500"
                        >
                          {header}
                        </th>
                      ),
                  )}
                </tr>
              </thead>
              <tbody>
                {getFilteredData().map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map(
                      (cell, cellIndex) =>
                        selectedColumns.includes(cellIndex) && (
                          <td
                            key={cellIndex}
                            className="px-4 py-2 border border-gray-500"
                          >
                            {cell}
                          </td>
                        ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportsTablesFianance;

/// TODO - analisar o fator dessa implementação... se realmente compensa realizar pelo FE
