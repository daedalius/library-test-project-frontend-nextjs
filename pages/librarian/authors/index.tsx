import React, { useCallback, useState } from "react";
import classNames from "classnames";
import {
  deleteAuthors,
  getAuthors,
  postAuthors,
  putAuthors,
} from "#api/authors";
import { AuthorEditor } from "#components/AuthorEditor";
import { LibrarianMenu } from "#components/LibrarianMenu";
import { useDebounceEffect } from "#utils/useDebounceEffect";
import { IAuthor } from "#entities";

import styles from "./styles.module.css";

export default function AuthorActions() {
  const [searchSubstring, setSearchSubstring] = useState<string>("");
  const [authorsFound, setAuthorsFound] = useState<IAuthor[]>([]);
  const [authorToEdit, setAuthorToEdit] = useState<IAuthor>(null);

  const handleAuthorSubstringChange = useCallback((e) => {
    setSearchSubstring(e.target.value);
  }, []);

  const searchAuthors = useCallback(async () => {
    if (!searchSubstring) return;
    try {
      const { response, responseBody } = await getAuthors(
        undefined,
        searchSubstring
      );
      if (response.ok) {
        setAuthorsFound(responseBody);
      }
      return;
    } catch (e) {
      console.error(e);
    }
    alert("Unable to fetch authors");
  }, [searchSubstring]);

  useDebounceEffect(searchAuthors, [searchSubstring], 500);

  const handleAuthorSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const chosenAuthorId = e.target.value;
      setAuthorToEdit(authorsFound.find((a) => a.id === chosenAuthorId));
    },
    [authorsFound]
  );

  const handleAuthorAdd = useCallback(async (author: IAuthor) => {
    try {
      const { response } = await postAuthors([author]);
      if (response.ok) {
        return;
      }
    } catch (e) {
      console.error(e);
    }

    alert(`Unable to add ${author.name}`);
  }, []);

  const handleAuthorChange = useCallback(async (author: IAuthor) => {
    try {
      const { response, responseBody } = await putAuthors([author]);
      if (response.ok) {
        setAuthorToEdit(responseBody[0]);
        setAuthorsFound((authors) =>
          authors.map((a) => (a.id === author.id ? responseBody[0] : a))
        );
        return;
      }
    } catch (e) {
      console.error(e);
    }

    alert(`Unable to update ${author.name}`);
  }, []);

  const handleAuthorRemoveButtonClick = useCallback(async () => {
    try {
      const { response } = await deleteAuthors([authorToEdit]);
      if (response.ok) {
        setAuthorsFound((authors) =>
          authors.filter((a) => a.id !== authorToEdit.id)
        );
        return;
      }
    } catch (e) {
      console.error(e);
    }

    alert(`Unable to remove ${authorToEdit.name}`);
  }, [authorToEdit]);

  return (
    <LibrarianMenu activeMenu="authors">
      <div>
        <input
          type="text"
          placeholder="Author name to search"
          className={styles.authorSearch}
          onChange={handleAuthorSubstringChange}
          value={searchSubstring}
        />
        <select
          className={styles.authorsFound}
          onChange={handleAuthorSelectChange}
          size={7}
          data-element="authors-found"
        >
          {authorsFound.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <div className={classNames(styles.actionButtons, "buttons-block")}>
          <AuthorEditor author={null} onChange={handleAuthorAdd}>
            📝 Add an author
          </AuthorEditor>
          {authorToEdit ? (
            <AuthorEditor author={authorToEdit} onChange={handleAuthorChange}>
              ✏️ Edit an author
            </AuthorEditor>
          ) : null}
          {authorToEdit ? (
            <button onClick={handleAuthorRemoveButtonClick}>
              ❌ Remove an author
            </button>
          ) : null}
        </div>
      </div>
    </LibrarianMenu>
  );
}
