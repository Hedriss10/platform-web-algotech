import api from "@module/Hooks/ApiConfig";

class ManageOperational {
  constructor(
    user_id = null,
    search_term = null,
    current_page = null,
    rows_per_page = null,
    page_number = null,
    order_by = null,
    filter_value = null,
    start_date = null,
    end_date = null,
    bank_id = null,
    financial_agreements = null,
  ) {
    this.user_id = user_id;
    this.search_term = search_term;
    this.current_page = current_page;
    this.rows_per_page = rows_per_page;
    this.page_number = page_number;
    this.order_by = order_by;
    this.filter_value = filter_value;
    this.start_date = start_date;
    this.end_date = end_date;
    this.bank_id = bank_id;
    this.financial_agreements = financial_agreements;
  }

  async getListProposalOperational(token) {
    try {
      const params = {
        filter_by: this.search_term || "",
        current_page: this.current_page || 1,
        rows_per_page: this.rows_per_page || 10,
        page_number: this.page_number || 1,
        order_by: this.order_by || "",
        filter_value: this.filter_value || "",
        start_date: this.start_date || "",
        end_date: this.end_date || "",
        bank_id: this.bank_id || "",
        financial_agreements: this.financial_agreements || "", // Corrigido
      };

      console.log("Parâmetros construídos em ManageOperational:", {
        user_id: this.user_id,
        ...params,
      });

      const response = await api.get("/operational/proposal", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          id: this.user_id,
        },
      });

      console.log("Resposta de /operational/proposal:", response.data);
      console.log("URL final enviado (do Axios):", response.config.url);

      if (
        !response.data ||
        !response.data.data ||
        response.data.data.length === 0 ||
        response.data.message_id === "" // Corrigido: message_id
      ) {
        return { empty: true };
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar propostas:", error);
      if (error.config) {
        console.error("URL da requisição com erro:", error.config.url);
      }
      throw error;
    }
  }

  async getProposalDetails(token, id) {
    try {
      const response = await api.get(`/operational/proposal/details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: this.user_id,
        },
      });
      if (response.data.error) {
        throw new Error(response.data.message_id);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProposalHistory(token, id) {
    try {
      const response = await api.get(`/operational/history/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: this.user_id,
        },
      });
      if (response.data.error) {
        throw new Error(response.data.message_id);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async postStatusProposal(token, id, data) {
    try {
      const response = await api.post(`/operational/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: this.user_id,
        },
      });

      if (response.data.error) {
        return {
          status_code: response.status,
          message_id: response.data.message_id,
          error: true,
        };
      }

      return response.data;
    } catch (error) {
      throw {
        status_code: error.response?.status || 500,
        message_id: error.response?.data?.message_id || "unknown_error",
        error: true,
      };
    }
  }
}

export default ManageOperational;
