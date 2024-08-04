import Modal from "../sections/modal";

export class ConfirmDeletePopUp {
  static confirm(
    warningMsg: string,
    callback: (id: string) => void,
    deletingId: string
  ) {
    const deleteConfirmationPopUp = document.createElement("div");
    const yesBtn = document.createElement("button");
    const noBtn = document.createElement("button");
    deleteConfirmationPopUp.classList.add("delete-confirmation-pop-up");
    deleteConfirmationPopUp.innerHTML = warningMsg;
    yesBtn.innerHTML = "Yes";
    noBtn.innerHTML = "No";
    yesBtn.classList.add("red-btn");
    noBtn.classList.add("green-btn");

    deleteConfirmationPopUp.appendChild(document.createElement("br"));
    deleteConfirmationPopUp.appendChild(yesBtn);
    deleteConfirmationPopUp.appendChild(noBtn);

    Modal.modal(deleteConfirmationPopUp, "Delete Confirmation");

    yesBtn.addEventListener("click", async () => {
      await callback(deletingId);
      Modal.removeModal();
    });

    noBtn.addEventListener("click", () => {
      Modal.removeModal();
    });
  }
}
