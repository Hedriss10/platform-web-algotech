const UploadFilesProposal = ({ files, handleAddImage }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.keys(files).map((key) => (
        <div key={key}>
          <label>{key.replace(/_/g, " ").toUpperCase()}</label>
          <input
            type="file"
            name={key}
            onChange={handleAddImage}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
    </div>
  );
};

export default UploadFilesProposal;
