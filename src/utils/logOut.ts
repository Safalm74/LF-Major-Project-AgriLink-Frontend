export function logOut() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userDetails");
  localStorage.removeItem("farm");
  localStorage.removeItem("orders");

  window.location.reload();
}
