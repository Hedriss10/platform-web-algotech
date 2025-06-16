// src/utils/FormatData.jsx
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR");
};

export default formatDate;
