import { deleteProduct, getAllProducts } from "../api/products";
import Toast from "../components/toast";
import { IProduct } from "../interface/product";
import Router from "../routes";
import { Content } from "../sections/content";

export class ProductManagement {
  static async init() {
    const div = document.createElement("div");
    const table = document.createElement("table");
    const tableRow = document.createElement("tr");
    div.appendChild(table);

    tableRow.innerHTML = `
        <th>Name</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Quantity Unit</th>
        <th>Description</th>
        <th>Actions</th>
    `;

    table.appendChild(tableRow);

    const productData: IProduct[] = await getAllProducts();

    productData.forEach((product) => {
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
        <td>${product.productName}</td>
        <td>${product.price}</td>
        <td>${product.quantity}</td>
        <td>${product.quantityUnit}</td>
        <td>${product.category}</td>`;

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = `<i class="fa-solid fa-trash" style="color:#FF4C4C"></i>`;
      deleteBtn.addEventListener("click", async () => {
        await deleteProduct(product.id!);

        Toast("Product deleted successfully", "success");
        Router.resolve("/product-management");
      });

      tableRow.appendChild(deleteBtn);

      table.appendChild(tableRow);
    });
    return table;
  }

  static async load() {
    const productManagement = document.createElement("div");
    productManagement.classList.add("product-management");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.innerHTML = `
      <h2><span>Product</span> Management</h2>
    `;

    productManagement.appendChild(titleDiv);
    productManagement.appendChild(await this.init());
    Content.replaceContent(productManagement);
  }
}
