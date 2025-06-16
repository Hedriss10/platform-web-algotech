// src/module/user/ui/forms/FormsUpdateUser.jsx

import { Link } from "react-router-dom";

const FormsUpdateUsers = ({
  formData,
  handleChange,
  handleFormSubmit,
  roles,
  setFormData,
  loading,
}) => {
  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 text-white">
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
    </form>
  );
};

export default FormsUpdateUsers;
