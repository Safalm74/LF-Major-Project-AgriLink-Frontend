import { Content } from "../sections/content";
import fetchHtml from "../utils/fetchHtml";
import { getProductDetail } from "../api/products";
import { addToCart } from "../api/cart";

export default class ProductDetails {
  static async init() {
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
    const productRating = productDetails.getElementsByClassName(
      "product-details__product-rating"
    )[0];
    const productUnit = productDetails.getElementsByClassName(
      "product-details__product-unit"
    )[0];

    const addToCartBtn = productDetails.getElementsByClassName(
      "product-details__add-to-cart-btn"
    )[0];

    addToCartBtn.addEventListener("click", async () => {
      await addToCart(productId, +productQuantity.value);
    });

    productImage.src = productData.imageUrl;
    productImage.classList.add("product-details__image");
    productImageContainer.innerHTML = "";
    productImageContainer.appendChild(productImage);
    productName.innerHTML = productData.productName;
    productPrice.innerHTML = `Rs. ${productData.price}`;
    productQuantity.max = `${productData.quantity}`;
    productDescription.innerHTML = productData.description;
    productRating.innerHTML = "4.5";
    productUnit.innerHTML = productData.quantityUnit;
  }
}
