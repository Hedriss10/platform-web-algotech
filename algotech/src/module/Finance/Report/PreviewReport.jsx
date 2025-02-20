import { useNavigate, Link } from "react-router-dom";
import Icons from "../../utils/Icons";

const PreviewReport = () => {
  const navigate = useNavigate();

  const handlePagamentosProcessados = () => {
    navigate("/payments-processed");
  };

  const handleGerenciarFlags = () => {
    navigate("/flags");
  };

  const handleImportarRelatorio = () => {
    alert("Importar Relatório de Comissão");
    // navigate("/importar-relatorio");
  };

  const handleDeletarRelatorio = () => {
    alert("Deletar Relatório de Comissão");
    // navigate("/deletar-relatorio");
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
            <Icons.FaFileAlt size={18} /> Importar Relatório de Comissão
          </button>
          <button
            className="w-full flex items-center gap-2 p-2 border rounded-md text-red-600 hover:bg-red-100"
            onClick={handleDeletarRelatorio}
          >
            <Icons.FaTrash size={18} /> Deletar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewReport;
