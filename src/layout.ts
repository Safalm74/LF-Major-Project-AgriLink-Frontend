import { Header } from "./sections/header";
import { Footer } from "./sections/footer";
import { Content } from "./sections/content";
const app = document.querySelector<HTMLDivElement>("#app");

export class Layout {
  static async layout() {
    if (app) {
      app.appendChild(Header.header());
      app.appendChild(await Content.initiate());
      app.appendChild(await Footer.init());
    }
  }
}
