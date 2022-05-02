import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { fetchCurrentUser } from "#api/credentials";
import { getBookCopiesBorrowedByUser } from "#api/copies";

import { CurrentUser } from "#components/contexts/CurrentUser";
import { CurrentUserInHeader } from "#components/CurrentUserInHeader";
import { SignOut } from "#components/SignOut";
import SignIn from "./sign-in";
import SignUp from "./sign-up";

import { IBookCopy } from "#entities/BookCopy";

import "../styles/globals.css";
export default function MyApp({
  Component,
  pageProps,
  props,
  router
}) {
  useEffect(() => {
    // Redirects to auth pages from others
    const isAuthRoute =
      router.pathname.endsWith("/sign-in") ||
      router.pathname.endsWith("/sign-up");

    if (props.user === null && !isAuthRoute) {
      router.push("/sign-in");
    }
  }, []);

  const [user, setUser] = useState(props?.user);
  const [borrowedBookCopies, setBorrowedBookCopies] = useState<IBookCopy[]>(
    props?.borrowedBookCopies
  );
  const contextValue = useMemo(
    () => ({
      user: user,
      setUser: setUser,
      borrowedBookCopies: borrowedBookCopies,
      setBorrowedBookCopies: setBorrowedBookCopies,
    }),
    [user, borrowedBookCopies]
  );

  return (
    <CurrentUser.Provider value={contextValue}>
      <div className="application">
        <div className="application__header">
          <h1>
            <Link href="/books">Library</Link>
          </h1>
          {user?.role === "librarian" ? (
            <span className="application__header-service-pages-links">
              <Link href="/librarian/authors">Librarian menu</Link>
            </span>
          ) : null}
          {user ? <CurrentUserInHeader /> : null}
          {user ? <SignOut /> : null}
        </div>
        {user ? (
          <Component {...pageProps} />
        ) : router.route === "/sign-up" ? (
          <SignUp />
        ) : (
          <SignIn />
        )}
      </div>
    </CurrentUser.Provider>
  );
}

MyApp.getInitialProps = async function (params) {
  const { ctx, req } = params;

  const sessionId = ctx.req?.cookies?.["session-id"];
  if (sessionId) {
    const userQuery = await fetchCurrentUser(sessionId);
    if (userQuery.response.ok) {
      const borrowedBookCopiesQuery = await getBookCopiesBorrowedByUser(
        userQuery.responseBody.id,
        {
          Cookie: "session-id=" + ctx.req.cookies["session-id"],
        }
      );
      if (borrowedBookCopiesQuery.response.ok) {
        return {
          props: {
            user: userQuery.responseBody,
            borrowedBookCopies: borrowedBookCopiesQuery.responseBody,
          },
        };
      }
    }
  }
  return {
    props: {
      user: null,
      borrowedBookCopies: null,
    },
  };
};
