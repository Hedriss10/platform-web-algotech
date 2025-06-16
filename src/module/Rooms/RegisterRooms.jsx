import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { notify } from "../utils/toastify";
import { useUser } from "../../service/UserContext";
import ManageServiceRooms from "./service/ManageServiceRooms";
import FormsRooms from "./ui/forms/RegisterRooms";

const RegisterRooms = () => {
  const { user, token } = useUser();
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewRooms = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    try {
      const apiRooms = new ManageServiceRooms(user?.id);
      const resposne = await apiRooms.postRooms(formData, token);
      notify("Sala criado com sucesso", { type: "success" });
      setTimeout(() => {
        1000, navigate("/rooms");
      });
    } catch (error) {
      notify("Erro ao criar Sala", { type: "error" });
    }
  };
  return (
    <FormsRooms
      formData={formData}
      handleChange={handleChange}
      handleNewRooms={handleNewRooms}
      loading={false}
    />
  );
};

export default RegisterRooms;
