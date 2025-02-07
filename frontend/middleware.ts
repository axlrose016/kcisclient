import { NextRequest, NextResponse } from "next/server";
import { decrypt, getSession, getSessionFromMiddleware } from "./src/lib/sessions";
import { SessionPayload } from "./src/types/globals";
import { NextApiRequest } from "next";

const protectedRoutes = ["/subproject", "/personprofile", "/implementation", "/finance", "/procurement", "/settings"];
const publicRoutes = ["/login", "/registration"];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

    const session = await getSessionFromMiddleware(req);
    const hasAccess = session?.userData[0].userAccess?.some(access => 
        path.startsWith(`/${access.module_path}`) 
    ) || false;

    console.log("Has Access: " + hasAccess + " Path: " + path + " " + " Session: ", session?.userData)

    if(isProtectedRoute && !hasAccess){
        return NextResponse.redirect(new URL("/not-found",req.url));
    }

    if (isProtectedRoute && !session?.id) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

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
