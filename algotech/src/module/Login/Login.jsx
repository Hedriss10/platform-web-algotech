import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "./Service/AuthService";
import { notify } from "../utils/toastify";
import { useUser } from "../../service/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AuthService.AuthService(email, password);
      if (response.data && response.data.length > 0) {
        const userData = response.data[0];
        const token = response.metadata;

        login(userData, token);
        
        notify("Login realizado com sucesso!", { type: "success" });
        navigate("/home");
      } else {
        throw new Error("Dados do usuário não encontrados na resposta.");
      }
    } catch (error) {
      console.error("Erro durante o login:", error);
      notify("Erro ao realizar login. Tente novamente.", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <a href="/" className="flex items-center">
            <span className="text-xl font-semibold text-gray-800 ml-2">
              maisbs
            </span>
          </a>
        </div>

        {/* Card de Login TODO verificar se a possibilidae*/}
        <div className="bg-white rounded-lg">
          <div className="p-6">
            <div className="text-center mb-6">
              <h5 className="text-2xl font-bold text-gray-800"></h5>
              <p className="text-sm text-gray-600"></p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  <strong>Email:</strong>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  <strong>Senha:</strong>
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 text-sm text-gray-600"
                  >
                    Lembrar-me
                  </label>
                </div>
              </div>

              {/* Botão de Login */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
