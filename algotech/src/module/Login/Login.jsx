import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "./Service/AuthService";
import { notify } from "../utils/toastify";

const Login = () => {
  const [email, setEamil] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AuthService.AuthService(email, password);

      // save token in localStorage
      localStorage.setItem("access_token", response.metadata.access_token);

      // head notification success
      notify("Login realizado com sucesso!", { type: "success" });

      // redirect to home
      navigate("/");
    } catch (error) {
      notify("Erro interno do servidor", { type: "error" });
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
            {/* <img src="assets/img/logo.png" alt="Logo" className="h-12" /> */}
            <span className="text-xl font-semibold text-gray-800 ml-2">
              NiceAdmin
            </span>
          </a>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-lg">
          <div className="p-6">
            <div className="text-center mb-6">
              <h5 className="text-2xl font-bold text-gray-800">
                Login to Your Account
              </h5>
              <p className="text-sm text-gray-600">
                Enter your username & password to login
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEamil(e.target.value)}
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
                  Password
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
                    Remember me
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

              {/* Link para Registrar */}
              <div className="text-center text-sm text-gray-600">
                <p>
                  Don't have an account?{" "}
                  <a href="/register" className="text-blue-500 hover:underline">
                    Create an account
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Créditos */}
        <div className="text-center text-sm text-gray-500 mt-6">
          Designed by{" "}
          <a
            href="https://bootstrapmade.com/"
            className="text-blue-500 hover:underline"
          >
            BootstrapMade
          </a>
        </div>
      </div>
    </main>
  );
};

export default Login;
