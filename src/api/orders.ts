import api from "./axiosApi";
import { backendServerURL } from "../constants";
import { IOrderForFarm, IOrders } from "../interface/orders";
import { ICartToCheckout } from "../interface/cart";
import toast from "../components/toast";
const endPoint = backendServerURL + `/orders`;

export async function createOrder(data: ICartToCheckout) {
  console.log(data);
  return await api.post(endPoint, data);
}

export function getFarmOrders(farmId: string) {
  return api.get(endPoint + `/farm?farmId=${farmId}`).then((res) => {
    const orders: IOrderForFarm[] = res.data;

    return orders;
  });
}

export function getUserOrders() {
  return api.get(backendServerURL + "/orders").then((res) => {
    const orders: IOrders[] = res.data;

    localStorage.setItem("orders", JSON.stringify(res.data));

    return orders;
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  return await api
    .patch(endPoint + `/${orderId}`, {
      orderStatus: status,
    })
    .then(() => {
      toast(`Order status updated to ${status}`, "success");
    });
}
