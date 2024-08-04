import fetchHtml from "../utils/fetchHtml";
import { Content } from "../sections/content";
import { deleteProduct, getProductByFarmId } from "../api/products";
import { IProduct } from "../interface/product";
import Modal from "../sections/modal";
import AddProductForm from "../components/addProductForm";
import toast from "../components/toast";
import { IFarm } from "../interface/farm";
import { UpdateProductForm } from "../components/updateProductForm";
import { ConfirmDeletePopUp } from "../components/deleteConfirmationPopUp";

export default class Inventory {
  static async init() {
    const inventory = document.createElement("div");
    inventory.classList.add("inventory");
    const inventoryPage = await fetchHtml("pages/inventory.html");

    inventory.innerHTML = inventoryPage;

    return inventory;
  }

  static async load() {
    const inventory = await Inventory.init();
    Content.replaceContent(inventory);

    this.loadContent();

    this.loadEventListener(inventory);

    return inventory;
  }

  static async loadEventListener(inventory: HTMLDivElement) {
    const addProduct = inventory.getElementsByClassName(
      "inventory__add-product"
    )[0];
    const selectFarm = document.getElementsByClassName(
      "select-farm"
    )[0] as HTMLSelectElement;

    addProduct.addEventListener("click", async () => {
      document.body.appendChild(
        Modal.modal(await AddProductForm.load(selectFarm.value), "Add Product")
      );
    });

    selectFarm.addEventListener("change", async () => {
      await this.loadTable(selectFarm.value);
    });
  }

  static async loadContent() {
    const selectFarmDiv = document.getElementsByClassName(
      "inventory__farm-name"
    )[0];
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

    this.loadTable(selectFarm.value);

    selectFarmDiv.appendChild(selectFarm);
  }

  static async loadTable(value: string) {
    let tableData = this.tableHeadings();
    const inventory = document.getElementsByClassName("inventory__table")[0];
    const farmProducts: IProduct[] = (await getProductByFarmId(
      value
    )) as IProduct[];

    inventory.innerHTML = tableData;

    farmProducts.forEach((product) => {
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = this.rowData(product);

      const editBtn = tableRow.getElementsByClassName("edit")[0];
      editBtn.addEventListener("click", async () => {
        await UpdateProductForm.load(product.id);
      });

      const deleteBtn = tableRow.getElementsByClassName("delete")[0];
      deleteBtn.addEventListener("click", () => {
        ConfirmDeletePopUp.confirm(
          "Are you sure you want to delete this product?",
          async (id) => {
            await deleteProduct(id);
            inventory.removeChild(tableRow);

            toast("Product deleted successfully", "success");
          },
          product.id
        );
      });

      inventory.appendChild(tableRow);
    });
  }

  static tableData(product: string | number) {
    let tableData = "";
    tableData += `<td>${product}</td>`;

    return tableData;
  }

  static rowData(product: IProduct) {
    let rowData = "";
    rowData += this.tableData(product.productName);
    rowData += this.tableData(product.price);
    rowData += this.tableData(product.quantity);
    rowData += this.tableData(product.quantityUnit);
    rowData += this.tableData(product.description);
    rowData += this.tableData(product.category);
    rowData += `<td>
    <div>
      <i class="fa-solid fa-pen-to-square edit" style="color:#4C9EFF" ></i>
      <i class="fa-solid fa-trash delete" style="color:#FF4C4C"></i></td>
    </div>`;

    return rowData;
  }

  static tableHeadings() {
    let tableHeadings = "<tr>";
    let headings: string[] = [
      "Product Name",
      "Price",
      "Quantity",
      "Quantity Unit",
      "Description",
      "Category",
      "Actions",
    ];

    headings.forEach((index) => (tableHeadings += `<th>${index}</th>`));

    tableHeadings += "</tr>";

    return tableHeadings;
  }
}
