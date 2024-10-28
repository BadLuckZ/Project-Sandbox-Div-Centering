export const formatInteger = (number, decimalPoints) => {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: decimalPoints,
    maximumFractionDigits: decimalPoints,
  });
};

export const getAllSizes = (variants) => {
  if (["XS", "S", "M", "L", "XL", "2XL"].includes(variants[0].size)) {
    return ["XS", "S", "M", "L", "XL", "2XL"];
  }
  const sortedVariants = variants.sort((a, b) => {
    return a.skuCode.localeCompare(b.skuCode);
  });
  const sizes = [];
  sortedVariants.forEach((v) => {
    if (v.size && !sizes.includes(v.size)) {
      sizes.push(v.size);
    }
  });
  return sizes;
};

export const getAllColors = (variants) => {
  const sortedVariants = variants.sort((a, b) => {
    return a.skuCode.localeCompare(b.skuCode);
  });
  const colors = [];
  sortedVariants.forEach((v) => {
    if (v.color && !colors.includes(v.color)) {
      colors.push(v.color);
    }
  });
  return colors;
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

export const getItemInCart = (cart, itemId) => {
  const item = cart.find((itemCart) => itemCart.id === itemId);
  if (item) {
    return item;
  } else {
    return null;
  }
};

async function fetchAllCategories() {
  try {
    const url = `https://api.storefront.wdb.skooldio.dev/categories`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await res.json();
    const fetchCategories = data.map((d) => d.permalink);
    console.log(fetchCategories);
  } catch (err) {
    console.error(err);
  }
}

export const categoryData = [
  // get the data from fetchAllCategories and modify them in this function
  { api: "all-men", text: "Men's Clothing", type: "All" },
  { api: "all-ladies", text: "Women's Clothing", type: "All" },
  { api: "men-shirts", text: "Men's Shirts", type: "Shirts" },
  { api: "ladies-shirts", text: "Women's Shirts", type: "Shirts" },
  { api: "men-shoes", text: "Men's Shoes", type: "Shoes" },
  { api: "ladies-shoes", text: "Women's Shoes", type: "Shoes" },
  { api: "men-accessories", text: "Men's Accessories", type: "Accessories" },
  {
    api: "ladies-accessories",
    text: "Women's Accessories",
    type: "Accessories",
  },
  { api: "test", text: "Test Test", type: "Test" },
];
