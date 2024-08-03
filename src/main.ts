import "./css/main.css";
import { Layout } from "./layout";
import Router from "./routes";

document.addEventListener("DOMContentLoaded", () => {
  Layout.layout();

  window.addEventListener("popstate", async () => {
    await Router.resolve(window.location.pathname);
  });
});
