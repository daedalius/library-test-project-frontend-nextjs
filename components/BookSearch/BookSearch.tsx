import React, { useCallback, useEffect, useState } from "react";
import { useDebounceEffect } from "#utils/useDebounceEffect";
import { IAuthor } from "#entities/author";
import { getAuthors } from "#api/authors";
import { IBookSearchCriteria } from "#entities/BookSearchCriteria";

import styles from "./styles.module.css";

export const BookSearch = React.memo(
  (props: {
    onSearchRequest: (searchRequest: IBookSearchCriteria) => void;
  }) => {
    const [knownAuthors, setKnownAuthors] = useState<IAuthor[]>([]);
    useEffect(() => {
      getAuthors().then((r) => setKnownAuthors(r.responseBody));
    }, []);

    const [onlyAvailable, setIsOnlyAvailable] = useState<boolean | undefined>(
      undefined
    );
    const handleOnlyAvailableCheckboxChange = useCallback(() => {
      setIsOnlyAvailable((x) => !x);
    }, []);

    const [searchText, setSearchText] = useState<string>("");
    const handleSearchInputChange = useCallback((e) => {
      setSearchText(e.target.value);
    }, []);

    const [authorIdToSearch, setAuthorIdToSearch] = useState<string>("");
    const handleAuthorsChange = useCallback((e) => {
      setAuthorIdToSearch(e.target.value);
    }, []);

    const handleClearSearchOptions = useCallback(() => {
      setSearchText("");
      setAuthorIdToSearch("");
      setIsOnlyAvailable(undefined);
    }, []);

    const searchBooksCallback = useCallback(async () => {
      const searchRequest: IBookSearchCriteria = {};
      if (searchText) {
        searchRequest.substring = searchText;
      } else {
        searchRequest.substring = "";
      }

      if (onlyAvailable !== undefined) {
        searchRequest.available = onlyAvailable;
      }
      if (authorIdToSearch) {
        searchRequest.authorIds = [authorIdToSearch];
      }

      props.onSearchRequest(searchRequest);
    }, [searchText, authorIdToSearch, onlyAvailable]);
    useDebounceEffect(
      searchBooksCallback,
      [searchText, authorIdToSearch, onlyAvailable],
      1000
    );

    return (
      <div className="books-page__book-search">
        <div className={styles.topRow}>
          Search for a book
          {(searchText || authorIdToSearch || onlyAvailable) && (
            <button
              className={styles.clearButton}
              onClick={handleClearSearchOptions}
            >
              Clear options
            </button>
          )}
        </div>
        <div className={styles.criterias}>
          <label>
            Substring:{" "}
            <input
              placeholder="Substring"
              value={searchText}
              onChange={handleSearchInputChange}
            />
          </label>
          <label>
            Author:
            {knownAuthors && (
              <select onChange={handleAuthorsChange} value={authorIdToSearch}>
                <option></option>
                {knownAuthors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            )}
          </label>
          <label>
            <input
              type="checkbox"
              checked={onlyAvailable || false}
              onChange={handleOnlyAvailableCheckboxChange}
            />
            Free copies
          </label>
        </div>
      </div>
    );
  }
);
BookSearch.displayName = "BookSearch";
