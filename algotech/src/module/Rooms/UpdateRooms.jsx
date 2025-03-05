import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { notify } from "../utils/toastify";
import { useUser } from "../../service/UserContext";
import ManageRoosms from "../Rooms/Service/ManageRooms";

const UpdateRooms = () => {
  const { id } = useParams();
  const { user, token } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const usersApi = new ManageRoosms();
        const response = await usersApi.getRoomsById(id, token);
        if (response) {
          setFormData({
            id: response.data[0].id || "",
            name: response.data[0].name || "",
          });
        }
      } catch (error) {
        notify("Erro ao carregar dados da sala", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, token]);

  // Função para atualizar o estado quando o input muda
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const usersApi = new ManageRoosms();
      await usersApi.updateRooms(id, formData, token);
      notify("Sala editada com sucesso", { type: "success" });
      navigate("/rooms");
    } catch (error) {
      notify("Erro ao editar sala", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Sala</h1>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <form onSubmit={handleFormSubmit} className="space-y-4 text-white">
          <div>
            <label htmlFor="name">Nome da Sala:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange} // Adicione o onChange aqui
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md">
              <Link to="/rooms">Fechar</Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRooms;