import Inventory from "../pages/inventory";
import Modal from "../sections/modal";
import fetchHtml from "../utils/fetchHtml";
import toast from "./toast";
import { IProduct } from "../interface/product";
import { getProductDetail, updateProduct } from "../api/products";
import { uploadImage } from "../api/minio";

export class UpdateProductForm {
  static async init() {
    const updateProductForm = document.createElement("div");
    updateProductForm.classList.add("update-product-form");
    updateProductForm.innerHTML = await fetchHtml(
      "components/updateProductForm"
    );
    return updateProductForm;
  }

  static async load(productId: string) {
    const updateProductForm = await UpdateProductForm.init();
    Modal.modal(updateProductForm);

    this.loadEventListener(updateProductForm, productId);
    this.loadProductDetails(updateProductForm, productId);
  }

  static async loadProductDetails(form: HTMLElement, productId: string) {
    const productDetails: IProduct = await getProductDetail(productId);

    (
      form.getElementsByClassName("product-name-input")[0] as HTMLInputElement
    ).value = productDetails.productName;

    (form.getElementsByClassName("price-input")[0] as HTMLInputElement).value =
      productDetails.price.toString();

    (
      form.getElementsByClassName("quantity-input")[0] as HTMLInputElement
    ).value = productDetails.quantity.toString();

    (
      form.getElementsByClassName("quantity-unit-input")[0] as HTMLInputElement
    ).value = productDetails.quantityUnit;

    (
      form.getElementsByClassName("description-input")[0] as HTMLInputElement
    ).value = productDetails.description;

    (
      form.getElementsByClassName("category-input")[0] as HTMLInputElement
    ).value = productDetails.category;
  }

  static async loadEventListener(ProductForm: HTMLElement, productId: string) {
    ProductForm.getElementsByClassName("submit-btn")[0].addEventListener(
      "click",
      async (e) => {
        e.preventDefault();

        this.handleUpdateSubmit(
          ProductForm.getElementsByTagName("form")[0],
          productId
        );

        Modal.removeModal();

        toast("Product added successfully", "success");

        await Inventory.load();
      }
    );
  }

  static async handleUpdateSubmit(form: HTMLFormElement, productId: string) {
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

    if (!productImage) {
      toast("Please select an image", "error");
      return;
    }

    const image = productImage.files![0];

    try {
      const fileName = await uploadImage(image);

      if (fileName) {
        const productToUpload: Omit<IProduct, "id" | "farmId"> = {
          productName: productName,
          price: +price,
          quantity: +quantity,
          quantityUnit: quantityUnit,
          description: description,
          category: category,
          imageUrl: fileName,
        };

        updateProduct(productId, productToUpload);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
