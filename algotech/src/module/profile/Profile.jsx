import React, { useState } from "react";
import { useUser } from "../../service/UserContext";
import { notify } from "../utils/toastify";
import ManageUser from "../User/Service/UsersApi";

const UserProfile = () => {
  const { user, token } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleResertPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword === formData.confirmPassword) {
      const passowrd = { password: formData.newPassword };
      const usersApi = new ManageUser(user?.id);
      const response = await usersApi.updateUser(user?.id, passowrd, token);
      notify("Senha resetada com sucesso", { type: "success" });
    } else {
      notify("Senhas diferentes", { type: "error" });
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      {/* Cabeçalho e navegação */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Perfil do usuário</h1>
        <nav className="text-sm text-gray-500 mt-2">
          <ol className="flex space-x-2">
            <li>
              <a href="/home" className="hover:text-gray-700">
                Home
              </a>
            </li>
            <li>/</li>
            <li>Perfil</li>
          </ol>
        </nav>
      </div>

      {/* Grid de layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Card de perfil */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 flex flex-col items-center">
              {/* <img
                alt="Kevin Anderson"
                className="w-24 h-24 rounded-full mb-4"
              /> */}
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              <h3 className="text-lg text-gray-600">{user?.role}</h3>
            </div>
          </div>
        </div>

        {/* Detalhes do perfil */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              {/* Abas de navegação */}
              <ul className="flex space-x-4 border-b mb-6">
                <li className="nav-item">
                  <button
                    className={`nav-link py-2 px-4 hover:bg-gray-100 rounded-t-lg ${
                      activeTab === "overview" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Visão Geral
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link py-2 px-4 hover:bg-gray-100 rounded-t-lg ${
                      activeTab === "change-password" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setActiveTab("change-password")}
                  >
                    Alterar Senha
                  </button>
                </li>
              </ul>

              {/* Conteúdo da aba "Visão Geral" */}
              {activeTab === "overview" && (
                <div className="profile-overview">
                  <h5 className="text-xl font-bold mb-4">Sobre:</h5>
                  <p className="text-sm italic text-gray-600 mb-6">
                    Detalhamento de usuário
                  </p>

                  <h5 className="text-xl font-bold mb-4">
                    Detalhes do Perfil:
                  </h5>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="w-1/3 font-medium">Nome Completo:</div>
                      <div className="w-2/3">
                        {user?.username} {user?.lastname}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 font-medium">Empresa:</div>
                      <div className="w-2/3">maisbs</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 font-medium">Cargo:</div>
                      <div className="w-2/3">{user?.role}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 font-medium">País:</div>
                      <div className="w-2/3">Brasil</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 font-medium">Email:</div>
                      <div className="w-2/3">{user?.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Conteúdo da aba "Alterar Senha" */}
              {activeTab === "change-password" && (
                <div className="profile-change-password">
                  <h5 className="text-xl font-bold mb-4">Alterar Senha</h5>
                  <form className="space-y-4" onSubmit={handleResertPassword}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <strong>Nova Senha:</strong>
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <strong>Confirmar Nova Senha:</strong>
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Salvar Alterações
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
