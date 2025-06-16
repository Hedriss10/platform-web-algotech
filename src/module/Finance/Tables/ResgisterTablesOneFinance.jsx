import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../../../service/UserContext";
import { notify } from "../../utils/toastify";
import ManageTablesFinance from "../Service/ManageTablesFinance";

const RegisterTablesOneFinance = () => {
  const { id: FinancialAgreementsId } = useParams();
  const { user, token } = useUser();
  const [issueDate, setIssueDate] = useState("");
  const [formData, setFormData] = useState({
    financial_agreements_id: Number(FinancialAgreementsId),
    name: "",
    table_code: "",
    type_table: "",
    start_term: "",
    end_term: "",
    start_rate: 0.0,
    end_rate: 0.0,
    rate: 0.0,
    issue_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rate" ? parseFloat(value) || 0.0 : value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const usersApi = new ManageTablesFinance(user?.id);
      const response = await usersApi.postTablesFinance(
        { ...formData, issue_date: issueDate },
        token,
      );
      notify("Tabela cadastrado com sucesso", { type: "success" });
    } catch (error) {
      notify("Erro ao cadastrar tabela", { type: "error" });
    }
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Cadastrar Tabela</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/finance" className="hover:text-gray-200">
              <strong>Bancos</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="flex justify-end">
          <Link to="/finance">
            <button className="text-white">Fechar</button>
          </Link>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-4 text-white">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Nome:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="MARGEM LIVRE - 24X96 FLEX |||"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="table_code"
              className="block text-sm font-medium text-white"
            >
              Código da Tabela:
            </label>
            <input
              type="text"
              id="table_code"
              name="table_code"
              value={formData.table_code}
              onChange={handleChange}
              placeholder="020128"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="type_table"
              className="block text-sm font-medium text-white"
            >
              Tipo da Tabela:
            </label>
            <input
              type="text"
              id="type_table"
              name="type_table"
              value={formData.type_table}
              onChange={handleChange}
              placeholder="Margem Livre"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="start_term"
              className="block text-sm font-medium text-white"
            >
              Prazo Inicio:
            </label>
            <input
              type="text"
              id="start_term"
              name="start_term"
              value={formData.start_term}
              onChange={handleChange}
              placeholder="24"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="end_term"
              className="block text-sm font-medium text-white"
            >
              Prazo Fim:
            </label>
            <input
              type="text"
              id="end_term"
              name="end_term"
              value={formData.end_term}
              onChange={handleChange}
              placeholder="96"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="rate"
              className="block text-sm font-medium text-white"
            >
              Flat:
            </label>
            <input
              type="number"
              step="0.01"
              id="rate"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              placeholder="3.75"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="rate"
              className="block text-sm font-medium text-white"
            >
              Taxa Inicio:
            </label>
            <input
              type="number"
              step="1.8"
              id="start_rate"
              name="start_rate"
              value={formData.start_rate}
              onChange={handleChange}
              placeholder="3.75"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="rate"
              className="block text-sm font-medium text-white"
            >
              Taxa Fim:
            </label>
            <input
              type="number"
              step="0.01"
              id="end_rate"
              name="end_rate"
              value={formData.end_rate}
              onChange={handleChange}
              placeholder="3.75"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="text-white block mb-2">
            <strong>Data de Vigência:</strong>
          </label>
          <input
            type="date"
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterTablesOneFinance;
