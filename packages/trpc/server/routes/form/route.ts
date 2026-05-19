import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createFormInputModel, createFormOutputModel, listFormByUserIdOutputModel, updateFormInputModel, updateFormOutputModel, deleteFormInputModel, deleteFormOutputModel } from "./model";
import { formService } from "../../services";
import { z } from "zod";

const TAGS = ["Form"]

const getPath = generatePath("/form")


export const formRouter = router({
    createForm: authenticatedProcedure
        .meta({
            method: "POST",
            path: getPath("createForm"),
            tags: TAGS,
            protect: true,
        })
        .input(createFormInputModel)
        .output(createFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { title, description } = input;

            const { id } = await formService.createForm({
                userId: ctx.user!.id,
                title,
                description,
            });

            return { formId: id };
        }),

    listFormByUserId: authenticatedProcedure
        .meta({
            method: "GET",
            path: getPath("listFormByUserId"),
            tags: TAGS,
            protect: true,
        })
        .input(z.undefined())
        .output(z.array(listFormByUserIdOutputModel))
        .query(async ({ ctx }) => {

            return formService.listFormById({
                userId: ctx.user!.id,
            });
        }),

    updateForm: authenticatedProcedure
        .meta({
            method: "PUT",
            path: getPath("updateForm"),
            tags: TAGS,
            protect: true,
        })
        .input(updateFormInputModel)
        .output(updateFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { id } = await formService.updateForm({
                ...input,
                userId: ctx.user!.id,
            });

            return { formId: id };
        }),

    deleteForm: authenticatedProcedure
        .meta({
            method: "DELETE",
            path: getPath("deleteForm"),
            tags: TAGS,
            protect: true,
        })
        .input(deleteFormInputModel)
        .output(deleteFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { id } = await formService.deleteForm({
                id: input.id,
                userId: ctx.user!.id,
            });

            return { formId: id };
        }),
});