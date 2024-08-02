import { backendServerURL } from "../constants";
import { IOrderItems } from "../interface/orderItems";
import api from "./axiosApi";

const endPoint = backendServerURL + `/orderItems`;

export function getOrderItems(orderId: string) {
  return api.get(endPoint + `?orderId=${orderId}`).then((res) => {
    const data: IOrderItems[] = res.data;
    return data;
  });
}
