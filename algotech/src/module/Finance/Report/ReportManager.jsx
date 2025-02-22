import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Icons from "../../utils/Icons";

const ReportManager = () => {
  const navigate = useNavigate();

  const handleProcessPayments = () => {
    navigate("/preview-payments");
  };

  const handleImportReports = () => {
    navigate("/import-reports");
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
        </div>
      </div>
    </div>
  );
};

export default ReportManager;
