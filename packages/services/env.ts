import { z } from "zod";

const envSchema = z.object({
    JWT_SECRET: z.string().describe("JWT secret for signing tokens"),
    RESEND_API_KEY: z.string().describe("Resend email service API Key"),
    CLOUDINARY_CLOUD_NAME: z.string().default("dubngcmbl"),
    CLOUDINARY_API_KEY: z.string().default("115215566627279"),
    CLOUDINARY_API_SECRET: z.string().default("7dmG20-y6hmjwPrRm7hX1wnt-9M"),
    CLOUDINARY_FOLDER: z.string().default("for-form-builder-logos"),
});

function createEnv(env: NodeJS.ProcessEnv) {
    const safeParseResult = envSchema.safeParse(env);
    if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
    return safeParseResult.data;
}

export const env = createEnv(process.env);
