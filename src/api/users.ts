import { backendServerURL } from "../constants";
import { IFarm } from "../interface/farm";
import { ICustomer } from "../interface/user";
import api from "./axiosApi";

const endPoint = backendServerURL + "/user";

export async function createUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone: string,
  address: string
) {
  const defaultRole = "customer";
  return (
    await api.post(endPoint, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      phone: phone,
      address: address,
      roleId: defaultRole,
    })
  ).data.data;
}

export async function getAllUser() {
  return api.get(endPoint).then((res) => {
    const data: ICustomer[] = res.data;

    return data;
  });
}

export async function getUserById(userId: string) {
  return api.get(endPoint + "?id=" + userId).then((res) => res.data);
}

export async function updateUser(
  userId: string,
  lastName: string,
  firstName: string,
  email: string,
  password: string,
  phone: string,
  address: string
) {
  await api.put(endPoint + "/" + userId, {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    phone: phone,
    address: address,
  });
}

export async function changeToFarmer(farmToCreate: Omit<IFarm, "id">) {
  return await api.patch(endPoint + "/roleToFarmer", farmToCreate);
}

export async function deleteUser(userId: string) {
  return await api.delete(endPoint + "/" + userId);
}
