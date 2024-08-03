import toast from "./toast";
import { createUser, getUserById, updateUser } from "../api/users";
import { errorHandler } from "../utils/errorHandler";
import { AxiosError } from "axios";
import Modal from "../sections/modal";

export function userRegisterForm(isUpdate?: boolean, updatingId?: string) {
  const form = document.createElement("form");
  form.classList.add("form");
  form.method = "post";

  const firstName = document.createElement("input");
  firstName.type = "text";
  firstName.placeholder = "First Name";
  firstName.id = "firstName";
  firstName.name = "firstName";
  firstName.value = "admin";

  const lastName = document.createElement("input");
  lastName.type = "text";
  lastName.placeholder = "Last Name";
  lastName.id = "lastName";
  lastName.name = "lastName";
  lastName.value = "admin";

  const email = document.createElement("input");
  email.type = "email";
  email.placeholder = "Example@example.com";
  email.id = "email";
  email.name = "email";
  email.value = "admin@admin.com";

  const phone = document.createElement("input");
  phone.type = "text";
  phone.placeholder = "Phone";
  phone.id = "phone";
  phone.name = "phone";
  phone.value = "admin";

  const address = document.createElement("input");
  address.type = "text";
  address.placeholder = "Address";
  address.id = "address";
  address.name = "address";
  address.value = "admin";

  const password = document.createElement("input");
  password.type = "password";
  password.placeholder = "Password";
  password.id = "password";
  password.name = "password";
  password.value = "admin";

  const confirmPassword = document.createElement("input");
  confirmPassword.type = "password";
  confirmPassword.placeholder = "Confirm Password";
  confirmPassword.id = "confirmPassword";
  confirmPassword.name = "confirmPassword";
  confirmPassword.value = "admin";

  const registerBtn = document.createElement("button");
  registerBtn.type = "submit";
  registerBtn.innerHTML = "Register";
  registerBtn.classList.add("btn");

  const btns = document.createElement("div");
  btns.classList.add("btns");
  btns.append(registerBtn);

  if (isUpdate) {
    if (!updatingId) {
      toast("user id not found", "error");

      return;
    }

    loadFormData(updatingId!).then((data) => {
      if (data) {
        firstName.value = data.firstName;
        lastName.value = data.lastName;
        email.value = data.email;
        phone.value = data.phone;
        address.value = data.address;
        password.value = data.password;
        confirmPassword.value = data.password;
      }
    });
  }

  form.addEventListener(
    "submit",
    isUpdate
      ? (event) => handleFormSubmitUpdateUser(event, updatingId!)
      : handleFormSubmitAddUser
  );

  const name = document.createElement("div");
  name.classList.add("name");
  name.append(
    wrapWithLabel("First Name:", firstName),
    wrapWithLabel("Last Name:", lastName)
  );

  form.append(
    name,
    wrapWithLabel("Email", email),
    wrapWithLabel("Phone", phone),
    wrapWithLabel("Address", address),
    wrapWithLabel("Password", password),
    wrapWithLabel("Confirm Password", confirmPassword),
    btns
  );
  return form;
}

function wrapWithLabel(text: string, element: HTMLElement) {
  const wrapper = document.createElement("div");
  const textNode = document.createElement("p");
  textNode.innerHTML = text;
  wrapper.append(textNode);
  wrapper.append(element);
  return wrapper;
}

async function loadFormData(id: string) {
  try {
    const userDetails = await getUserById(id);

    return userDetails[0];
  } catch (error) {
    errorHandler((error as AxiosError).response!);
  }
}

async function handleFormSubmitAddUser(event: Event) {
  event.preventDefault();

  const formData = new FormData(event.target as HTMLFormElement);
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  if (password !== confirmPassword) {
    toast("Passwords do not match", "warn");
    return;
  }

  try {
    await createUser(firstName, lastName, email, password, phone, address);
    Modal.removeModal();
  } catch (error) {
    errorHandler((error as AxiosError).response!);
  }
}

async function handleFormSubmitUpdateUser(event: Event, userId: string) {
  event.preventDefault();

  const formData = new FormData(event.target as HTMLFormElement);
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    updateUser(userId, lastName, firstName, email, password, phone, address);
    Modal.removeModal();
  } catch (error) {
    errorHandler((error as AxiosError).response!);
  }
}
