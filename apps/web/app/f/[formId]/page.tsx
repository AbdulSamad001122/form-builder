"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetPublicForm } from "~/hooks/api/form";
import { useSubmitFormResponse } from "~/hooks/api/form-response";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Checkbox } from "~/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import { getThemeById } from "~/lib/form-themes";
import { toast } from "sonner";
import { Skeleton } from "~/components/ui/skeleton";

type Step = "email" | "form" | "submitted";

export default function PublicFormPage() {
    const params = useParams();
    const formId = params.formId as string;

    const { data: form, isLoading, isError, error } = useGetPublicForm(formId);
    const { mutate: submitResponse, isPending: isSubmitting } = useSubmitFormResponse();

    const [step, setStep] = useState<Step>("email");
    const [respondentEmail, setRespondentEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Resolve theme (after form loads)
    const theme = getThemeById(form?.theme);

    // ─── Loading ───────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4 animate-pulse">
                <div className="w-full max-w-md space-y-6 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <div className="space-y-3 text-center">
                        <Skeleton className="h-8 w-2/3 mx-auto" />
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    // ─── Error ─────────────────────────────────────────────────────────────────
    if (isError || !form) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950 p-4">
                <div className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 text-center">
                    <p className="text-red-400 font-semibold text-lg mb-2">Form Unavailable</p>
                    <p className="text-gray-400 text-sm">
                        {(error as any)?.message || "This form does not exist or is not currently accepting responses."}
                    </p>
                </div>
            </div>
        );
    }

    // ─── Submitted ─────────────────────────────────────────────────────────────
    if (step === "submitted") {
        return (
            <div className={`${theme.page} flex items-center justify-center`}>
                <div className="w-full max-w-lg text-center p-8 space-y-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl"
                        style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h2 className={`text-3xl font-extrabold mb-2 ${theme.title}`}>Thank you!</h2>
                        <p className={`${theme.subtitle} opacity-80`}>Your response has been recorded successfully.</p>
                        {respondentEmail && (
                            <p className={`text-sm mt-2 ${theme.footer}`}>
                                Submitted as <strong>{respondentEmail}</strong>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!respondentEmail.trim()) {
            setEmailError("Email is required to submit this form.");
            return;
        }
        if (!emailRegex.test(respondentEmail)) {
            setEmailError("Please enter a valid email address.");
            return;
        }
        setEmailError("");
        setStep("form");
    };

    const handleFieldChange = (fieldId: string, value: any) => {
        setAnswers((prev) => ({ ...prev, [fieldId]: value }));
        if (validationErrors[fieldId]) {
            setValidationErrors((prev) => {
                const updated = { ...prev };
                delete updated[fieldId];
                return updated;
            });
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};
        let isValid = true;

        form.fields.forEach((field: any) => {
            const val = answers[field.id];
            const isMissing =
                val === undefined || val === null || val === "" ||
                (Array.isArray(val) && val.length === 0);
            if (field.isRequired && isMissing) {
                newErrors[field.id] = "This field is required";
                isValid = false;
            }
        });

        if (!isValid) {
            setValidationErrors(newErrors);
            const firstId = Object.keys(newErrors)[0];
            document.getElementById(`field-${firstId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const formattedAnswers = Object.entries(answers).map(([fieldId, value]) => ({
            fieldId,
            value: typeof value === "object" ? JSON.stringify(value) : String(value),
        }));

        submitResponse(
            { formId: form.id, respondentEmail, answers: formattedAnswers },
            {
                onSuccess: () => {
                    setStep("submitted");
                    toast.success("Response submitted successfully!");
                },
                onError: (err) => {
                    toast.error(`Failed to submit response: ${err.message}`);
                },
            }
        );
    };

    // ─── Field Renderer ───────────────────────────────────────────────────────
    const renderField = (field: any) => {
        const errorMsg = validationErrors[field.id];
        const opts = Array.isArray(field.options) ? field.options : [];
        let inputEl: React.ReactNode = null;

        switch (field.type) {
            case "TEXT":
            case "EMAIL":
            case "PASSWORD":
                inputEl = (
                    <Input
                        type={field.type === "EMAIL" ? "email" : field.type === "PASSWORD" ? "password" : "text"}
                        placeholder={field.placeholder || ""}
                        value={answers[field.id] || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className={`${theme.input} ${errorMsg ? "border-red-500" : ""}`}
                    />
                );
                break;

            case "NUMBER":
                inputEl = (
                    <Input
                        type="number"
                        placeholder={field.placeholder || ""}
                        value={answers[field.id] || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className={`${theme.input} ${errorMsg ? "border-red-500" : ""}`}
                    />
                );
                break;

            case "LONG_TEXT":
                inputEl = (
                    <Textarea
                        placeholder={field.placeholder || ""}
                        value={answers[field.id] || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className={`${theme.input} ${errorMsg ? "border-red-500" : ""}`}
                        rows={4}
                    />
                );
                break;

            case "YES_NO":
                inputEl = (
                    <RadioGroup
                        onValueChange={(val) => handleFieldChange(field.id, val)}
                        value={answers[field.id] || ""}
                        className="flex space-x-6"
                    >
                        {["Yes", "No"].map((opt) => (
                            <div key={opt} className="flex items-center space-x-2">
                                <RadioGroupItem value={opt} id={`${field.id}-${opt}`} />
                                <Label htmlFor={`${field.id}-${opt}`} className={`font-normal cursor-pointer ${theme.label}`}>{opt}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
                break;

            case "SINGLE_SELECT":
            case "DROPDOWN":
                inputEl = (
                    <Select onValueChange={(val) => handleFieldChange(field.id, val)} value={answers[field.id] || ""}>
                        <SelectTrigger className={`${theme.input} ${errorMsg ? "border-red-500" : ""}`}>
                            <SelectValue placeholder={field.placeholder || "Select an option"} />
                        </SelectTrigger>
                        <SelectContent>
                            {opts.map((opt: string, i: number) => (
                                <SelectItem key={i} value={opt}>{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
                break;

            case "MULTI_SELECT": {
                const currentVals = (answers[field.id] || []) as string[];
                inputEl = (
                    <div className="space-y-3">
                        {opts.length === 0 && (
                            <p className="text-sm opacity-50 italic">No options defined.</p>
                        )}
                        {opts.map((opt: string, i: number) => (
                            <div key={i} className="flex items-center space-x-3">
                                <Checkbox
                                    id={`${field.id}-${i}`}
                                    checked={currentVals.includes(opt)}
                                    onCheckedChange={(checked) =>
                                        handleFieldChange(
                                            field.id,
                                            checked ? [...currentVals, opt] : currentVals.filter((v) => v !== opt)
                                        )
                                    }
                                />
                                <Label htmlFor={`${field.id}-${i}`} className={`font-normal cursor-pointer ${theme.label}`}>{opt}</Label>
                            </div>
                        ))}
                    </div>
                );
                break;
            }

            case "CHECKBOX": {
                if (opts.length > 0) {
                    const currentVals = (answers[field.id] || []) as string[];
                    inputEl = (
                        <div className="space-y-3">
                            {opts.map((opt: string, i: number) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <Checkbox
                                        id={`${field.id}-${i}`}
                                        checked={currentVals.includes(opt)}
                                        onCheckedChange={(checked) =>
                                            handleFieldChange(
                                                field.id,
                                                checked ? [...currentVals, opt] : currentVals.filter((v) => v !== opt)
                                            )
                                        }
                                    />
                                    <Label htmlFor={`${field.id}-${i}`} className={`font-normal cursor-pointer ${theme.label}`}>{opt}</Label>
                                </div>
                            ))}
                        </div>
                    );
                } else {
                    const isChecked = answers[field.id] === "true" || answers[field.id] === true;
                    inputEl = (
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id={`${field.id}-single`}
                                checked={isChecked}
                                onCheckedChange={(checked) =>
                                    handleFieldChange(field.id, checked ? "true" : "false")
                                }
                            />
                            <Label htmlFor={`${field.id}-single`} className={`font-normal cursor-pointer ${theme.label}`}>
                                {field.placeholder || "Check to confirm"}
                            </Label>
                        </div>
                    );
                }
                break;
            }

            case "DATE":
                inputEl = (
                    <Input
                        type="date"
                        value={answers[field.id] || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className={`${theme.input} ${errorMsg ? "border-red-500" : ""}`}
                    />
                );
                break;

            case "RATING":
                inputEl = (
                    <RadioGroup
                        onValueChange={(val) => handleFieldChange(field.id, val)}
                        value={answers[field.id] || ""}
                        className="flex space-x-4"
                    >
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <div key={rating} className="flex flex-col items-center space-y-2">
                                <RadioGroupItem value={rating.toString()} id={`${field.id}-${rating}`} />
                                <Label htmlFor={`${field.id}-${rating}`} className={`font-normal cursor-pointer ${theme.label}`}>{rating}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
                break;

            default:
                inputEl = <Input placeholder="Unsupported field type" disabled className={theme.input} />;
        }

        return (
            <div key={field.id} id={`field-${field.id}`} className={theme.fieldCard}>
                <div className="space-y-1">
                    <Label className={`${theme.label} flex items-center`}>
                        {field.label}
                        {field.isRequired && <span className="text-red-400 ml-1">*</span>}
                    </Label>
                    {field.description && (
                        <p className={`text-sm opacity-60 ${theme.label}`}>{field.description}</p>
                    )}
                </div>
                <div className="pt-1">{inputEl}</div>
                {errorMsg && (
                    <p className="text-sm text-red-400 flex items-center gap-1 mt-1">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errorMsg}
                    </p>
                )}
            </div>
        );
    };

    // ─── Email Step ───────────────────────────────────────────────────────────
    if (step === "email") {
        return (
            <div className={`${theme.page} flex items-center justify-center`}>
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className={`text-3xl font-extrabold tracking-tight ${theme.title}`}>{form.title}</h1>
                        {form.description && (
                            <p className={`${theme.subtitle}`}>{form.description}</p>
                        )}
                    </div>

                    <div className={theme.emailCard}>
                        <div className="p-6 space-y-4">
                            <div>
                                <h2 className={`text-lg font-semibold flex items-center gap-2 ${theme.label}`}>
                                    <Mail size={18} />
                                    Enter Your Email to Continue
                                </h2>
                                <p className={`text-sm mt-1 opacity-60 ${theme.label}`}>
                                    Your email is required to submit this form.
                                </p>
                            </div>
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="respondent-email" className={theme.label}>
                                        Email address <span className="text-red-400">*</span>
                                    </Label>
                                    <Input
                                        id="respondent-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={respondentEmail}
                                        onChange={(e) => {
                                            setRespondentEmail(e.target.value);
                                            if (emailError) setEmailError("");
                                        }}
                                        className={`${theme.input} ${emailError ? "border-red-500" : ""}`}
                                        autoFocus
                                    />
                                    {emailError && (
                                        <p className="text-sm text-red-400">{emailError}</p>
                                    )}
                                </div>
                                <Button type="submit" className={`w-full flex items-center gap-2 ${theme.button}`}>
                                    Continue to Form
                                    <ArrowRight size={16} />
                                </Button>
                            </form>
                        </div>
                    </div>

                    <p className={`text-center ${theme.footer}`}>
                        Powered by <strong>Formify</strong>
                    </p>
                </div>
            </div>
        );
    }

    // ─── Form Step ────────────────────────────────────────────────────────────
    return (
        <div className={theme.page}>
            <div className="max-w-2xl mx-auto space-y-2">
                <div className="text-center space-y-3 mb-8">
                    <h1 className={`text-3xl font-extrabold tracking-tight ${theme.title}`}>{form.title}</h1>
                    {form.description && (
                        <p className={`text-lg max-w-xl mx-auto ${theme.subtitle}`}>{form.description}</p>
                    )}
                    <div className={`inline-flex items-center gap-2 ${theme.emailBadge}`}>
                        <Mail size={13} />
                        Responding as <strong>{respondentEmail}</strong>
                        <button
                            type="button"
                            onClick={() => setStep("email")}
                            className="text-xs opacity-60 hover:opacity-100 underline ml-1"
                        >
                            Change
                        </button>
                    </div>
                </div>

                <form onSubmit={handleFormSubmit}>
                    {form.fields.map(renderField)}
                    <div className="mt-8 flex justify-end">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className={`w-full sm:w-auto px-10 ${theme.button}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : "Submit Response"}
                        </Button>
                    </div>
                </form>

                <div className="mt-12 pt-8 text-center">
                    <p className={theme.footer}>Powered by <strong>Formify</strong></p>
                </div>
            </div>
        </div>
    );
}
