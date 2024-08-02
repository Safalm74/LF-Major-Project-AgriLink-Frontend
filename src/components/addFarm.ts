import { AxiosError } from "axios";
import { errorHandler } from "../utils/errorHandler";
import { createFarm, getAllFarmsByUserId, updateFarm } from "../api/farm";
import Modal from "../sections/modal";
import fetchHtml from "../utils/fetchHtml";

export class AddFarmForm {
  static async init() {
    const changeToFarmerForm = document.createElement("div");
    changeToFarmerForm.classList.add("change-to-farmer-form");

    changeToFarmerForm.innerHTML = await fetchHtml("components/addFarm.html");

    return changeToFarmerForm;
  }

  static async load(btnName: string, farmId?: string) {
    const addFarmForm = await this.init();
    Modal.modal(addFarmForm);

    this.loadEventListener(addFarmForm, btnName, farmId);
  }

  static async loadEventListener(
    addFarmForm: HTMLElement,
    btnName: string,
    farmId?: string
  ) {
    addFarmForm.getElementsByClassName("convert-btn")[0].innerHTML = btnName;
    addFarmForm
      .getElementsByClassName("convert-btn")[0]
      .addEventListener("click", async (e) => {
        e.preventDefault();
        const farmName = addFarmForm.getElementsByClassName(
          "farm-name"
        )[0] as HTMLInputElement;
        const farmAddress = addFarmForm.getElementsByClassName(
          "farm-address"
        )[0] as HTMLInputElement;
        if (farmName && farmAddress) {
          const farmNameValue = farmName.value;
          const farmAddressValue = farmAddress.value;
          if (farmNameValue && farmAddressValue) {
            try {
              if (farmId) {
                await updateFarm(farmId, {
                  id: farmId,
                  farmName: farmNameValue,
                  farmAddress: farmAddressValue,
                });
              } else {
                await createFarm({
                  farmName: farmNameValue,
                  farmAddress: farmAddressValue,
                });

                localStorage.removeItem("farm");
                localStorage.setItem(
                  "farm",
                  JSON.stringify(await getAllFarmsByUserId())
                );

                Modal.removeModal();
              }
            } catch (error) {
              errorHandler((error as AxiosError).response!);
            }
          }
        }
      });
  }
}
