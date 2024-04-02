document.addEventListener("DOMContentLoaded", function () {
  const uncompletedBooksList = document.getElementById("uncompleted-books-list");
  const completedBooksList = document.getElementById("completed-books-list");
  const addBookForm = document.getElementById("add-book-form");

  addBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    addBook(title, author);
  });
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("move-to-completed")) {
      const bookId = event.target.parentElement.parentElement.getAttribute("data-id");
      moveToCompleted(bookId);
    } else if (event.target.classList.contains("move-to-uncompleted")) {
      const bookId = event.target.parentElement.parentElement.getAttribute("data-id");
      moveToUncompleted(bookId);
    } else if (event.target.classList.contains("delete-book")) {
      const bookId = event.target.parentElement.parentElement.getAttribute("data-id");
      deleteBook(bookId);
    }
  });

  function renderBook(book, targetList) {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");
    bookElement.setAttribute("data-id", book.id);
    bookElement.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <div class="book-buttons">
          <button class="btn btn-success move-to-${targetList === uncompletedBooksList ? "completed" : "uncompleted"}">${targetList === uncompletedBooksList ? "Selesai Dibaca" : "Belum Selesai Dibaca"}</button>
          <button class="btn btn-danger delete-book">Hapus</button>
        </div>
      `;
    targetList.appendChild(bookElement);
  }

  function addBook(title, author) {
    const newBook = {
      id: Date.now(),
      title: title,
      author: author,
    };
    const books = getBooks();
    books.push(newBook);
    localStorage.setItem("books", JSON.stringify(books));
    renderBook(newBook, uncompletedBooksList);
  }

  function deleteBook(bookId) {
    const books = getBooks();
    const updatedBooks = books.filter((book) => book.id !== parseInt(bookId));
    localStorage.setItem("books", JSON.stringify(updatedBooks));
    document.querySelector(`[data-id="${bookId}"]`).remove();
  }

  function moveToCompleted(bookId) {
    const books = getBooks();
    const bookIndex = books.findIndex((book) => book.id === parseInt(bookId));
    if (bookIndex !== -1) {
      books[bookIndex].completed = true; // Update properti completed
      localStorage.setItem("books", JSON.stringify(books));
      renderBook(books[bookIndex], completedBooksList); // Render buku ke rak "Selesai Dibaca"
      document.querySelector(`[data-id="${bookId}"]`).remove(); // Hapus buku dari rak "Belum Selesai Dibaca"
    }
  }

  function moveToUncompleted(bookId) {
    const books = getBooks();
    const bookIndex = books.findIndex((book) => book.id === parseInt(bookId));
    if (bookIndex !== -1) {
      // Ubah status completed buku menjadi false
      books[bookIndex].completed = false;

      // Perbarui localStorage
      localStorage.setItem("books", JSON.stringify(books));

      // Dapatkan buku yang dihapus dari rak "Selesai Dibaca"
      const removedBook = books.splice(bookIndex, 1)[0];

      // Render kembali buku ke rak "Belum Selesai Dibaca"
      renderBook(removedBook, uncompletedBooksList);

      // Hapus buku dari rak "Selesai Dibaca"
      const completedBookElement = completedBooksList.querySelector(`[data-id="${bookId}"]`);
      if (completedBookElement) {
        completedBookElement.remove();
      }
    }
  }

  function getBooks() {
    return localStorage.getItem("books") ? JSON.parse(localStorage.getItem("books")) : [];
  }

  function renderBooks() {
    const books = getBooks();
    books.forEach((book) => {
      const uncompletedBookElement = uncompletedBooksList.querySelector(`[data-id="${book.id}"]`);
      const completedBookElement = completedBooksList.querySelector(`[data-id="${book.id}"]`);

      // Cek apakah buku sudah ada di rak yang dituju
      const isBookInTargetList = book.completed ? completedBookElement : uncompletedBookElement;

      // Jika buku sudah ada di rak yang dituju, lanjutkan ke buku berikutnya
      if (isBookInTargetList) {
        return;
      }

      // Jika buku belum ada di rak yang dituju, render buku di rak yang dituju
      const targetList = book.completed ? completedBooksList : uncompletedBooksList;
      renderBook(book, targetList);

      // Hapus buku dari rak yang berlawanan jika sudah ditampilkan sebelumnya
      const oppositeList = book.completed ? uncompletedBooksList : completedBooksList;
      const oppositeBookElement = oppositeList.querySelector(`[data-id="${book.id}"]`);
      if (oppositeBookElement) {
        oppositeBookElement.remove();
      }
    });
  }

  renderBooks();
});
