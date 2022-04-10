import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Link from "next/link";

import { getUsers } from "#api/users";
import {
  deleteComments,
  getBookComments,
  postComment,
  putComment,
} from "#api/comments";
import { CurrentUser } from "#components/contexts/CurrentUser";
import { CommentEditor } from "#components/CommentEditor";
import { IBook, IComment, IUser } from "#entities";

import styles from "./styles.module.css";

export const BookComments = React.memo((props: { book: IBook }) => {
  const userContext = useContext(CurrentUser);
  const [comments, setComments] = useState<IComment[]>(null);
  const [commentators, setCommentators] = useState<IUser[]>([userContext.user]);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isLoadingErrorStatus, setIsLoadingErrorStatus] = useState(false);

  // GET
  useEffect(() => {
    const bookId = props.book?.id;
    const userId = userContext.user?.id;

    if (bookId && userId) {
      (async () => {
        try {
          setIsLoadingStatus(true);
          const { response, responseBody } = await getBookComments(bookId);
          if (response.ok) {
            const commentatorsIds = new Set(responseBody.map((c) => c.userId));
            if (commentatorsIds.size) {
              const commentatorsQuery = await getUsers(
                Array.from(commentatorsIds)
              );
              if (commentatorsQuery.response.ok) {
                setCommentators((commentators) => [
                  ...commentators,
                  ...commentatorsQuery.responseBody,
                ]);
                setComments(responseBody);
                setIsLoadingStatus(false);
                setIsLoadingErrorStatus(false);
                return;
              }
            } else {
              setComments(responseBody);
              setIsLoadingStatus(false);
              setIsLoadingErrorStatus(false);
              return;
            }
          }
        } catch (e) {
          console.error(e);
        }
        setIsLoadingStatus(false);
        setIsLoadingErrorStatus(true);
      })();
    }
  }, [props.book, userContext.user?.id]);

  // POST
  const handleNewCommentFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      let text = "";
      const formData = new FormData(e.target as HTMLFormElement);
      for (const keyValue of formData.entries()) {
        if (keyValue[0] === "text") {
          text = keyValue[1];
        }
      }

      if (text.trim()) {
        setIsLoadingStatus(true);
        setIsLoadingErrorStatus(false);

        try {
          const { response, responseBody } = await postComment(
            props.book.id,
            text
          );
          if (response.ok) {
            setComments((comments) => [...comments, responseBody]);
            setIsLoadingStatus(false);
            setIsLoadingErrorStatus(false);
            return;
          }
        } catch (e) {
          console.error(e);
        }
        setIsLoadingStatus(false);
        setIsLoadingErrorStatus(true);
      }
    },
    [props.book?.id]
  );

  // PUT
  const handleCommentChange = useCallback(async (comment: IComment) => {
    if (comment.text.trim()) {
      setIsLoadingStatus(true);
      setIsLoadingErrorStatus(false);
      const { response, responseBody } = await putComment(comment);
      if (response.ok) {
        setComments((comments) =>
          comments.map((c) => (c.id === responseBody.id ? responseBody : c))
        );
        setIsLoadingStatus(false);
        setIsLoadingErrorStatus(false);
      } else {
        alert("Unable to update a coment");
        setIsLoadingStatus(false);
        setIsLoadingErrorStatus(false);
      }
    }
  }, []);

  // DELETE
  const handleCommentRemove = useCallback(async (comment: IComment) => {
    if (confirm(`Remove comment "${comment.text}" ?`)) {
      setIsLoadingStatus(true);
      setIsLoadingErrorStatus(false);

      const { response } = await deleteComments([comment]);
      if (response.ok) {
        setComments((comments) => comments.filter((c) => c.id !== comment.id));
        setIsLoadingStatus(false);
        setIsLoadingErrorStatus(false);
      } else {
        alert("Unable to delete a coment");
        setIsLoadingStatus(false);
        setIsLoadingErrorStatus(false);
      }
    }
  }, []);

  if (isLoadingStatus) return <div className={styles.comments}>Loading...</div>;
  if (isLoadingErrorStatus)
    return (
      <div className={styles.comments}>Error while getting comments list</div>
    );
  return (
    <div className={styles.comments} data-element="book-comments">
      {comments.length ? (
        <div>
          <p>Comments:</p>
          {comments.map((c) => {
            const commentator = commentators.find(
              (commentator) => commentator.id === c.userId
            );
            return (
              <div className={styles.comment} key={c.id}>
                <div>
                  <b>
                    <Link href={"/user/" + commentator.id}>
                      {commentator.login}
                    </Link>{" "}
                  </b>
                </div>
                <div>
                  {c.text}{" "}
                  {userContext.user.id === commentator.id ? (
                    <span
                      className={styles.commentActions}
                      title="edit comment"
                    >
                      <CommentEditor comment={c} onChange={handleCommentChange}>
                        ✏️
                      </CommentEditor>
                      <span
                        className={styles.commentActions}
                        title="remove comment"
                        onClick={() => handleCommentRemove(c)}
                      >
                        {" ❌"}
                      </span>
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.comments}>No comments yet. Write one maybe?</div>
      )}
      <form className={styles.newComment} onSubmit={handleNewCommentFormSubmit}>
        <textarea required name="text" className={styles.newCommentText} />
        <div className={styles.buttons}>
          <input type="submit" value="Submit" />
          <input type="reset" value="Reset" />
        </div>
      </form>
    </div>
  );
});
BookComments.displayName = "BookComments";
