import api from "../../Hooks/ApiConfig";

class ManageProfit {
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

  async getProfitAll(token) {
    try {
      const response = await api.get("/profit", {
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

  async getProfitSellers(token) {
    try {
      const response = await api.get("/statistics/sellers-ranking", {
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
}

export default ManageProfit;
