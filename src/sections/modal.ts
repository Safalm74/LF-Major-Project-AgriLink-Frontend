export default class Modal {
  static removeModal() {
    const existingModal = document.getElementsByClassName("modal")[0];
    if (existingModal) {
      existingModal.remove();
    }
  }
  static modal(modalContent: HTMLElement, message?: string) {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal__container");

    const msgWrapper = document.createElement("div");
    msgWrapper.classList.add("modal__msg-wrapper");

    if (message) {
      const modalMessageP = document.createElement("p");
      modalMessageP.innerHTML = message;
      modalMessageP.classList.add("modal__message");
      msgWrapper.appendChild(modalMessageP);
    }

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("close-btn");
    closeBtn.innerHTML = "X";
    closeBtn.addEventListener("click", () => {
      modal.remove();
      modal.classList.remove("modal--active");
    });

    modalContent.classList.add("modal__content");

    const existingModal = document.getElementsByClassName("modal")[0];
    if (existingModal) {
      existingModal.remove();
    }

    msgWrapper.appendChild(closeBtn);
    modalContainer.appendChild(msgWrapper);
    modalContainer.appendChild(modalContent);
    modal.appendChild(modalContainer);

    document.body.appendChild(modal);

    return modal;
  }
}
