import React, { useCallback, useState } from "react";
import * as apiBooks from "#api/books";
import { useDebounceEffect } from "#utils/useDebounceEffect";
import { IBook, IBookDto } from "#entities";

import { BookCopiesEditor } from "#components/BookCopiesEditor";
import { BookEditor } from "#components/BookEditor";
import { LibrarianMenu } from "#components/LibrarianMenu";

import styles from "./styles.module.css";
import classNames from "classnames";

export default function BookActions() {
  const [searchSubstring, setSearchSubstring] = useState<string>("");
  const [booksFound, setBooksFound] = useState<IBook[]>([]);
  const [bookToEdit, setBookToEdit] = useState<IBook>(null);

  const handleBookSubstringChange = useCallback((e) => {
    setSearchSubstring(e.target.value);
  }, []);

  const getBooks = useCallback(async () => {
    if (!searchSubstring) return;
    try {
      const { response, responseBody } = await apiBooks.getBooks({
        substring: searchSubstring,
      });
      if (response.ok) {
        setBooksFound(responseBody);
      }
      return;
    } catch (e) {
      console.error(e);
    }
    alert("Unable to fetch books");
  }, [searchSubstring]);
  useDebounceEffect(getBooks, [searchSubstring], 500);

  const handleAuthorSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const chosenBookId = e.target.value;
      setBookToEdit(booksFound.find((a) => a.id === chosenBookId));
    },
    [booksFound]
  );

  const handleBookAdd = useCallback(async (book: IBook) => {
    const bookDto: IBookDto = {
      id: book.id,
      title: book.title,
      coverUrl: book.coverUrl,
      description: book.description,
      authorIds: book.authors.map((a) => a.id),
    };

    try {
      const { response } = await apiBooks.postBooks([bookDto]);
      if (response.ok) {
        return;
      }
    } catch (e) {
      console.error(e);
    }

    alert(`Unable to add ${book.title}`);
  }, []);

  const handleBookChange = useCallback(async (book: IBook) => {
    const bookDto: IBookDto = {
      id: book.id,
      title: book.title,
      coverUrl: book.coverUrl,
      description: book.description,
      authorIds: book.authors.map((a) => a.id),
    };

    try {
      const { response, responseBody } = await apiBooks.putBooks([bookDto]);
      if (response.ok) {
        setBookToEdit(responseBody[0]);
        setBooksFound((books) =>
          books.map((b) => (b.id === book.id ? responseBody[0] : b))
        );
        return;
      }
    } catch (e) {
      console.error(e);
    }

    alert(`Unable to update ${book.title}`);
  }, []);

  const handleBookRemoveButtonClick = useCallback(async () => {
    try {
      const { response } = await apiBooks.deleteBooks([bookToEdit]);
      if (response.ok) {
        setBooksFound((books) => books.filter((b) => b.id !== bookToEdit.id));
        return;
      }
    } catch (e) {
      console.error(e);
    }

    alert(`Unable to remove ${bookToEdit.title}`);
  }, [bookToEdit]);

  return (
    <LibrarianMenu activeMenu="books">
      <div className="book-actions">
        <input
          type="text"
          placeholder="Book title or description to search"
          className={styles.bookSearch}
          onChange={handleBookSubstringChange}
          value={searchSubstring}
        />
        <select
          className={styles.booksFound}
          onChange={handleAuthorSelectChange}
          size={7}
        >
          {booksFound.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
        <div className={classNames(styles.actionButtons, "buttons-block")}>
          <BookEditor book={null} onChange={handleBookAdd}>
            📝 Add a book
          </BookEditor>
          {bookToEdit ? (
            <BookEditor book={bookToEdit} onChange={handleBookChange}>
              ✏️ Edit a book
            </BookEditor>
          ) : null}
          {bookToEdit ? (
            <button onClick={handleBookRemoveButtonClick}>
              ❌ Remove a book
            </button>
          ) : null}
          {bookToEdit ? (
            <BookCopiesEditor book={bookToEdit}>🖇 Edit copies</BookCopiesEditor>
          ) : null}
        </div>
      </div>
    </LibrarianMenu>
  );
}
