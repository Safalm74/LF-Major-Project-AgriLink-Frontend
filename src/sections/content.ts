import { userManagement } from "../pages/UserManagement";
import Router from "../routes";
import { Header } from "./header";

export class Content {
  static async initiate(): Promise<HTMLElement> {
    const content = document.createElement("main");
    content.classList.add("contents");
    content.id = "content";

    const userDetails = JSON.parse(localStorage.getItem("userDetails")!);

    if (!userDetails) {
      Router.resolve("/home");

      return content;
    }

    if (userDetails.role === "admin") {
      content.appendChild(await userManagement.init());
    } else {
      Router.resolve("/home");
    }

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    return content!;
  }

  static removeContent() {
    const content = document.getElementById("content");
    if (content) {
      content.remove();
    }
  }
}
