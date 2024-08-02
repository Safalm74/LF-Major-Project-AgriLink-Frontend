import axios from "axios";
import { backendServerURL } from "../constants";
import { IOrderForFarm, IOrders } from "../interface/orders";
import { ICartToCheckout } from "../interface/cart";
import toast from "../components/toast";

const endPoint = backendServerURL + `/orders`;

export async function createOrder(data: ICartToCheckout) {
  return await axios.post(endPoint, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
    },
  });
}

export function getFarmOrders(farmId: string) {
  return axios
    .get(endPoint + `/farm?farmId=${farmId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
      },
    })
    .then((res) => {
      const orders: IOrderForFarm[] = res.data;

      return orders;
    });
}

export function getUserOrders() {
  return axios
    .get(backendServerURL + "/orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
      },
    })
    .then((res) => {
      const orders: IOrders[] = res.data;

      localStorage.setItem("orders", JSON.stringify(res.data));

      return orders;
    });
}

export async function updateOrderStatus(orderId: string, status: string) {
  return await axios
    .patch(
      endPoint + `/${orderId}`,
      {
        orderStatus: status,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
    .then(() => {
      toast("Delivered", "success");
    });
}
