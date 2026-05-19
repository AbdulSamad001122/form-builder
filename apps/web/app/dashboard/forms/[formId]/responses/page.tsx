"use client";

import { useParams } from "next/navigation";
import { useListFormResponses } from "~/hooks/api/form-response";
import { useGetFormById } from "~/hooks/api/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Loader2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";

export default function FormResponsesPage() {
    const params = useParams();
    const formId = params.formId as string;

    const { data: form, isLoading: isFormLoading, error: formError } = useGetFormById(formId);
    const { data: responses, isLoading: isResponsesLoading } = useListFormResponses(formId);

    if (isFormLoading || isResponsesLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!form || !responses) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive font-medium">Error loading data</p>
                    {formError && <p className="text-muted-foreground text-sm mt-1">{formError.message}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{form.title} - Responses</h2>
                <p className="text-muted-foreground">View and analyze submissions for this form.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{responses.length}</div>
                    </CardContent>
                </Card>
                {/* Additional analytics cards can go here */}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Individual Submissions</CardTitle>
                    <CardDescription>All recorded responses for this form.</CardDescription>
                </CardHeader>
                <CardContent>
                    {responses.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No responses yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">Respondent Email</TableHead>
                                        <TableHead className="w-[150px]">Submitted At</TableHead>
                                        {form.fields.map((field: any) => (
                                            <TableHead key={field.id}>{field.label}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {responses.map((response: any) => (
                                        <TableRow key={response.id}>
                                            <TableCell className="font-medium text-blue-500">
                                                {response.respondentEmail || <span className="text-muted-foreground italic">No email</span>}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(response.submittedAt).toLocaleString()}
                                            </TableCell>
                                            {form.fields.map((field: any) => {
                                                const answer = response.answers.find((a: any) => a.fieldId === field.id);
                                                let displayValue = answer?.value || "-";
                                                
                                                try {
                                                    // Parse if it looks like a JSON array
                                                    if (displayValue.startsWith("[") && displayValue.endsWith("]")) {
                                                        const parsed = JSON.parse(displayValue);
                                                        if (Array.isArray(parsed)) displayValue = parsed.join(", ");
                                                    }
                                                } catch (e) {}

                                                return (
                                                    <TableCell key={field.id}>
                                                        {displayValue}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
