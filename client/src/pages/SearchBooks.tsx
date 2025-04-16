import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../graphql/mutations';
import type { GoogleAPIBook } from '../models/GoogleAPIBook';
import Auth from '../utils/auth';

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState<GoogleAPIBook[]>([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');
  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);

  // Set up mutation for saving books
  const [saveBook] = useMutation(SAVE_BOOK);

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`);
      const data = await response.json();

      const bookData = data.items.map((book: GoogleAPIBook) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        description: book.volumeInfo.description,
        title: book.volumeInfo.title,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId: string) => {
    // find the book in `searchedBooks` by matching `bookId`
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveBook({
        variables: { bookData: { ...bookToSave } }
      });

      // if book successfully saves to User's account, save bookId to state
      setSavedBookIds([...savedBookIds, bookToSave!.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="my-5">
        <h3>Search For Books</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="flex-row space-between my-2">
            <label htmlFor="bookSearch">Book:</label>
            <input
              name="searchInput"
              type="text"
              size={20}
              placeholder="Enter a search term"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="flex-row flex-end">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>

      <div className="my-5">
        <h3>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h3>
        <div className="flex-row">
          {searchedBooks.map((book) => {
            return (
              <div key={book.bookId} className="col-12 mb-3 p-3">
                <div className="card">
                  <h4 className="card-header bg-primary text-light p-2 m-0">
                    {book.title} <br />
                    <span className="font-italic">
                      {book.authors.length ? `Written by ${book.authors.join(', ')}` : 'No author listed'}
                    </span>
                  </h4>
                  <div className="card-body bg-light p-3">
                    <p>{book.description}</p>
                    {Auth.loggedIn() && (
                      <button
                        className="btn-block btn-danger"
                        onClick={() => handleSaveBook(book.bookId)}
                      >
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SearchBooks;
