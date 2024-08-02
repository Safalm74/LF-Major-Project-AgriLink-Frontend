import Modal from "../sections/modal";
import { userRegisterForm } from "./userRegisterForm";
import { refreshNav } from "./nav";
import { IUserToken } from "../interface/auth";
import toast from "./toast";
import { login } from "../api/auth";
import { Axios, AxiosError } from "axios";
import { errorHandler } from "../api/errorHandler";

async function handleFormSubmit(event: Event) {
  event.preventDefault();

  const formData = new FormData(event.target as HTMLFormElement);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response: IUserToken = await login(email, password);

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("userDetails", JSON.stringify(response.userDetails));

    if (response.farm) {
      localStorage.setItem("farm", JSON.stringify(response.farm));
    }

    toast("Log in Sucessfull", "sucess");

    refreshNav();
  } catch (error) {
    const errorResponse = error as AxiosError;

    errorHandler(errorResponse.response!);
  } finally {
    Modal.removeModal();
  }
}

/**
 * input: email, password
 * btn: submit
 */
export default function logInForm() {
  const form = document.createElement("form");
  form.classList.add("form");
  form.method = "post";

  const email = document.createElement("input");
  email.type = "email";
  email.placeholder = "Example@example.com";
  email.id = "email";
  email.name = "email";
  email.value = "admin@admin.com";

  const password = document.createElement("input");
  password.type = "password";
  password.placeholder = "Password";
  password.id = "password";
  password.name = "password";
  password.value = "admin";

  const logInBtn = document.createElement("button");
  logInBtn.type = "submit";
  logInBtn.innerHTML = "Log In";
  logInBtn.classList.add("btn");

  const createNewAccountBtn = document.createElement("button");
  createNewAccountBtn.type = "button";
  createNewAccountBtn.innerHTML = "Create New Account";
  createNewAccountBtn.classList.add("btn");
  createNewAccountBtn.addEventListener("click", () => {
    document.body.appendChild(
      Modal.modal(userRegisterForm()!, "Create New Account")
    );
  });

  const btns = document.createElement("div");
  btns.classList.add("btns");
  btns.append(logInBtn, createNewAccountBtn);

  form.addEventListener("submit", handleFormSubmit);
  form.append(
    wrapWithLable("Email:", email),
    wrapWithLable("Password:", password),
    btns
  );

  return form;
}

function wrapWithLable(text: string, element: HTMLElement) {
  const wrapper = document.createElement("div");
  const textNode = document.createElement("p");
  textNode.innerHTML = text;
  wrapper.append(textNode);
  wrapper.append(element);
  return wrapper;
}
