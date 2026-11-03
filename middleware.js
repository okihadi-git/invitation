import { NextResponse } from "next/server";

const RESERVED = new Set(["www", "app", "admin", "api"]);

// rani-bima.undanganka.my.id  ->  /s/rani-bima
export function middleware(req) {
  const host = (req.headers.get("host") || "").split(":")[0].toLowerCase();
  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost").toLowerCase();
  if (host === root || !host.endsWith("." + root)) return NextResponse.next();

  const slug = host.slice(0, -(root.length + 1));
  if (!slug || slug.includes(".") || RESERVED.has(slug)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/s/${slug}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico|.*\\..*).*)"],
};
