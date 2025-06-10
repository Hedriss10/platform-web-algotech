import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { notify } from "@module/utils/toastify";
import { useUser } from "../../service/UserContext";
import Roles from "@module/user/service/Roles";
import FormsAddUser from "@module/user/ui/forms/FormsAddUser";
import ManageServiceUser from "@module/user/service/ManageServiceUser";

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
      try {
        const rolesService = new Roles(user?.id);
        const response = await rolesService.getAllRoles();
        if (response?.data) {
          setRoles(response.data);
        }
      } catch (error) {
        notify("Erro ao carregar funções", { type: "error" });
        console.error("Erro ao buscar roles:", error);
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
    setLoading(true);

    try {
      const api = new ManageServiceUser(user?.id);
      const response = await api.postUsers(formData, token);
      notify("Usuário cadastrado com sucesso", { type: "success" });
      
      setFormData({
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

      // Fechar o formulário se onClose estiver disponível
      if (onClose) {
        onClose();
      }
    } catch (error) {
      if (error.message === "cpf_with_email_already_exists") {
        notify("CPF ou e-mail já cadastrado", { type: "warning" });
      } else {
        notify("CPF ou e-mail ou matricula ou PIS já cadastrado", { type: "warning" });
      }
    } finally {
      setLoading(false);
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