import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
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

async function main() {
    try {
        const existingUser = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, "demo@formit.dev"))
            .limit(1);

        let userId: string;

        if (existingUser.length > 0) {
            userId = existingUser[0]!.id;
        } else {
            const salt = randomBytes(16).toString("hex");
            const hash = generateHash(salt, "Demo@1234");

            const inserted = await db
                .insert(usersTable)
                .values({
                    email: "demo@formit.dev",
                    fullName: "Demo User",
                    password: hash,
                    salt,
                })
                .returning();

            userId = inserted[0]!.id;
        }

        await db.delete(formsTable).where(eq(formsTable.createdBy, userId));

        const [form1] = await db
            .insert(formsTable)
            .values({
                title: "Customer Satisfaction Survey",
                description: "We'd love to hear your thoughts on our latest product updates and service quality.",
                visibility: "PUBLIC",
                status: "PUBLISHED",
                theme: "forest",
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

        const [form2] = await db
            .insert(formsTable)
            .values({
                title: "Hackathon 2026 Registration",
                description: "Register now for our flagship 48-hour hackathon! Build something amazing.",
                visibility: "PUBLIC",
                status: "PUBLISHED",
                theme: "doodle",
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

        const [form3] = await db
            .insert(formsTable)
            .values({
                title: "Movie Night Picks 🎬",
                description: "Help us choose the best movies for our weekly community movie night! Let's choose the best films together.",
                visibility: "PUBLIC",
                status: "PUBLISHED",
                theme: "death-note",
                createdBy: userId,
            })
            .returning();

        const f3q1Id = randomUUID();
        const f3q2Id = randomUUID();
        const f3q3Id = randomUUID();
        const f3q4Id = randomUUID();
        const f3q5Id = randomUUID();
        const f3q6Id = randomUUID();
        const f3q7Id = randomUUID();

        await db
            .insert(formFieldsTable)
            .values([
                {
                    id: f3q1Id,
                    formId: form3!.id,
                    label: "Your Name",
                    labelKey: "your_name",
                    type: "TEXT",
                    isRequired: true,
                    placeholder: "e.g. Alex",
                    index: "1000.00",
                },
                {
                    id: f3q2Id,
                    formId: form3!.id,
                    label: "Pick your favourite genre",
                    labelKey: "genre",
                    type: "SINGLE_SELECT",
                    options: ["Sci-Fi", "Comedy", "Documentary"],
                    conditionalRules: [
                        {
                            id: `rule-${f3q2Id}-SciFi`,
                            value: "Sci-Fi",
                            targetFieldId: f3q3Id,
                            edgeType: "smoothstep",
                            color: "#6366f1",
                            animated: true,
                        },
                        {
                            id: `rule-${f3q2Id}-Comedy`,
                            value: "Comedy",
                            targetFieldId: f3q4Id,
                            edgeType: "smoothstep",
                            color: "#10b981",
                            animated: true,
                        },
                        {
                            id: `rule-${f3q2Id}-Documentary`,
                            value: "Documentary",
                            targetFieldId: f3q5Id,
                            edgeType: "smoothstep",
                            color: "#f59e0b",
                            animated: true,
                        },
                    ],
                    isRequired: true,
                    index: "2000.00",
                },
                {
                    id: f3q3Id,
                    formId: form3!.id,
                    label: "Choose a Sci-Fi movie",
                    labelKey: "scifi_picker",
                    type: "SINGLE_SELECT",
                    options: ["Dune Part Two", "Interstellar", "Blade Runner 2049"],
                    conditionalRules: [
                        {
                            id: `rule-${f3q3Id}-Default`,
                            value: "default",
                            targetFieldId: f3q6Id,
                            edgeType: "smoothstep",
                            color: "#64748b",
                            animated: true,
                        },
                    ],
                    isRequired: true,
                    index: "3000.00",
                },
                {
                    id: f3q4Id,
                    formId: form3!.id,
                    label: "Choose a Comedy movie",
                    labelKey: "comedy_picker",
                    type: "SINGLE_SELECT",
                    options: ["Everything Everywhere All at Once", "Poor Things", "Barbie"],
                    conditionalRules: [
                        {
                            id: `rule-${f3q4Id}-Default`,
                            value: "default",
                            targetFieldId: f3q6Id,
                            edgeType: "smoothstep",
                            color: "#64748b",
                            animated: true,
                        },
                    ],
                    isRequired: true,
                    index: "4000.00",
                },
                {
                    id: f3q5Id,
                    formId: form3!.id,
                    label: "Choose a Documentary movie",
                    labelKey: "documentary_picker",
                    type: "SINGLE_SELECT",
                    options: ["Parasite", "My Octopus Teacher", "Free Solo"],
                    conditionalRules: [
                        {
                            id: `rule-${f3q5Id}-Default`,
                            value: "default",
                            targetFieldId: f3q6Id,
                            edgeType: "smoothstep",
                            color: "#64748b",
                            animated: true,
                        },
                    ],
                    isRequired: true,
                    index: "5000.00",
                },
                {
                    id: f3q6Id,
                    formId: form3!.id,
                    label: "Rate your excitement for movie night (1–5)",
                    labelKey: "excitement_rating",
                    type: "RATING",
                    isRequired: false,
                    index: "6000.00",
                },
                {
                    id: f3q7Id,
                    formId: form3!.id,
                    label: "Any suggestions?",
                    labelKey: "suggestions",
                    type: "LONG_TEXT",
                    isRequired: false,
                    index: "7000.00",
                },
            ]);

        const form3Respondents = [
            { name: "Alex", email: "alex@mail.com", genre: "Sci-Fi", choiceField: f3q3Id, choiceValue: "Dune Part Two", rating: "5" },
            { name: "Jordan", email: "jordan@mail.com", genre: "Comedy", choiceField: f3q4Id, choiceValue: "Everything Everywhere All at Once", rating: "4" },
            { name: "Sam", email: "sam@mail.com", genre: "Documentary", choiceField: f3q5Id, choiceValue: "Parasite", rating: "5" },
        ];

        for (const r of form3Respondents) {
            const submittedAt = new Date(Date.now() - Math.floor(Math.random() * 4) * 24 * 60 * 60 * 1000);
            const [response] = await db
                .insert(formResponsesTable)
                .values({ formId: form3!.id, respondentEmail: r.email, submittedAt })
                .returning();

            await db.insert(formResponseAnswersTable).values([
                { responseId: response!.id, fieldId: f3q1Id, value: r.name },
                { responseId: response!.id, fieldId: f3q2Id, value: r.genre },
                { responseId: response!.id, fieldId: r.choiceField, value: r.choiceValue },
                { responseId: response!.id, fieldId: f3q6Id, value: r.rating },
            ]);
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
