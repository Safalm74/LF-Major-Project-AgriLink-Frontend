import { nav } from "../components/nav";

export class Header {
  static header() {
    const header = document.createElement("header");
    header.classList.add("header");

    const imageCarouselTextWrapper = document.createElement("div");
    const imageCarouselText = document.createElement("div");
    imageCarouselTextWrapper.classList.add("carousel-text");
    imageCarouselText.innerHTML = `
      <p>FRESH AND ORGANIC</p>
      <h1>Seasonal Fruits and Vegetables</h1>
      `;

    imageCarouselTextWrapper.appendChild(imageCarouselText);

    const imageCarousel1 = document.createElement("div");
    imageCarousel1.classList.add("carousel-slide");
    imageCarousel1.classList.add("slide1");

    const imageCarousel2 = document.createElement("div");
    imageCarousel2.classList.add("carousel-slide");
    imageCarousel2.classList.add("slide2");

    const imageCarousel3 = document.createElement("div");
    imageCarousel3.classList.add("carousel-slide");
    imageCarousel3.classList.add("slide3");
    header.append(imageCarousel1, imageCarousel2, imageCarousel3);

    header.appendChild(nav());

    header.appendChild(imageCarouselTextWrapper);

    return header;
  }

  static loadImageCarousel(header: HTMLElement) {
    const nav = document.querySelector(".nav")!;
    const imageCarousel1 = document.querySelector(".slide1")!;
    const imageCarousel2 = document.querySelector(".slide2")!;
    const imageCarousel3 = document.querySelector(".slide3")!;
    const imageCarouselText = document.querySelector(".carousel-text")!;

    if (window.location.pathname === "/") {
      window.location.pathname = "/home";
    }

    if (window.location.pathname === "/home") {
      header.style.minHeight = "100vh";
      imageCarousel1.classList.remove("display-none");
      imageCarousel2.classList.remove("display-none");
      imageCarousel3.classList.remove("display-none");
      imageCarouselText.classList.remove("display-none");

      nav.classList.remove("nav--sticky");
    } else {
      header.style.minHeight = "auto";
      imageCarousel1.classList.add("display-none");
      imageCarousel2.classList.add("display-none");
      imageCarousel3.classList.add("display-none");
      imageCarouselText.classList.add("display-none");

      nav.classList.add("nav--sticky");
    }
  }
}
