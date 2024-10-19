export const formatInteger = (number, decimalPoints) => {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: decimalPoints,
    maximumFractionDigits: decimalPoints,
  });
};

export const getAllSizes = (variants) => {
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
  const item = cart.find((itemCart) => itemCart.id == itemId);
  return item;
};

export async function addCart(cart) {
  console.log(cart);
  // == Sample of cart ==
  // cart = [
  //   {
  //     id: "6FYslqo6hFuvdIpffL9t",
  //     skuCode: "S09001",
  //     permalink: "shoes-athletic-mesh-slip-on-sneakers",
  //     price: 990,
  //     promotionalPrice: 990,
  //     quantity: 9,
  //     color: "Black",
  //     size: "36",
  //   },
  //   {
  //     id: "UMcp5TasyJzU5XuQCNbv",
  //     skuCode: "S09004",
  //     permalink: "shoes-casual-strappy-flat-sandals",
  //     price: 590,
  //     promotionalPrice: 590,
  //     quantity: 3,
  //     color: "Nude",
  //     size: "36",
  //   },
  //   {
  //     id: "qkgJhtwob70HoMELcHn0",
  //     skuCode: "C09004",
  //     permalink: "shirts-fleece-turtleneck-long-sleeve-dress",
  //     price: 1990,
  //     promotionalPrice: 1490,
  //     quantity: 10,
  //     color: "Red",
  //     size: "L",
  //   },
  // ];
  // ===================

  const url = "https://api.storefront.wdb.skooldio.dev/carts";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });
    if (!res.ok) {
      throw Error("Fail to post data");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
  return null;
}
