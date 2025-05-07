import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../../../service/UserContext";
import { notify } from "../../utils/toastify";
import ManageBankers from "../Service/ManageBankers";

const FinanciaAgrements = () => {
  const { user, token } = useUser();

  const [bankers, setBankers] = useState([]);
  const [banker_id, setBankId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    bank_id: "",
    bank_name: "",
    banker_id: null,
  });

  const handleBankers = async () => {
    try {
      const userApi = new ManageBankers(user?.id, null, 1, 100);
      const response = await userApi.getAllBankers();
      setBankers(response.data);
    } catch (error) {
      notify("Erro ao procurar o banco", { type: "warning" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "banker_id") {
      const selectedBank = bankers.find((bank) => String(bank.id) === value);
      const bankerId = parseInt(value, 10);
      setBankId(value);
      setFormData((prevData) => ({
        ...prevData,
        banker_id: bankerId,
        bank_name: selectedBank?.name || "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handlePostNewBank = async (e) => {
    e.preventDefault();

    try {
      const apiRoles = new ManageBankers(user?.id);
      await apiRoles.postNewFinancialAgreementsBankers(formData, token);
      notify("Convênio criado com sucesso", { type: "success" });
    } catch (error) {
      notify("Erro ao criar convênio", { type: "error" });
    }
  };

  useEffect(() => {
    handleBankers();
  }, []);

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cadastrar Convênio</h1>
        <nav className="text-sm text-gray-500">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-gray-700">
              <strong>Home</strong>
            </Link>
          </ol>
        </nav>
      </div>

      {/* Card com fundo escuro */}
      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="flex justify-end mb-4">
          <Link to="/finance">
            <button className="text-white">Fechar</button>
          </Link>
        </div>

        <form onSubmit={handlePostNewBank} className="space-y-6 text-white">
          {/* Nome do Convênio */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Nome do Convênio:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-500 rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Select Banco */}
          <div>
            <label
              htmlFor="banker_id"
              className="block text-sm font-medium text-white"
            >
              Selecione o Banco:
            </label>
            <select
              name="banker_id"
              id="banker_id"
              value={banker_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o banco</option>
              {bankers.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          <div className="text-sm text-gray-300">
            Banco selecionado:{" "}
            <span className="font-semibold text-white">
              {formData.bank_name || "Nenhum"}
            </span>
          </div>

          {/* Botão */}
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

export default FinanciaAgrements;
