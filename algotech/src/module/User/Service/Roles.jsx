import api from "../../Hooks/ApiConfig";

class Roles {
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

  async getAllRoles() {
    try {
      const response = await api.get("/role", {
        params: {
          filter_by: this.search_term,
          current_page: this.current_page,
          rows_per_page: this.rows_per_page,
          page_number: this.page_number,
          order_by: this.order_by,
          filter_value: this.filter_value,
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

  async postRole(data, token) {
    try {
      const response = await api.post("/role", data, {
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

  async deleteRole(id, token) {
    try {
      const response = await api.delete(`/role/${id}`, {
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

export default Roles;
