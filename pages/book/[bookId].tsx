import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getBooks } from "#api/books";
import { Book as BookDetails } from "#components/Book";
import { IBook, IBookCopy } from "#entities";
import { CurrentUser } from "#components/contexts/CurrentUser";

import { borrowBookCopy, getFreeBookCopies, returnBookCopy } from "#api/copies";
import { BookComments } from "#components/BookComments";

import styles from "./styles.module.css";

export default function Book(props: {
  book?: IBook;
  freeBookCopies?: IBookCopy[];
  isError: boolean;
}) {
  const userContext = useContext(CurrentUser);

  const [book, setBook] = useState<IBook | null>(props.book || null);
  const [freeBookCopies, setFreeBookCopies] = useState<IBookCopy[] | null>(
    props.freeBookCopies || null
  );
  const [isError, setIsError] = useState(props.isError);

  const [isCopyStatusLoading, setIsCopyStatusLoading] = useState(false);
  const [isCopyStatusError, setIsCopyStatusError] = useState(false);
  const handleReturnBookButtonClick = useCallback(() => {
    (async () => {
      try {
        const bookCopyId = userContext.borrowedBookCopies.find(
          (bc) => bc.bookId === book.id
        ).id;
        const { response, responseBody } = await returnBookCopy(bookCopyId);
        if (response.ok) {
          console.assert(responseBody.id === bookCopyId);
          userContext.setBorrowedBookCopies((copies) =>
            copies.filter((bc) => bc.id !== bookCopyId)
          );

          setFreeBookCopies((bc) => [...bc, responseBody]);
          setIsCopyStatusLoading(false);
          setIsCopyStatusError(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }

      setIsCopyStatusLoading(false);
      setIsCopyStatusError(true);
    })();
  }, [book?.id, userContext]);

  const handleBorrowBookButtonClick = useCallback(() => {
    (async () => {
      try {
        const { response, responseBody } = await borrowBookCopy(
          book.id,
          userContext.user.id
        );
        if (response.ok) {
          userContext.setBorrowedBookCopies((copies) => [
            ...copies,
            responseBody,
          ]);

          setIsCopyStatusLoading(false);
          setIsCopyStatusError(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }

      setIsCopyStatusLoading(false);
      setIsCopyStatusError(true);
    })();
  }, [book?.id, userContext]);

  const copyStatus = useMemo(() => {
    if (!book || !userContext.borrowedBookCopies) return <p>Loading ...</p>;
    const isBookBorrowedByUser = (userContext.borrowedBookCopies || []).find(
      (bc) => bc.bookId === book.id
    );

    if (isCopyStatusLoading) return <p>Loading ...</p>;
    if (isCopyStatusError)
      return <p>Unable to check book availability status. Please try later</p>;
    if (isBookBorrowedByUser)
      return (
        <input
          type="button"
          onClick={handleReturnBookButtonClick}
          value="Return"
        />
      );
    if (freeBookCopies?.length === 0)
      return <p>No free book copies available</p>;
    return (
      <input
        type="button"
        onClick={handleBorrowBookButtonClick}
        value="Borrow"
      />
    );
  }, [
    book,
    userContext.borrowedBookCopies,
    isCopyStatusLoading,
    isCopyStatusError,
    freeBookCopies,
    handleReturnBookButtonClick,
    handleBorrowBookButtonClick,
  ]);

  if (isError) return <p>Unable to fetch book data</p>;

  return (
    <>
      <div className={styles.book}>
        <BookDetails book={book} />
        <div className="book-page__buttons">{copyStatus}</div>
      </div>
      <div className={styles.comments}>
        <BookComments book={book} />
      </div>
    </>
  );
}

export async function getServerSideProps({ req, params: { bookId } }): Promise<{
  props: {
    book?: IBook;
    freeBookCopies?: IBookCopy[];
    isError: boolean;
  };
}> {
  try {
    const bookQuery = await getBooks(
      { ids: [bookId] },
      {
        Cookie: "session-id=" + req.cookies["session-id"],
      }
    );
    if (bookQuery.response.ok && bookQuery.responseBody?.length) {
      const freeCopiesQuery = await getFreeBookCopies(bookId, {
        Cookie: "session-id=" + req.cookies["session-id"],
      });
      if (
        freeCopiesQuery.response.ok &&
        Array.isArray(freeCopiesQuery.responseBody)
      ) {
        return {
          props: {
            isError: false,
            book: bookQuery.responseBody[0],
            freeBookCopies: freeCopiesQuery.responseBody,
          },
        };
      }
    }
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      isError: true,
    },
  };
}
