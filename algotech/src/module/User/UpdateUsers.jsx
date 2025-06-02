import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { notify } from "../utils/toastify";
import { useUser } from "../../service/UserContext";
import ManageUser from "./Service/UsersApi";
import MaskCpf from "../utils/MaskCpf";
import Roles from "./Service/Roles";
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
        {/* <form onSubmit={handleFormSubmit} className="space-y-4 text-white">
          <div>
            <label htmlFor="username">Nome de Usuário:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="lastname">Sobrenome:</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="cpf">CPF:</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={(e) =>
                setFormData({ ...formData, cpf: MaskCpf(e.target.value) })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="typecontract">Cargo:</label>
            <select
              id="typecontract"
              name="typecontract"
              value={formData.typecontract || ""}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Selecione o Cargo:
              </option>
              <option value="Estagiario">Estagiário</option>
              <option value="Funcionario">Funcionário</option>
            </select>
          </div>

          <div>
            <label htmlFor="role">Função:</label>
            <select
              id="role"
              name="role"
              value={formData.role || ""}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Selecione uma Função
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="matricula"
              className="block text-sm font-medium text-white"
            >
              Matrícula:
            </label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="situacao_cadastro"
              className="block text-sm font-medium text-white"
            >
              Situação Cadastro:
            </label>
            <select
              id="situacao_cadastro"
              name="situacao_cadastro"
              value={formData.situacao_cadastro}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled hidden>
                Selecione um status
              </option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md">
              <Link to="/users">Fechar</Link>
            </button>
          </div>
        </form> */}
      </div>
    </div>
  );
};

export default UpdateUsers;
