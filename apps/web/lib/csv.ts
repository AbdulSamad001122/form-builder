/**
 * Utility to format and trigger a client-side CSV download of form responses.
 */

export function downloadResponsesAsCSV(
    form: { title: string; fields: any[] },
    responses: any[]
) {
    if (!form || !responses) return;

    const headers = [
        "Respondent Email",
        "Submitted At",
        ...form.fields.map((field) => field.label),
    ];

    const escapeCSVCell = (val: string) => {
        if (!val) return '""';
        const formatted = val.replace(/"/g, '""');
        return `"${formatted}"`;
    };

    const rows = responses.map((response) => {
        const email = response.respondentEmail || "Anonymous";
        const date = new Date(response.submittedAt).toLocaleString();

        const fieldAnswers = form.fields.map((field) => {
            const answer = response.answers.find((a: any) => a.fieldId === field.id);
            let displayValue = answer?.value || "";

            try {
                if (displayValue.startsWith("[") && displayValue.endsWith("]")) {
                    const parsed = JSON.parse(displayValue);
                    if (Array.isArray(parsed)) {
                        displayValue = parsed.join(", ");
                    }
                }
            } catch (e) {
                // Return original displayValue if JSON parsing fails
            }

            return displayValue;
        });

        return [email, date, ...fieldAnswers].map(escapeCSVCell).join(",");
    });

    const csvContent = [
        headers.map(escapeCSVCell).join(","),
        ...rows,
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const sanitizedTitle = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const filename = `${sanitizedTitle}_responses_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
