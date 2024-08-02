import Card from "../components/card";
import { backendServerURL } from "../constants";
import { IProduct } from "../interface/product";
import { Content } from "../sections/content";
import fetchHtml from "../utils/fetchHtml";
import { getAllProducts } from "../api/products";
import ProductDetails from "./productDetails";
import { debounce } from "../utils/debounce";

export default class Home {
  static endPoint = backendServerURL + "/product";
  static async init() {
    const home = document.createElement("div");
    const homePage = await fetchHtml("pages/home.html");

    home.innerHTML = homePage;
    home.classList.add("home");

    return home;
  }

  static async load() {
    const home = await Home.init();
    if (home) {
      Content.replaceContent(home);

      const ourProductsDiv = document.createElement("div");
      ourProductsDiv.classList.add("our-products");
      ourProductsDiv.innerHTML = `
        <h2><span>Our</span> Products</h2>
      `;

      home.appendChild(ourProductsDiv);

      this.loadContent();
    }
  }

  static async searchChangeEvent(products: HTMLElement) {
    const search = document.querySelector(".search-bar") as HTMLInputElement;
    const searchDelay = 500;

    const handleSearchInput = debounce(async () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });

      const searchValue = search.value;
      if (searchValue) {
        const filteredCardData = await getAllProducts(searchValue);

        this.loadProducts(products, filteredCardData);
      } else {
        const cardData: IProduct[] = await getAllProducts();

        this.loadProducts(products, cardData);
      }
    }, searchDelay);

    search.addEventListener("input", handleSearchInput);
  }

  static async loadContent() {
    const home = document.querySelector(".home");
    const products = document.createElement("div");
    products.classList.add("products");

    if (home) {
      const cardData: IProduct[] = await getAllProducts();

      this.loadProducts(products, cardData);

      this.searchChangeEvent(products);

      home.appendChild(products);
    }
  }
  static async loadProducts(products: HTMLElement, cardData: IProduct[]) {
    products.innerHTML = "";
    if (cardData.length < 1) {
      products.innerHTML = "No products found";
      return;
    }

    cardData.forEach(async (cardInstant) => {
      const card = await Card.init();
      const imageContainer = card.getElementsByClassName(
        "card__image-container"
      )[0];
      const productName = card.getElementsByClassName("card__title")[0];
      const productCategory =
        card.getElementsByClassName("card__description")[0];
      const productPrice = card.getElementsByClassName("card__price")[0];
      const productImage = document.createElement("img");

      productImage.src = cardInstant.imageUrl;
      productImage.classList.add("card__image");

      imageContainer.innerHTML = "";
      imageContainer.appendChild(productImage);
      productName.innerHTML = cardInstant.productName;
      productCategory.innerHTML = cardInstant.category;
      productPrice.innerHTML = `Rs. ${cardInstant.price} per ${cardInstant.quantityUnit}`;
      if (cardInstant.quantity < 1) {
        const outOfStock = document.createElement("img");
        outOfStock.src = "../../public/images/outOfStock.png";
        outOfStock.classList.add("out-of-stock");
        outOfStock.style.width = "100%";
        outOfStock.style.position = "absolute";
        outOfStock.style.top = "50%";
        outOfStock.style.transform = "translateY(-50%)";
        card.appendChild(outOfStock);
      }

      card.addEventListener("click", () => {
        ProductDetails.load(cardInstant.id);
      });
      products.appendChild(card);
    });
  }
}
