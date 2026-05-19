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

const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 60000 
const MAX_REQUESTS_PER_WINDOW = 5

function checkRateLimit(ip: string) {
    const now = Date.now()
    const requests = rateLimitMap.get(ip) || []
 
    const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW_MS)
    
    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        return false 
    }
    
    recentRequests.push(now)
    rateLimitMap.set(ip, recentRequests)
    return true
}

export const formResponseRouter = router({
    submitResponse: publicProcedure
        .meta({ openapi: { method: "POST", path: getPath("submitResponse"), tags: TAGS, protect: false } })
        .input(submitFormResponseInputModel)
        .output(submitFormResponseOutputModel)
        .mutation(async ({ input, ctx }) => {

            const ip = (ctx as any).req?.headers?.['x-forwarded-for'] || "unknown_ip"
            
            if (!checkRateLimit(ip as string)) {
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: "Rate limit exceeded. Please try again later."
                })
            }
            
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
