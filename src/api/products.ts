import { IProduct } from "../interface/product";
import { backendServerURL } from "../constants";
import api from "./axiosApi";

const endPoint = backendServerURL + `/product`;

export async function createProduct(productToUpload: Omit<IProduct, "id">) {
  await api.post(endPoint, productToUpload);
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
  return api.get(endPoint + `?id=${productId}`).then((res) => res.data);
}

export async function getProductByFarmId(farmId?: string) {
  if (!farmId) {
    return;
  }

  const data: IProduct[] = (await api.get(endPoint + `?farmId=${farmId}`)).data;

  sessionStorage.setItem("products", JSON.stringify(data));

  return data;
}

export async function getAllProducts(searchKey?: string) {
  let getProductEndPoint = endPoint;

  if (searchKey) {
    getProductEndPoint += `?searchKeyword=${searchKey}`;
  }

  const data: IProduct[] = (await api.get(getProductEndPoint)).data;

  sessionStorage.setItem("products", JSON.stringify(data));

  return data;
}

export async function updateProduct(
  productId: string,
  productToUpload: Omit<IProduct, "id" | "farmId">
) {
  await api.put(endPoint + `/${productId}`, productToUpload);
}

export async function deleteProduct(productId: string) {
  return await api.delete(endPoint + `/${productId}`);
}
