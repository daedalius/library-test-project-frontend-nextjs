import React, { useCallback, useEffect, useState } from "react";

import { Modal } from "#components/Modal";
import { IBook, IBookCopy, IUser } from "#entities";
import { deleteBookCopies, getBookCopies, postBookCopies } from "#api/copies";
import { getUsers } from "#api/users";
import classNames from "classnames";

import styles from "./styles.module.css";

export const BookCopiesEditor = React.memo(
  (props: { book: IBook; children: React.ReactNode }) => {
    const [bookCopies, setBookCopies] = useState<IBookCopy[]>(null);
    const [knownHolders, setKnownHolders] = useState<IUser[]>([]);
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [isLoadingErrorStatus, setIsLoadingErrorStatus] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chosenCopy, setChosenCopy] = useState(null);

    useEffect(() => {
      if (!props.book || !isModalOpen) {
        setChosenCopy(null);
        return;
      }

      (async () => {
        try {
          setIsLoadingStatus(true);
          setIsLoadingErrorStatus(false);
          const bookCopiesQuery = await getBookCopies(props.book.id);
          if (bookCopiesQuery.response.ok) {
            const uniqueUserIds = new Set(
              bookCopiesQuery.responseBody
                .map((bc) => bc.userId)
                .filter(Boolean)
            );
            if (uniqueUserIds.size) {
              const holdersQuery = await getUsers(Array.from(uniqueUserIds));
              if (holdersQuery.response.ok) {
                setKnownHolders(holdersQuery.responseBody);
              } else {
                throw new Error("Failed to fetch book holders");
              }
            }

            setBookCopies(bookCopiesQuery.responseBody);
            setIsLoadingStatus(false);
            setIsLoadingErrorStatus(false);
            return;
          }
        } catch (e) {
          console.error(e);
        }

        setIsLoadingStatus(false);
        setIsLoadingErrorStatus(true);
      })();
    }, [props.book, isModalOpen]);

    const handleBookCopyChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value) {
          const bookChosen = bookCopies.find((bc) => bc.id === e.target.value);
          setChosenCopy(bookChosen);
        } else {
          setChosenCopy(null);
        }
      },
      [bookCopies]
    );

    const handleNewBookCopyButtonClick = useCallback(async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { response, responseBody } = await postBookCopies([
          { bookId: props.book.id },
        ]);
        if (response.ok) {
          setBookCopies((bookCopies) => [...bookCopies, ...responseBody]);
          return;
        }
      } catch (e) {
        console.error(e);
      }
      alert("Unable to add a new book copy");
    }, [props.book?.id]);
    const handleRemoveBookCopyButtonClick = useCallback(async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { response } = await deleteBookCopies([chosenCopy.id]);
        if (response.ok) {
          setChosenCopy(null);
          setBookCopies((bookCopies) =>
            bookCopies.filter((bc) => bc.id !== chosenCopy.id)
          );
          return;
        }
      } catch (e) {
        console.error(e);
      }
      alert("Unable to remove a book copy");
    }, [chosenCopy]);

    return (
      <>
        <button onClick={() => setIsModalOpen((o) => !o)}>
          {props.children}
        </button>
        <Modal isOpen={isModalOpen}>
          {isLoadingStatus ? <p>Loading ...</p> : null}
          {isLoadingErrorStatus ? <p>Unable to fetch book copies ...</p> : null}
          {!isLoadingStatus &&
          !isLoadingErrorStatus &&
          bookCopies.length === 0 ? (
            <p>No registered copies for that book</p>
          ) : null}
          {!isLoadingStatus &&
            !isLoadingErrorStatus &&
            bookCopies.length !== 0 && (
              <div>
                <select
                  className={classNames(
                    styles.list,
                    "book-copies-editor__list"
                  )}
                  size={7}
                  onChange={handleBookCopyChange}
                >
                  {bookCopies.map((bc) => {
                    const holder = bc.userId
                      ? knownHolders.find((u) => u.id === bc.userId)
                      : null;
                    const borrowedInfo = holder
                      ? `Borrowed by ${holder.login}, `
                      : "";
                    return (
                      <option value={bc.id} key={bc.id}>
                        {borrowedInfo}copy id: {bc.id}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          <div className="comment-editor__buttons-row buttons-block">
            <input
              type="button"
              value="Register new copy"
              onClick={handleNewBookCopyButtonClick}
            />
            {chosenCopy ? (
              <input
                type="button"
                value="Remove a book copy"
                onClick={handleRemoveBookCopyButtonClick}
              />
            ) : null}
            <input
              type="button"
              value="Close"
              onClick={() => {
                setIsModalOpen(false);
              }}
            />
          </div>
        </Modal>
      </>
    );
  }
);
BookCopiesEditor.displayName = "BookCopiesEditor";
