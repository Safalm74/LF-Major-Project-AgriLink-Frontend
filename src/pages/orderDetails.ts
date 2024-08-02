import { IOrderItems } from "../interface/orderItems";
import { IOrders } from "../interface/orders";
import { IProduct } from "../interface/product";
import { ICustomer } from "../interface/user";
import { Content } from "../sections/content";
import { getFarmDetailsById } from "../api/farm";
import fetchHtml from "../utils/fetchHtml";
import { getOrderItems } from "../api/orderItems";
import { getProductDetail } from "../api/products";
import { getUserById } from "../api/users";
import { Account } from "./account";
import { updateOrderStatus } from "../api/orders";

export class OrderDetails {
  static async init() {
    const orderDetails = document.createElement("div");
    orderDetails.classList.add("order-details");
    orderDetails.innerHTML = await fetchHtml("pages/orderDetails.html");

    return orderDetails;
  }

  static async load(isFarmOrder: boolean, order: IOrders) {
    const orderDetails = await this.init();
    Content.replaceContent(orderDetails);

    const orderItemsTable = orderDetails.getElementsByClassName(
      "order-details__table"
    )[0] as HTMLTableElement;

    this.loadStatus(order.orderStatus, order, isFarmOrder);

    isFarmOrder
      ? this.loadCustomerDetails(order.customerId)
      : this.loadFarmDetails(order.farmId);

    this.loadTable(orderItemsTable, order.id);
  }

  static loadStatus(status: string, order: IOrders, isFarmOrder: boolean) {
    const statusDiv = document.getElementsByClassName(
      "order-details__status"
    )[0] as HTMLElement;

    statusDiv.innerHTML = `Status:  ${status}`;

    if (status === "delivered" || status === "cancled") {
      return;
    }

    const cancleBtn = document.createElement("button");
    cancleBtn.classList.add("order-details__cancle-btn");
    cancleBtn.innerHTML = "Cancle";
    cancleBtn.addEventListener("click", async () => {
      await this.cancleOrder(order.id);
      await Account.load();
    });

    statusDiv.appendChild(cancleBtn);

    if (!isFarmOrder) {
      return;
    }

    if (status === "pending") {
      const acceptBtn = document.createElement("button");
      acceptBtn.classList.add("order-details__accept-btn");
      acceptBtn.innerHTML = "Accept";
      acceptBtn.addEventListener("click", async () => {
        updateOrderStatus(order.id, "To deliver");
      });

      statusDiv.appendChild(acceptBtn);
    }

    if (status === "To deliver") {
      const deliverBtn = document.createElement("button");
      deliverBtn.classList.add("order-details__deliver-btn");
      deliverBtn.innerHTML = "Delivered";
      deliverBtn.addEventListener("click", async () => {
        updateOrderStatus(order.id, "delivered");
      });

      statusDiv.appendChild(deliverBtn);
    }
  }
  static async cancleOrder(orderId: string) {
    updateOrderStatus(orderId, "cancled");
  }

  static loadTable(table: HTMLTableElement, orderId: string) {
    this.loadTableHeadings(table);
    this.loadtabledata(table, orderId);
  }

  static async loadCustomerDetails(customerId: string) {
    const customerDiv = document.getElementsByClassName(
      "order-details__customer"
    )[0] as HTMLElement;

    const customerDetails: ICustomer = (await getUserById(customerId))[0];

    customerDiv.innerHTML = `
        <h3>Customer</h3>
        <p>Name: ${customerDetails.firstName} ${customerDetails.lastName}</p>
        <p>Address: ${customerDetails.address}</p>
        <p>Email: ${customerDetails.email}</p>
        <p>Phone: ${customerDetails.phone}</p>
    `;
  }

  static async loadFarmDetails(farmId: string) {
    const farmDiv = document.getElementsByClassName(
      "order-details__farm"
    )[0] as HTMLElement;

    const farmDetails = await getFarmDetailsById(farmId);

    const farm = document.createElement("p");

    farm.innerHTML = `
        <h3>Farm: ${farmDetails.farmName}</h3> 
        <p>Address: ${farmDetails.farmAddress}</p>
    `;
    farmDiv.appendChild(farm);
  }

  static async loadtabledata(table: HTMLTableElement, orderId: string) {
    const orderItems: IOrderItems[] = await getOrderItems(orderId);

    orderItems.forEach(async (orderItem) => {
      const tr = document.createElement("tr");
      const productDetails: IProduct = await getProductDetail(
        orderItem.productId
      );
      tr.innerHTML = `
        <td>${productDetails.productName}</td>
        <td>${productDetails.price}</td>
        <td>${orderItem.quantity}</td>
        <td>${productDetails.quantityUnit}</td>
        `;
      table.appendChild(tr);
    });
  }

  static loadTableHeadings(table: HTMLTableElement) {
    const tableHeadings = [
      "Product Name",
      "Price",
      "Quantity",
      "Quantity Unit",
    ];

    const tr = document.createElement("tr");
    tableHeadings.forEach((heading) => {
      const tableHeading = document.createElement("th");
      tableHeading.innerHTML = heading;

      tr.appendChild(tableHeading);
    });

    table.appendChild(tr);
  }
}
