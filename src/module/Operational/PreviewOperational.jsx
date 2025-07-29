import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../service/UserContext";
import { notify } from "@module/utils/toastify";
import {
  formatDateToBackend,
  mockFilterProposal,
} from "@module/utils/FormatDataToBackend";
import ManageOperational from "./Service/MangeOperational";
import ManageBankers from "@module/Finance/Service/ManageBankers";
import ListTablesOperational from "@module/Operational/ui/tables/ListTablesOperational";
import Icons from "@module/utils/Icons";
import FiltersListProposal from "@module/Operational/ui/filters/FiltersListProposal";
import Pagination from "@module/ui/Pagination/Pagination";
import debounce from "lodash/debounce";

const PreviewOperational = () => {
  const { user, token } = useUser();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingBankers, setLoadingBankers] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    ...mockFilterProposal,
    selectedBankId: "",
    selectedAgreementId: "",
  });
  const [bankers, setBankers] = useState([]);
  const [financialAgreements, setFinancialAgreements] = useState([]);

  const memoizedFilterValues = useMemo(
    () => filterValues,
    [
      filterValues.current_status,
      filterValues.start_date,
      filterValues.end_date,
      filterValues.selectedBankId,
      filterValues.selectedAgreementId,
    ],
  );

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const applyFilter = () => {
    if (filterValues.start_date && filterValues.end_date) {
      const start = new Date(filterValues.start_date);
      const end = new Date(filterValues.end_date);
      if (start > end) {
        notify("A data inicial não pode ser posterior à data final", {
          type: "error",
        });
        return;
      }
    }
    setSearchTerm(filterValues.current_status || "");
    setCurrentPage(1);
    setIsFilterModalOpen(false);
    loadOperational();
  };

  const loadOperational = useCallback(
    debounce(async () => {
      setLoading(true);
      setProposal([]);
      try {
        const formattedStartDate = filterValues.start_date
          ? formatDateToBackend(filterValues.start_date)
          : "";
        const formattedEndDate = filterValues.end_date
          ? formatDateToBackend(filterValues.end_date)
          : "";
        const bankId = filterValues.selectedBankId || "";

        const usersApi = new ManageOperational(
            user?.id,
            searchTerm,
            currentPage,
            rowsPerPage,
            1,
            "",
            "", 
            formattedStartDate,
            formattedEndDate,
            bankId,
            filterValues.selectedAgreementId || "" 
        );


        const response = await usersApi.getListProposalOperational(token);

        if (response.empty) {
          notify("Nenhuma proposta encontrada", { type: "info" });
          setProposal([]);
          setTotalPages(1);
        } else {
          setProposal(response.data || []);
          setTotalPages(response.metadata?.total_pages || 1);
        }
      } catch (error) {
        console.error("Erro ao carregar propostas:", error);
        notify("Erro ao carregar propostas", { type: "error" });
      } finally {
        setLoading(false);
      }
    }, 300),
    [
      user?.id,
      searchTerm,
      currentPage,
      rowsPerPage,
      filterValues.start_date,
      filterValues.end_date,
      filterValues.selectedBankId,
      filterValues.selectedAgreementId,
      token,
    ],
  );

  const loadBankers = useCallback(async () => {
    setLoadingBankers(true);
    try {
      const userApi = new ManageBankers(user?.id, token);
      const response = await userApi.getAllBankers();
      const banks = Array.isArray(response.data) ? response.data : [];
      setBankers(banks);
    } catch (error) {
      notify("Erro ao procurar o banco", { type: "warning" });
      setBankers([]);
    } finally {
      setLoadingBankers(false);
    }
  }, [user?.id, token]);

  useEffect(() => {
    loadBankers();
  }, [loadBankers]);

  useEffect(() => {
    loadOperational();
  }, [memoizedFilterValues, currentPage, searchTerm, rowsPerPage]);

  const handlePreviewProposal = (id) => {
    try {
      navigate(`/operational/proposal/${id}`);
    } catch (error) {
      notify("Erro ao processar a Proposta", { type: "error" });
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleUpdateProposal = (id) => {
    try {
      navigate(`/operational/proposal/update/${id}`);
    } catch (error) {
      console.log(error);
      notify("Erro ao editar Proposta", { type: "error" });
    }
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento Operacional</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Lista de Propostas
          </h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar Proposta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition duration-300">
              <Icons.FaSearch className="text-white" />
            </button>
            <button
              className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition duration-300"
              onClick={openFilterModal}
            >
              <Icons.CiFilter className="text-white" />
            </button>
          </div>
        </div>

        {isFilterModalOpen && (
          <FiltersListProposal
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            setIsFilterModalOpen={setIsFilterModalOpen}
            applyFilter={applyFilter}
            bankers={bankers}
            financialAgreements={financialAgreements}
            setFinancialAgreements={setFinancialAgreements}
            loadingBankers={loadingBankers}
          />
        )}

        <ListTablesOperational
          proposal={proposal}
          loading={loading}
          handlePreviewProposal={handlePreviewProposal}
          handleUpdateProposal={handleUpdateProposal}
        />

        <Pagination
          rowsPerPage={rowsPerPage}
          handlePageChange={handlePageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default PreviewOperational;
