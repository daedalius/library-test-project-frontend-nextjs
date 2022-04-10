import React from "react";
import classnames from "classnames";
import Image from "next/image";

import styles from "./styles.module.css";

export const Avatar = React.memo(
  (props: {
    size: "small" | "medium" | "large";
    login: string;
    avatarUrl?: string;
  }) => {
    if (!props.avatarUrl) return null;

    const size =
      props.size === "small" ? 32 : props.size === "medium" ? 48 : 72;
    return (
      <Image
        className={classnames(styles.avatar)}
        src={props.avatarUrl}
        alt={"user " + props.login + " profile image"}
        width={size}
        height={size}
      />
    );
  }
);
Avatar.displayName = "Avatar";
