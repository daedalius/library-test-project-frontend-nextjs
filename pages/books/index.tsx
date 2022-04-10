import React, { useCallback, useEffect, useState } from "react";

import * as booksApi from "#api/books";
import { Book } from "#components/Book";
import { IBook } from "#entities/Book";
import { BookSearch } from "#components/BookSearch/BookSearch";
import { IBookSearchCriteria } from "#entities/BookSearchCriteria";

import styles from "./styles.module.css";

export default function Books(props: { books?: IBook[]; isError: boolean }) {
  const [books, setBooks] = useState<IBook[]>(props.books || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(props.isError || false);

  const handleSearchRequest = useCallback(
    (searchRequest: IBookSearchCriteria) => {
      (async () => {
        setIsLoading(true);
        try {
          const { response, responseBody } = await booksApi.getBooks(
            searchRequest
          );
          if (response.ok) {
            setBooks(responseBody);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error(e);
        }
        setBooks(null);
        setIsError(true);
        setIsLoading(false);
      })();
    },
    []
  );

  return (
    <>
      <div className={styles.bookSearch}>
        <BookSearch onSearchRequest={handleSearchRequest} />
      </div>
      {isLoading ? <p>Loading ...</p> : null}
      {isError ? <p>Unable to fetch books</p> : null}
      {books?.length > 0
        ? books.map((book) => (
            <div key={book.id} className={styles.book}>
              <Book book={book} />
            </div>
          ))
        : null}
      {books?.length === 0 ? <p>No books found</p> : null}
    </>
  );
}

export async function getServerSideProps({ req }): Promise<{
  props: {
    books?: IBook[];
    isError: boolean;
  };
}> {
  const sessionId = req.cookies["session-id"];
  req;
  try {
    const { response, responseBody } = await booksApi.getBooks(
      { latest: 10 },
      {
        Cookie: "session-id=" + sessionId,
      }
    );

    if (response.ok) {
      return { props: { books: responseBody, isError: false } };
    }
  } catch (e) {}
  return { props: { isError: true } };
}
