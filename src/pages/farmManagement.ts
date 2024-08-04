import { deleteFarm, getAllFarms } from "../api/farm";
import { ConfirmDeletePopUp } from "../components/deleteConfirmationPopUp";
import Toast from "../components/toast";
import { IFarm } from "../interface/farm";
import Router from "../routes";
import { Content } from "../sections/content";

export class FarmManagement {
  static async init() {
    const table = document.createElement("table");
    const tableRow = document.createElement("tr");

    tableRow.innerHTML = `
        <th>Name</th>
        <th>Address</th>
        <th>Actions</th>
    `;
    table.appendChild(tableRow);

    const farmData: IFarm[] = await getAllFarms();

    farmData.forEach((farm) => {
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
        <td>${farm.farmName}</td>
        <td>${farm.farmAddress}</td>
        `;

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = `<i class="fa-solid fa-trash " style="color:#FF4C4C"></i>`;
      deleteBtn.addEventListener("click", async () => {
        ConfirmDeletePopUp.confirm(
          "Are you sure you want to delete this farm?",
          async (id) => {
            await deleteFarm(id);
            Toast("Farm deleted successfully", "success");
            Router.resolve("/farm-management");
          },
          farm.id!
        );
      });

      tableRow.appendChild(deleteBtn);
      table.appendChild(tableRow);
    });

    return table;
  }

  static async load() {
    const farmManagement = document.createElement("div");
    farmManagement.classList.add("farm-management");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.innerHTML = `
      <h2><span>Farm</span> Management</h2>
    `;

    farmManagement.appendChild(titleDiv);
    farmManagement.appendChild(await this.init());
    Content.replaceContent(farmManagement);
  }
}
