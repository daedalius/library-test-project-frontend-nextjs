import { IComment } from "#entities";
import { backendBaseUrl } from "./backendBaseUrl";

export async function getBookComments(bookId: string, headers = {}) {
  const response = await fetch(`${backendBaseUrl}/comments?bookId=${bookId}`, {
    method: "GET",
    credentials: "include",
    headers: headers,
  });

  return {
    response,
    responseBody:
      response.status === 200 ? ((await response.json()) as IComment[]) : null,
  };
}

export async function postComment(bookId: string, text: string, headers = {}) {
  const response = await fetch(`${backendBaseUrl}/comments?bookId=${bookId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({
      bookId: bookId,
      text: text,
    }),
  });

  return {
    response,
    responseBody:
      response.status === 200 ? ((await response.json()) as IComment) : null,
  };
}

export async function putComment(comment: IComment, headers = {}) {
  const response = await fetch(`${backendBaseUrl}/comments`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(comment),
  });

  return {
    response,
    responseBody:
      response.status === 200 ? ((await response.json()) as IComment) : null,
  };
}

export async function deleteComments(comments: IComment[], headers = {}) {
  const response = await fetch(`${backendBaseUrl}/comments`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(comments.map((c) => c.id)),
  });

  return {
    response,
  };
}
