import Icons from "../utils/Icons";
import { useUser } from "../../service/UserContext";
import { notify } from "../utils/toastify";
import Roles from "./Service/Roles";

const RoleUsers = () => {
  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Lista de Usuários</h2>
        {/* <div className="flex items-center space-x-2">
          <input
            type="text"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition duration-300">
            <Icons.FaSearch className="text-white" />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default RoleUsers;
