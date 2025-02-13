import React from "react";
import { useUser } from "../../service/UserContext";

const Home = ({ isAsideOpen }) => {
  const user = useUser();
  return (
    <main
      id="main"
      className={`flex-1 p-4 bg-gray-100 min-h-screen transition-margin duration-300 ease-in-out ${
        isAsideOpen ? "ml-64" : "ml-0"
      } mt-16`} // mt-16 para o Header e ml-64 para o Aside
    >
      {/* Page Title */}
      <div className="p-6 bg-white rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Data Tables</h1>
        Seja bem-vindo à plataforma {user?.user?.username ?? "Visitante"} e sua
        identificação é {user?.user?.id ?? "N/A"}
        <nav className="mt-2">
          <ol className="flex space-x-2 text-sm text-gray-600">
            <li>
              <a
                href="/"
                className="hover:text-blue-500 transition duration-300"
              >
                Home
              </a>
            </li>
            <li>/</li>
            <li>Tables</li>
            <li>/</li>
            <li className="font-semibold text-gray-800">Data</li>
          </ol>
        </nav>
      </div>
      {/* End Page Title */}

      {/* Section for Data Tables */}
      <section className="p-6 bg-white rounded-lg shadow">
        <div className="space-y-6">
          <div className="w-full">
            <div className="bg-white rounded-lg">
              <div className="p-6">
                <h5 className="text-xl font-semibold text-gray-800 mb-4">
                  Datatables
                </h5>
                <p className="text-gray-600 mb-6">
                  Add lightweight datatables to your project using the{" "}
                  <a
                    href="https://github.com/fiduswriter/Simple-DataTables"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline transition duration-300"
                  >
                    Simple DataTables
                  </a>{" "}
                  library. Just add{" "}
                  <code className="bg-gray-200 p-1 rounded text-sm font-mono">
                    .datatable
                  </code>{" "}
                  class name to any table you wish to convert into a datatable.
                  Check for{" "}
                  <a
                    href="https://fiduswriter.github.io/simple-datatables/demos/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline transition duration-300"
                  >
                    more examples
                  </a>
                  .
                </p>

                {/* Table with stripped rows */}
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">
                          <b>N</b>ame
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">
                          Ext.
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">
                          City
                        </th>
                        <th
                          className="p-3 text-left text-sm font-semibold text-gray-700 border border-gray-200"
                          data-type="date"
                          data-format="YYYY/DD/MM"
                        >
                          Start Date
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">
                          Completion
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50 transition duration-300">
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">
                          Unity Pugh
                        </td>
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">
                          9958
                        </td>
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">
                          Curicó
                        </td>
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">
                          2005/02/11
                        </td>
                        <td className="p-3 text-sm text-gray-700 border border-gray-200">
                          37%
                        </td>
                      </tr>
                      {/* Adicione mais linhas conforme necessário */}
                    </tbody>
                  </table>
                </div>
                {/* End Table with stripped rows */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
