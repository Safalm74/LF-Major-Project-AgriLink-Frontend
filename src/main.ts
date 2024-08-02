import "./css/main.css";
import { Layout } from "./layout";
import Router from "./routes";

document.addEventListener("DOMContentLoaded", () => {
  try {
    Layout.layout();
  } catch (error) {
    console.log(error);
  }

  window.addEventListener("popstate", async () => {
    await Router.resolve(window.location.pathname);
  });
});
