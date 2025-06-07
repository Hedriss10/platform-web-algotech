import api from "../../Hooks/ApiConfig";

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
  }

  async getCountProposal(token) {
    try {
      const response = await api.get("/operational/coutn", {
        params: {
          filter_by: this.search_term || "",
          current_page: this.current_page || 1,
          rows_per_page: this.rows_per_page || 10,
          page_number: this.page_number || 1,
          order_by: this.order_by || "",
          filter_value: this.filter_value || "",
        },
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

  async getListProposalOperational(token) {
    try {
      const response = await api.get("/operational/proposal", {
        params: {
          filter_by: this.search_term || "",
          current_page: this.current_page || 1,
          rows_per_page: this.rows_per_page || 10,
          page_number: this.page_number || 1,
          order_by: this.order_by || "",
          filter_value: this.filter_value || "",
          start_date: this.start_date || "",
          end_date: this.end_date || "",
        },
        headers: {
          Authorization: `Bearer ${token}`,
          id: this.user_id,
        },
      });

      if (
        !response.data ||
        response.data.length === 0 ||
        response.data.menssage_id === ""
      ) {
        return { empty: true }; // Indicador de resposta vazia
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar propostas:", error);
      throw error; // Propaga o erro para o catch no loadOperational
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
