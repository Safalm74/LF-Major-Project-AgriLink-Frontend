import Home from "../pages/home";
import { Header } from "./header";

export class Content {
  static async initiate(): Promise<HTMLElement> {
    const content = document.createElement("main");
    content.classList.add("contents");
    content.id = "content";

    Home.load();

    return content;
  }

  static replaceContent(element: HTMLElement): HTMLElement {
    let content = document.getElementById("content");

    if (!content) {
      this.initiate();

      content = document.getElementById("content");
    }

    content!.classList.add("content");

    content!.innerHTML = "";

    content!.appendChild(element);

    const header = document.getElementsByClassName("header")[0];
    Header.loadImageCarousel(header as HTMLElement);

    window.scrollTo(0, 0);

    return content!;
  }

  static removeContent() {
    const content = document.getElementById("content");
    if (content) {
      content.remove();
    }
  }
}
