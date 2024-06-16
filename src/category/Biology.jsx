import React, { useState, useEffect } from "react";

const Biology = () => {
  const [query, setQuery] = useState("Biology");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    searchBooks(query);
  }, [query]);

  const searchBooks = async (searchQuery) => {
    setLoading(true); // Set loading state to true when fetching starts

    try {
      const response = await fetch(
        `https://gutendex.com/books?search=${searchQuery}&limit=50`
      );
      const data = await response.json();
      setBooks(data.results);
    } catch (error) {
      console.error("Error fetching books:", error);
    }

    setLoading(false); // Set loading state to false when fetching completes
  };

  const handleSearch = (event) => {
    event.preventDefault();
    searchBooks(query);
  };

  return (
    <div>
      <h1>Books under Biology</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
        />
        <button type="submit">Search</button>
      </form>

      {/* Display loading text or spinner */}
      {loading && <p>Loading books...</p>}

      <div>
        {books.length > 0 ? (
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
        ) : (
          !loading && <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Biology;
