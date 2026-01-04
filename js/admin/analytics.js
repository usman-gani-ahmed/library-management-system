/* ======================================================
   ADMIN ANALYTICS LOGIC (IFRAME SAFE)
====================================================== */

function loadAnalytics() {
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const books = JSON.parse(localStorage.getItem("books") || "[]");
  const requests = JSON.parse(localStorage.getItem("bookRequests") || "[]");
  const issued = JSON.parse(localStorage.getItem("issuedBooks") || "[]");

  const approvedCount = students.filter(s => s.approved).length;
  const pendingRequests = requests.filter(r => r.status === "pending").length;

  document.getElementById("totalStudents").innerText = students.length;
  document.getElementById("approvedStudents").innerText = approvedCount;
  document.getElementById("totalBooks").innerText = books.length;
  document.getElementById("pendingRequests").innerText = pendingRequests;
  document.getElementById("issuedBooks").innerText = issued.length;
}

/* INIT */
loadAnalytics();
