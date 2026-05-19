import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";
import { formsTable, formFieldsTable, usersTable } from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

async function main() {
    console.log("Seeding database...");

    try {
        // Find or create a user to own the seed data
        const users = await db.select().from(usersTable).limit(1);
        let userId = "";

        if (users.length === 0) {
            console.log("No users found. Creating a test user...");
            const insertRes = await db.insert(usersTable).values({
                email: "demo@example.com",
                fullName: "Demo User",
                password: "hashed_password_placeholder", // Assuming standard auth
            }).returning();
            userId = insertRes[0]!.id;
        } else {
            userId = users[0]!.id;
        }

        console.log(`Using User ID: ${userId}`);

        // Create Demo Form 1: Customer Feedback
        const form1 = await db.insert(formsTable).values({
            title: "Customer Satisfaction Survey",
            description: "We'd love to hear your thoughts on our recent updates.",
            visibility: "PUBLIC",
            status: "PUBLISHED",
            createdBy: userId,
        }).returning();
        
        if (!form1 || !form1[0]) throw new Error("Failed to create form 1");
        console.log(`Created Form: ${form1[0].title}`);

        // Add fields to Form 1
        await db.insert(formFieldsTable).values([
            {
                formId: form1[0].id,
                label: "How would you rate your overall experience?",
                labelKey: "overall_experience",
                type: "RATING",
                isRequired: true,
                index: "0.0",
            },
            {
                formId: form1[0].id,
                label: "What features do you use the most?",
                labelKey: "features_used",
                type: "MULTI_SELECT",
                options: ["Dashboard", "Analytics", "Reports", "Settings"],
                isRequired: false,
                index: "1.0",
            },
            {
                formId: form1[0].id,
                label: "Any other feedback?",
                labelKey: "feedback",
                type: "LONG_TEXT",
                placeholder: "Tell us what you think...",
                isRequired: false,
                index: "2.0",
            }
        ]);

        // Create Demo Form 2: Event Registration
        const form2 = await db.insert(formsTable).values({
            title: "Hackathon Registration",
            description: "Sign up for our upcoming 2026 Hackathon event!",
            visibility: "PUBLIC",
            status: "PUBLISHED",
            createdBy: userId,
        }).returning();

        if (!form2 || !form2[0]) throw new Error("Failed to create form 2");
        console.log(`Created Form: ${form2[0].title}`);

        // Add fields to Form 2
        await db.insert(formFieldsTable).values([
            {
                formId: form2[0].id,
                label: "Full Name",
                labelKey: "full_name",
                type: "TEXT",
                isRequired: true,
                index: "0.0",
            },
            {
                formId: form2[0].id,
                label: "Email Address",
                labelKey: "email",
                type: "EMAIL",
                isRequired: true,
                index: "1.0",
            },
            {
                formId: form2[0].id,
                label: "Dietary Restrictions",
                labelKey: "dietary",
                type: "SINGLE_SELECT",
                options: ["None", "Vegetarian", "Vegan", "Gluten-Free"],
                isRequired: true,
                index: "2.0",
            },
            {
                formId: form2[0].id,
                label: "Do you need a mentor?",
                labelKey: "needs_mentor",
                type: "YES_NO",
                isRequired: false,
                index: "3.0",
            }
        ]);

        console.log("Seeding complete! 🚀");
    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        await pool.end();
    }
}

main();
