import { ICart, ICartToCheckout } from "../interface/cart";
import { Content } from "../sections/content";
import fetchHtml from "../utils/fetchHtml";
import { getProductDetail } from "../api/products";
import { deleteCart, getCartData, updateCart } from "../api/cart";
import { createOrder } from "../api/orders";
import { Account } from "./account";
import Toast from "../components/toast";

interface ICartWithFarm extends ICart {
  farmId?: string;
  price?: number;
  productImage?: string;
  productName?: string;
  productMaxQuantity?: number;
}

export default class Cart {
  static cartItems: ICartWithFarm[] = [];
  static tempChangeInCartItems: ICartWithFarm[] = [];

  static async init() {
    const cart = document.createElement("div");
    cart.innerHTML = await fetchHtml("pages/cart.html");
    cart.classList.add("cart");

    return cart;
  }

  static async load() {
    const cart = await this.init();
    Content.replaceContent(cart);

    await this.getCartItems();

    if (this.cartItems.length === 0) {
      cart.innerHTML = "";
      const p = document.createElement("h1");
      p.innerHTML = "Cart is empty";
      p.classList.add("empty-cart");
      cart.appendChild(p);
    } else {
      this.loadTotalAmount();

      this.loadTableContent();

      this.btnListener();
    }
  }

  static async getCartItems() {
    this.tempChangeInCartItems = [];
    this.cartItems = await getCartData();

    await Promise.all(
      this.cartItems.map(async (data) => {
        const product = await getProductDetail(data.productId);
        data.price = product.price;
        data.farmId = product.farmId;
        data.productImage = product.imageUrl;
        data.productName = product.productName;
        data.productMaxQuantity = product.quantity;

        return data;
      })
    );

    return this.cartItems;
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
      this.tempChangeInCartItems.forEach(async (data) => {
        await updateCart(data.id, data.quantity);

        this.load();
      });
    });

    checkoutBtn.addEventListener("click", async () => {
      await this.checkout();
    });
  }

  static async loadTableContent() {
    const cart = document.getElementsByClassName("cart")[0];
    const cartTable = cart.getElementsByClassName("cart-table")[0];

    cartTable.innerHTML = this.tableHeadings([
      "Actions",
      "Product Image",
      "Product",
      "Quantity",
      "Price",
      "Total",
    ]);

    this.cartItems.forEach((data) => {
      const tempChangeInCartItem = this.tempChangeInCartItems.find(
        (tempCartItem) => tempCartItem.id === data.id
      );
      cartTable.appendChild(this.loadTable(tempChangeInCartItem || data));
    });
  }

  static async loadTotalAmount() {
    const cart = document.getElementsByClassName("cart")[0];
    const totalTable = cart.getElementsByClassName("total-table")[0];

    let total = 0;
    this.cartItems.forEach((data) => {
      //checking if there is a change in cart items
      const tempChangeInCartItem = this.tempChangeInCartItems.find(
        (tempCartItem) => tempCartItem.id === data.id
      );

      //if there is a change in cart items, adding total by the total change
      if (tempChangeInCartItem) {
        total += tempChangeInCartItem.quantity * +tempChangeInCartItem.price!;
      } else {
        total += data.quantity * +data.price!;
      }

      return total;
    });

    totalTable.innerHTML = this.tableHeadings(["Grand Total", `Rs. ${total}`]);
  }

  static loadTable(data: ICartWithFarm) {
    const tr = document.createElement("tr");
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
    const subTotal = data.price! * data.quantity;

    productImage.src = data.productImage!;
    productImage.classList.add("cart__image");

    productImageContainer.classList.add("cart__image-container");
    productImageContainer.appendChild(productImage);
    productImageTD.appendChild(productImageContainer);

    removeFromCartBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    removeFromCartBtn.addEventListener("click", async () => {
      await deleteCart(data.id);

      Toast("Item removed from cart", "success");
      this.load();
    });

    removeFromCartTD.appendChild(removeFromCartBtn);

    quantity.type = "number";
    quantity.value = data.quantity.toString();
    quantity.min = "0";
    quantity.max = data.productMaxQuantity!.toString();
    quantity.addEventListener("change", () => {
      this.quantityChangeEventListener(data, quantity);
      this.loadTableContent();
    });

    quantityTd.appendChild(quantity);

    product.innerHTML = data.productName!;
    price.innerHTML = `Rs. ${data.price}`;
    total.innerHTML = `Rs. ${subTotal}`;

    tr.appendChild(removeFromCartTD);
    tr.appendChild(productImageTD);
    tr.appendChild(product);
    tr.appendChild(quantityTd);
    tr.appendChild(price);
    tr.appendChild(total);

    return tr;
  }
  static async quantityChangeEventListener(
    data: ICart,
    quantity: HTMLInputElement
  ) {
    //checking if there was already change in cart item
    const existingCartInTempChange = this.tempChangeInCartItems.find(
      (tempCartItem) => tempCartItem.id === data.id
    );

    if (existingCartInTempChange) {
      //if cart item exists, updating quantity else adding cart item to temp change
      existingCartInTempChange.quantity = +quantity.value;
    } else {
      this.tempChangeInCartItems.push(data);
    }
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
    const cartDataByFarm = this.groupItemsByFarm();

    cartDataByFarm.forEach(async (cartItems) => {
      cartItems.forEach(async (data) => {
        const dataToCheckout: ICartToCheckout = {
          customerId: JSON.parse(localStorage.getItem("userDetails")!).id,
          farmId: data.farmId!,
          orderItems: [
            {
              productId: data.productId,
              unitPrice: data.price!,
              quantity: data.quantity,
            },
          ],
        };

        allCartDataToCheckout.push(dataToCheckout);
      });

      await Promise.all(
        allCartDataToCheckout.map(async (data) => {
          return await createOrder(data);
        })
      );

      this.cartItems = [];

      Toast("Order placed successfully", "success");
      Account.load();
    });
  }

  static groupItemsByFarm() {
    const farms: Record<string, ICartWithFarm[]> = {};

    this.cartItems.forEach((item) => {
      if (item.farmId) {
        if (!farms[item.farmId!]) {
          farms[item.farmId!] = [];
        }

        farms[item.farmId!].push(item);
      }
    });

    return Object.values(farms);
  }
}
