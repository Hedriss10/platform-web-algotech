import { useNavigate, Link } from "react-router-dom";
import Icons from "../../utils/Icons";
import ManageReport from "./Service/ManageReport";
import { notify } from "../../utils/toastify";

const PreviewReport = () => {
  const navigate = useNavigate();

  const handlePagamentosProcessados = () => {
    navigate("/payments-processed");
  };

  const handleGerenciarFlags = () => {
    navigate("/flags");
  };

  const handleImportarRelatorio = () => {
    navigate("/gerement-reports");
  };

  const handleImportsGetAllProposal = async () => {
    try {
      const usersApi = new ManageReport();
      const csvData = await usersApi.getAllReportProposals();

      if (!csvData || typeof csvData !== "string") {
        throw new Error("Dados inválidos retornados pela API");
      }

      const blob = new Blob([csvData], { type: "text/csv" });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio_propostas.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      notify("Relatório baixado e processado com sucesso", { type: "success" });
    } catch (error) {
      console.error("Erro ao baixar o relatório:", error);
      notify("Erro ao baixar Relatório", { type: "error" });
    }
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Relatório</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/finance" className="hover:text-bg-gray-200">
              <strong>Lista de Bancos</strong>
            </Link>
            <Link className="hover:text-bg-gray-200">
              <strong>Relatorio</strong>
            </Link>
          </ol>
        </nav>
      </div>

      {/* Container de ações */}
      <div className="bg-gray-700 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Gestão de relatórios</h2>
        <div className="space-y-4">
          <button
            className="w-full flex items-center gap-2 p-2 border rounded-md hover:bg-gray-800"
            onClick={handlePagamentosProcessados}
          >
            <Icons.FaCreditCard size={18} /> Pagamentos Processados
          </button>
          <button
            className="w-full flex items-center gap-2 p-2 border rounded-md hover:bg-gray-800"
            onClick={handleGerenciarFlags}
          >
            <Icons.FaCog size={18} /> Gerenciar Cadastro de Flags
          </button>
          <button
            className="w-full flex items-center gap-2 p-2 border rounded-md hover:bg-gray-800"
            onClick={handleImportarRelatorio}
          >
            <Icons.FaFileAlt size={18} /> Gerenciar Relatório de Comissão
          </button>
          <button
            className="w-full flex items-center gap-2 p-2 border rounded-md text-green-600 hover:bg-green-100"
            onClick={handleImportsGetAllProposal}
          >
            <Icons.FaRegFileExcel size={18} /> Exportar Relatório de Comissão
            Pagas
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewReport;
