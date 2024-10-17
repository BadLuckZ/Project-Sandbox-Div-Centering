export const formatInteger = (number, decimalPoints) => {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: decimalPoints,
    maximumFractionDigits: decimalPoints,
  });
};

export const getAllSizes = (variants) => {
  const sizes = [
    ...new Set(
      variants.filter((variant) => variant.size).map((variant) => variant.size)
    ),
  ];
  return sizes.sort();
};

export const getAllColors = (variants) => {
  const colors = [...new Set(variants.map((variant) => variant.color))];
  return colors.sort();
};

export async function fetchAllItemsInCategories(target) {
  const url = `https://api.storefront.wdb.skooldio.dev/products?categories=${target}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch related items");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
  return null;
}

export function randomlyPickCategory(arr) {
  if (typeof arr === typeof "string") {
    arr = [arr];
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function randomlyPickItems(arr, number, target) {
  const filteredArray = arr.filter((item) => item.id !== target);
  const arrayCopy = [...filteredArray];
  const result = [];

  for (let i = 0; i < number; i++) {
    if (arrayCopy.length === 0) {
      break;
    }
    let randomIndex = Math.floor(Math.random() * arrayCopy.length);
    result.push(arrayCopy.splice(randomIndex, 1)[0]);
  }

  return result;
}
