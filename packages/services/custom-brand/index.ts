import { db, eq } from "@repo/database";
import { customBrandsTable } from "../../database/schema";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../env";

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

export default class CustomBrandService {
    public async getCustomBrand(userId: string) {
        const [brand] = await db
            .select()
            .from(customBrandsTable)
            .where(eq(customBrandsTable.userId, userId))
            .limit(1);

        if (!brand) {
            return {
                logoUrl: null,
                backgroundColor: "#030712",
                cardBgColor: "rgba(255,255,255,0.03)",
                textColor: "#f9fafb",
                inputBgColor: "rgba(255,255,255,0.05)",
                inputTextColor: "#ffffff",
                inputBorderColor: "rgba(255,255,255,0.1)",
            };
        }

        return brand;
    }

    private extractPublicId(url: string): string | null {
        try {
            const parts = url.split("/upload/");
            if (parts.length < 2) return null;
            const path = parts[1]!.replace(/^v\d+\//, "");
            return path.substring(0, path.lastIndexOf("."));
        } catch {
            return null;
        }
    }

    public async updateCustomBrand(
        userId: string,
        payload: {
            logoUrl: string | null;
            backgroundColor: string;
            cardBgColor: string;
            textColor: string;
            inputBgColor: string;
            inputTextColor: string;
            inputBorderColor: string;
        }
    ) {
        const [existing] = await db
            .select()
            .from(customBrandsTable)
            .where(eq(customBrandsTable.userId, userId))
            .limit(1);

        if (existing) {
            if (existing.logoUrl && existing.logoUrl !== payload.logoUrl) {
                const publicId = this.extractPublicId(existing.logoUrl);
                if (publicId) {
                    try {
                        await cloudinary.uploader.destroy(publicId);
                    } catch (err) {
                        console.error("Failed to delete logo from Cloudinary:", err);
                    }
                }
            }

            const [updated] = await db
                .update(customBrandsTable)
                .set({
                    logoUrl: payload.logoUrl,
                    backgroundColor: payload.backgroundColor,
                    cardBgColor: payload.cardBgColor,
                    textColor: payload.textColor,
                    inputBgColor: payload.inputBgColor,
                    inputTextColor: payload.inputTextColor,
                    inputBorderColor: payload.inputBorderColor,
                    updatedAt: new Date(),
                })
                .where(eq(customBrandsTable.userId, userId))
                .returning();
            return updated;
        } else {
            const [created] = await db
                .insert(customBrandsTable)
                .values({
                    userId,
                    logoUrl: payload.logoUrl,
                    backgroundColor: payload.backgroundColor,
                    cardBgColor: payload.cardBgColor,
                    textColor: payload.textColor,
                    inputBgColor: payload.inputBgColor,
                    inputTextColor: payload.inputTextColor,
                    inputBorderColor: payload.inputBorderColor,
                })
                .returning();
            return created;
        }
    }

    public async uploadLogo(base64Image: string) {
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: env.CLOUDINARY_FOLDER,
        });
        return { logoUrl: result.secure_url };
    }
}
