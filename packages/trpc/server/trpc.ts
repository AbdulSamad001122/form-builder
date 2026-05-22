import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { getAuthenticationCookie } from "./utils/cookies";
import { userService } from "./services";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        message:
          error.cause instanceof ZodError
            ? error.cause.issues.map((e: any) => e.message).join(", ")
            : shape.message,
      };
    },
  });

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const authenticatedProcedure = tRPCContext.procedure.use(async options => {
  const { ctx } = options

  const userToken = getAuthenticationCookie(ctx)

  if (!userToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    });
  }

  const { id } = await userService.verifyAndDecodeUserToken(userToken)

  return options.next({
    ctx: {
      ...ctx,
      user: { id },
    },
  });
});
