import api from "../../Hooks/ApiConfig";

class manageRegisterUsers {
  constructor(user_id = null) {
    this.user_id = user_id;
  }

  async registerUser(data, token) {
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
}

export default manageRegisterUsers;
