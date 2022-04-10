import React from "react";
import Link from "next/link";

import { getBookCopiesOnUser } from "#api/copies";
import { getUsers } from "#api/users";
import { getBooks } from "#api/books";
import { IBook, IUser } from "#entities";
import { Avatar } from "#components/Avatar";

import styles from "./styles.module.css";

export default function User(props: {
  isError: boolean;
  user?: IUser;
  userBorrowedBooks?: IBook[];
}) {
  if (props.isError) return <p>Unable to fetch user data</p>;

  return (
    <div className={styles.user} data-element="user-profile">
      <div>
        <Avatar
          size="large"
          avatarUrl={props.user.avatarUrl}
          login={props.user.login}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.login}>{props.user.login}</div>
        <div className={styles.borrowedCopies}>
          Borrowed book copies:
          {!props.userBorrowedBooks || props.userBorrowedBooks.length === 0 ? (
            <p>User has no borrowed book copies</p>
          ) : null}
          {props.userBorrowedBooks && props.userBorrowedBooks.length ? (
            <ul>
              {props.userBorrowedBooks.map((b) => (
                <ul key={b.id}>
                  <Link href={`/book/${b.id}`}>{b.title}</Link>
                </ul>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, params: { userId } }): Promise<{
  props: {
    isError: boolean;
    user?: IUser;
    userBorrowedBooks?: IBook[];
  };
}> {
  try {
    const [usersQuery, bookCopiesQuery] = await Promise.all([
      getUsers([userId], {
        Cookie: "session-id=" + req.cookies["session-id"],
      }),
      getBookCopiesOnUser(userId, {
        Cookie: "session-id=" + req.cookies["session-id"],
      }),
    ]);
    if (usersQuery.response.ok && bookCopiesQuery.response.ok) {
      if (bookCopiesQuery.responseBody.length > 0) {
        const bookIds = bookCopiesQuery.responseBody.map((bc) => bc.bookId);
        const userBooksQuery = await getBooks(
          { ids: bookIds },
          {
            Cookie: "session-id=" + req.cookies["session-id"],
          }
        );
        if (userBooksQuery.response.ok) {
          return {
            props: {
              isError: false,
              user: usersQuery.responseBody[0],
              userBorrowedBooks: userBooksQuery.responseBody,
            },
          };
        }
      } else {
        return {
          props: {
            isError: false,
            user: usersQuery.responseBody[0],
            userBorrowedBooks: [],
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
