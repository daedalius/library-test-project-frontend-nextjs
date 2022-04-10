import React, { useCallback, useEffect, useState } from "react";

import { IAuthor, IBook } from "#entities";
import { getAuthors } from "#api/authors";
import { Modal } from "#components/Modal";

import styles from "./styles.module.css";
import classNames from "classnames";

export const BookEditor = (props: {
  book: IBook;
  onChange: (book: IBook) => void;
  children: React.ReactNode;
}) => {
  const [title, setTitle] = useState<string>(props.book?.title || "");
  const [description, setDescription] = useState<string>(
    props.book?.description || ""
  );
  const [coverUrl, setCoverUrl] = useState<string>(props.book?.coverUrl || "");
  const [authorIds, setAuthorIds] = useState<string[]>(
    props.book?.authors.map((a) => a.id) || []
  );
  const [allAuthors, setAllAuthors] = useState<IAuthor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setTitle(props.book?.title || "");
    setDescription(props.book?.description || "");
    setCoverUrl(props.book?.coverUrl || "");
    setAuthorIds(props.book?.authors.map((a) => a.id) || []);
  }, [props.book]);

  useEffect(() => {
    (async () => {
      const { response, responseBody } = await getAuthors();
      setAllAuthors(responseBody);
    })();
  }, []);

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      props.onChange({
        id: props.book?.id,
        title,
        description,
        coverUrl,
        authors: allAuthors.filter((a) => authorIds.includes(a.id)),
      });
      setIsModalOpen(false);
    },
    [allAuthors, authorIds, coverUrl, description, props, title]
  );
  const handleFormReset = useCallback(() => {
    setTitle(props.book?.title || "");
    setDescription(props.book?.description || "");
    setCoverUrl(props.book?.coverUrl || "");
    setAuthorIds(props.book?.authors.map((a) => a.id) || []);
  }, [props.book]);

  return (
    <>
      <button onClick={() => setIsModalOpen((o) => !o)}>
        {props.children}
      </button>
      <Modal isOpen={isModalOpen}>
        <form
          className="book-editor__form"
          onSubmit={handleFormSubmit}
          onReset={handleFormReset}
        >
          <div className={styles.formRow}>
            <label htmlFor="title">Title: </label>
            <input
              required
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="description">Description:</label>
            <textarea
              required
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="coverUrl">Cover URL: </label>
            <input
              id="coverUrl"
              type="text"
              value={coverUrl}
              onChange={(e) => {
                setCoverUrl(e.target.value);
              }}
            />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="authors">Authors:</label>
            <select
              required
              id="authors"
              multiple
              value={authorIds}
              onChange={(e) => {
                setAuthorIds(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                );
              }}
            >
              {allAuthors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className={classNames(styles.buttonsRow, "buttons-block")}>
            <input type="submit" value="Submit" />
            <input type="reset" value="Reset" />
            <input
              type="button"
              value="Cancel"
              onClick={() => {
                setIsModalOpen(false);
              }}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};
