// src/module/user/ui/forms/FormsUpdateUser.jsx

const FormsAddUser = ({
  formData,
  handleChange,
  handleFormSubmit,
  roles,
  setFormData,
}) => {
  return (
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
        <label htmlFor="email" className="block text-sm font-medium text-white">
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
        <label htmlFor="cpf" className="block text-sm font-medium text-white">
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
        <label htmlFor="role" className="block text-sm font-medium text-white">
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
  );
};

export default FormsAddUser;
