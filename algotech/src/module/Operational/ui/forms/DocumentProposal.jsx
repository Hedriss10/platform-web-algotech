const DocumentProposal = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label>
          <strong>RG:</strong>
        </label>
        <input
          type="text"
          name="rg_documento"
          id="rg_documento"
          value={formData.rg_documento}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Data de Emissão:</strong>
        </label>
        <input
          type="date"
          name="data_emissao"
          id="data_emissao"
          value={formData.data_emissao}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Orgão Emissor:</strong>
        </label>
        <input
          type="text"
          name="orgao_emissor"
          id="orgao_emissor"
          value={formData.orgao_emissor}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>UF Emissor:</strong>
        </label>
        <select
          name="uf_emissor"
          id="uf_emissor"
          value={formData.uf_emissor}
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
          <strong>Nome do Pai:</strong>
        </label>
        <input
          type="text"
          name="nome_pai"
          id="nome_pai"
          value={formData.nome_pai}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>
          <strong>Nome da Mãe:</strong>
        </label>
        <input
          type="text"
          name="nome_mae"
          id="nome_mae"
          value={formData.nome_mae}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default DocumentProposal;
