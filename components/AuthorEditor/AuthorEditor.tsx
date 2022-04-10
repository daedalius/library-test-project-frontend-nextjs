import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";

import { IAuthor } from "#entities";
import { Modal } from "#components/Modal";

import styles from "./styles.module.css";

export const AuthorEditor = React.memo(
  (props: {
    author: IAuthor;
    onChange: (author: IAuthor) => void;
    children: React.ReactNode;
  }) => {
    const [name, setName] = useState<string>(props.author?.name || "");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    useEffect(() => setName(props.author?.name || ""), [props.author]);

    const handleFormSubmit = useCallback(
      (e) => {
        e.preventDefault();
        props.onChange({
          id: props.author?.id,
          name,
        });
        setIsModalOpen(false);
      },
      [name, props]
    );
    const handleFormReset = useCallback(() => {
      setName(props.author.name);
    }, [props.author]);

    return (
      <>
        <button onClick={() => setIsModalOpen((o) => !o)}>
          {props.children}
        </button>
        <Modal isOpen={isModalOpen}>
          <form
            className="author-editor__form"
            onSubmit={handleFormSubmit}
            onReset={handleFormReset}
          >
            <div className={styles.formRow}>
              <label htmlFor="name">Name: </label>
              <input
                required
                id="name"
                type="text"
                placeholder="Author name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
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
  }
);
AuthorEditor.displayName = "AuthorEditor";
