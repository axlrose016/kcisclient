import { NextRequest, NextResponse } from "next/server";
import { decrypt, getSession, getSessionFromMiddleware } from "./lib/sessions";
import { SessionPayload } from "./types/globals";
import { NextApiRequest } from "next";

const protectedRoutes = ["/subproject", "/personprofile", "/implementation", "/finance", "/procurement", "/settings"];
const publicRoutes = ["/login", "/registration"];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    console.log("Middleware Triggered for:", path);

    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

    const session = await getSessionFromMiddleware(req);

    if (isProtectedRoute && !session?.id) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isPublicRoute && session?.id) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

// ✅ Define matcher to apply middleware only on specific routes
export const config = {
    matcher: [
        "/subproject/:path*",
        "/personprofile",
        "/implementation",
        "/finance",
        "/procurement",
        "/settings",
        "/login",
        "/registration",
    ],
};
