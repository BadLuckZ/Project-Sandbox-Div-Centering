export const formatInteger = (number, decimalPoints = 0) => {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: decimalPoints,
    maximumFractionDigits: decimalPoints,
  });
};

export const getAllColors = (variants) => {
  const colors = [...new Set(variants.map((variant) => variant.color))];
  return colors.sort();
};
