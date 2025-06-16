import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../../service/UserContext";
import { notify } from "../utils/toastify";
import ManageBankers from "./Service/ManageBankers";

const UpdateBank = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useUser();

  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [bankers, setBankers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const usersApi = new ManageBankers(user?.id);
        const response = await usersApi.getBankersById(id, token);
        console.log("RETORNO DA API", response);
        if (response && response.data.length > 0) {
          setFormData({ name: response.data[0].username || "" });
        }
      } catch (error) {
        notify("Erro ao carregar dados do banco", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, token, user]);

  // função para eviar os dados ao formulario, com o novo nome
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const usersApi = new ManageBankers(user?.id);
      await usersApi.updateBankers(id, formData, token);
      notify("Banco editado com sucesso", { type: "success" });
      navigate("/finance");
    } catch (error) {
      notify("Erro ao editar banco", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // função para alterar o estado do input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      {/* Título e Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Bancos</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/finance" className="hover:text-bg-gray-200">
              <strong>Bancos</strong>
            </Link>
            <Link to="/finance" className="hover:text-bg-gray-200">
              <strong>Lista de Bancos</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <form onSubmit={handleFormSubmit} className="space-y-4 text-white">
          <div>
            <label htmlFor="name">Nome de Banco:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => navigate("/finance")}
            >
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBank;
