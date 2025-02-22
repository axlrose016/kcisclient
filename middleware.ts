import { NextRequest, NextResponse } from "next/server";
import { SessionPayload } from "@/types/globals";
import { decrypt, getSession } from "@/lib/sessions-client";
import { cookies } from "next/headers";

// Define protected and public routes
const protectedRoutes = ["/subproject", "/personprofile", "/implementation", "/finance", "/procurement", "/settings"];
const publicRoutes = ["/login", "/registration"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log("Middleware Path: ", path);

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  // Check if the session cookie is available
  const cookie = (await cookies()).get('session')?.value;
  let session = null;

  if (cookie) {
    // If a session cookie is found, decrypt it
    session = await decrypt(cookie) as SessionPayload;
  }

  console.log("Middleware Session: ", session);

  // Determine access rights for protected routes
  const hasAccess = session?.userData.userAccess?.some(access => 
    path.startsWith(`/${access.module_path}`)
  ) || false;
  
  // If accessing a protected route without sufficient access, redirect to a not-found page
  if (isProtectedRoute && !hasAccess) {
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  // If accessing a protected route without a valid session, redirect to login
  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If accessing a public route with a valid session, redirect to home page
  if (isPublicRoute && session?.id) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/subproject/:path*",
    "/personprofile/:path*",
    "/implementation",
    "/finance",
    "/procurement",
    "/settings",
    "/login",
    "/registration",
  ],
};
