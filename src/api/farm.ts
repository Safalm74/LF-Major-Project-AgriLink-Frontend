import { backendServerURL } from "../constants";
import { IFarm } from "../interface/farm";
import toast from "../components/toast";
import api from "./axiosApi";

const endPoint = backendServerURL + "/farm";

export async function createFarm(farmToCreate: Omit<IFarm, "id">) {
  return api
    .post(endPoint, {
      userId: farmToCreate.userId,
      farmName: farmToCreate.farmName,
      farmAddress: farmToCreate.farmAddress,
    })
    .then((res) => {
      toast("Farm created successfully", "success");
      return res.data;
    });
}

export function getFarmDetailsById(farmId: string) {
  return api.get(endPoint + `/?id=${farmId}`).then((res) => {
    const farm: IFarm = res.data[0];

    return farm;
  });
}

export function getAllFarms() {
  return api.get(endPoint).then((res) => {
    const farms: IFarm[] = res.data;

    return farms;
  });
}

export function getAllFarmsByUserId() {
  return api.get(endPoint + "/userFarms").then((res) => {
    const farms: IFarm[] = res.data;

    return farms;
  });
}

export async function updateFarm(farmId: string, farmToUpdate: IFarm) {
  return await api.put(endPoint + `/${farmId}`, farmToUpdate);
}

export async function deleteFarm(farmId: string) {
  return await api.delete(endPoint + `/${farmId}`);
}
