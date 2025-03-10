/// TODO realizar o post e delete das operação tanto na UI e no backend
import api from "../../Hooks/ApiConfig";

class ManageFinace {
  constructor(
    user_id = null,
    search_term = null,
    current_page = null,
    rows_per_page = null,
    page_number = null,
    order_by = null,
    filter_value = null,
  ) {
    this.user_id = user_id;
    this.search_term = search_term;
    this.current_page = current_page;
    this.rows_per_page = rows_per_page;
    this.page_number = page_number;
    this.order_by = order_by;
    this.filter_value = filter_value;
  }

  async getAllLoanOperation(token) {
    try {
      const response = await api.get(`/datacatalog`, {
        params: {
          filter_by: this.search_term || "",
          current_page: this.current_page || 1,
          rows_per_page: this.rows_per_page || 50,
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

  async getAllBenefits(token) {
    try {
      const response = await api.get(`/datacatalog/benefit`, {
        params: {
          current_page: this.current_page || 1,
          rows_per_page: this.rows_per_page || 40,
          page_number: this.page_number || 1,
          filter_by: this.search_term || "",
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

  async postOperation(data, toke) {
    try {
      const response = await api.post(`/datacatalog`, data, {
        headers: {
          Authorization: `Bearer ${toke}`,
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
  async updateOperation(id, data, token) {
    try {
      const response = await api.put(`/datacatalog/${id}`, data, {
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

  async deleteOperation(id, token) {
    try {
      const response = await api.delete(`/datacatalog/${id}`, {
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

  async postBenefit(data, token) {
    try {
      const response = await api.post(`/datacatalog/benefit`, data, {
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

  async deleteBenefit(id, token) {
    try {
      const response = await api.delete(`/datacatalog/benefit/${id}`, {
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
}

export default ManageFinace;
