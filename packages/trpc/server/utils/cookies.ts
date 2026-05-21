import type { CookieOptions, Response, Request } from "express"
import { TRPCContext } from "../context"

const ONE_MINUTE = 60 * 1000
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR
const ONE_MONTH = 30 * ONE_DAY
const ONE_YEAR = 12 * ONE_MONTH


const isProduction = process.env.NODE_ENV === "production" || (process.env.NODE_ENV as string) === "prod";

export const getCookieOptions = (): CookieOptions => ({
    path: '/',
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: ONE_YEAR
});

export function createCookieFactory(res: Response) {
    return function createCookie(
        name: string,
        value: string,
        opts: CookieOptions = getCookieOptions()
    ) {
        res.cookie(name, value, opts)
    }
}

export function getCookieFactory(req: Request) {
    return function getCookie(name: string,) {
        return req.cookies?.[name]
    }
}

export function clearCookieFactory(res: Response) {
    return function clearCookie(name: string) {
        const opts = getCookieOptions();
        res.cookie(name, "", { ...opts, maxAge: 0, expires: new Date(0) });
    }
}

// Authentication Cookie

const AUTH_COOKIE_NAME = "authentication-token"


export function setAuthenticationCookie(ctx: TRPCContext, accessToken: string) {
    ctx.createCookie(AUTH_COOKIE_NAME, accessToken,)
}

export function getAuthenticationCookie(ctx: TRPCContext) {
    return ctx.getCookie(AUTH_COOKIE_NAME)
}
export function clearAuthenticationCookie(ctx: TRPCContext) {
    ctx.clearCookie(AUTH_COOKIE_NAME)
}