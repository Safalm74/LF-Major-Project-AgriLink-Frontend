import { backendServerURL } from "../constants";
import { ICart } from "../interface/cart";
import api from "./axiosApi";

const endPoint = backendServerURL + `/cartItems`;

export async function addToCart(id: string, quantity: number) {
  return await api.post(endPoint, {
    productId: id,
    quantity: quantity,
  });
}

export async function getCartData() {
  return api.get(endPoint).then((res) => {
    const cart: ICart[] = res.data;
    return cart;
  });
}

export async function updateCart(id: string, quantity: number) {
  return await api.put(endPoint + `/${id}`, {
    id: id,
    quantity: quantity,
  });
}

export async function deleteCart(id: string) {
  return await api.delete(endPoint + `/${id}`);
}
