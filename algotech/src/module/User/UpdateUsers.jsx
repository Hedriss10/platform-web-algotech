import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { notify } from "../utils/toastify";
import { useUser } from "../../service/UserContext";
import ManageUser from "./service/ManageServiceUser";
import MaskCpf from "../utils/MaskCpf";
import Roles from "./service/Roles";
import FormsUsers from "./ui/forms/FormsUpdateUser";

const UpdateUsers = ({ onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, token } = useUser();

  const [formData, setFormData] = useState({
    username: "",
    lastname: "",
    email: "",
    cpf: "",
    typecontract: "",
    role: "",
    matricula: "",
    numero_pis: "",
    empresa: "",
    situacao_cadastro: "",
    carga_horaria_semanal: "",
    cargo: "",
  });

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  // Busca os dados do usuário ao carregar o componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const usersApi = new ManageUser();
        const response = await usersApi.getUserById(id, token);
        if (response) {
          setFormData({
            username: response.data[0].username || "",
            lastname: response.data[0].lastname || "",
            email: response.data[0].email || "",
            cpf: MaskCpf(response.data[0].cpf) || "",
            typecontract: response.data[0].typecontract || "",
            role: response.data[0].role || "",
            matricula: response.data[0].matricula || "",
            situacao_cadastro: response.data[0].situacao_cadastro || "",
            cargo: response.data[0].cargo || "",
          });
        }
      } catch (error) {
        notify("Erro ao carregar dados do usuário", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, token]);

  // Busca as roles disponíveis
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesService = new Roles(currentUser?.id);
        const response = await rolesService.getAllRoles();
        if (response?.data) {
          setRoles(response.data);
        }
      } catch (error) {
        notify("Erro ao carregar funções", { type: "error" });
      }
    };

    fetchRoles();
  }, [currentUser]);

  // Atualiza os dados do usuário
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const usersApi = new ManageUser();
      await usersApi.updateUser(id, formData, token);
      notify("Usuário editado com sucesso", { type: "success" });
      navigate("/users");
    } catch (error) {
      notify("Erro ao editar usuário", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Atualiza os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Usuários</h1>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <FormsUsers
          formData={formData}
          handleChange={handleChange}
          handleFormSubmit={handleFormSubmit}
          loading={loading}
          roles={roles}
        />
      </div>
    </div>
  );
};

export default UpdateUsers;
