import { z } from "zod";

const envSchema = z.object({
    JWT_SECRET: z.string().describe("JWT secret for signing tokens"),
    BREVO_API_KEY: z.string().describe("Brevo email service API Key"),
    CLOUDINARY_CLOUD_NAME: z.string().describe("Cloudinary Cloud Name"),
    CLOUDINARY_API_KEY: z.string().describe("Cloudinary API Key"),
    CLOUDINARY_API_SECRET: z.string().describe("Cloudinary API Secret"),
    CLOUDINARY_FOLDER: z.string().default("for-form-builder-logos"),
});

function createEnv(env: NodeJS.ProcessEnv) {
    const safeParseResult = envSchema.safeParse(env);
    if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
    return safeParseResult.data;
}

export const env = createEnv(process.env);
