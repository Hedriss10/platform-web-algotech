import axios from "axios";
import { notify } from "../../utils/toastify";

const API_URL = import.meta.env.VITE_API_URL;

const AuthService = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    console.log("Response Data:", response.data);

    if (response.data.error) {
      throw new Error(response.data.message_id);
    }

    notify("Login successful!", { type: "success" });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error("Error 404: Not Found");
      notify("Usuário não existe.", { type: "warning" });
    } else {
      console.error("Error:", error.response?.data?.message_id || "An error occurred during login.");
      notify(error.response?.data?.message_id || "An error occurred during login.", { type: "error" });
    }
    throw new Error(
      error.response?.data?.message_id || "An error occurred during login."
    );
  }
};

export default { AuthService };