import { deleteUser, getAllUser } from "../api/users";
import { Iuser } from "../interface/user";
import { Content } from "../sections/content";

export class userManagement {
  static async init() {
    const table = document.createElement("table");
    const tableRow = document.createElement("tr");

    tableRow.innerHTML = `
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
        `;

    table.appendChild(tableRow);

    const userData: Iuser[] = await getAllUser();

    userData.forEach((user) => {
      const tableRow = document.createElement("tr");
      const deleteBtn = document.createElement("button");
      if (user.role !== "admin") {
        tableRow.innerHTML = `
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.role}</td>
            `;

        deleteBtn.innerHTML = `delete`;
        deleteBtn.addEventListener("click", async () => {
          await deleteUser(user.id!);
        });

        tableRow.appendChild(deleteBtn);
        table.appendChild(tableRow);
      }
    });

    return table;
  }

  static async load() {
    const userManagement = await this.init();
    Content.replaceContent(userManagement);
  }
}
