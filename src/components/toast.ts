export default function Toast(
  message: string,
  type: string,
  time: number = 1500
) {
  const container = document.createElement("div");
  container.classList.add("toast");
  container.classList.add(`toast--${type}`);

  container.innerHTML = message;
  container.classList.add("toast__content");

  document.body.appendChild(container);

  setTimeout(() => {
    container.remove();
  }, time);
}
