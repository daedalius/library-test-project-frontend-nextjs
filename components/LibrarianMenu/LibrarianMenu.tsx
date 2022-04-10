import React, { useCallback, useState } from "react";
import Link from "next/link";
import classNames from "classnames";

import styles from "./styles.module.css";

export const LibrarianMenu = React.memo(
  (props: { activeMenu: "authors" | "books"; children: React.ReactNode }) => (
    <div>
      <Link href="/librarian/authors" passHref>
        <span
          className={classNames(
            styles.link,
            props.activeMenu === "authors" ? styles.linkActive : ""
          )}
        >
          Authors
        </span>
      </Link>
      <Link href="/librarian/books" passHref>
        <span
          className={classNames(
            styles.link,
            props.activeMenu === "books" ? styles.linkActive : ""
          )}
        >
          Books
        </span>
      </Link>
      <div className={styles.content}>{props.children}</div>
    </div>
  )
);
LibrarianMenu.displayName = "LibrarianMenu";
