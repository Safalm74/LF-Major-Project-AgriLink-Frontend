import Home from "./pages/home";
import Inventory from "./pages/inventory";
import Cart from "./pages/cart";
import { Account } from "./pages/account";
import OrderManagement from "./pages/orderManagement";
import { IRoute } from "./interface/route";

const routes: IRoute[] = [
  {
    path: "/home",
    action: async () => {
      await Home.load();
      return;
    },
  },
  {
    path: "/inventory",
    action: async () => {
      await Inventory.load();
    },
  },
  {
    path: "/cart",
    action: async () => {
      await Cart.load();
    },
  },
  {
    path: "/account",
    action: async () => {
      await Account.load();
    },
  },
  {
    path: "/order-management",
    action: async () => {
      await OrderManagement.load();
    },
  },
];

export default class Router {
  static async resolve(path: string) {
    const route = routes.find((r) => r.path === path);

    if (!route) {
      window.history.pushState(null, "", "/");
      await Home.load();

      return;
    }

    window.history.pushState(null, "", path);
    route?.action();
  }

  static onHashChange() {
    const path = window.location.hash;
    this.resolve(path);
  }
}
