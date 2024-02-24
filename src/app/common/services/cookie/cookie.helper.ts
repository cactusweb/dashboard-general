export function getParsedCookies(cookie: string) {
  const cookieStore: Record<string, string> = {};

  let cookiesArr = cookie.split(';');
  for (const cookie of cookiesArr) {
    const cookieArr = cookie.split('=');
    cookieStore[cookieArr[0].trim()] = cookieArr[1];
  }

  return cookieStore;
}
