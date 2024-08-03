import { Content } from "../sections/content";
import fetchHtml from "../utils/fetchHtml";
import { getProductDetail } from "../api/products";
import { addToCart } from "../api/cart";
import Toast from "../components/toast";

export default class ProductDetails {
  static async init() {
    window.history.pushState(null, "", "/product-details");
    const content = document.createElement("div");
    content.classList.add("product-details");
    content.innerHTML = await fetchHtml("pages/productDetails");

    return content;
  }

  static async load(productId: string) {
    const productDetails = await ProductDetails.init();
    Content.replaceContent(productDetails);

    if (!productDetails) {
      return;
    }

    this.loadContent(productId);

    return;
  }

  static async loadContent(productId: string) {
    const productDetails =
      document.getElementsByClassName("product-details")[0];

    if (!productDetails) {
      return;
    }

    const productData = await getProductDetail(productId);

    if (!productData) {
      return;
    }

    const productName = productDetails.getElementsByClassName(
      "product-details__product-name"
    )[0];
    const productPrice = productDetails.getElementsByClassName(
      "product-details__product-price"
    )[0];
    const productImageContainer = productDetails.getElementsByClassName(
      "product-details__image-container"
    )[0];
    const productImage = document.createElement("img");
    const productQuantity = productDetails.getElementsByClassName(
      "product-details__product-quantity"
    )[0] as HTMLInputElement;
    const productDescription = productDetails.getElementsByClassName(
      "product-details__product-description"
    )[0];
    const productUnit = productDetails.getElementsByClassName(
      "product-details__product-unit"
    )[0];

    const addToCartBtn = productDetails.getElementsByClassName(
      "product-details__add-to-cart-btn"
    )[0] as HTMLButtonElement;

    addToCartBtn.addEventListener("click", async () => {
      if (!localStorage.getItem("userDetails")) {
        Toast("Please login to add product to cart", "error");
        return;
      }
      if (productData.quantity < 1) {
        Toast("Product out of stock", "error");
        return;
      }

      await addToCart(productId, +productQuantity.value);
      Toast("Product added to cart", "success");
    });

    productImage.src = productData.imageUrl;
    productImage.classList.add("product-details__image");
    productImageContainer.innerHTML = "";
    productImageContainer.appendChild(productImage);
    productName.innerHTML = productData.productName;
    productPrice.innerHTML = `Rs. ${productData.price}`;
    productQuantity.max = `${productData.quantity}`;
    productDescription.innerHTML = productData.description;
    productUnit.innerHTML = productData.quantityUnit;
  }
}
