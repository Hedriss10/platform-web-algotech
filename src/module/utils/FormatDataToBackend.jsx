const formatDateToBackend = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

const mockFilterProposal = {
  current_status: "",
  start_date: "",
  end_date: "",
  selectedBankId: "",
  selectedAgreementId: "",
};

export { formatDateToBackend, mockFilterProposal };
