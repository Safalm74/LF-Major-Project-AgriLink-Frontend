import { deleteUser, getAllUser } from "../api/users";
import Toast from "../components/toast";
import { ICustomer } from "../interface/user";
import Router from "../routes";
import { Content } from "../sections/content";

export class userManagement {
  static async init() {
    const table = document.createElement("table");
    const tableRow = document.createElement("tr");

    tableRow.innerHTML = `
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
        `;

    table.appendChild(tableRow);

    const userData: ICustomer[] = await getAllUser();

    userData.forEach((user) => {
      const tableRow = document.createElement("tr");
      const deleteBtn = document.createElement("button");

      tableRow.innerHTML = `
              <td>${user.firstName + " " + user.lastName}</td>
              <td>${user.email}</td>
            `;

      deleteBtn.innerHTML = `<i class="fa-solid fa-trash " style="color:#FF4C4C"></i>`;
      deleteBtn.addEventListener("click", async () => {
        await deleteUser(user.id!);

        Toast("User deleted successfully", "success");
        Router.resolve("/user-management");
      });

      tableRow.appendChild(deleteBtn);
      table.appendChild(tableRow);
    });

    return table;
  }

  static async load() {
    const userManagement = document.createElement("div");
    userManagement.classList.add("user-management");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.innerHTML = `
      <h2><span>User</span> Management</h2>
    `;

    userManagement.appendChild(titleDiv);
    userManagement.appendChild(await this.init());
    Content.replaceContent(userManagement);
  }
}
