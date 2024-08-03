import Modal from "../sections/modal";
import fetchHtml from "../utils/fetchHtml";
import toast from "./toast";
import { IProduct } from "../interface/product";
import Inventory from "../pages/inventory";
import { createProduct } from "../api/products";
import { uploadImage } from "../api/minio";
import { errorHandler } from "../utils/errorHandler";
import { AxiosError } from "axios";

export default class AddProductForm {
  static async init() {
    const addProductForm = document.createElement("div");
    addProductForm.classList.add("add-product-form");
    addProductForm.innerHTML = await fetchHtml("components/addProductForm");
    return addProductForm;
  }

  static async load(farmId: string) {
    const addProductForm = await AddProductForm.init();
    Modal.modal(addProductForm);

    this.loadEventListener(addProductForm, farmId);

    return addProductForm;
  }

  static async handleNewSubmit(form: HTMLFormElement, farmId: string) {
    const formData = new FormData(form);
    const productImage = form.getElementsByClassName(
      "product-image"
    )[0] as HTMLInputElement;
    const productName = formData.get("product-name") as string;
    const price = formData.get("price") as string;
    const quantity = formData.get("quantity") as string;
    const quantityUnit = formData.get("quantity-unit") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;

    const image = productImage.files![0];

    if (!image) {
      toast("Please select an image", "error");
      return;
    }

    try {
      const fileName = await uploadImage(image);

      if (fileName) {
        const productToUpload: Omit<IProduct, "id"> = {
          farmId: farmId,
          productName: productName,
          price: +price,
          quantity: +quantity,
          quantityUnit: quantityUnit,
          description: description,
          category: category,
          imageUrl: fileName,
        };

        await createProduct(productToUpload);

        Modal.removeModal();

        toast("Product added successfully", "success");

        Inventory.load();
      }
    } catch (error) {
      errorHandler((error as AxiosError).response!);
    }
  }

  static async loadEventListener(addProductForm: HTMLElement, farmId: string) {
    addProductForm
      .getElementsByClassName("submit-btn")[0]
      .addEventListener("click", (e) => {
        e.preventDefault();

        this.handleNewSubmit(
          addProductForm.getElementsByTagName("form")[0],
          farmId
        );
      });
  }
}
