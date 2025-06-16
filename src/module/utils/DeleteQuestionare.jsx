import React, { useState } from "react";

const QuestionareDelete = ({ onDelete, onCancel }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleDelete = () => {
    if (isConfirmed) {
      onDelete();
    } else {
      alert("Por favor, confirme a ação de deletar.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        {/* Título */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Deseja deletar essa ação? Esta ação é irreversível.
          </h2>
        </div>
        <div className="flex justify-end space-x-2">
          <label className="text-gray-800 flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
            />
            <span>Confirmar exclusão</span>
          </label>
          <button
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition duration-300"
            onClick={handleDelete}
          >
            Deletar
          </button>
          <button
            className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition duration-300"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionareDelete;
