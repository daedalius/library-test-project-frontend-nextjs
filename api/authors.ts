import { IAuthor } from "#entities";

import { backendBaseUrl } from "./backendBaseUrl";

export async function getAuthors(
  ids?: string[],
  substring?: string,
  headers = {}
) {
  let query = "";
  if (ids?.length || substring) {
    const idsParams = ids?.length ? `ids=${ids.join(",")}` : "";
    const substringParams = substring ? `substring=${substring}` : "";
    query = "?" + [idsParams, substringParams].filter(Boolean).join("&");
  }

  const response = await fetch(`${backendBaseUrl}/authors${query}`, {
    method: "GET",
    credentials: "include",
    headers: headers,
  });

  return {
    response,
    responseBody:
      response.status === 200 ? ((await response.json()) as IAuthor[]) : null,
  };
}

export async function postAuthors(authors: IAuthor[], headers = {}) {
  const response = await fetch(`${backendBaseUrl}/authors`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(authors),
    headers: { "Content-Type": "application/json", ...headers },
  });

  return {
    response,
    responseBody:
      response.status === 200 ? ((await response.json()) as IAuthor[]) : null,
  };
}

export async function putAuthors(authors: IAuthor[], headers = {}) {
  const response = await fetch(`${backendBaseUrl}/authors`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(authors),
    headers: { "Content-Type": "application/json", ...headers },
  });

  return {
    response,
    responseBody:
      response.status === 200 ? ((await response.json()) as IAuthor[]) : null,
  };
}

export async function deleteAuthors(authors: IAuthor[], headers = {}) {
  const response = await fetch(`${backendBaseUrl}/authors`, {
    method: "DELETE",
    credentials: "include",
    body: JSON.stringify(authors.map((a) => a.id)),
    headers: { "Content-Type": "application/json", ...headers },
  });

  return {
    response,
  };
}
