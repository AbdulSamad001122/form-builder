import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { userService } from "../../services";

import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
  getLoggedInUserInfoInputModel,
  getLoggedInUserInfoOutputModel,
  signinUserWithEmailAndPasswordInputModel,
  signinUserWithEmailAndPasswordOutputModel,
} from "./model";

import {
  getAuthenticationCookie,
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

  getLoggedInUserInfo: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("getLoggedInUserInfo"),
        tags: TAGS,
      },
    })
    .input(getLoggedInUserInfoInputModel)
    .output(getLoggedInUserInfoOutputModel)
    .query(async ({ ctx }) => {

      const userToken = getAuthenticationCookie(ctx);

      const user = await userService.verifyAndDecodeUserToken(userToken);

      if (!user.id || !user.email || !user.fullName) {
        throw new Error("Invalid user token");
      }

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        profileImageUrl: user.profileImageUrl ?? null,
      };
    }),
});