import { NextRequest, NextResponse } from "next/server";
import { decrypt, getSessionFromMiddleware } from "./src/lib/sessions";
import { cookies } from "next/headers";
import { SessionPayload } from "@/types/globals";

const protectedRoutes = ["/subproject", "/personprofile", "/implementation", "/finance", "/procurement", "/settings"];
const publicRoutes = ["/login", "/registration"];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    console.log("Middleware Path: ", path)


    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

    const cookie = (await cookies()).get('session')?.value;
    let session = null;
    if (cookie) {
    session = await decrypt(cookie) as SessionPayload;
    }

   
    console.log("Middleware Session: ", session);

    const hasAccess = session?.userData.userAccess?.some(access => 
        path.startsWith(`/${access.module_path}`) 
    ) || false;
    
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
