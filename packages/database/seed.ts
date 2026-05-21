import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";
import { createHmac, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import {
    formsTable,
    formFieldsTable,
    usersTable,
    formResponsesTable,
    formResponseAnswersTable,
} from "./schema";


const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

function generateHash(salt: string, password: string): string {
    return createHmac("sha256", salt).update(password).digest("hex");
}

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]!;
}

async function main() {
    console.log("🌱 Seeding database...");

    try {
        const existingUser = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, "demo@formline.dev"))
            .limit(1);

        let userId: string;

        if (existingUser.length > 0) {
            userId = existingUser[0]!.id;
            console.log(`✅ Demo user already exists (id: ${userId})`);
        } else {
            const salt = randomBytes(16).toString("hex");
            const hash = generateHash(salt, "Demo@1234");

            const inserted = await db
                .insert(usersTable)
                .values({
                    email: "demo@formline.dev",
                    fullName: "Demo User",
                    password: hash,
                    salt,
                })
                .returning();

            userId = inserted[0]!.id;
            console.log(`✅ Created demo user (id: ${userId})`);
        }

        const existingForms = await db
            .select()
            .from(formsTable)
            .where(eq(formsTable.createdBy, userId));


        if (existingForms.length >= 3) {
            console.log("✅ Seed data already present. Skipping form creation.");
            await pool.end();
            return;
        }

        // ─── Form 1: Customer Satisfaction Survey ──────────────────────────────────
        const [form1] = await db
            .insert(formsTable)
            .values({
                title: "Customer Satisfaction Survey",
                description: "We'd love to hear your thoughts on our latest product updates and service quality.",
                visibility: "PUBLIC",
                status: "PUBLISHED",
                theme: "ocean",
                createdBy: userId,
            })
            .returning();

        const [f1q1, f1q2, f1q3, f1q4] = await db
            .insert(formFieldsTable)
            .values([
                {
                    formId: form1!.id,
                    label: "How would you rate your overall experience?",
                    labelKey: "overall_rating",
                    type: "RATING",
                    isRequired: true,
                    index: "1000.00",
                },
                {
                    formId: form1!.id,
                    label: "Which features do you use the most?",
                    labelKey: "features_used",
                    type: "MULTI_SELECT",
                    options: ["Dashboard", "Analytics", "Form Builder", "Reports", "API Access"],
                    isRequired: false,
                    index: "2000.00",
                },
                {
                    formId: form1!.id,
                    label: "Would you recommend us to a friend?",
                    labelKey: "recommend",
                    type: "YES_NO",
                    isRequired: true,
                    index: "3000.00",
                },
                {
                    formId: form1!.id,
                    label: "Any additional feedback or suggestions?",
                    labelKey: "feedback",
                    type: "LONG_TEXT",
                    placeholder: "Tell us what you think...",
                    isRequired: false,
                    index: "4000.00",
                },
            ])
            .returning();

        console.log(`✅ Created form: ${form1!.title}`);

        const form1Respondents = [
            { email: "alice@example.com", rating: "5", features: JSON.stringify(["Dashboard", "Analytics"]), recommend: "Yes", feedback: "Absolutely love the analytics dashboard!" },
            { email: "bob@example.com", rating: "4", features: JSON.stringify(["Form Builder", "API Access"]), recommend: "Yes", feedback: "Great product, could use more field types." },
            { email: "carol@example.com", rating: "3", features: JSON.stringify(["Reports"]), recommend: "No", feedback: "The UI could be more intuitive for new users." },
            { email: "dave@example.com", rating: "5", features: JSON.stringify(["Dashboard", "Form Builder", "Analytics"]), recommend: "Yes", feedback: "One of the best form tools I've used." },
            { email: "emma@example.com", rating: "4", features: JSON.stringify(["Analytics", "API Access"]), recommend: "Yes", feedback: "Fast and reliable. Would love CSV export." },
        ];

        for (const r of form1Respondents) {
            const submittedAt = new Date(Date.now() - Math.floor(Math.random() * 6) * 24 * 60 * 60 * 1000);
            const [response] = await db
                .insert(formResponsesTable)
                .values({ formId: form1!.id, respondentEmail: r.email, submittedAt })
                .returning();

            await db.insert(formResponseAnswersTable).values([
                { responseId: response!.id, fieldId: f1q1!.id, value: r.rating },
                { responseId: response!.id, fieldId: f1q2!.id, value: r.features },
                { responseId: response!.id, fieldId: f1q3!.id, value: r.recommend },
                { responseId: response!.id, fieldId: f1q4!.id, value: r.feedback },
            ]);
        }

        console.log(`✅ Seeded ${form1Respondents.length} responses for form 1`);

        // ─── Form 2: Hackathon Registration ────────────────────────────────────────
        const [form2] = await db
            .insert(formsTable)
            .values({
                title: "Hackathon 2026 Registration",
                description: "Register now for our flagship 48-hour hackathon! Build something amazing.",
                visibility: "PUBLIC",
                status: "PUBLISHED",
                theme: "neon",
                createdBy: userId,
            })
            .returning();

        const [f2q1, f2q2, f2q3, f2q4, f2q5] = await db
            .insert(formFieldsTable)
            .values([
                {
                    formId: form2!.id,
                    label: "Full Name",
                    labelKey: "full_name",
                    type: "TEXT",
                    isRequired: true,
                    placeholder: "e.g. Jane Smith",
                    index: "1000.00",
                },
                {
                    formId: form2!.id,
                    label: "Email Address",
                    labelKey: "email_address",
                    type: "EMAIL",
                    isRequired: true,
                    placeholder: "you@example.com",
                    index: "2000.00",
                },
                {
                    formId: form2!.id,
                    label: "Which track are you most interested in?",
                    labelKey: "track",
                    type: "SINGLE_SELECT",
                    options: ["AI / ML", "Web3 / Blockchain", "HealthTech", "FinTech", "Open Innovation"],
                    isRequired: true,
                    index: "3000.00",
                },
                {
                    formId: form2!.id,
                    label: "Do you need a mentor assigned to your team?",
                    labelKey: "needs_mentor",
                    type: "YES_NO",
                    isRequired: false,
                    index: "4000.00",
                },
                {
                    formId: form2!.id,
                    label: "Tell us about your team and idea (optional)",
                    labelKey: "team_idea",
                    type: "LONG_TEXT",
                    placeholder: "Brief description of your team or project idea...",
                    isRequired: false,
                    index: "5000.00",
                },
            ])
            .returning();

        console.log(`✅ Created form: ${form2!.title}`);

        const form2Respondents = [
            { name: "Zara Khan", email: "zara@dev.io", track: "AI / ML", mentor: "Yes", idea: "Building an AI-powered resume screener for HR teams." },
            { name: "Liam Chen", email: "liam@startup.co", track: "Web3 / Blockchain", mentor: "No", idea: "Decentralized voting platform for DAOs." },
            { name: "Sofia Russo", email: "sofia@health.org", track: "HealthTech", mentor: "Yes", idea: "Remote patient monitoring with real-time alerts." },
            { name: "Jake Williams", email: "jake@fintech.io", track: "FinTech", mentor: "No", idea: "AI budgeting assistant for Gen Z users." },
            { name: "Priya Sharma", email: "priya@devs.in", track: "Open Innovation", mentor: "Yes", idea: "Community-driven urban farming platform." },
            { name: "Omar Al-Farsi", email: "omar@code.ae", track: "AI / ML", mentor: "No", idea: "" },
        ];

        for (const r of form2Respondents) {
            const submittedAt = new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000);
            const [response] = await db
                .insert(formResponsesTable)
                .values({ formId: form2!.id, respondentEmail: r.email, submittedAt })
                .returning();

            const answers = [
                { responseId: response!.id, fieldId: f2q1!.id, value: r.name },
                { responseId: response!.id, fieldId: f2q2!.id, value: r.email },
                { responseId: response!.id, fieldId: f2q3!.id, value: r.track },
                { responseId: response!.id, fieldId: f2q4!.id, value: r.mentor },
            ];
            if (r.idea) {
                answers.push({ responseId: response!.id, fieldId: f2q5!.id, value: r.idea });
            }
            await db.insert(formResponseAnswersTable).values(answers);
        }

        console.log(`✅ Seeded ${form2Respondents.length} responses for form 2`);

        // ─── Form 3: Movie Night Picks ─────────────────────────────────────────────
        const [form3] = await db
            .insert(formsTable)
            .values({
                title: "Movie Night Picks 🎬",
                description: "Help us choose the best movies for our weekly community movie night! Vote for your favourites.",
                visibility: "PUBLIC",
                status: "PUBLISHED",
                theme: "galaxy",
                createdBy: userId,
            })
            .returning();

        const [f3q1, f3q2, f3q3, f3q4] = await db
            .insert(formFieldsTable)
            .values([
                {
                    formId: form3!.id,
                    label: "Your Name",
                    labelKey: "your_name",
                    type: "TEXT",
                    isRequired: true,
                    placeholder: "e.g. Alex",
                    index: "1000.00",
                },
                {
                    formId: form3!.id,
                    label: "Pick your favourite genre",
                    labelKey: "genre",
                    type: "SINGLE_SELECT",
                    options: ["Action", "Comedy", "Sci-Fi", "Thriller", "Horror", "Romance", "Documentary"],
                    isRequired: true,
                    index: "2000.00",
                },
                {
                    formId: form3!.id,
                    label: "Which movies would you like to watch? (pick all that apply)",
                    labelKey: "movie_picks",
                    type: "MULTI_SELECT",
                    options: ["Oppenheimer", "Dune Part Two", "Poor Things", "The Bear", "Interstellar", "Parasite", "Everything Everywhere All at Once"],
                    isRequired: true,
                    index: "3000.00",
                },
                {
                    formId: form3!.id,
                    label: "Rate your excitement for movie night (1–5)",
                    labelKey: "excitement_rating",
                    type: "RATING",
                    isRequired: false,
                    index: "4000.00",
                },
            ])
            .returning();

        console.log(`✅ Created form: ${form3!.title}`);

        const form3Respondents = [
            { name: "Alex", email: "alex@mail.com", genre: "Sci-Fi", picks: JSON.stringify(["Dune Part Two", "Interstellar"]), rating: "5" },
            { name: "Jordan", email: "jordan@mail.com", genre: "Thriller", picks: JSON.stringify(["Oppenheimer", "Parasite"]), rating: "4" },
            { name: "Morgan", email: "morgan@mail.com", genre: "Comedy", picks: JSON.stringify(["Everything Everywhere All at Once", "Poor Things"]), rating: "5" },
            { name: "Riley", email: "riley@mail.com", genre: "Action", picks: JSON.stringify(["Dune Part Two", "Oppenheimer"]), rating: "3" },
            { name: "Sam", email: "sam@mail.com", genre: "Documentary", picks: JSON.stringify(["Parasite", "Poor Things"]), rating: "4" },
        ];

        for (const r of form3Respondents) {
            const submittedAt = new Date(Date.now() - Math.floor(Math.random() * 4) * 24 * 60 * 60 * 1000);
            const [response] = await db
                .insert(formResponsesTable)
                .values({ formId: form3!.id, respondentEmail: r.email, submittedAt })
                .returning();

            await db.insert(formResponseAnswersTable).values([
                { responseId: response!.id, fieldId: f3q1!.id, value: r.name },
                { responseId: response!.id, fieldId: f3q2!.id, value: r.genre },
                { responseId: response!.id, fieldId: f3q3!.id, value: r.picks },
                { responseId: response!.id, fieldId: f3q4!.id, value: r.rating },
            ]);
        }

        console.log(`✅ Seeded ${form3Respondents.length} responses for form 3`);

        console.log("\n🎉 Seeding complete!");
        console.log("────────────────────────────────────");
        console.log("  Demo email:    demo@formline.dev");
        console.log("  Demo password: Demo@1234");
        console.log("  Forms seeded:  3");
        console.log("  Responses:     16 total");
        console.log("────────────────────────────────────\n");
    } catch (err) {
        console.error("❌ Error seeding database:", err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
