import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { notify } from "../utils/toastify";
import { useUser } from "../../service/UserContext";
import MaskCpf from "../utils/MaskCpf";
import Roles from "./Service/Roles";
import ManagerServiceUsers from  "../../service/user/Usermangeservice"

const RegisterUser = ({ onClose }) => {
  const { user, token } = useUser();
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
      const usersApi = new ManagerServiceUsers(user?.id);
      const response = await usersApi.addUser(formData, token);
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
        <div className="flex justify-end">
          <Link to="/users">
            <button onClick={onClose} className="text-white">
              Fechar
            </button>
          </Link>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-4 text-white">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-white"
            >
              Nome de Usuário:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-white"
            >
              Sobrenome:
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-white"
            >
              CPF:
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={(e) => {
                const formattedCpf = MaskCpf(e.target.value);
                setFormData({ ...formData, cpf: formattedCpf });
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Senha:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="typecontract"
              className="block text-sm font-medium text-white"
            >
              Cargo:
            </label>
            <select
              id="typecontract"
              name="typecontract"
              value={formData.typecontract}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" hidden>
                Selecione o Cargo:
              </option>
              <option value="Estagiario">Estágiario</option>
              <option value="Funcionário">Funcionário</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-white"
            >
              Função:
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled hidden>
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
              htmlFor="numero_pis"
              className="block text-sm font-medium text-white"
            >
              Número do PIS:
            </label>
            <input
              type="text"
              id="numero_pis"
              name="numero_pis"
              value={formData.numero_pis}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="empresa"
              className="block text-sm font-medium text-white"
            >
              Empresa:
            </label>
            <input
              type="text"
              id="empresa"
              name="empresa"
              value={formData.empresa}
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
              <option value="" hidden>
                Selecione um status
              </option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="carga_horaria_semanal"
              className="block text-sm font-medium text-white"
            >
              Carga Horária Semanal
            </label>
            <input
              type="number"
              id="carga_horaria_semanal"
              name="carga_horaria_semanal"
              value={formData.carga_horaria_semanal}
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

export default RegisterUser;
