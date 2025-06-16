import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../../service/UserContext";
import { notify } from "../../utils/toastify";
import ManageReport from "../Report/Service/ManageReport";

const RegisterFlags = () => {
  const { user, token } = useUser();
  const [formData, setFormData] = useState({
    rate: 0.0,
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "rate" ? parseFloat(value) || 0.0 : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const usersApi = new ManageReport(user?.id);
      await usersApi.postFlags(formData, token);
      notify("Flag cadastrado com sucesso", { type: "success" });
    } catch (error) {
      console.log(error);
      notify("Erro ao cadastrar Flag", { type: "error" });
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
            <Link to="/flags" className="hover:text-gray-200">
              <strong>Gestão de Flags</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="flex justify-end">
          <Link to="/flags">
            <button className="text-white hover:text-gray-300">Fechar</button>
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
              placeholder="Digite o nome da flag"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
          <div>
            <label
              htmlFor="rate"
              className="block text-sm font-medium text-white"
            >
              Taxa:
            </label>
            <input
              type="number"
              step="0.01"
              id="rate"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              placeholder="Ex: 3.75"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
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

export default RegisterFlags;
