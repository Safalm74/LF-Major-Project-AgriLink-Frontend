import axios from "axios";
import { backendServerURL } from "../constants";
import { IOrderItems } from "../interface/orderItems";

const endPoint = backendServerURL + `/orderItems`;

export function getOrderItems(orderId: string) {
  return axios
    .get(endPoint + `?orderId=${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
      },
    })
    .then((res) => {
      const data: IOrderItems[] = res.data;
      return data;
    });
}
