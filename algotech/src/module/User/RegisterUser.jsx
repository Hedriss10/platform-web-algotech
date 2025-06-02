import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { notify } from "../utils/toastify";
import { useUser } from "../../service/UserContext";
import Roles from "./Service/Roles";
import FormsAddUser from "./ui/forms/FormsAddUser";
import ManageServiceUser from "./Service/ManageServiceUser";

const RegisterUser = ({ onClose }) => {
  const { user, token } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    lastname: "",
    email: "",
    cpf: "",
    password: "",
    typecontract: "",
    role: "",
    matricula: "",
    numero_pis: "",
    empresa: "",
    situacao_cadastro: "",
    carga_horaria_semanal: "",
  });

  const [roles, setRoles] = useState([]);
  useEffect(() => {
    const fetchRoles = async () => {
      const rolesService = new Roles(user?.id);
      const response = await rolesService.getAllRoles();
      if (response?.data) {
        setRoles(response.data);
      }
    };

    fetchRoles();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "carga_horaria_semanal" ? Number(value) : value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = new ManageServiceUser(user?.id);
      const response = await api.postUsers(formData, token);
      notify("Usuário cadastrado com sucesso", { type: "success" });
    } catch (error) {
      notify("Erro ao cadastrar usuário", { type: "error" });
    }
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Cadastrar Usuários</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/users" className="hover:text-bg-gray-200">
              <strong>Usuários</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <FormsAddUser
          formData={formData}
          handleChange={handleChange}
          handleFormSubmit={handleFormSubmit}
          roles={roles}
          setFormData={setFormData}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default RegisterUser;
