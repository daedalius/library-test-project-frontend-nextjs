import { NextResponse, NextRequest } from "next/server";

export async function middleware(req, ev) {
  const url = req.nextUrl.clone();

  if (url.pathname == "/") {
    url.pathname = "/books";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
