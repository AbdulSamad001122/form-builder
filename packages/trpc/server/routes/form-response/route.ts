import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formResponseService } from "../../services";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { 
    submitFormResponseInputModel, 
    submitFormResponseOutputModel,
    listFormResponsesInputModel,
    formResponseOutputModel
} from "./model";

const TAGS = ["FormResponse"]
const getPath = generatePath("/form-response")

export const formResponseRouter = router({
    submitResponse: publicProcedure
        .meta({ openapi: { method: "POST", path: getPath("submitResponse"), tags: TAGS, protect: false } })
        .input(submitFormResponseInputModel)
        .output(submitFormResponseOutputModel)
        .mutation(async ({ input, ctx }) => {

            try {
                const result = await formResponseService.submitResponse(input);
                return result;
            } catch (error: any) {
                if (error.message === "Form not found" || error.message === "Cannot submit response to an unpublished form") {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: error.message
                    })
                }
                throw error;
            }
        }),

    listResponses: authenticatedProcedure
        .meta({ openapi: { method: "GET", path: getPath("listResponses"), tags: TAGS, protect: true } })
        .input(listFormResponsesInputModel)
        .output(z.array(formResponseOutputModel))
        .query(async ({ input, ctx }) => {
            return await formResponseService.listResponses({
                formId: input.formId,
                userId: ctx.user!.id,
            });
        }),
});
