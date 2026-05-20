"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useListFormResponses } from "~/hooks/api/form-response";
import { useGetFormById } from "~/hooks/api/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Search, X, Filter, LayoutGrid, Eye, Download } from "lucide-react";
import { downloadResponsesAsCSV } from "~/lib/csv";

export default function FormResponsesPage() {
    const params = useParams();
    const formId = params.formId as string;

    const { data: form, isLoading: isFormLoading, error: formError } = useGetFormById(formId);
    const { data: responses, isLoading: isResponsesLoading } = useListFormResponses(formId);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFieldId, setSelectedFieldId] = useState<string>("all");
    const [filterValue, setFilterValue] = useState("");
    const [hiddenFieldIds, setHiddenFieldIds] = useState<Set<string>>(new Set());
    const [selectedResponse, setSelectedResponse] = useState<any>(null);

    if (isFormLoading || isResponsesLoading) {
        return (
            <div className="p-4 lg:p-8 space-y-8 animate-pulse">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16" />
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Individual Submissions</CardTitle>
                        <Skeleton className="h-4 w-64 mt-1" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-muted/40 p-4 border-b">
                                <Skeleton className="h-4 w-full" />
                            </div>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="p-4 border-b last:border-0 flex items-center justify-between">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-4 w-1/5" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
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

    const selectedField = form.fields.find((f: any) => f.id === selectedFieldId);

    const getFilterOptions = () => {
        if (selectedFieldId === "yes_no") {
            return ["Yes", "No"];
        }
        if (selectedField) {
            if (selectedField.type === "YES_NO") {
                return ["Yes", "No"];
            }
            if (selectedField.options) {
                try {
                    const opts = typeof selectedField.options === "string"
                        ? JSON.parse(selectedField.options)
                        : selectedField.options;
                    if (Array.isArray(opts)) {
                        return opts.map((opt: any) => typeof opt === "object" ? opt.value || opt.label : String(opt));
                    }
                } catch (e) {
                    console.error("Failed to parse options for filtering", e);
                }
            }
        }
        return null;
    };

    const filterOptions = getFilterOptions();

    const handleFieldChange = (val: string) => {
        setSelectedFieldId(val);
        setFilterValue("");
    };

    const toggleFieldVisibility = (fieldId: string) => {
        setHiddenFieldIds(prev => {
            const next = new Set(prev);
            if (next.has(fieldId)) {
                next.delete(fieldId);
            } else {
                next.add(fieldId);
            }
            return next;
        });
    };

    const visibleFields = form.fields.filter((field: any) => !hiddenFieldIds.has(field.id));

    const filteredResponses = responses.filter((response: any) => {
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            const emailMatch = response.respondentEmail && response.respondentEmail.toLowerCase().includes(query);
            const answerMatch = response.answers.some((answer: any) => 
                answer.value && answer.value.toLowerCase().includes(query)
            );
            if (!emailMatch && !answerMatch) return false;
        }

        if (filterValue.trim() !== "") {
            const filterVal = filterValue.toLowerCase();

            if (selectedFieldId === "all") {
                const emailMatch = response.respondentEmail && response.respondentEmail.toLowerCase().includes(filterVal);
                const answerMatch = response.answers.some((answer: any) => 
                    answer.value && answer.value.toLowerCase().includes(filterVal)
                );
                return emailMatch || answerMatch;
            }

            if (selectedFieldId === "email") {
                return response.respondentEmail && response.respondentEmail.toLowerCase().includes(filterVal);
            }

            const answer = response.answers.find((a: any) => a.fieldId === selectedFieldId);
            if (!answer) return false;
            
            return answer.value && answer.value.toLowerCase().includes(filterVal);
        }

        return true;
    });

    return (
        <div className="p-4 lg:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{form.title} - Responses</h2>
                    <p className="text-muted-foreground">View and analyze submissions for this form.</p>
                </div>
                <Button
                    onClick={() => downloadResponsesAsCSV(form, filteredResponses)}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-medium gap-2 shadow-sm"
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
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
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Individual Submissions</CardTitle>
                    <CardDescription>
                        {filteredResponses.length === responses.length 
                            ? `All ${responses.length} recorded responses for this form.`
                            : `Showing ${filteredResponses.length} of ${responses.length} filtered responses.`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center justify-between pb-2">
                        <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by email or answer..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 w-full bg-background"
                                    id="responses-search"
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Select value={selectedFieldId} onValueChange={handleFieldChange}>
                                    <SelectTrigger className="w-[180px] bg-background">
                                        <SelectValue placeholder="Filter by Column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Columns</SelectItem>
                                        <SelectItem value="email">Respondent Email</SelectItem>
                                        {form.fields.map((field: any) => (
                                            <SelectItem key={field.id} value={field.id}>
                                                {field.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {filterOptions ? (
                                    <Select value={filterValue} onValueChange={setFilterValue}>
                                        <SelectTrigger className="w-[180px] bg-background">
                                            <SelectValue placeholder="Select Option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value=" ">Any Option</SelectItem>
                                            {filterOptions.map((opt: string) => (
                                                <SelectItem key={opt} value={opt}>
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        placeholder="Filter value..."
                                        value={filterValue}
                                        onChange={(e) => setFilterValue(e.target.value)}
                                        className="w-[180px] bg-background"
                                        id="responses-filter"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2 bg-background ml-auto sm:ml-0">
                                        <LayoutGrid className="h-4 w-4" />
                                        Columns
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[200px]">
                                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {form.fields.map((field: any) => {
                                        const isVisible = !hiddenFieldIds.has(field.id);
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={field.id}
                                                checked={isVisible}
                                                onCheckedChange={() => toggleFieldVisibility(field.id)}
                                            >
                                                {field.label}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {(searchQuery || filterValue || selectedFieldId !== "all" || hiddenFieldIds.size > 0) && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedFieldId("all");
                                        setFilterValue("");
                                        setHiddenFieldIds(new Set());
                                    }}
                                    className="h-9 px-2 lg:px-3 text-muted-foreground hover:text-foreground"
                                >
                                    Reset
                                    <X className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {filteredResponses.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                            <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="font-semibold">No matching responses found</p>
                            <p className="text-sm">Try adjusting your search query or column filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border rounded-lg">
                            <Table className="min-w-full divide-y divide-x border-collapse">
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="divide-x">
                                        <TableHead className="w-[200px] border-r">Respondent Email</TableHead>
                                        <TableHead className="w-[200px] border-r">Submitted At</TableHead>
                                        {visibleFields.map((field: any) => (
                                            <TableHead key={field.id} className="border-r min-w-[200px]">{field.label}</TableHead>
                                        ))}
                                        <TableHead className="w-[100px] border-r text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredResponses.map((response: any) => (
                                        <TableRow key={response.id} className="divide-x hover:bg-muted/10">
                                            <TableCell className="font-medium text-blue-500 border-r py-3 px-4">
                                                {response.respondentEmail || <span className="text-muted-foreground italic">No email</span>}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground border-r py-3 px-4">
                                                {new Date(response.submittedAt).toLocaleString()}
                                            </TableCell>
                                            {visibleFields.map((field: any) => {
                                                const answer = response.answers.find((a: any) => a.fieldId === field.id);
                                                let displayValue = answer?.value || "-";
                                                
                                                try {
                                                    if (displayValue.startsWith("[") && displayValue.endsWith("]")) {
                                                        const parsed = JSON.parse(displayValue);
                                                        if (Array.isArray(parsed)) displayValue = parsed.join(", ");
                                                    }
                                                } catch (e) {}

                                                return (
                                                    <TableCell key={field.id} className="border-r py-3 px-4 max-w-[300px] truncate">
                                                        {displayValue}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell className="border-r py-3 px-4 text-center">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => setSelectedResponse(response)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sr-only">View Response</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!selectedResponse} onOpenChange={(open) => !open && setSelectedResponse(null)}>
                <DialogContent className="max-w-lg sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Response Details</DialogTitle>
                        <DialogDescription>
                            Submitted by <span className="font-semibold text-blue-500">{selectedResponse?.respondentEmail || "Anonymous"}</span> on {selectedResponse && new Date(selectedResponse.submittedAt).toLocaleString()}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 my-4">
                        {form.fields.map((field: any) => {
                            const answer = selectedResponse?.answers.find((a: any) => a.fieldId === field.id);
                            let displayValue = answer?.value || "-";
                            
                            try {
                                if (displayValue.startsWith("[") && displayValue.endsWith("]")) {
                                    const parsed = JSON.parse(displayValue);
                                    if (Array.isArray(parsed)) displayValue = parsed.join(", ");
                                }
                            } catch (e) {}

                            return (
                                <div key={field.id} className="p-3 border rounded-lg bg-muted/20 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            {field.label}
                                        </span>
                                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-medium">
                                            {field.type}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground whitespace-pre-wrap break-words">
                                        {displayValue}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setSelectedResponse(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
