import { ICredentials, IUser } from "#entities";

import { backendBaseUrl } from "./backendBaseUrl";

export async function signIn(credentials: ICredentials) {
  const response = await fetch(`${backendBaseUrl}/sign-in`, {
    method: "POST",
    body: JSON.stringify(credentials),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  return {
    response,
    responseBody:
      response.status === 200 ? ((await response.json()) as IUser) : null,
  };
}

export async function signOut() {
  const response = await fetch(`${backendBaseUrl}/sign-out`, {
    method: "POST",
    credentials: "include",
  });

  return { response };
}

export async function signUp(credentials: ICredentials) {
  const response = await fetch(`${backendBaseUrl}/sign-up`, {
    method: "POST",
    body: JSON.stringify(credentials),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  return {
    response,
    responseBody:
      response.status === 200 ? ((await response.json()) as IUser) : null,
  };
}

export async function fetchCurrentUser(sessionId: string) {
  const response = await fetch(`${backendBaseUrl}/current-user`, {
    method: "POST",
    credentials: "include",
    headers: {
      Cookie: `session-id=${sessionId}`,
    },
  });

  return {
    response,
    responseBody:
      response.status === 200 ? ((await response.json()) as IUser) : null,
  };
}
