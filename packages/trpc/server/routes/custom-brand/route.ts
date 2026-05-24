import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
    getCustomBrandOutputModel,
    updateCustomBrandInputModel,
    uploadLogoInputModel,
    uploadLogoOutputModel,
} from "./model";
import { customBrandService } from "../../services";
import { z } from "zod";

const TAGS = ["CustomBrand"];
const getPath = generatePath("/custom-brand");

export const customBrandRouter = router({
    getCustomBrand: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("getCustomBrand"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(z.undefined())
        .output(getCustomBrandOutputModel)
        .query(async ({ ctx }) => {
            const res = await customBrandService.getCustomBrand(ctx.user!.id);
            return {
                logoUrl: res.logoUrl,
                backgroundColor: res.backgroundColor,
                cardBgColor: res.cardBgColor,
                textColor: res.textColor,
                inputBgColor: res.inputBgColor,
                inputTextColor: res.inputTextColor,
                inputBorderColor: res.inputBorderColor,
            };
        }),

    updateCustomBrand: authenticatedProcedure
         .meta({
             openapi: {
                 method: "PUT",
                 path: getPath("updateCustomBrand"),
                 tags: TAGS,
                 protect: true,
             },
         })
        .input(updateCustomBrandInputModel)
        .output(getCustomBrandOutputModel)
        .mutation(async ({ input, ctx }) => {
            const res = await customBrandService.updateCustomBrand(ctx.user!.id, input);
            if (!res) {
                throw new Error("Failed to save brand settings");
            }
            return {
                logoUrl: res.logoUrl,
                backgroundColor: res.backgroundColor,
                cardBgColor: res.cardBgColor,
                textColor: res.textColor,
                inputBgColor: res.inputBgColor,
                inputTextColor: res.inputTextColor,
                inputBorderColor: res.inputBorderColor,
            };
        }),

    uploadLogo: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("uploadLogo"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(uploadLogoInputModel)
        .output(uploadLogoOutputModel)
        .mutation(async ({ input }) => {
            return await customBrandService.uploadLogo(input.logoBase64);
        }),
});
