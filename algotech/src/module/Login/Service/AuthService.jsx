import axios from "axios";
import { notify } from "../../utils/toastify";

const API_URL = import.meta.env.VITE_API_URL;

const AuthService = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    if (response.data.error) {
      throw new Error(response.data.message_id);
    }

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      notify("Usuário não existe.", { type: "warning" });
    } else if (error.response?.status === 401) {
      notify("Credenciais inválidas.", { type: "error" });
    } else {
      notify("Erro interno.", { type: "error" });
    }
    throw new Error(
      error.response?.data?.message_id || "An error occurred during login.",
    );
  }
};

export default { AuthService };
