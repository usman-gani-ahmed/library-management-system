/* ======================================================
   ADMIN – MANAGE BOOKS
   File: js/admin/books.js
====================================================== */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/* ---------- ADD BOOK ---------- */
async function addBook() {
  const title = document.getElementById("bookTitle").value.trim();
  const author = document.getElementById("bookAuthor").value.trim();
  const course = document.getElementById("bookCourse").value.trim();
  const quantityInput = document.getElementById("bookQuantity");
  const imageInput = document.getElementById("bookImage");

  const quantity = parseInt(quantityInput.value);

  if (!title || !author || !course || isNaN(quantity) || quantity <= 0) {
    alert("Please fill all fields correctly.");
    return;
  }

  let imageBase64 = "";

  if (imageInput.files.length > 0) {
    imageBase64 = await toBase64(imageInput.files[0]);
  }

  const books = JSON.parse(localStorage.getItem("books") || "[]");

  books.push({
    id: "book_" + Date.now(),
    title,
    author,
    course,
    quantity,
    image: imageBase64   // ✅ STORED PERMANENTLY
  });

  localStorage.setItem("books", JSON.stringify(books));

  // Reset form
  document.getElementById("bookTitle").value = "";
  document.getElementById("bookAuthor").value = "";
  document.getElementById("bookCourse").value = "";
  quantityInput.value = "";
  imageInput.value = "";

  renderBooks();
}


/* ---------- RENDER BOOKS ---------- */
function renderBooks() {
  const books = JSON.parse(localStorage.getItem("books") || "[]");
  const tableBody = document.getElementById("booksTable");

  tableBody.innerHTML = "";

  if (books.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;color:#94a3b8;">
          No books added yet.
        </td>
      </tr>
    `;
    return;
  }

  books.forEach(book => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        ${
          book.image
            ? `<img src="${book.image}" alt="cover" style="width:40px;border-radius:6px;">`
            : "-"
        }
      </td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.course}</td>
      <td>${book.quantity}</td>
      <td>
        <button class="btn danger" onclick="deleteBook('${book.id}')">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

/* ---------- DELETE BOOK ---------- */
function deleteBook(bookId) {
  let books = JSON.parse(localStorage.getItem("books") || "[]");

  // Try ID-based delete (new books)
  let newBooks = books.filter(b => b.id !== bookId);

  // If nothing changed, fallback for old books (no id)
  if (newBooks.length === books.length) {
    const index = books.findIndex(b => !b.id || b.id === undefined);
    if (index !== -1) {
      books.splice(index, 1);
    }
  } else {
    books = newBooks;
  }

  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
}


/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderBooks);

