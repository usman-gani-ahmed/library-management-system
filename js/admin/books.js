/* ======================================================
   ADMIN MANAGE BOOKS LOGIC (NO SAMPLE DATA)
====================================================== */

function loadBooks() {
  const books = JSON.parse(localStorage.getItem("books") || "[]");
  const table = document.getElementById("booksTable");
  const empty = document.getElementById("emptyState");

  table.innerHTML = "";

  if (books.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  books.forEach((book, index) => {
    table.innerHTML += `
      <tr>
        <td>
          <img src="${book.image}" style="width:50px;border-radius:6px">
        </td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.course}</td>
        <td>
          <button class="btn danger" onclick="deleteBook(${index})">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

function addBook() {
  const title = document.getElementById("bookTitle").value.trim();
  const author = document.getElementById("bookAuthor").value.trim();
  const course = document.getElementById("bookCourse").value.trim();
  const quantity = parseInt(document.getElementById("bookQuantity").value);
  const imageInput = document.getElementById("bookImage");

  if (!title || !author || !course || !quantity || quantity < 1 || !imageInput.files[0]) {
    alert("Please fill all fields correctly");
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    const books = JSON.parse(localStorage.getItem("books") || "[]");

    books.push({
      id: "book_" + Date.now(),
      title,
      author,
      course,
      quantity,
      available: quantity,
      image: reader.result
    });

    localStorage.setItem("books", JSON.stringify(books));
    clearForm();
    loadBooks();
  };

  reader.readAsDataURL(imageInput.files[0]);
}

function deleteBook(index) {
  const books = JSON.parse(localStorage.getItem("books"));
  books.splice(index, 1);
  localStorage.setItem("books", JSON.stringify(books));
  loadBooks();
}

function clearForm() {
  document.getElementById("bookTitle").value = "";
  document.getElementById("bookAuthor").value = "";
  document.getElementById("bookCourse").value = "";
  document.getElementById("bookQuantity").value = "";
  document.getElementById("bookImage").value = "";
}

/* INIT */
loadBooks();
