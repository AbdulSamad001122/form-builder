import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { userService } from "../../services";

import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
  getLoggedInUserInfoInputModel,
  getLoggedInUserInfoOutputModel,
  signinUserWithEmailAndPasswordInputModel,
  signinUserWithEmailAndPasswordOutputModel,
  logoutOutputModel,
  forgotPasswordInputModel,
  forgotPasswordOutputModel,
  resetPasswordInputModel,
  resetPasswordOutputModel,
} from "./model";

import {
  clearAuthenticationCookie,
  setAuthenticationCookie,
} from "../../utils/cookies";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("createUserWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { fullName, email, password } = input;

      const { id, token } =
        await userService.createUserWithEmailAndPassword({
          fullName,
          email,
          password,
        });

      setAuthenticationCookie(ctx, token);

      return {
        id,
        token,
      };
    }),

  signinUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("signinUserWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(signinUserWithEmailAndPasswordInputModel)
    .output(signinUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const { id, token } =
        await userService.siginUserWithEmailAndPassword({
          email,
          password,
        });

      setAuthenticationCookie(ctx, token);

      return {
        id,
        token,
      };
    }),

  getLoggedInUserInfo: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("getLoggedInUserInfo"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getLoggedInUserInfoInputModel)
    .output(getLoggedInUserInfoOutputModel)
    .query(async ({ ctx }) => {
      const { id, email, fullName } =
        (await userService.getUserInfoById(ctx.user!.id))!;

      return {
        id,
        email,
        fullName,
      };
    }),

  logout: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("logout"),
        tags: TAGS,
        protect: false,
      },
    })
    .output(logoutOutputModel)
    .mutation(async ({ ctx }) => {
      clearAuthenticationCookie(ctx);
      return { success: true };
    }),

  forgotPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("forgotPassword"),
        tags: TAGS,
      },
    })
    .input(forgotPasswordInputModel)
    .output(forgotPasswordOutputModel)
    .mutation(async ({ input }) => {
      const { email, webUrl } = input;
      return await userService.requestPasswordReset({ email, webUrl });
    }),

  resetPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("resetPassword"),
        tags: TAGS,
      },
    })
    .input(resetPasswordInputModel)
    .output(resetPasswordOutputModel)
    .mutation(async ({ input }) => {
      const { email, token, password } = input;
      return await userService.resetPassword({ email, token, password });
    }),
});