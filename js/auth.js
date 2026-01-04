// js/auth.js

function logout() {
  // Remove session-related data only
  localStorage.removeItem("role");
  localStorage.removeItem("activeStudent");

  // Redirect to home
  window.location.href = "../index.html";
}
