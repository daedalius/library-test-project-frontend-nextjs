export async function fetchWrapper<T>(
  input: RequestInfo,
  init: RequestInit
): Promise<{
  response: Response;
  responseBody: T | null;
}> {
  const response = await fetch(input, init);
  if (response.status === 401) {
    document.location.replace('/sign-in');
    return;
  }
  let responseBody = null;
  if (response.ok) {
    const responseContentType = response.headers.get('Content-Type');
    if (responseContentType.includes('application/json')) {
      responseBody = (await response.json()) as T;
    }
  }

  return {
    response,
    responseBody,
  };
}
