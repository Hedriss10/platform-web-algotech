import React, { useState } from "react";
import { Link } from "react-router-dom";
import { notify } from "../../utils/toastify";
import { useUser } from "../../../service/UserContext";
import Icons from "../../utils/Icons";
import ManageReport from "./Service/ManageReport";

const ImportReports = () => {
  const { user, token } = useUser();
  const [file, setFile] = useState(null);
  const [selectedAgreement, setSelectedAgreement] = useState("");

  // Função para lidar com a seleção de arquivo
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Função para enviar o arquivo e importar o relatório
  const handleSubmitImportTables = async (e) => {
    e.preventDefault();

    if (!selectedAgreement) {
      notify("Selecione um convênio antes de importar", { type: "warning" });
      return;
    }
    if (!file) {
      notify("Selecione um arquivo .xlsx para importar", { type: "warning" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", selectedAgreement);
      formData.append("file", file);

      const tablesApi = new ManageReport(user?.id);
      await tablesApi.importReport(formData, token);

      notify("Relatórios importados com sucesso", { type: "success" });
      setFile(null);
      setSelectedAgreement("");
    } catch (error) {
      console.error("Erro ao importar relatório:", error);
      notify("Erro ao importar Relatório", { type: "error" });
    }
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Importar Relatório</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/report" className="hover:text-gray-200">
              <strong>Gerenciamento de Relatório</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Importar Relatório
          </h2>
          <p className="text-white text-sm">
            O relatório tem que estar de acordo com o template do sistema.
          </p>
        </div>

        {/* Campo para selecionar o convênio */}
        <div className="mb-4">
          <label className="text-white block mb-2">
            <strong>Nome:</strong>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
            placeholder="Digite o nome do relatório"
            value={selectedAgreement}
            onChange={(e) => setSelectedAgreement(e.target.value)}
          />
        </div>

        {/* Campo para selecionar o arquivo */}
        <div className="mb-4">
          <label className="text-white block mb-2">
            Selecione um arquivo (.xlsx)
          </label>
          <input
            type="file"
            accept=".xlsx .csv"
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
            onChange={handleFileChange}
          />
        </div>

        {/* Botão para importar o relatório */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
          onClick={handleSubmitImportTables}
        >
          <Icons.FaUpload className="mr-2" /> Importar Tabela
        </button>
      </div>
    </div>
  );
};

export default ImportReports;
