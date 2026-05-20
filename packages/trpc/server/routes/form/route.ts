import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createFormInputModel, createFormOutputModel, listFormByUserIdOutputModel, updateFormInputModel, updateFormOutputModel, deleteFormInputModel, deleteFormOutputModel, getPublicFormInputModel, getPublicFormOutputModel, getFormByIdInputModel, getFormByIdOutputModel, getDashboardStatsOutputModel, listExploreFormsInputModel, listExploreFormsOutputModel } from "./model";
import { formService } from "../../services";
import { z } from "zod";

const TAGS = ["Form"]

const getPath = generatePath("/form")


export const formRouter = router({
    createForm: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("createForm"),
                tags: TAGS,
                protect: true,
            }
        })
        .input(createFormInputModel)
        .output(createFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { title, description, slug, theme, visibility, status } = input;

            const { id } = await formService.createForm({
                userId: ctx.user!.id,
                title,
                description,
                slug,
                theme,
                visibility,
                status
            });

            return { formId: id };
        }),

    listFormByUserId: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("listFormByUserId"),
                tags: TAGS,
                protect: true,
            }
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
            openapi: {
                method: "PUT",
                path: getPath("updateForm"),
                tags: TAGS,
                protect: true,
            }
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
            openapi: {
                method: "DELETE",
                path: getPath("deleteForm"),
                tags: TAGS,
                protect: true,
            }
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

    getPublicForm: publicProcedure
        .meta({ 
            openapi: { method: "GET", path: getPath("getPublicForm"), tags: TAGS, protect: false }
        })
        .input(getPublicFormInputModel)
        .output(getPublicFormOutputModel)
        .query(async ({ input }) => {
            return await formService.getPublicForm(input.id)
        }),

    getFormById: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("getFormById"),
                tags: TAGS,
                protect: true,
            }
        })
        .input(getFormByIdInputModel)
        .output(getFormByIdOutputModel)
        .query(async ({ input, ctx }) => {
            return await formService.getFormById({
                id: input.id,
                userId: ctx.user!.id,
            })
        }),

    getDashboardStats: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("getDashboardStats"),
                tags: TAGS,
                protect: true,
            }
        })
        .input(z.undefined())
        .output(getDashboardStatsOutputModel)
        .query(async ({ ctx }) => {
            return await formService.getDashboardStats({
                userId: ctx.user!.id,
            });
        }),

    listExploreForms: publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("listExploreForms"),
                tags: TAGS,
                protect: false,
            }
        })
        .input(listExploreFormsInputModel)
        .output(listExploreFormsOutputModel)
        .query(async ({ input }) => {
            return await formService.listExploreForms({ search: input.search })
        }),
});