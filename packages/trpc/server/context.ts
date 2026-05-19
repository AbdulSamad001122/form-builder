import type { CreateExpressContextOptions } from "@trpc/server/adapters/express"
import { createCookieFactory, getCookieFactory, clearCookieFactory } from "./utils/cookies"

export interface TRPCCtxUser {
    id: string
}


export interface TRPCContext {
    createCookie: ReturnType<typeof createCookieFactory>,
    getCookie: ReturnType<typeof getCookieFactory>,
    clearCookie: ReturnType<typeof clearCookieFactory>

    user?: TRPCCtxUser

}


export async function createContext({ req, res }: CreateExpressContextOptions): Promise<TRPCContext> {
    const ctx: TRPCContext = {
        createCookie: createCookieFactory(res),
        getCookie: getCookieFactory(req),
        clearCookie: clearCookieFactory(res),
        user: undefined
    }
    return ctx
}
export type Context = Awaited<ReturnType<typeof createContext>>;
