// src/module/Operational/ui/forms/DataUsers.jsx

import MaskCpf from "@module/utils/MaskCpf";

const DataUsers = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label>
          <strong>Nome</strong>
        </label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>CPF:</strong>
        </label>
        <input
          type="text"
          name="cpf"
          value={MaskCpf(formData.cpf)}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label>
          <strong>Data Nacismento:</strong>
        </label>
        <input
          type="date"
          name="data_nascimento"
          id="data_nascimento"
          value={formData.data_nascimento}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Genero:</strong>
        </label>
        <select
          name="genero"
          id="genero"
          value={formData.genero}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option className="text-gray-400">Selecione</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
      </div>
      <div>
        <label>
          <strong>Email:</strong>
        </label>
        <input
          type="text"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Naturalidade</strong>
        </label>
        <input
          type="text"
          name="naturalidade"
          id="naturalidade"
          value={formData.naturalidade}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Cidade da Naturalidade:</strong>
        </label>
        <input
          type="text"
          name="cidade_naturalidade"
          id="cidade_naturalidade"
          value={formData.cidade_naturalidade}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Estado:</strong>
        </label>
        <input
          type="text"
          name="uf_naturalidade"
          id="uf_naturalidade"
          value={formData.uf_naturalidade}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Telefone:</strong>
        </label>
        <input
          type="text"
          name="telefone"
          id="telefone"
          value={formData.telefone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Telefone Comercial:</strong>
        </label>
        <input
          type="text"
          name="telefone_comercial"
          id="telefone_comercial"
          value={formData.telefone_comercial}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default DataUsers;
