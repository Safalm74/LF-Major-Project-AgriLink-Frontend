import { deleteProduct, getAllProducts } from "../api/products";
import { IProduct } from "../interface/product";
import { Content } from "../sections/content";

export class ProductManagement {
  static async init() {
    const table = document.createElement("table");
    const tableRow = document.createElement("tr");

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
      deleteBtn.innerHTML = `delete`;
      deleteBtn.addEventListener("click", async () => {
        await deleteProduct(product.id!);
      });

      tableRow.appendChild(deleteBtn);

      table.appendChild(tableRow);
    });
    return table;
  }

  static async load() {
    const productManagement = await this.init();
    Content.replaceContent(productManagement);
  }
}
