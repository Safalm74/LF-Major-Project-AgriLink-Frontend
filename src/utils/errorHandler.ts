import { AxiosResponse } from "axios";
import toast from "../components/toast";

export function errorHandler(error: AxiosResponse) {
  const errorMessage = error.data.message;
  toast(errorMessage, "error");
}
