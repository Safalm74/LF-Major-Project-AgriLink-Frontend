import axios from "axios";
import { backendServerURL } from "../constants";
import { IFarm } from "../interface/farm";
import toast from "../components/toast";

const endPoint = backendServerURL + "/farm";

export async function createFarm(farmToCreate: Omit<IFarm, "id">) {
  return axios
    .post(
      endPoint,
      {
        userId: farmToCreate.userId,
        farmName: farmToCreate.farmName,
        farmAddress: farmToCreate.farmAddress,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
    .then((res) => {
      toast("Farm created successfully", "success");
      return res.data;
    });
}

export function getFarmDetailsById(farmId: string) {
  return axios
    .get(endPoint + `/${farmId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((res) => {
      const farm: IFarm = res.data[0];

      return farm;
    });
}

export function getAllFarms() {
  return axios
    .get(endPoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((res) => {
      const farms: IFarm[] = res.data;

      return farms;
    });
}

export function getAllFarmsByUserId() {
  return axios
    .get(endPoint + "/userFarms", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((res) => {
      const farms: IFarm[] = res.data;

      return farms;
    });
}

export async function updateFarm(farmId: string, farmToUpdate: IFarm) {
  return await axios.put(endPoint + `/${farmId}`, farmToUpdate, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export async function deleteFarm(farmId: string) {
  return await axios.delete(endPoint + `/${farmId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}
