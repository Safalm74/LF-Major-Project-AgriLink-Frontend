import fetchHtml from "../utils/fetchHtml";

export default class Card {
  static async init() {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardHtml = await fetchHtml("components/card.html");

    card.innerHTML = cardHtml;

    return card;
  }
}
