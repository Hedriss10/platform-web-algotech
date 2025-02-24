import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { notify } from "../../utils/toastify";
import { useUser } from "../../../service/UserContext";
import Icons from "../../utils/Icons";

const PreviewProposal = () => {
  const { user, token } = useUser();
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // Estado para armazenar os IDs dos usuários selecionados
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  return <div>PreviewProposal</div>;
};

export default PreviewProposal;
