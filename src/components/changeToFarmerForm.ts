import { changeToFarmer } from "../api/users";
import Modal from "../sections/modal";
import fetchHtml from "../utils/fetchHtml";
import Toast from "./toast";

export class ChangeToFarmerForm {
  static async init() {
    const changeToFarmerForm = document.createElement("div");
    changeToFarmerForm.classList.add("change-to-farmer-form");

    changeToFarmerForm.innerHTML = await fetchHtml(
      "components/convertToFarmerForm.html"
    );

    return changeToFarmerForm;
  }

  static async load() {
    const changeToFarmerForm = await ChangeToFarmerForm.init();
    Modal.modal(changeToFarmerForm);

    this.loadEventListener(changeToFarmerForm);
  }

  static async loadEventListener(changeToFarmerForm: HTMLElement) {
    changeToFarmerForm
      .getElementsByClassName("convert-btn")[0]
      .addEventListener("click", async (e) => {
        e.preventDefault();
        const farmName = changeToFarmerForm.getElementsByClassName(
          "farm-name"
        )[0] as HTMLInputElement;
        const farmAddress = changeToFarmerForm.getElementsByClassName(
          "farm-address"
        )[0] as HTMLInputElement;
        if (farmName && farmAddress) {
          const farmNameValue = farmName.value;
          const farmAddressValue = farmAddress.value;
          if (farmNameValue && farmAddressValue) {
            await changeToFarmer({
              userId: JSON.parse(localStorage.getItem("userDetails")!).id,
              farmName: farmNameValue,
              farmAddress: farmAddressValue,
            });

            Toast("Log in again to see changes", "success");
          }
        }
      });
  }
}
