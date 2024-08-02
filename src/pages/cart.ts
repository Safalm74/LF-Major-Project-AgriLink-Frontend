import { Icart, ICartToCheckout } from "../interface/cart";
import { Content } from "../sections/content";
import fetchHtml from "../utils/fetchHtml";
import { getProductDetail } from "../api/products";
import { IProduct } from "../interface/product";
import { deleteCart, getCartData, updateCart } from "../api/cart";
import { createOrder } from "../api/orders";

interface IchangeHistory {
  id: string;
  price: number;
  quantity: number;
}

interface ICartWithFarm extends Icart {
  farmId: string;
}

export default class Cart {
  static tempCartChange: Icart[] = [];
  static changeHistory: Icart[] = [];
  static totalAmount = 0;
  static cartData: ICartWithFarm[] = [];

  static async init() {
    const cart = document.createElement("div");
    cart.innerHTML = await fetchHtml("pages/cart.html");
    cart.classList.add("cart");

    return cart;
  }

  static async load() {
    Content.replaceContent(await this.init());

    this.loadContent();

    this.btnListener();
  }

  static async btnListener() {
    const cart = document.getElementsByClassName("cart")[0];
    const checkoutBtn = cart.getElementsByClassName(
      "checkout-btn"
    )[0] as HTMLButtonElement;
    const updateBtn = cart.getElementsByClassName(
      "update-btn"
    )[0] as HTMLButtonElement;

    updateBtn.addEventListener("click", () => {
      this.tempCartChange.forEach(async (data) => {
        await updateCart(data.id, data.quantity);
      });
    });

    checkoutBtn.addEventListener("click", () => {
      this.checkout();
    });
  }

  static async loadContent() {
    const cart = document.getElementsByClassName("cart")[0];
    const cartTable = cart.getElementsByClassName("cart-table")[0];

    cartTable.innerHTML = this.tableHeadings([
      " ",
      "Product Image",
      "Product",
      "Quantity",
      "Price",
      "Total",
    ]);

    const cartData = await getCartData();

    this.totalAmount = (
      await Promise.all(
        cartData!.map(async (data) => {
          const trAndSubTotal = await this.loadTable(data);
          cartTable.appendChild(trAndSubTotal.tr);

          return trAndSubTotal.subTotal;
        })
      )
    ).reduce((a, c) => {
      return a + c;
    });
    this.loadTotalAmount();
  }

  static async loadTotalAmount() {
    const cart = document.getElementsByClassName("cart")[0];
    const totalTable = cart.getElementsByClassName("total-table")[0];
    totalTable.innerHTML = this.tableHeadings([
      "Grand Total",
      `Rs. ${this.totalAmount}`,
    ]);
  }

  static async loadTable(data: Icart) {
    const tr = document.createElement("tr");

    const productDetail: IProduct = await getProductDetail(data.productId);
    const product = document.createElement("td");
    const quantity = document.createElement("input");
    const price = document.createElement("td");
    const total = document.createElement("td");
    const quantityTd = document.createElement("td");
    const removeFromCartTD = document.createElement("td");
    const productImageTD = document.createElement("td");
    const removeFromCartBtn = document.createElement("button");
    const productImageContainer = document.createElement("figure");
    const productImage = document.createElement("img");
    const subTotal = productDetail!.price * data.quantity;

    productImage.src = productDetail!.imageUrl;
    productImage.classList.add("cart__image");

    productImageContainer.classList.add("cart__image-container");
    productImageContainer.appendChild(productImage);
    productImageTD.appendChild(productImageContainer);

    removeFromCartBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    removeFromCartBtn.addEventListener("click", async () => {
      await deleteCart(data.id);
      Cart.load();
    });

    removeFromCartTD.appendChild(removeFromCartBtn);

    quantity.type = "number";
    quantity.value = data.quantity.toString();
    quantity.min = "0";
    quantity.max = productDetail!.quantity.toString();
    quantity.addEventListener("change", async () => {
      const dataBeforeChanged = this.changeHistory.find(
        (change) => change.id === data.id
      );

      const existingCartDataInChange = this.tempCartChange.find(
        (change) => change.id === data.id
      );

      if (existingCartDataInChange) {
        existingCartDataInChange.quantity = +quantity.value;
      } else {
        this.tempCartChange.push({
          id: data.id,
          quantity: +quantity.value,
          productId: data.productId,
        });
      }

      if (!dataBeforeChanged) {
        return;
      }

      this.totalAmount +=
        (+quantity.value - dataBeforeChanged.quantity) * productDetail!.price;

      dataBeforeChanged.quantity = +quantity.value;

      this.loadTotalAmount();
    });
    quantityTd.appendChild(quantity);

    product.innerHTML = productDetail!.productName;
    price.innerHTML = `Rs. ${productDetail!.price}`;
    total.innerHTML = `Rs. ${subTotal}`;

    tr.appendChild(removeFromCartTD);
    tr.appendChild(productImageTD);
    tr.appendChild(product);
    tr.appendChild(quantityTd);
    tr.appendChild(price);
    tr.appendChild(total);

    this.changeHistory.push({
      id: data.id,
      quantity: +quantity.value,
      productId: data.productId,
    });

    this.cartData.push({ farmId: productDetail!.farmId, ...data });

    return { tr, subTotal };
  }

  static tableHeadings(tableHeadings: string[]) {
    let tableHeadingString = "<tr>";

    tableHeadings.forEach((heading) => {
      tableHeadingString += `<th>${heading}</th>`;
    });

    tableHeadingString += "</tr>";

    return tableHeadingString;
  }

  static async checkout() {
    const allCartDataToCheckout: ICartToCheckout[] = [];

    const cartDataByFram = this.groupItemsByFarm();
    console.log(cartDataByFram);

    cartDataByFram.forEach(async (cartItems) => {
      cartItems.forEach(async (data) => {
        const dataToCheckout = {
          customerId: JSON.parse(localStorage.getItem("userDetails")!).id,
          farmId: data.farmId,
          orderItems: [
            {
              productId: data.productId,
              unitPrice: data.quantity,
              quantity: data.quantity,
            },
          ],
        };

        allCartDataToCheckout.push(dataToCheckout);
      });

      allCartDataToCheckout.forEach(async (data) => {
        createOrder(data);
      });
    });
  }
  static groupItemsByFarm() {
    const farms: Record<string, ICartWithFarm[]> = {};

    this.cartData.forEach((item) => {
      if (!farms[item.farmId]) {
        farms[item.farmId] = [];
      }
      farms[item.farmId].push(item);
    });

    return Object.values(farms);
  }
}
