// js/auth.js
function logout() {
  localStorage.removeItem("role");
  localStorage.removeItem("activeStudent");
  window.location.href = "../index.html";
}
