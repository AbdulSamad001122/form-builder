import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";
import { eq } from "drizzle-orm";
import {
    formsTable,
    formFieldsTable,
    formResponsesTable,
    formResponseAnswersTable,
} from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function main() {
    try {
        const forms = await db.select().from(formsTable).limit(5);
        if (forms.length > 0) {
            const formId = forms[0].id;
            console.log("Form ID:", formId);

            const allAnswers = await db.select({
                responseId: formResponseAnswersTable.responseId,
                fieldId: formResponseAnswersTable.fieldId,
                value: formResponseAnswersTable.value
            })
                .from(formResponseAnswersTable)
                .innerJoin(formResponsesTable, eq(formResponsesTable.id, formResponseAnswersTable.responseId))
                .where(eq(formResponsesTable.formId, formId));

            console.log("All Answers query count:", allAnswers.length);
            console.log("All Answers rows:", allAnswers);
        }
    } catch (err) {
        console.error("Drizzle error:", err);
    } finally {
        await pool.end();
    }
}

main();
