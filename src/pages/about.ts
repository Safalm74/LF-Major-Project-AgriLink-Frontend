import { Content } from "../sections/content";
import fetchHtml from "../utils/fetchHtml";

export class About {
  static async init() {
    const content = document.createElement("div");
    content.innerHTML = await fetchHtml("pages/about");
    content.classList.add("about");

    return content;
  }

  static async load() {
    const about = await About.init();
    Content.replaceContent(about);

    return about;
  }
}
