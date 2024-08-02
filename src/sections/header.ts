import { nav } from "../components/nav";

export class Header {
  static header() {
    const header = document.createElement("header");
    header.classList.add("header");

    this.loadNavEventListener();

    header.appendChild(nav());

    return header;
  }

  static loadImageCarousel(header: HTMLElement) {
    const nav = document.querySelector(".nav")!;
    if (window.location.pathname === "/") {
      const imageCarouselTextWrapper = document.createElement("div");
      const imageCarouselText = document.createElement("div");
      imageCarouselTextWrapper.classList.add("carousel-text");
      imageCarouselText.innerHTML = `
        <p>FRESH AND ORGANIC</p>
        <h1>Seasonal Fruits and Vegetables</h1>
        `;

      imageCarouselTextWrapper.appendChild(imageCarouselText);

      header.appendChild(imageCarouselTextWrapper);

      const imageCarousel1 = document.createElement("div");
      imageCarousel1.classList.add("carousel-slide");
      imageCarousel1.classList.add("slide1");

      const imageCarousel2 = document.createElement("div");
      imageCarousel2.classList.add("carousel-slide");
      imageCarousel2.classList.add("slide2");

      const imageCarousel3 = document.createElement("div");
      imageCarousel3.classList.add("carousel-slide");
      imageCarousel3.classList.add("slide3");

      header.style.minHeight = "100vh";

      header.append(imageCarousel1, imageCarousel2, imageCarousel3);

      nav.classList.remove("nav--sticky");
    } else {
      header.style.minHeight = "auto";
      Array.from(document.getElementsByClassName("carousel-slide")).forEach(
        (element) => element?.remove()
      );

      document.getElementsByClassName("carousel-text")[0]?.remove();

      nav.classList.add("nav--sticky");
    }
  }

  static loadNavEventListener() {
    window.addEventListener("scroll", function () {
      const nav = document.querySelector(".nav")!;
      if (window.scrollY > 0) {
        nav.classList.add("nav--sticky");
      } else {
        if (window.location.pathname === "/") {
          nav.classList.remove("nav--sticky");
        }
      }
    });
  }
}
