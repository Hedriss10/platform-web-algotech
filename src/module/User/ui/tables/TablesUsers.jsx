import MaskCpf from "../../../utils/MaskCpf";
import Icons from "../../../utils/Icons";

const TablesUsers = ({
  users,
  loading,
  handleEditUser,
  handleBlockUser,
  handleDeleteUser,
  handleResetPassword,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden">
        <thead className="bg-gray-500">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              CPF
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Ações
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Editar
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Reset
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-500">
          {loading ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-300">
                Carregando...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-300">
                Nenhum usuário encontrado.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-550 transition duration-300"
              >
                <td className="px-6 py-4 text-sm text-gray-200">
                  {user.username}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {MaskCpf(user.cpf)}
                </td>
                <td className="px-6 py-4">
                  {user.is_block ? (
                    <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                      Bloqueado
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-500 text-white rounded-full">
                      Ativo
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition duration-300"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Icons.FaTrash className="text-white" />
                    </button>
                    <button
                      className="p-2 bg-yellow-600 rounded-lg hover:bg-yellow-500 transition duration-300"
                      onClick={() => handleBlockUser(user.id)}
                    >
                      <Icons.FaBan className="text-white" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300"
                    onClick={() => handleEditUser(user.id)}
                  >
                    <Icons.FaEdit className="text-white" />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => handleResetPassword(e, user.id)}
                    className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300"
                  >
                    <Icons.MdLockReset className="text-white" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablesUsers;
