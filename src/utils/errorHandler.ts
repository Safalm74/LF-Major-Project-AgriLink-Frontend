import { AxiosResponse } from "axios";
import toast from "../components/toast";
import { refreshAccessToken } from "../api/auth";
export function errorHandler(error: AxiosResponse) {
  const errorMessage = error.data.message;
  console.log(errorMessage);
  toast(errorMessage, "error");
  if (error.status === 401 && errorMessage === "Token Expired") {
    console.log("here");
    refreshAccessToken();
  }
}
