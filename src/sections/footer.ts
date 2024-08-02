import fetchHtml from "../utils/fetchHtml";

export class Footer {
  static async init() {
    const footer = document.createElement("footer");
    footer.classList.add("footer");

    const footerHtml = await fetchHtml("sections/footer.html");

    footer.innerHTML = footerHtml;

    return footer;
  }
  static footer() {
    this.init();
  }
}
