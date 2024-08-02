import axios from "axios";
import { backendServerURL } from "../constants";
import toast from "../components/toast";
import { logOut } from "../utils/logOut";

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
  try {
    const accessToken = (
      await axios.get(endPoint + "/refreshAccessToken", {
        withCredentials: true,
      })
    ).data;

    console.log("here", accessToken);

    localStorage.removeItem("accessToken");
    localStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    logOut();

    toast("Please login again", "error");
  }
}
