const AddressProposal = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label>
          <strong>CEP:</strong>
        </label>
        <input
          type="text"
          name="cep"
          id="cep"
          value={formData.cep}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>UF Cidade:</strong>
        </label>
        <select
          name="uf_cidade"
          id="uf_cidade"
          value={formData.uf_cidade}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option className="text-gray-400">Selecione</option>
          <option value="AC">Acre</option>
          <option value="AL">Alagoas</option>
          <option value="AP">Amapa</option>
          <option value="AM">Amazonas</option>
          <option value="BA">Bahia</option>
          <option value="CE">Ceara</option>
          <option value="DF">Distrito Federal</option>
          <option value="ES">Espirito Santo</option>
          <option value="GO">Goias</option>
          <option value="MA">Maranhao</option>
          <option value="MT">Mato Grosso</option>
          <option value="MS">Mato Grosso do Sul</option>
          <option value="MG">Minas Gerais</option>
          <option value="PA">Para</option>
          <option value="PB">Paraiba</option>
          <option value="PR">Parana</option>
          <option value="PE">Pernambuco</option>
          <option value="PI">Piaui</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="RN">Rio Grande do Norte</option>
          <option value="RS">Rio Grande do Sul</option>
          <option value="RO">Rondonia</option>
          <option value="RR">Roraima</option>
          <option value="SC">Santa Catarina</option>
          <option value="SP">Sao Paulo</option>
          <option value="SE">Sergipe</option>
          <option value="TO">Tocantins</option>
        </select>
      </div>
      <div>
        <label>
          <strong>Bairro:</strong>
        </label>
        <input
          type="text"
          name="bairro"
          id="bairro"
          value={formData.bairro}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Endereço:</strong>
        </label>
        <input
          type="text"
          name="endereco"
          id="endereco"
          value={formData.endereco}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Numero do Endereço:</strong>
        </label>
        <input
          type="text"
          name="numero_endereco"
          id="numero_endereco"
          value={formData.numero_endereco}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Complemento de Endereço:</strong>
        </label>
        <input
          type="text"
          name="complemento_endereco"
          id="complemento_endereco"
          value={formData.complemento_endereco}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Cidade:</strong>
        </label>
        <input
          type="text"
          name="cidade"
          id="cidade"
          value={formData.cidade}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default AddressProposal;
