import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formFieldService } from "../../services";
import { z } from "zod";
import { 
    createFormFieldInputModel, 
    updateFormFieldInputModel, 
    deleteFormFieldInputModel, 
    listFormFieldsInputModel,
    listFormFieldsOutputModel,
    reorderFormFieldInputModel,
    formFieldActionOutputModel
} from "./model";

const TAGS = ["FormField"]
const getPath = generatePath("/form-field")

export const formFieldRouter = router({
    createFormField: authenticatedProcedure
        .meta({ method: "POST", path: getPath("createFormField"), tags: TAGS, protect: true })
        .input(createFormFieldInputModel)
        .output(formFieldActionOutputModel)
        .mutation(async ({ input, ctx }) => {
            const result = await formFieldService.createFormField({
                ...input,
                userId: ctx.user!.id,
            });
            return { id: result!.id };
        }),

    updateFormField: authenticatedProcedure
        .meta({ method: "PUT", path: getPath("updateFormField"), tags: TAGS, protect: true })
        .input(updateFormFieldInputModel)
        .output(formFieldActionOutputModel)
        .mutation(async ({ input, ctx }) => {
            const result = await formFieldService.updateFormField({
                ...input,
                userId: ctx.user!.id,
            });
            return { id: result!.id };
        }),

    deleteFormField: authenticatedProcedure
        .meta({ method: "DELETE", path: getPath("deleteFormField"), tags: TAGS, protect: true })
        .input(deleteFormFieldInputModel)
        .output(formFieldActionOutputModel)
        .mutation(async ({ input, ctx }) => {
            const result = await formFieldService.deleteFormField({
                id: input.id,
                userId: ctx.user!.id,
            });
            return { id: result!.id };
        }),

    listFormFields: authenticatedProcedure
        .meta({ method: "GET", path: getPath("listFormFields"), tags: TAGS, protect: true })
        .input(listFormFieldsInputModel)
        .output(z.array(listFormFieldsOutputModel))
        .query(async ({ input, ctx }) => {
            return await formFieldService.listFormFields({
                formId: input.formId,
                userId: ctx.user!.id,
            });
        }),

    reorderFormField: authenticatedProcedure
        .meta({ method: "PUT", path: getPath("reorderFormField"), tags: TAGS, protect: true })
        .input(reorderFormFieldInputModel)
        .output(formFieldActionOutputModel)
        .mutation(async ({ input, ctx }) => {
            const result = await formFieldService.reorderFormField({
                ...input,
                userId: ctx.user!.id,
            });
            return { id: result!.id };
        }),
});
