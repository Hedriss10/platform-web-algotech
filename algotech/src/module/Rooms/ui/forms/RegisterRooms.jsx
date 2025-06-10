import { useNavigate, Link } from "react-router-dom";
import Button from "../../../ui/Button/Button";

const FormsRooms = ({ formData, handleChange, handleNewRooms, loading }) => {
  return (
    <div className="flex-1 p-15 w-full bg-gray-100 h-full text-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Cadastrar Sala</h1>
        <nav className="text-sm text-gray-400">
          <ol className="flex space-x-2">
            <Link to="/home" className="hover:text-bg-gray-200">
              <strong>Home</strong>
            </Link>
            <Link to="/rooms" className="hover:text-bg-gray-200">
              <strong>Salas</strong>
            </Link>
          </ol>
        </nav>
      </div>

      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <form onSubmit={handleNewRooms} className="space-y-4 text-white">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Nome da Sala:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="submit"
              loading={loading}
              className="px-3 py-2 rounded-lg text-white font-semibold transition-all duration-200 bg-green-600 hover:bg-green-600-500"
            >
              Cadastrar
            </Button>

            <Link to="/rooms">
              <Button className="px-3 py-2 rounded-lg text-white font-semibold transition-all duration-200 bg-red-600 hover:bg-red-500">
                Fechar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormsRooms;
