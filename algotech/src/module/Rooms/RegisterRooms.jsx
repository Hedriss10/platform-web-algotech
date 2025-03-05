import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { notify } from "../utils/toastify";
import { useUser } from "../../service/UserContext";
import ManageRooms from "../Rooms/Service/ManageRooms";

const RegisterRooms = () => {
  const { user, token } = useUser();
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewRooms = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    try {
      const apiRooms = new ManageRooms(user?.id);
      const resposne = await apiRooms.postRooms(formData, token);
      notify("Sala criado com sucesso", { type: "success" });
      setTimeout(() => {
        1000, navigate("/rooms");
      });
    } catch (error) {
      notify("Erro ao criar Sala", { type: "error" });
    }
  };
  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Cadastrar Sala</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/rooms" className="hover:text-bg-gray-200">
              <strong>Salas</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="flex justify-end">
          <Link to="/rooms">
            <button className="text-white">Fechar</button>
          </Link>
        </div>
        <form onSubmit={handleNewRooms} className="space-y-4 text-white">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Nome da Sala:
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

export default RegisterRooms;
