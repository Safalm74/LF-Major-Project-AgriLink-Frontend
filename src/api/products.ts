import axios from "axios";
import { IProduct } from "../interface/product";
import { backendServerURL } from "../constants";

const endPoint = backendServerURL + `/product`;

export async function createProduct(productToUpload: Omit<IProduct, "id">) {
  await axios.post(endPoint, productToUpload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
    },
  });
}

export async function getProductDetail(productId: string) {
  const products: IProduct[] = JSON.parse(sessionStorage.getItem("products")!);

  if (!products) {
    return (await getProductById(productId))[0];
  }

  let requestedProduct = products.find((product) => product.id === productId);

  if (!requestedProduct) {
    requestedProduct = (await getProductById(productId))[0];
  }

  return requestedProduct;
}

function getProductById(productId: string) {
  return axios
    .get(endPoint + `?id=${productId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
      },
    })
    .then((res) => res.data);
}

export async function getProductByFarmId(farmId?: string) {
  if (!farmId) {
    return;
  }

  const data: IProduct[] = (await axios.get(endPoint + `?farmId=${farmId}`))
    .data;

  sessionStorage.setItem("products", JSON.stringify(data));

  return data;
}

export async function getAllProducts(searchKey?: string) {
  let getProductEndPoint = endPoint;

  if (searchKey) {
    getProductEndPoint += `?searchKeyword=${searchKey}`;
  }

  const data: IProduct[] = (await axios.get(getProductEndPoint)).data;

  return data;
}

export async function updateProduct(
  productId: string,
  productToUpload: Omit<IProduct, "id" | "farmId">
) {
  await axios.put(endPoint + `/${productId}`, productToUpload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
    },
  });
}

export async function deleteProduct(productId: string) {
  return await axios.delete(endPoint + `/${productId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
    },
  });
}
