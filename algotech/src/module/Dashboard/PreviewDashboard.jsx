import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ManageDashBoards from "./Service/ManageDashboard";
import { useUser } from "../../service/UserContext";
import { Bar } from "react-chartjs-2";
import Icons from "../utils/Icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const PreviewDashBoard = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [bankers, setBankers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const justFirstPage = 1;
  const [currentPage] = useState(justFirstPage);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sallesRankingPaid, setSallesRankingPaid] = useState(0);
  const [statusProposal, setStatusProposal] = useState({
    aceite_feito_analise_banco_count: 0,
    aguardando_digitacao_count: 0,
    aguardando_pagamento_count: 0,
    contrato_em_digitacao_count: 0,
    contrato_pago_count: 0,
    contrato_pendente_banco_count: 0,
    pendente_digitacao_count: 0,
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total de Vendas (R$)",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Ranking de Vendas por Vendedor" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Valor (R$)" } },
    },
  };

  const loadGetSalesPaid = async () => {
    try {
      setLoading(true);
      const usersApi = new ManageDashBoards(
        user?.id,
        searchTerm,
        justFirstPage,
        rowsPerPage,
      );
      const response = await usersApi.getSalesPaid(token);

      const rawValue = response.data[0]?.value_total_operations || 0;
      setSallesRankingPaid(parseFloat(rawValue) || 0);
    } catch (error) {
      console.error("Erro ao carregar vendas pagas:", error);
      setSallesRankingPaid(0);
    } finally {
      setLoading(false);
    }
  };

  const loadSallesRankingPaid = async () => {
    try {
      setLoading(true);
      const usersApi = new ManageDashBoards(
        user?.id,
        searchTerm,
        justFirstPage,
        rowsPerPage,
      );
      const response = await usersApi.getSallesRankingPaid(token);
      setBankers(response.data);
      setTotalPages(response.metadata.total_pages || 1);
      const labels = response.data.map((item) => item.seller);
      const salesData = response.data.map(
        (item) =>
          parseFloat(
            item.value_total_operations
              .replace("R$", "")
              .replace(".", "")
              .replace(",", ".")
              .trim(),
          ) || 0,
      );
      setChartData({
        labels,
        datasets: [
          {
            label: "Total de Vendas (R$)",
            data: salesData,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Erro ao carregar ranking de vendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatusProposal = async () => {
    try {
      setLoading(true);
      const usersApi = new ManageDashBoards(
        user?.id,
        searchTerm,
        justFirstPage,
        rowsPerPage,
      );
      const response = await usersApi.getStatusProposal(token);
      const data = response.data[0] || {};
      setStatusProposal({
        aceite_feito_analise_banco_count:
          data.aceite_feito_analise_banco_count || 0,
        aguardando_digitacao_count: data.aguardando_digitacao_count || 0,
        aguardando_pagamento_count: data.aguardando_pagamento_count || 0,
        contrato_em_digitacao_count: data.contrato_em_digitacao_count || 0,
        contrato_pago_count: data.contrato_pago_count || 0,
        contrato_pendente_banco_count: data.contrato_pendente_banco_count || 0,
        pendente_digitacao_count: data.pendente_digitacao_count || 0,
      });
    } catch (error) {
      console.error("Erro ao carregar status das propostas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && token) {
      loadGetSalesPaid();
      loadSallesRankingPaid();
      loadStatusProposal();
    }
  }, [user, token, searchTerm]);

  const getBorderColor = (value) =>
    value === 0
      ? "border-red-500"
      : value <= 5
        ? "border-yellow-500"
        : "border-green-500";

  const formattedValue = sallesRankingPaid.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Indicadores</h1>
        {loading && <p className="text-gray-500">Carregando...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          <div
            className={`bg-white p-5 rounded-lg shadow-lg border-l-4 ${getBorderColor(sallesRankingPaid)} hover:scale-105 transition-transform`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                {Icons.MdOutlinePaid}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-600 uppercase">
                  Vendas Pagas
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  {sallesRankingPaid.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-white p-5 rounded-lg shadow-lg border-l-4 ${getBorderColor(statusProposal.aceite_feito_analise_banco_count)} hover:scale-105 transition-transform`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                {Icons.FaStopCircle}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-600 uppercase">
                  Aceite Feito
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  {statusProposal.aceite_feito_analise_banco_count}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-white p-5 rounded-lg shadow-lg border-l-4 ${getBorderColor(statusProposal.aguardando_digitacao_count)} hover:scale-105 transition-transform`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full mr-3">
                {Icons.FaStopCircle}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-600 uppercase">
                  Aguard. Digitação
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  {statusProposal.aguardando_digitacao_count}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-white p-5 rounded-lg shadow-lg border-l-4 ${getBorderColor(statusProposal.aguardando_pagamento_count)} hover:scale-105 transition-transform`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-full mr-3">
                {Icons.FaStopCircle}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-600 uppercase">
                  Aguard. Pagamento
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  {statusProposal.aguardando_pagamento_count}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-white p-5 rounded-lg shadow-lg border-l-4 ${getBorderColor(statusProposal.contrato_em_digitacao_count)} hover:scale-105 transition-transform`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full mr-3">
                {Icons.FaStopCircle}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-600 uppercase">
                  Em Digitação
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  {statusProposal.contrato_em_digitacao_count}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-white p-5 rounded-lg shadow-lg border-l-4 ${getBorderColor(statusProposal.contrato_pago_count)} hover:scale-105 transition-transform`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                {Icons.FaStopCircle}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-600 uppercase">
                  Contrato Pago
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  {statusProposal.contrato_pago_count}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-white p-5 rounded-lg shadow-lg border-l-4 ${getBorderColor(statusProposal.contrato_pendente_banco_count)} hover:scale-105 transition-transform`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-full mr-3">
                {Icons.FaStopCircle}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-600 uppercase">
                  Pendente Banco
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  {statusProposal.contrato_pendente_banco_count}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-white p-5 rounded-lg shadow-lg border-l-4 ${getBorderColor(statusProposal.pendente_digitacao_count)} hover:scale-105 transition-transform`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-full mr-3">
                {Icons.FaStopCircle}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-600 uppercase">
                  Pendente Digitação
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  {statusProposal.pendente_digitacao_count}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Ranking de vendedores</h2>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PreviewDashBoard;
