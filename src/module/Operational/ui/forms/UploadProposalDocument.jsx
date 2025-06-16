const UploadProposalDocument = ({
  image_urls,
  pdfStates,
  toggleExpandPdf,
  downloadPdf,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(image_urls).map(([key, urls]) =>
        urls.length > 0 ? (
          <div key={key}>
            <h3 className="font-semibold">
              {key.replace(/_/g, " ").toUpperCase()}
            </h3>
            {urls.map((url, index) => {
              const isPdf = url && url.toLowerCase().endsWith(".pdf");
              const filename = url
                ? url.split("/").pop() || `${key}.pdf`
                : `${key}.pdf`;
              return (
                <div key={`${key}-${index}`} className="mt-2">
                  {isPdf ? (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      {!pdfStates[url] ? (
                        <div>Carregando PDF...</div>
                      ) : pdfStates[url].error ? (
                        <p className="text-red-600">{pdfStates[url].error}</p>
                      ) : (
                        <div>
                          <div
                            onClick={() => toggleExpandPdf(url)}
                            className="cursor-pointer"
                          >
                            <iframe
                              src={pdfStates[url].blob}
                              className={`w-full transition-all duration-300 ${
                                pdfStates[url].isExpanded
                                  ? "h-[80vh] max-h-[800px]"
                                  : "h-[400px]"
                              }`}
                              title={`${key}_${index}`}
                              style={{ border: "none" }}
                            />
                          </div>
                          <div className="flex justify-between mt-2">
                            <button
                              onClick={() => toggleExpandPdf(url)}
                              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                            >
                              {pdfStates[url].isExpanded
                                ? "Reduzir"
                                : "Expandir"}
                            </button>
                            <button
                              onClick={() => downloadPdf(url, filename)}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                            >
                              Baixar PDF
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt={`${key}_${index}`}
                      className="w-full h-auto rounded-lg shadow-sm"
                      onError={() =>
                        console.error(`Erro ao carregar imagem: ${url}`)
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : null,
      )}
    </div>
  );
};

export default UploadProposalDocument;
