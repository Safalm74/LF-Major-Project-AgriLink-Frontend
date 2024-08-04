import toast from "../components/toast";
import { IFarm } from "../interface/farm";
import { IOrderForFarm } from "../interface/orders";
import { Content } from "../sections/content";
import fetchHtml from "../utils/fetchHtml";
import { getFarmOrders } from "../api/orders";
import { OrderDetails } from "./orderDetails";

export default class OrderManagement {
  static async init() {
    const orderManagement = document.createElement("div");
    orderManagement.classList.add("order-management");
    orderManagement.innerHTML = await fetchHtml("pages/orderManagement.html");

    return orderManagement;
  }

  static async load() {
    const orderManagement = await OrderManagement.init();
    Content.replaceContent(orderManagement);

    this.loadContent(orderManagement);
  }

  static loadContent(orderManagement: HTMLElement) {
    const order = orderManagement.querySelector(
      ".order-management__orders"
    ) as HTMLElement;

    const selectFarmDiv = document.getElementsByClassName(
      "order-management__farm"
    )[0];
    const farmNameSpan = document.createElement("span");
    farmNameSpan.innerHTML = "Select Farm";
    farmNameSpan.style.fontWeight = "bold";
    selectFarmDiv.appendChild(farmNameSpan);
    const selectFarm = document.createElement("select");
    const farmDetails = localStorage.getItem("farm");

    selectFarm.classList.add("select-farm");

    if (!farmDetails) {
      toast("No farm found", "warn");
      return;
    }

    const farm: IFarm[] = JSON.parse(farmDetails);

    farm.forEach((farm) => {
      const option = document.createElement("option");
      option.value = farm.id;
      option.text = farm.farmName;
      selectFarm.appendChild(option);
    });

    const orderManagementTable = order.getElementsByClassName(
      "order-management__table"
    )[0] as HTMLTableElement;

    this.loadTable(orderManagementTable, farm[0].id);

    selectFarmDiv.appendChild(selectFarm);
  }

  static loadTable(table: HTMLTableElement, farmId: string) {
    this.loadTableHeadings(table);
    this.loadTableData(table, farmId);
  }

  static async loadTableData(table: HTMLTableElement, farmId: string) {
    const orderData: IOrderForFarm[] = await getFarmOrders(farmId);

    orderData.forEach((order) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${order.id}</td>
        <td>${order.orderStatus}</td>
        <td>${new Date(order.orderDate).toDateString()}</td>
        <td>${order.totalPrice}</td>
        <td>${order.customerName}</td>`;

      tr.addEventListener("click", () => {
        OrderDetails.load(true, order);
      });

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
      table.appendChild(tr);
    });
  }

  static loadTableHeadings(table: HTMLTableElement) {
    const tableHeadings = [
      "Order Id",
      "Order Status",
      "Order Date",
      "Total Price",
      "Customer",
    ];
    const tr = document.createElement("tr");
    tableHeadings.forEach((heading) => {
      const th = document.createElement("th");
      th.innerHTML = heading;
      tr.appendChild(th);
    });
    table.appendChild(tr);
  }
}
