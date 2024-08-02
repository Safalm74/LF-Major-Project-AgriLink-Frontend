import axios from "axios";
import { backendServerURL } from "../constants";
import { IFarm } from "../interface/farm";
import { Iuser } from "../interface/user";
import { errorHandler } from "./errorHandler";

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
    await axios.post(endPoint, {
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
  return axios
    .get(endPoint, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
    .then((res) => {
      const data: Iuser[] = res.data;

      return data;
    })
    .catch((e) => {
      errorHandler(e.response);
      return getAllUser();
    });
}

export async function getUserById(userId: string) {
  return axios
    .get(endPoint + "?id=" + userId, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("refreshToken"),
      },
    })
    .then((res) => res.data);
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
  await axios.put(
    endPoint + "/" + userId,
    {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      phone: phone,
      address: address,
    },
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }
  );
}

export async function changeToFarmer(farmToCreate: Omit<IFarm, "id">) {
  return await axios.patch(endPoint + "/roleToFarmer", farmToCreate, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("refreshToken"),
    },
  });
}

export async function deleteUser(userId: string) {
  return await axios.delete(endPoint + "/" + userId, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("refreshToken"),
    },
  });
}
