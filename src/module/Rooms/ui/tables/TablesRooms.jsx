// scr/module/rooms/ui/tables/TablesRooms.jsx

import Icons from "../../../utils/Icons";

const TablesRooms = ({
  rooms,
  loading,
  handleGetRoomByid,
  handleEditRooms,
  handleDeleteRooms,
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
              Visualizar
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Editar
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Apagar
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
          ) : rooms.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-300">
                Nenhum sala encontrado.
              </td>
            </tr>
          ) : (
            rooms.map((room) => (
              <tr
                key={room.id}
                className="hover:bg-gray-550 transition duration-300"
              >
                <td className="px-6 py-4 text-sm text-gray-200">{room.name}</td>
                <td className="px-6 py-4">
                  <button
                    className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300"
                    onClick={() => handleGetRoomByid(room.id)}
                  >
                    <Icons.MdOutlinePreview className="text-white" />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="p-2 bg-orange-600 rounded-lg hover:bg-blue-500 transition duration-300"
                    onClick={() => handleEditRooms(room.id)}
                  >
                    <Icons.FaEdit className="text-white" />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition duration-300"
                      onClick={() => handleDeleteRooms(room.id)}
                    >
                      <Icons.FaTrash className="text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablesRooms;
