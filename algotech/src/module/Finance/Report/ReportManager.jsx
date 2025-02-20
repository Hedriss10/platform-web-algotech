import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Icons from "../../utils/Icons";

const ReportManager = () => {
  const navigate = useNavigate();

  const handleProcessPayments = () => {
    navigate("/process-payments");
  };

  const handleImportReports = () => {
    navigate("/gerement-reports");
  };

  const handleDeleteReports = () => {
    alert("Deletar Relatório de Comissão");
    // navigate("/deletar-relatorio");
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Gerenciamento de Relatório de Comissão
        </h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/report" className="hover:text-bg-gray-200">
              <strong>Gerenciamento de Relatório</strong>
            </Link>
          </ol>
        </nav>
      </div>

      {/* Container de ações */}
      <div className="bg-gray-700 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">
          Gestão de relatórios de comissão
        </h2>
        <div className="space-y-4">
          <button
            className="w-full flex items-center gap-2 p-2 border rounded-md hover:bg-gray-800"
            onClick={handleProcessPayments}
          >
            <Icons.FaRegMoneyBillAlt size={18} /> Processar Pagamentos
          </button>
          <button
            className="w-full flex items-center gap-2 p-2 border rounded-md hover:bg-gray-800"
            onClick={handleImportReports}
          >
            <Icons.FaFileAlt size={18} /> Importar Relatório
          </button>
          <button
            className="w-full flex items-center gap-2 p-2 border rounded-md text-red-600 hover:bg-red-100"
            onClick={handleDeleteReports}
          >
            <Icons.FaTrash size={18} /> Deletar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportManager;
