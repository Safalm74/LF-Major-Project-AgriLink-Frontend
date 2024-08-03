import { deleteFarm, getAllFarms } from "../api/farm";
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
      deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
      deleteBtn.addEventListener("click", async () => {
        await deleteFarm(farm.id!);

        Toast("Farm deleted successfully", "success");
        Router.resolve("/farm-management");
      });

      tableRow.appendChild(deleteBtn);
      table.appendChild(tableRow);
    });

    return table;
  }

  static async load() {
    const farmManagement = await this.init();
    Content.replaceContent(farmManagement);
  }
}
