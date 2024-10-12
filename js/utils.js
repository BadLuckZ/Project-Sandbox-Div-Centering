export const formatInteger = (number, decimalPoints = 0) => {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: decimalPoints,
    maximumFractionDigits: decimalPoints,
  });
};
