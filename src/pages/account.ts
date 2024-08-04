import { IUser } from "../interface/user";
import { Content } from "../sections/content";
import fetchHtml from "../utils/fetchHtml";
import { getUserOrders } from "../api/orders";
import { IOrders } from "../interface/orders";
import { OrderDetails } from "./orderDetails";
import Modal from "../sections/modal";
import { userRegisterForm } from "../components/userRegisterForm";
import { ChangeToFarmerForm } from "../components/changeToFarmerForm";
import { AddFarmForm } from "../components/addFarm";
import { IFarm } from "../interface/farm";
import { deleteFarm, getAllFarmsByUserId } from "../api/farm";
import Toast from "../components/toast";

export class Account {
  static async init() {
    const account = document.createElement("div");
    const accountPage = await fetchHtml("pages/account.html");

    account.innerHTML = accountPage;
    return account;
  }

  static async load() {
    const account = await this.init();
    Content.replaceContent(account);

    this.loadContent(account);

    this.loadEventListeners(account);
  }
  static loadEventListeners(account: HTMLElement) {
    const logoutBtn = account.querySelector(".account__logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "/";
      });
    }

    const editBtn = account.querySelector(".account__edit-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        Modal.modal(
          userRegisterForm(
            true,
            JSON.parse(localStorage.getItem("userDetails")!).id
          )!,
          "Edit Profile"
        );
      });
    }
  }

  static loadContent(account: HTMLElement) {
    const userDetail = account.querySelector(".account__user-detail");
    let savedUser: IUser;

    if (userDetail) {
      if (!localStorage.getItem("userDetails")) {
        return;
      }
      savedUser = JSON.parse(localStorage.getItem("userDetails")!) as IUser;
      userDetail.querySelector("h1")!.innerHTML = `Hi, ${savedUser.name}`;
      userDetail.querySelector("p")!.innerHTML = savedUser.email;
    }

    const orders = account.querySelector(".account__orders") as HTMLElement;
    const userDetails: IUser = JSON.parse(localStorage.getItem("userDetails")!);

    if (userDetails.role === "admin") {
      (
        document.getElementsByClassName("account__orders")[0] as HTMLElement
      ).classList.add("display-none");
    }

    if (orders) {
      this.loadTable(orders);
    }

    if (userDetails.role === "customer") {
      const convertToFarmerBtn = document.createElement("button");
      convertToFarmerBtn.classList.add("account__convert-to-farmer-btn");
      convertToFarmerBtn.innerHTML = "Convert To Farmer";
      convertToFarmerBtn.addEventListener("click", async () => {
        await ChangeToFarmerForm.load();
      });
      account.appendChild(convertToFarmerBtn);
    }

    if (userDetails.role === "farmer") {
      const addFarm = document.createElement("button");
      addFarm.classList.add("account__add-farm-btn");
      addFarm.innerHTML = "Add Farm";
      addFarm.addEventListener("click", async () => {
        await AddFarmForm.load("Add Farm");
      });

      account.appendChild(addFarm);

      if (localStorage.getItem("farm")) {
        const farm = JSON.parse(localStorage.getItem("farm")!);

        account.appendChild(this.farmTable(farm));
      }
    }
  }

  static async loadTable(ordersDiv: HTMLElement) {
    const table = document.createElement("table");
    this.loadTableHeadings(table);
    this.loadTableData(table);

    ordersDiv.appendChild(table);
  }
  static async loadTableData(table: HTMLTableElement) {
    const orders: IOrders[] = await getUserOrders();

    orders.forEach((order) => {
      const tr = document.createElement("tr");
      const orderId = document.createElement("td");
      const orderDate = document.createElement("td");
      const orderStatus = document.createElement("td");
      const totalPrice = document.createElement("td");

      orderId.innerHTML = order.id;
      orderDate.innerHTML = new Date(order.orderDate).toDateString();
      orderStatus.innerHTML = order.orderStatus;
      totalPrice.innerHTML = order.totalPrice.toString();

      tr.appendChild(orderId);
      tr.appendChild(orderDate);
      tr.appendChild(orderStatus);
      tr.appendChild(totalPrice);

      switch (order.orderStatus) {
        case "pending":
          tr.classList.add("pending");
          break;
        case "delivered":
          tr.classList.add("delivered");
          break;
        case "canceled":
          tr.classList.add("canceled");
          break;
        case "To deliver":
          tr.classList.add("to-deliver");
          break;
        default:
          break;
      }

      tr.addEventListener("click", () => {
        OrderDetails.load(false, order);
      });

      table.appendChild(tr);
    });
  }

  static loadTableHeadings(table: HTMLTableElement) {
    const tableHeadings = [
      "Order Id",
      "Order Date",
      "Order Status",
      "Total Price",
    ];
    const tr = document.createElement("tr");

    tableHeadings.forEach((heading) => {
      const th = document.createElement("th");
      th.innerHTML = heading;
      tr.appendChild(th);
    });

    table.appendChild(tr);
  }

  static farmTable(farm: IFarm[]) {
    const table = document.createElement("table");
    table.appendChild(this.farmTableHeading());

    this.farmTableData(table, farm);

    return table;
  }
  static farmTableHeading() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <th>Farm Name</th>
      <th>Farm address</th>
      <th>Actions</th>
    `;

    return tr;
  }

  static async farmTableData(table: HTMLTableElement, farm: IFarm[]) {
    farm.forEach((farm) => {
      const tr = document.createElement("tr");
      const farmName = document.createElement("td");
      const farmAddress = document.createElement("td");
      const actionWrapper = document.createElement("div");
      const editBtn = document.createElement("button");
      const deleteBtn = document.createElement("button");

      editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square edit" style="color:#4C9EFF"></i>`;
      deleteBtn.innerHTML = `<i class="fa-solid fa-trash delete" style="color:#FF4C4C"></i>`;

      editBtn.addEventListener("click", async () => {
        await AddFarmForm.load("Edit Farm", farm.id);

        localStorage.setItem(
          "farm",
          JSON.stringify(await getAllFarmsByUserId())
        );
      });

      deleteBtn.addEventListener("click", async () => {
        await deleteFarm(farm.id!);

        Toast("Farm deleted successfully", "success");

        table.removeChild(tr);

        localStorage.removeItem("farm");
        localStorage.setItem(
          "farm",
          JSON.stringify(await getAllFarmsByUserId())
        );
      });

      farmName.innerHTML = farm.farmName;
      farmAddress.innerHTML = farm.farmAddress!;

      actionWrapper.appendChild(editBtn);
      actionWrapper.appendChild(deleteBtn);

      tr.appendChild(farmName);
      tr.appendChild(farmAddress);
      tr.appendChild(actionWrapper);

      table.appendChild(tr);
    });
  }
}
