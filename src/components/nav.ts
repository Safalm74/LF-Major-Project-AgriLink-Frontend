import listBtns from "./listBtns";
import logo from "../../public/images/logo/logo.png";
import Modal from "../sections/modal";
import logInForm from "./logInForm";
import getInitials from "../utils/getInitials";
import Router from "../routes";

function isLoggedIn() {
  const accessToken = localStorage.getItem("accessToken");
  const userDetails = localStorage.getItem("userDetails");
  if (accessToken && userDetails) {
    return true;
  }
  return false;
}

export function refreshNav() {
  const existingNav = document.querySelector(".nav");
  if (existingNav && existingNav.parentNode) {
    existingNav.parentNode.replaceChild(nav(), existingNav);
  }
}

export function nav(): HTMLElement {
  const userDetails = JSON.parse(localStorage.getItem("userDetails")!);
  const nav = document.createElement("nav");
  nav.classList.add("nav");

  const navLogo = new Image();
  navLogo.src = logo;
  navLogo.classList.add("nav__logo");

  const logoWrapper = document.createElement("figure");
  logoWrapper.classList.add("nav__logo-wrapper");

  logoWrapper.appendChild(navLogo);

  const navBtns = listBtns([
    {
      btnName: "Home",
      btnClass: "btn",
      btnFunction: async () => {
        await Router.resolve("/home");
      },
    },
    {
      btnName: "About",
      btnClass: "btn",
      btnFunction: async () => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      },
    },
    {
      btnName: "Inventory",
      btnClass: localStorage.getItem("farm") ? "nav__btns" : "display-none",
      btnFunction: async () => {
        await Router.resolve("/inventory");
      },
    },
    {
      btnName: "Order Management",
      btnClass: localStorage.getItem("farm") ? "nav__btns" : "display-none",
      btnFunction: async () => {
        await Router.resolve("/order-management");
      },
    },
  ]);

  const searchBar = document.createElement("input");
  searchBar.classList.add("search-bar");
  searchBar.type = "search";
  searchBar.placeholder = "Product search...";

  let accountBtns;

  if (isLoggedIn()) {
    accountBtns = listBtns([
      {
        btnName: `<i class="fa-solid fa-cart-shopping"></i>`,
        btnClass: userDetails?.role !== "admin" ? "cart-btn" : "display-none",
        btnFunction: async () => {
          window.history.pushState(null, "", "/cart");
          await Router.resolve("/cart");
        },
      },
      {
        btnName: getInitials(
          JSON.parse(localStorage.getItem("userDetails")!).name
        ),
        btnClass: "account-btn",
        btnFunction: async () => {
          window.history.pushState(null, "", "/account");
          await Router.resolve("/account");
          refreshNav();
        },
      },
    ]);
  } else {
    accountBtns = listBtns([
      {
        btnName: "Login",
        btnClass: "btn",
        btnFunction: () => {
          document.body.appendChild(Modal.modal(logInForm(), "Login"));
          refreshNav();
        },
      },
    ]);
  }

  const userManagementBtn = document.createElement("button");
  const farmManagementBtn = document.createElement("button");
  const productManagementBtn = document.createElement("button");

  userManagementBtn.innerHTML = "User Management";
  farmManagementBtn.innerHTML = "Farm Management";
  productManagementBtn.innerHTML = "Product Management";

  userManagementBtn?.addEventListener("click", async () => {
    Router.resolve("/user-management");
  });

  farmManagementBtn?.addEventListener("click", async () => {
    Router.resolve("/farm-management");
  });

  productManagementBtn?.addEventListener("click", async () => {
    Router.resolve("/product-management");
  });

  nav.appendChild(logoWrapper);
  if (userDetails?.role !== "admin") {
    nav.appendChild(navBtns);
    nav.appendChild(searchBar);
  } else {
    nav.appendChild(userManagementBtn);
    nav.appendChild(farmManagementBtn);
    nav.appendChild(productManagementBtn);
  }

  nav.appendChild(accountBtns);

  return nav;
}
