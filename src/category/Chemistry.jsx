import React, { useState, useEffect } from "react";

const Chemistry = () => {
  const [query, setQuery] = useState("Chemistry");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    searchBooks(query);
  }, [query]);

  const searchBooks = async (searchQuery) => {
    setLoading(true); // Set loading state to true when fetching starts

    let allBooks = [];
    let page = 1;
    let totalBooks = 0;
    const limit = 50; // Number of books per page

    do {
      const response = await fetch(
        `https://gutendex.com/books?search=${searchQuery}&page=${page}&limit=${limit}`
      );
      const data = await response.json();
      allBooks = [...allBooks, ...data.results];
      totalBooks = data.total; // Total number of books matching the query
      page++;
    } while (allBooks.length < totalBooks);

    setLoading(false); // Set loading state to false when fetching completes
    setBooks(allBooks);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    searchBooks(query);
  };

  return (
    <div>
      <h1>Books under Chemistry</h1>
      <form onSubmit={handleSearch}>
        <input
          type="button"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
        />
      </form>

      {/* Display loading text or spinner */}
      {loading && <p>Loading books...</p>}

      <div>
        {books.length > 0 && (
          <ul>
            {books.map((book) => (
              <li key={book.id} style={{ marginBottom: "20px" }}>
                <div>
                  {book.formats["image/jpeg"] && (
                    <img
                      src={book.formats["image/jpeg"]}
                      alt={`${book.title} cover`}
                      style={{
                        width: "100px",
                        height: "150px",
                        marginRight: "20px",
                      }}
                    />
                  )}
                  <div
                    style={{ display: "inline-block", verticalAlign: "top" }}
                  >
                    <h2>{book.title.split(":")[0] + "."}</h2>
                    <p>
                      by {book.authors.map((author) => author.name).join(", ")}
                    </p>
                    <a
                      href={book.formats["text/html"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginRight: "10px" }}
                    >
                      Read Live
                    </a>

                    <a
                      href={book.formats["text/html"]}
                      download="mybook.pdf"
                      style={{ marginRight: "10px" }} // Apply style directly to the <a> tag
                    >
                      Download
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Chemistry;
