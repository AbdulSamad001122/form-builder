import { z } from "zod";

export const getCustomBrandOutputModel = z.object({
    logoUrl: z.string().nullable(),
    backgroundColor: z.string(),
    cardBgColor: z.string(),
    textColor: z.string(),
    inputBgColor: z.string(),
    inputTextColor: z.string(),
    inputBorderColor: z.string(),
});

export const updateCustomBrandInputModel = z.object({
    logoUrl: z.string().nullable(),
    backgroundColor: z.string(),
    cardBgColor: z.string(),
    textColor: z.string(),
    inputBgColor: z.string(),
    inputTextColor: z.string(),
    inputBorderColor: z.string(),
});

export const uploadLogoInputModel = z.object({
    logoBase64: z.string(),
});

export const uploadLogoOutputModel = z.object({
    logoUrl: z.string(),
});
