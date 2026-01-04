/* ======================================================
   STUDENT – MY BOOKS
   Source of truth: issuedBooks
====================================================== */

const grid = document.getElementById("myBooksGrid");
const emptyState = document.getElementById("emptyState");

function renderMyBooks() {
  const student = JSON.parse(localStorage.getItem("activeStudent"));
  const issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];

  grid.innerHTML = "";

  if (!student) {
    emptyState.style.display = "block";
    emptyState.innerText = "Student not logged in.";
    return;
  }

  const myIssuedBooks = issuedBooks.filter(
    book => book.studentId === student.id
  );

  if (myIssuedBooks.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  myIssuedBooks.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <img src="${book.image || '../assets/book-placeholder.png'}">
      <h4>${book.title}</h4>
      <p>Status: <strong>Issued</strong></p>
      <p>Due Date: ${new Date(book.dueDate).toDateString()}</p>
    `;

    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderMyBooks);
