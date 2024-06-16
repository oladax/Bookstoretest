import React, { useState } from "react";
import axios from "axios";

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [inputError, setInputError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    if (query.trim() === "") {
      setInputError(true);
      setErrorMessage("Please enter a search term.");
      return;
    }

    setInputError(false);
    setErrorMessage("");

    try {
      // Fetch from Gutenberg API
      const gutenbergResponse = await axios.get(
        `https://gutendex.com/books?search=${query}`
      );
      if (gutenbergResponse.data.results.length > 0) {
        setBooks(gutenbergResponse.data.results);
        setMessage("");
      } else {
        // Fetch from Google Books API if not found in Gutenberg
        const googleResponse = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyCmSq1TVDrDfG6DrbZakTEyqyueSSvqJ1E`
        );
        if (googleResponse.data.items && googleResponse.data.items.length > 0) {
          setBooks(googleResponse.data.items);
          setMessage(
            "This book is going to be added soon to our collection of books."
          );
        } else {
          setMessage("No results found.");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("An error occurred while searching. Please try again.");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books"
        style={{ borderColor: inputError ? "red" : "black" }}
      />
      <button onClick={handleSearch} disabled={!query.trim()}>
        Search
      </button>
      {inputError && <p style={{ color: "red" }}>{errorMessage}</p>}
      <div>
        {message && <p>{message}</p>}
        {books.map((book, index) => (
          <div key={index}>
            <h3>{book.title || book.volumeInfo.title}</h3>
            <p>
              {book.authors
                ? book.authors.map((author) => author.name).join(", ")
                : book.volumeInfo.authors.join(", ")}
            </p>
            {book.formats && book.formats["image/jpeg"] && (
              <img src={book.formats["image/jpeg"]} alt={book.title} />
            )}
            {book.volumeInfo &&
              book.volumeInfo.imageLinks &&
              book.volumeInfo.imageLinks.thumbnail && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                />
              )}
            {book.formats && book.formats["text/html"] && (
              <a
                href={book.formats["text/html"]}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read
              </a>
            )}
            {book.formats && book.formats["application/epub+zip"] && (
              <a
                href={book.formats["application/epub+zip"]}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download EPUB
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSearch;
