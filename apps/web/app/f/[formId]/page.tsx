"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useGetPublicForm, useGetFormById, useVerifyFormPassword } from "~/hooks/api/form";
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
    const searchParams = useSearchParams();
    const formId = params.formId as string;
    const isPreview = searchParams.get("preview") === "true";

    const [accessToken, setAccessToken] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(`form-auth-token-${formId}`);
        }
        return null;
    });

    const { data: publicForm, isLoading: isPublicLoading, isError: isPublicError, error: publicError } = useGetPublicForm(formId, accessToken || undefined);
    const { data: privateForm, isLoading: isPrivateLoading, isError: isPrivateError, error: privateError } = useGetFormById(formId, isPreview);

    const form = isPreview ? privateForm : publicForm;
    const isLoading = isPreview ? isPrivateLoading : isPublicLoading;
    const isError = isPreview ? isPrivateError : isPublicError;
    const error = isPreview ? privateError : publicError;

    const { mutate: submitResponse, isPending: isSubmitting } = useSubmitFormResponse();
    const { verifyFormPasswordAsync, isPending: isVerifying } = useVerifyFormPassword();

    const [step, setStep] = useState<Step>("email");
    const [respondentEmail, setRespondentEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isContinuing, setIsContinuing] = useState(false);

    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [currentFieldId, setCurrentFieldId] = useState("");
    const [fieldHistory, setFieldHistory] = useState<string[]>([]);

    const theme = getThemeById(form?.theme);

    const brandStyle = form?.brand ? {
        backgroundColor: form.brand.backgroundColor,
        color: form.brand.textColor,
        backgroundImage: "none",
    } : {};

    const brandCardStyle = form?.brand ? {
        backgroundColor: form.brand.cardBgColor,
        color: form.brand.textColor,
        borderColor: form.brand.inputBorderColor,
    } : {};

    const brandTextStyle = form?.brand ? {
        color: form.brand.textColor,
    } : {};

    const brandInputStyle = form?.brand ? {
        backgroundColor: form.brand.inputBgColor,
        color: form.brand.inputTextColor,
        borderColor: form.brand.inputBorderColor,
    } : {};

    const isLocked = !isPreview && form?.isPasswordProtected && (!form.fields || form.fields.length === 0);

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) {
            setPasswordError("Password is required.");
            return;
        }
        try {
            const result = await verifyFormPasswordAsync({ formId, password });
            localStorage.setItem(`form-auth-token-${formId}`, result.token);
            setAccessToken(result.token);
            setPasswordError("");
            toast.success("Form unlocked successfully!");
        } catch (err: any) {
            setPasswordError(err.message || "Incorrect password. Please try again.");
        }
    };

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
        const message = (error as any)?.message ?? ""
        const isClosed = message.includes("not accepting") || message.includes("expired") || message.includes("limit")
        const displayMessage = message || "This form does not exist or the link may be incorrect."
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950 p-4">
                <div className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-10 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                        style={{ background: isClosed ? "rgba(234,179,8,0.15)" : "rgba(239,68,68,0.15)" }}>
                        {isClosed ? (
                            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    <p className={`font-semibold text-lg ${isClosed ? "text-yellow-300" : "text-red-400"}`}>
                        {message.includes("expired") ? "Form Expired" : message.includes("limit") ? "Limit Reached" : isClosed ? "Form Closed" : "Form Not Found"}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed font-normal">
                        {displayMessage}
                    </p>
                </div>
            </div>
        );
    }

    if (isLocked) {
        return (
            <div className={`${theme.page} flex items-center justify-center relative py-12`} style={brandStyle}>
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-2">
                        {form.brand?.logoUrl && (
                            <div className="flex justify-center mb-6">
                                <img
                                    src={form.brand.logoUrl}
                                    alt="Company Logo"
                                    className="max-h-16 object-contain rounded-lg"
                                />
                            </div>
                        )}
                        <h1 className={`text-3xl font-extrabold tracking-tight ${theme.title}`} style={brandTextStyle}>{form.title}</h1>
                        {form.description && (
                            <p className={`${theme.subtitle}`} style={brandTextStyle}>{form.description}</p>
                        )}
                    </div>

                    <div className={theme.emailCard} style={brandCardStyle}>
                        <div className="p-6 space-y-4">
                            <div>
                                <h2 className={`text-lg font-semibold flex items-center gap-2 ${theme.label}`} style={brandTextStyle}>
                                    🔒 Protected Form
                                </h2>
                                <p className={`text-sm mt-1 opacity-60 ${theme.label}`} style={brandTextStyle}>
                                    This form is password protected. Enter the password to unlock and view fields.
                                </p>
                            </div>
                            <form onSubmit={handleUnlock} className="space-y-4">
                                <div className="space-y-2 relative">
                                    <Label htmlFor="form-password" className={theme.label} style={brandTextStyle}>
                                        Form Password <span className="text-red-400">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="form-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter password to unlock"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (passwordError) setPasswordError("");
                                            }}
                                            className={`${theme.input} pr-10 ${passwordError ? "border-red-500" : ""}`}
                                            style={brandInputStyle}
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {passwordError && (
                                        <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isVerifying}
                                    className={`w-full flex items-center justify-center gap-2 ${theme.button}`}
                                    style={form.brand ? { backgroundColor: form.brand.textColor, color: form.brand.backgroundColor } : undefined}
                                >
                                    {isVerifying ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Unlock Form
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>

                    <p className={`text-center ${theme.footer}`} style={brandTextStyle}>
                        Powered by <strong>Formit</strong>
                    </p>
                </div>
            </div>
        );
    }

    // ─── Submitted ─────────────────────────────────────────────────────────────
    if (step === "submitted") {
        return (
            <div className={`${theme.page} flex items-center justify-center relative`} style={brandStyle}>
                {isPreview && (
                    <div className="absolute top-0 left-0 right-0 z-50 w-full bg-amber-500/10 backdrop-blur-md border-b border-amber-500/20 px-4 py-2.5 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold">
                            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                            <span className="text-amber-800 dark:text-amber-200">
                                <strong>Preview Mode</strong> — Submissions are simulated.
                            </span>
                        </div>
                    </div>
                )}
                <div className="w-full max-w-lg text-center p-10 space-y-6 border rounded-2xl shadow-sm" style={brandCardStyle}>
                    {form.brand?.logoUrl && (
                        <div className="flex justify-center mb-6">
                            <img
                                src={form.brand.logoUrl}
                                alt="Company Logo"
                                className="max-h-16 object-contain rounded-lg"
                            />
                        </div>
                    )}
                    {!form.brand?.logoUrl && (
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl"
                            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                    <div>
                        <h2 className={`text-3xl font-extrabold mb-2 ${theme.title}`} style={brandTextStyle}>Thank you!</h2>
                        <p className={`${theme.subtitle} opacity-80`} style={brandTextStyle}>Your response has been recorded successfully.</p>
                        {respondentEmail && (
                            <p className={`text-sm mt-2 ${theme.footer}`} style={brandTextStyle}>
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
        setIsContinuing(true);
        setTimeout(() => {
            setStep("form");
            setIsContinuing(false);
        }, 400);
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

    const sortedFields = form?.fields ? [...form.fields].sort((a: any, b: any) => Number(a.index) - Number(b.index)) : [];

    if (!currentFieldId && sortedFields.length > 0) {
        setCurrentFieldId(sortedFields[0].id);
    }

    const activeField = sortedFields.find((f: any) => f.id === currentFieldId);

    const triggerSubmit = () => {
        if (!activeField) return;

        const visitedFieldIds = new Set([...fieldHistory, activeField.id]);
        const formattedAnswers = Object.entries(answers)
            .filter(([fieldId]) => visitedFieldIds.has(fieldId))
            .map(([fieldId, value]) => ({
                fieldId,
                value: typeof value === "object" ? JSON.stringify(value) : String(value),
            }));

        if (isPreview) {
            toast.success("✨ (Preview Mode) Submission simulated successfully!", {
                description: "Your inputs were validated, but no database entry was created."
            });
            setStep("submitted");
            return;
        }

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

    const handleBack = () => {
        if (fieldHistory.length === 0) return;
        const prevHistory = [...fieldHistory];
        const prevFieldId = prevHistory.pop()!;
        setFieldHistory(prevHistory);
        setCurrentFieldId(prevFieldId);
        setValidationErrors({});
    };

    const getNextFieldId = (field: any) => {
        if (!field) return "submit";
        const val = answers[field.id];
        const isMissing = val === undefined || val === null || val === "" ||
            (Array.isArray(val) && val.length === 0);

        let nextFieldId: string = "";
        const rules = field.conditionalRules;

        if (rules && Array.isArray(rules) && rules.length > 0) {
            if (!isMissing) {
                const matchedRule = rules.find((rule: any) => {
                    if (rule.value === "default") return false;
                    if (Array.isArray(val)) {
                        return val.includes(rule.value);
                    }
                    return String(val) === String(rule.value);
                });
                if (matchedRule) {
                    nextFieldId = matchedRule.targetFieldId || "";
                }
            }

            if (!nextFieldId) {
                const defaultRule = rules.find((rule: any) => rule.value === "default");
                if (defaultRule) {
                    nextFieldId = defaultRule.targetFieldId || "";
                }
            }
        }

        if (!nextFieldId) {
            const currentIndex = sortedFields.findIndex((f: any) => f.id === field.id);
            const nextField = sortedFields[currentIndex + 1];
            nextFieldId = nextField ? nextField.id : "submit";
        }

        return nextFieldId;
    };

    const handleNext = () => {
        if (!activeField) return;

        const val = answers[activeField.id];
        const isMissing = val === undefined || val === null || val === "" ||
            (Array.isArray(val) && val.length === 0);

        if (activeField.isRequired && isMissing) {
            setValidationErrors({ [activeField.id]: "This field is required" });
            return;
        }

        setValidationErrors({});

        const nextFieldId = getNextFieldId(activeField);

        if (nextFieldId === "submit") {
            triggerSubmit();
        } else {
            setFieldHistory((prev) => [...prev, activeField.id]);
            setCurrentFieldId(nextFieldId);
        }
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
                        style={brandInputStyle}
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
                        style={brandInputStyle}
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
                        style={brandInputStyle}
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
                                <Label htmlFor={`${field.id}-${opt}`} className={`font-normal cursor-pointer ${theme.label}`} style={brandTextStyle}>{opt}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
                break;

            case "SINGLE_SELECT":
            case "DROPDOWN":
                inputEl = (
                    <Select onValueChange={(val) => handleFieldChange(field.id, val)} value={answers[field.id] || ""}>
                        <SelectTrigger className={`${theme.input} ${errorMsg ? "border-red-500" : ""}`} style={brandInputStyle}>
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
                                <Label htmlFor={`${field.id}-${i}`} className={`font-normal cursor-pointer ${theme.label}`} style={brandTextStyle}>{opt}</Label>
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
                                    <Label htmlFor={`${field.id}-${i}`} className={`font-normal cursor-pointer ${theme.label}`} style={brandTextStyle}>{opt}</Label>
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
                            <Label htmlFor={`${field.id}-single`} className={`font-normal cursor-pointer ${theme.label}`} style={brandTextStyle}>
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
                        style={brandInputStyle}
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
                                <Label htmlFor={`${field.id}-${rating}`} className={`font-normal cursor-pointer ${theme.label}`} style={brandTextStyle}>{rating}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
                break;

            default:
                inputEl = <Input placeholder="Unsupported field type" disabled className={theme.input} style={brandInputStyle} />;
        }

        return (
            <div key={field.id} id={`field-${field.id}`} className={theme.fieldCard} style={brandCardStyle}>
                <div className="space-y-1">
                    <Label className={`${theme.label} flex items-center`} style={brandTextStyle}>
                        {field.label}
                        {field.isRequired && <span className="text-red-400 ml-1">*</span>}
                    </Label>
                    {field.description && (
                        <p className={`text-sm opacity-60 ${theme.label}`} style={brandTextStyle}>{field.description}</p>
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
            <div className={`${theme.page} flex items-center justify-center relative`} style={brandStyle}>
                {isPreview && (
                    <div className="absolute top-0 left-0 right-0 z-50 w-full bg-amber-500/10 backdrop-blur-md border-b border-amber-500/20 px-4 py-2.5 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold">
                            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                            <span className="text-amber-800 dark:text-amber-200">
                                <strong>Preview Mode</strong> — Submissions are simulated.
                            </span>
                        </div>
                    </div>
                )}
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-2">
                        {form.brand?.logoUrl && (
                            <div className="flex justify-center mb-6">
                                <img
                                    src={form.brand.logoUrl}
                                    alt="Company Logo"
                                    className="max-h-16 object-contain rounded-lg"
                                />
                            </div>
                        )}
                        <h1 className={`text-3xl font-extrabold tracking-tight ${theme.title}`} style={brandTextStyle}>{form.title}</h1>
                        {form.description && (
                            <p className={`${theme.subtitle}`} style={brandTextStyle}>{form.description}</p>
                        )}
                    </div>

                    <div className={theme.emailCard} style={brandCardStyle}>
                        <div className="p-6 space-y-4">
                            <div>
                                <h2 className={`text-lg font-semibold flex items-center gap-2 ${theme.label}`} style={brandTextStyle}>
                                    <Mail size={18} />
                                    Enter Your Email to Continue
                                </h2>
                                <p className={`text-sm mt-1 opacity-60 ${theme.label}`} style={brandTextStyle}>
                                    Your email is required to submit this form.
                                </p>
                            </div>
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="respondent-email" className={theme.label} style={brandTextStyle}>
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
                                        style={brandInputStyle}
                                        autoFocus
                                    />
                                    {emailError && (
                                        <p className="text-sm text-red-400">{emailError}</p>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isContinuing}
                                    className={`w-full flex items-center justify-center gap-2 ${theme.button}`}
                                    style={form.brand ? { backgroundColor: form.brand.textColor, color: form.brand.backgroundColor } : undefined}
                                >
                                    {isContinuing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Continuing...
                                        </>
                                    ) : (
                                        <>
                                            Continue to Form
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>

                    <p className={`text-center ${theme.footer}`} style={brandTextStyle}>
                        Powered by <strong>Formit</strong>
                    </p>
                </div>
            </div>
        );
    }

    // ─── Form Step ────────────────────────────────────────────────────────────
    const currentQuestionStep = fieldHistory.length + 1;
    const totalQuestions = sortedFields.length;
    const isLastQuestion = activeField ? getNextFieldId(activeField) === "submit" : false;

    return (
        <div className={`${theme.page} relative`} style={brandStyle}>
            {isPreview && (
                <div className="absolute top-0 left-0 right-0 z-50 w-full bg-amber-500/10 backdrop-blur-md border-b border-amber-500/20 px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold">
                        <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                        <span className="text-amber-800 dark:text-amber-200">
                            <strong>Preview Mode</strong> — Submissions are simulated.
                        </span>
                    </div>
                </div>
            )}
            <div className="max-w-2xl mx-auto space-y-2">
                <div className="text-center space-y-3 mb-8">
                    {form.brand?.logoUrl && (
                        <div className="flex justify-center mb-6">
                            <img
                                src={form.brand.logoUrl}
                                alt="Company Logo"
                                className="max-h-16 object-contain rounded-lg"
                            />
                        </div>
                    )}
                    <h1 className={`text-3xl font-extrabold tracking-tight ${theme.title}`} style={brandTextStyle}>{form.title}</h1>
                    {form.description && (
                        <p className={`text-lg max-w-xl mx-auto ${theme.subtitle}`} style={brandTextStyle}>{form.description}</p>
                    )}
                    <div className={`inline-flex items-center gap-2 ${theme.emailBadge}`} style={brandStyle}>
                        <Mail size={13} />
                        Responding as <strong style={brandTextStyle}>{respondentEmail}</strong>
                        <button
                            type="button"
                            onClick={() => setStep("email")}
                            className="text-xs opacity-60 hover:opacity-100 underline ml-1"
                            style={brandTextStyle}
                        >
                            Change
                        </button>
                    </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                    {activeField && (
                        <div className="flex justify-between items-center mb-2 px-1 text-xs opacity-75 font-semibold" style={brandTextStyle}>
                            <span>Question {currentQuestionStep} of {totalQuestions}</span>
                            <span className="opacity-60">{Math.round((currentQuestionStep / totalQuestions) * 100)}% Complete</span>
                        </div>
                    )}
                    {activeField && (
                        <div className="w-full bg-muted rounded-full h-1.5 mb-6 overflow-hidden border border-border/10">
                            <div 
                                className="bg-primary h-full transition-all duration-300 rounded-full" 
                                style={{ 
                                    width: `${(currentQuestionStep / totalQuestions) * 100}%`,
                                    backgroundColor: form.brand?.textColor || undefined
                                }} 
                            />
                        </div>
                    )}
                    {activeField && renderField(activeField)}
                    <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                        {fieldHistory.length > 0 ? (
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={handleBack}
                                className="w-full sm:w-auto px-8"
                                style={brandStyle}
                            >
                                Back
                            </Button>
                        ) : <div />}
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className={`w-full sm:w-auto px-10 ${theme.button}`}
                            style={form.brand ? { backgroundColor: form.brand.textColor, color: form.brand.backgroundColor } : undefined}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                isLastQuestion ? "Submit" : "Next"
                            )}
                        </Button>
                    </div>
                </form>

                <div className="mt-12 pt-8 text-center">
                    <p className={theme.footer}>Powered by <strong>Formit</strong></p>
                </div>
            </div>
        </div>
    );
}
