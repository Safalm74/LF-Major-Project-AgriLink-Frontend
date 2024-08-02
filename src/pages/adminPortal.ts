import { deleteFarm, getAllFarms } from "../api/farm";
import { deleteProduct, getAllProducts } from "../api/products";
import { deleteUser, getAllUser } from "../api/users";
import { IProduct } from "../interface/product";
import { Iuser } from "../interface/user";
import { Content } from "../sections/content";
import fetchHtml from "../utils/fetchHtml";
import ProductDetails from "./productDetails";

export class AdminPortal {
  static state = {
    activePage: "userManagement",
  };
  static async init() {
    const adminPortal = document.createElement("div");
    const adminPortalPage = await fetchHtml("pages/adminPortal.html");

    adminPortal.innerHTML = adminPortalPage;
    return adminPortal;
  }

  static async load() {
    const adminPortal = await this.init();
    Content.replaceContent(adminPortal);

    this.loadContent(adminPortal);
  }

  static async loadContent(adminPortal: HTMLElement) {
    const nav = adminPortal.querySelector(
      ".admin-portal-nav"
    ) as HTMLDivElement;
    const content = adminPortal.querySelector(
      ".admin-portal-content"
    ) as HTMLDivElement;
  }

  static async replaceContent(content: HTMLElement) {
    const adminPortalContent = document.querySelector(
      ".admin-portal-content"
    ) as HTMLElement;

    adminPortalContent.innerHTML = "";

    adminPortalContent.appendChild(content);
  }
}
