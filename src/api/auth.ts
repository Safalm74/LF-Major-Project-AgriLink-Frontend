import axios from "axios";
import { backendServerURL } from "../constants";

const endPoint = backendServerURL + "/auth";

export async function login(email: string, password: string) {
  return (
    await axios.post(
      endPoint + "/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    )
  ).data.data;
}

export async function refreshAccessToken() {
  const accessToken = (
    await axios.get(endPoint + "/refreshAccessToken", {
      withCredentials: true,
    })
  ).data;

  localStorage.removeItem("accessToken");
  localStorage.setItem("accessToken", accessToken.accessToken);

  return accessToken;
}
