import api from "../../Hooks/ApiConfig";

class Roles {
  constructor(user_id = null) {
    this.user_id = user_id;
  }

  async getAllRoles() {
    try {
      const response = await api.get("/role");
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
