import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL("/admin/login", request.url);
  const res = NextResponse.redirect(url);
  res.cookies.set("nc_admin", "", { path: "/", maxAge: 0 });
  return res;
}
