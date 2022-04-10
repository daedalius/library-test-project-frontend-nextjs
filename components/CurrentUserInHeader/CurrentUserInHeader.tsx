import React, { useContext } from "react";
import Link from "next/link";

import { CurrentUser } from "#components/contexts/CurrentUser";
import { Avatar } from "#components/Avatar";

import styles from "./styles.module.css";

export function CurrentUserInHeader() {
  const userContext = useContext(CurrentUser);

  return (
    <div data-element="current-user-in-header">
      <Link href={"/user/" + userContext.user.id} passHref>
        <span className={styles.wrapper}>
          <Avatar {...userContext.user} size="medium" />
          <span>{userContext.user.login}</span>
        </span>
      </Link>
    </div>
  );
}
