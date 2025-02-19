import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../../../service/UserContext";
import { notify } from "../../utils/toastify";
import ManageBankers from "../Service/ManageBankers";

const FinancialAgreements = () => {
  const { id: bankerId } = useParams();
  const { user, token } = useUser();
  const [formData, setFormData] = useState({ name: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePostNewBank = async (e) => {
    e.preventDefault();

    try {
      const apiRoles = new ManageBankers(user?.id);
      const newFormData = { ...formData, banker_id: Number(bankerId) };
      const resposne = await apiRoles.postNewFinancialAgreementsBankers(
        newFormData,
        token,
      );
      notify("Convênico criado com sucesso", { type: "success" });
    } catch (error) {
      notify("Erro ao criar convênico", { type: "error" });
    }
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Cadastrar Convênio</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/finance" className="hover:text-bg-gray-200">
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
        <form onSubmit={handlePostNewBank} className="space-y-4 text-white">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Nome do Convênico:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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

export default FinancialAgreements;
