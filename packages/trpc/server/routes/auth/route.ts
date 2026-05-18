import { createUserWithEmailAndPasswordInput } from "@repo/services/user/model";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { userService } from "../../services";
import { createUserWithEmailAndPasswordInputModel, createUserWithEmailAndPasswordOutputModel } from "./model";
import { setAuthenticationCookie } from "../../utils/cookies";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("createUserWithEmailAndPassword"),
        tags: TAGS
      }
    })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { fullName, email, password } = input
      const { id, token } = await userService.createUserWithEmailAndPassword({ fullName, email, password })

      setAuthenticationCookie(ctx, token)


      return {
        id,
        token,
      }
    })


});
