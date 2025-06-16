const Pagination = ({
  rowsPerPage,
  handlePageChange,
  handleRowsPerPageChange,
  currentPage,
  totalPages,
}) => {
  return (
    <div className="flex justify-between items-center mt-6">
      <div>
        <select
          className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
        >
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
          <option value={50}>50 por página</option>
        </select>
      </div>
      <nav>
        <ul className="flex space-x-2">
          <li>
            <button
              className={`px-4 py-2 bg-gray-600 text-white rounded-lg ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-500"
              } transition duration-300`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i + 1}>
              <button
                className={`px-4 py-2 ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-600 text-white hover:bg-gray-500"
                } rounded-lg transition duration-300`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              className={`px-4 py-2 bg-gray-600 text-white rounded-lg ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-500"
              } transition duration-300`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
