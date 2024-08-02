import axios from "axios";
import { backendServerURL } from "../constants";
import { Icart } from "../interface/cart";
import { errorHandler } from "./errorHandler";

const endPoint = backendServerURL + `/cartItems`;

export async function addToCart(id: string, quantity: number) {
  return await axios.post(
    endPoint,
    {
      productId: id,
      quantity: quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
}

export async function getCartData() {
  return axios
    .get(endPoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((res) => {
      const cart: Icart[] = res.data;
      return cart;
    })
    .catch((err) => {
      errorHandler(err.response);
    });
}

export async function updateCart(id: string, quantity: number) {
  return await axios.put(
    endPoint + `/${id}`,
    {
      id: id,
      quantity: quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
}

export async function deleteCart(id: string) {
  return await axios.delete(endPoint + `/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}
