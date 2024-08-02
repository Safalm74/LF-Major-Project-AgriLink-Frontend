import { AxiosResponse } from "axios";
import toast from "../components/toast";
import { refreshAccessToken } from "./auth";
export function errorHandler(error: AxiosResponse) {
  const errorMessage = error.data.message;
  console.log(errorMessage);
  toast(errorMessage, "error");
  if (error.status === 401 && errorMessage === "Token expired") {
    refreshAccessToken();
  }
}
