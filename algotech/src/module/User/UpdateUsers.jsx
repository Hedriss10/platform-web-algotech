import React, { useState } from "react";
import { notify } from "../utils/toastify";
import { useUser } from "../../service/UserContext";
import Roles from "./Service/Roles";

const UpdataUsers = () => {
  const { user, token } = useUser();
  const [formData, setFormData] = useState({
    username: "",
    lastname: "",
    email: "",
    cpf: "",
    password: "",
    typecontract: "",
    role: "",
    matricula: "",
    numero_pis: "",
    empresa: "",
    situacao_cadastro: "",
    carga_horaria_semanal: "",
    cargo: "",
  });

  return <h1>Editar usuário</h1>;
};
