import React from "react";
import Image from "next/image";
import Link from "next/link";

import { IBook } from "#entities";

import styles from "./styles.module.css";

export function Book(props: { book: IBook }) {
  const { id, title, authors, description, coverUrl } = props.book;

  return (
    <div className={styles.book} data-element="book">
      {coverUrl ? (
        <span className={styles.imageWrapper}>
          <Image
            className={styles.cover}
            src={coverUrl}
            width={200}
            height={200}
            objectFit="contain"
            alt={"Cover for book " + props.book.title}
          />
        </span>
      ) : null}
      <div className={styles.details}>
        <h3 className={styles.title} data-element="title">
          <Link href={"/book/" + id}>{title}</Link>
        </h3>
        <p className="book__authors">
          Authors: {authors.map((a) => a.name).join(", ")}
        </p>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </div>
    </div>
  );
}
