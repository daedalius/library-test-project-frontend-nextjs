import { fetchWrapper } from "#utils/fetchWrapper";

import { IBook, IBookDto } from "#entities";
import { IBookSearchCriteria } from "#entities/BookSearchCriteria";

import { backendBaseUrl } from "./backendBaseUrl";

export async function getBooks(
  searchCriteria: IBookSearchCriteria = { latest: 10 },
  headers = {}
) {
  if (Object.keys(searchCriteria).length === 0) {
    searchCriteria = { latest: 10 };
  }

  let queryString = "?";
  if (searchCriteria.latest) {
    queryString += `latest=${searchCriteria.latest}&`;
  }
  if (searchCriteria.ids) {
    queryString += `ids=${searchCriteria.ids.join(",")}&`;
  }
  if (searchCriteria.substring) {
    queryString += `substring=${searchCriteria.substring}&`;
  }
  if (searchCriteria.available) {
    queryString += `available=true&`;
  }
  if (searchCriteria.authorIds) {
    queryString += `authorIds=${searchCriteria.authorIds.join(",")}&`;
  }
  return fetchWrapper<IBook[]>(
    `${backendBaseUrl}/books${queryString.replace(/&$/, "")}`,
    {
      method: "GET",
      credentials: "include",
      headers: headers,
    }
  );
}

export async function postBooks(books: IBookDto[], headers = {}) {
  return fetchWrapper<IBook[]>(`${backendBaseUrl}/books`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(books),
  });
}

export async function putBooks(books: IBookDto[], headers = {}) {
  return fetchWrapper<IBook[]>(`${backendBaseUrl}/books`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(books),
  });
}

export async function deleteBooks(books: IBook[], headers = {}) {
  const response = await fetch(`${backendBaseUrl}/books`, {
    method: "DELETE",
    credentials: "include",
    body: JSON.stringify(books.map((a) => a.id)),
    headers: { "Content-Type": "application/json", ...headers },
  });

  return {
    response,
  };
}
