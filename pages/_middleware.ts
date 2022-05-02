import { NextResponse, NextRequest } from "next/server";

export async function middleware(req, ev) {
  // Redirects to 'books' from root
  const url = req.nextUrl.clone();

  if (url.pathname == "/") {
    url.pathname = "/books";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
