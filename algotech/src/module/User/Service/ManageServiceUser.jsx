import api from "../../Hooks/ApiConfig";

class ManageServiceUsers {
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


  async postUsers(data, token){
    try {
      const response = await api.post("/user", data, {
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

  async getAllUsers() {
    try {
      const response = await api.get("/user", {
        params: {
          filter_by: this.search_term,
          current_page: this.current_page,
          rows_per_page: this.rows_per_page,
          page_number: this.page_number,
          order_by: this.order_by,
          filter_value: this.filter_value,
          // filter_by: this.filter_by,
        },
      });

      if (response.data.error) {
        throw new Error(response.data.message_id);
      }

      return response.data; // Retorna response.data
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserById(id, token) {
    try {
      const response = await api.get(`/user/${id}`, {
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

  async updateUser(id, data, token) {
    try {
      const response = await api.put(`/user/${id}`, data, {
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

  async resetPassword(data, token) {
    try {
      const response = await api.post(`/login/reset-master`, data, {
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

  async deleteUser(id, token) {
    try {
      const response = await api.delete(`/user/${id}`, {
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

export default ManageServiceUsers;
