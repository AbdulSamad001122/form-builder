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

function DoodleBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]" 
                 style={{
                     backgroundImage: 'radial-gradient(#111111 1px, transparent 1px), radial-gradient(#111111 1px, transparent 1px)',
                     backgroundSize: '24px 24px',
                     backgroundPosition: '0 0, 12px 12px'
                 }} 
            />

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float-sparkle {
                    0% { transform: translate(0, 0) scale(0.8) rotate(0deg); opacity: 0; }
                    50% { opacity: 0.3; }
                    100% { transform: translate(40px, -60px) scale(1) rotate(180deg); opacity: 0; }
                }
                .animate-sparkle-1 {
                    animation: float-sparkle 8s ease-in-out infinite;
                }
                .animate-sparkle-2 {
                    animation: float-sparkle 12s ease-in-out infinite;
                }
            `}} />

            <svg viewBox="0 0 100 60" className="absolute top-10 left-[10%] w-24 h-16 text-[#111111] opacity-[0.15] hidden md:block animate-bounce" style={{ animationDuration: '5s' }}>
                <path d="M 20 40 C 10 40, 5 30, 15 20 C 10 10, 30 5, 45 15 C 55 5, 75 10, 75 25 C 85 25, 90 35, 80 45 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 25 38 L 35 38 M 50 38 L 65 38 M 73 38 L 78 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 25 50 L 22 55 M 45 52 L 42 57 M 65 50 L 62 55" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </svg>

            <svg viewBox="0 0 100 100" className="absolute top-12 right-[12%] w-20 h-20 text-[#111111] opacity-[0.15] hidden lg:block animate-pulse" style={{ animationDuration: '3.5s' }}>
                <path d="M 35 60 C 20 50, 20 20, 50 20 C 80 20, 80 50, 65 60 C 60 65, 60 75, 60 75 H 40 C 40 75, 40 65, 35 60 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 40 80 H 60 M 42 85 H 58 M 45 90 H 55" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M 45 60 V 45 Q 50 40, 50 45 Q 50 40, 55 45 V 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M 50 5 V 12 M 20 25 L 26 30 M 80 25 L 74 30 M 10 50 H 17 M 90 50 H 83" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>

            <svg viewBox="0 0 100 100" className="absolute bottom-16 left-[10%] w-20 h-20 text-[#111111] opacity-[0.15] hidden lg:block animate-bounce" style={{ animationDuration: '7s' }}>
                <path d="M 25 35 H 75 V 75 C 75 85, 25 85, 25 75 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 75 45 C 90 45, 90 65, 75 65" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M 35 25 Q 40 15, 35 5 M 50 28 Q 55 18, 50 8 M 65 25 Q 70 15, 65 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M 15 85 H 85" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            </svg>

            <svg viewBox="0 0 100 100" className="absolute bottom-12 right-[10%] w-20 h-20 text-[#111111] opacity-[0.15] hidden md:block animate-spin" style={{ animationDuration: '45s' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <circle cx="35" cy="40" r="4" fill="currentColor" />
                <circle cx="65" cy="40" r="4" fill="currentColor" />
                <path d="M 30 60 Q 50 75, 70 60" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M 85 10 L 88 20 L 98 23 L 88 26 L 85 36 L 82 26 L 72 23 L 82 20 Z" fill="currentColor" />
            </svg>

            <svg viewBox="0 0 24 24" className="absolute top-[30%] left-[25%] w-6 h-6 text-[#111111] opacity-0 animate-sparkle-1 hidden md:block" style={{ animationDelay: '1.5s' }}>
                <path d="M12,2L14.5,9.5L22,12L14.5,14.5L12,22L9.5,14.5L2,12L9.5,9.5Z" fill="currentColor" />
            </svg>
            <svg viewBox="0 0 24 24" className="absolute top-[65%] right-[22%] w-5 h-5 text-[#111111] opacity-0 animate-sparkle-2 hidden md:block" style={{ animationDelay: '4.5s' }}>
                <path d="M12,2L14.5,9.5L22,12L14.5,14.5L12,22L9.5,14.5L2,12L9.5,9.5Z" fill="currentColor" />
            </svg>
        </div>
    );
}

function ForestBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
            <img 
                src="/forest-theme-assets/forest-theme.svg" 
                alt="Forest Theme Background" 
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" 
            />

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float-leaf-1 {
                    0% { transform: translate(0, -10px) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.7; }
                    90% { opacity: 0.7; }
                    100% { transform: translate(80px, 150px) rotate(360deg); opacity: 0; }
                }
                @keyframes float-leaf-2 {
                    0% { transform: translate(0, -10px) rotate(0deg); opacity: 0; }
                    15% { opacity: 0.6; }
                    85% { opacity: 0.6; }
                    100% { transform: translate(-100px, 200px) rotate(-180deg); opacity: 0; }
                }
                @keyframes fly-bird {
                    0% { transform: translate(-50px, 50px) scale(0.6); opacity: 0; }
                    10% { opacity: 0.5; }
                    90% { opacity: 0.5; }
                    100% { transform: translate(120px, -30px) scale(0.8); opacity: 0; }
                }
                .animate-leaf-1 {
                    animation: float-leaf-1 12s linear infinite;
                }
                .animate-leaf-2 {
                    animation: float-leaf-2 16s linear infinite;
                }
                .animate-bird {
                    animation: fly-bird 24s linear infinite;
                }
            `}} />

            <svg viewBox="0 0 24 24" className="absolute top-[15%] left-[20%] w-6 h-6 text-[#2C5B37] opacity-0 animate-leaf-1 hidden md:block" style={{ animationDelay: '1s' }}>
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L21.34,3.82C16.17,5.9 10,8 17,8Z" fill="currentColor" />
            </svg>

            <svg viewBox="0 0 24 24" className="absolute top-[10%] right-[25%] w-8 h-8 text-[#4B8057] opacity-0 animate-leaf-2 hidden md:block" style={{ animationDelay: '4s' }}>
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L21.34,3.82C16.17,5.9 10,8 17,8Z" fill="currentColor" />
            </svg>

            <svg viewBox="0 0 24 24" className="absolute top-[40%] right-[15%] w-5 h-5 text-[#81C784] opacity-0 animate-leaf-1 hidden md:block" style={{ animationDelay: '7s' }}>
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L21.34,3.82C16.17,5.9 10,8 17,8Z" fill="currentColor" />
            </svg>

            <svg viewBox="0 0 24 24" className="absolute top-[25%] left-[10%] w-8 h-6 text-[#1B3B22] opacity-0 animate-bird hidden lg:block" style={{ animationDelay: '2s' }}>
                <path d="M 2 12 C 7 2, 11 6, 12 8 C 13 6, 17 2, 22 12 C 16 8, 13 10, 12 11 C 11 10, 8 8, 2 12 Z" fill="currentColor" />
            </svg>

            <svg viewBox="0 0 24 24" className="absolute top-[35%] right-[20%] w-7 h-5 text-[#2C5B37] opacity-0 animate-bird hidden lg:block" style={{ animationDelay: '14s', animationDuration: '28s' }}>
                <path d="M 2 12 C 7 2, 11 6, 12 8 C 13 6, 17 2, 22 12 C 16 8, 13 10, 12 11 C 11 10, 8 8, 2 12 Z" fill="currentColor" />
            </svg>

            <div className="absolute top-0 right-0 w-[40%] h-[50%] bg-gradient-to-bl from-white/10 via-transparent to-transparent pointer-events-none mix-blend-screen" />
        </div>
    );
}

function DeathNoteBorder() {
    return (
        <>
            <div className="absolute inset-2 border border-white/20 pointer-events-none rounded-none" />
            <svg viewBox="0 0 100 100" className="absolute top-3 left-3 w-10 h-10 text-white/80 pointer-events-none">
                <path d="M 0 0 L 30 0 Q 15 15 0 30 Z M 0 0 L 0 30 Q 15 15 30 0 Z M 15 15 Q 25 25 35 35" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M 10 10 Q 5 25 5 45 M 10 10 Q 25 5 45 5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
            </svg>
            <svg viewBox="0 0 100 100" className="absolute top-3 right-3 w-10 h-10 text-white/80 pointer-events-none rotate-90">
                <path d="M 0 0 L 30 0 Q 15 15 0 30 Z M 0 0 L 0 30 Q 15 15 30 0 Z M 15 15 Q 25 25 35 35" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M 10 10 Q 5 25 5 45 M 10 10 Q 25 5 45 5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
            </svg>
            <svg viewBox="0 0 100 100" className="absolute bottom-3 left-3 w-10 h-10 text-white/80 pointer-events-none -rotate-90">
                <path d="M 0 0 L 30 0 Q 15 15 0 30 Z M 0 0 L 0 30 Q 15 15 30 0 Z M 15 15 Q 25 25 35 35" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M 10 10 Q 5 25 5 45 M 10 10 Q 25 5 45 5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
            </svg>
            <svg viewBox="0 0 100 100" className="absolute bottom-3 right-3 w-10 h-10 text-white/80 pointer-events-none rotate-180">
                <path d="M 0 0 L 30 0 Q 15 15 0 30 Z M 0 0 L 0 30 Q 15 15 30 0 Z M 15 15 Q 25 25 35 35" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M 10 10 Q 5 25 5 45 M 10 10 Q 25 5 45 5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
            </svg>
        </>
    );
}

function DeathNoteHeader() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 mb-6">
            <img 
                src="/death-note-logo-test.png" 
                alt="Death Note" 
                className="w-56 md:w-64 h-auto object-contain select-none pointer-events-none mix-blend-screen" 
            />
            <p className="text-xs font-normal text-gray-400 tracking-[0.2em] font-death-rules text-center lowercase">
                how to use it
            </p>
        </div>
    );
}

function DeathNoteFonts() {
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Pirata+One&family=Special+Elite&family=Sedgwick+Ave+Display&display=swap" rel="stylesheet" />
            <style dangerouslySetInnerHTML={{ __html: `
                .font-gothic {
                    font-family: 'Cinzel Decorative', 'Pirata One', serif !important;
                }
                .font-death-rules {
                    font-family: 'Special Elite', 'Sedgwick Ave Display', cursive !important;
                    line-height: 1.8 !important;
                    letter-spacing: 0.05em !important;
                }
            `}} />
        </>
    );
}

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

    const hasBrand = form?.brand ? form.brand : null;
    const isCustomTheme = form?.theme === "custom" || theme.id === "custom";

    const brandStyle = (hasBrand && isCustomTheme) ? {
        backgroundColor: hasBrand.backgroundColor,
        color: hasBrand.textColor,
        backgroundImage: "none",
    } : {};

    const brandCardStyle = (hasBrand && isCustomTheme) ? {
        backgroundColor: hasBrand.cardBgColor,
        color: hasBrand.textColor,
        borderColor: hasBrand.inputBorderColor,
    } : {};

    const brandTextStyle = (hasBrand && isCustomTheme) ? {
        color: hasBrand.textColor,
    } : {};

    const brandInputStyle = (hasBrand && isCustomTheme) ? {
        backgroundColor: hasBrand.inputBgColor,
        color: hasBrand.inputTextColor,
        borderColor: hasBrand.inputBorderColor,
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
                        {message.includes("expired") ? "Form Expired" : (message.includes("response limit") || message.includes("reached its response limit")) ? "Limit Reached" : isClosed ? "Form Closed" : "Form Not Found"}
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
                {form?.theme === "doodle" && <DoodleBackground />}
                {form?.theme === "forest" && <ForestBackground />}
                {form?.theme === "death-note" && <DeathNoteFonts />}
                <div className="w-full max-w-md space-y-6 z-10">
                    <div className="text-center space-y-2">
                        {(hasBrand?.logoUrl && isCustomTheme) && (
                            <div className="flex justify-center mb-6">
                                <img
                                    src={hasBrand.logoUrl}
                                    alt="Company Logo"
                                    className="max-h-16 object-contain rounded-lg"
                                />
                            </div>
                        )}
                        {form?.theme === "death-note" ? (
                            <DeathNoteHeader />
                        ) : (
                            <>
                                <h1 className={`text-3xl font-extrabold tracking-tight ${theme.title}`} style={brandTextStyle}>{form.title}</h1>
                                {form.description && (
                                    <p className={`${theme.subtitle}`} style={brandTextStyle}>{form.description}</p>
                                )}
                            </>
                        )}
                    </div>

                    <div className={`${theme.emailCard} relative`} style={brandCardStyle}>
                        {form?.theme === "death-note" && <DeathNoteBorder />}
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
                                    style={(hasBrand && isCustomTheme) ? { backgroundColor: hasBrand.textColor, color: hasBrand.backgroundColor } : undefined}
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
                {form?.theme === "doodle" && <DoodleBackground />}
                {form?.theme === "forest" && <ForestBackground />}
                {form?.theme === "death-note" && <DeathNoteFonts />}
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
                <div className={`w-full max-w-lg text-center p-10 space-y-6 relative z-10 ${theme.emailCard}`} style={brandCardStyle}>
                    {form?.theme === "death-note" && <DeathNoteBorder />}
                    {form?.theme === "death-note" ? (
                        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto text-white fill-none stroke-white stroke-[1.5] pointer-events-none mb-4">
                            <path d="M35 45 C35 30, 65 30, 65 45 C65 52, 60 55, 58 60 H42 C40 55, 35 52, 35 45 Z" fill="#080808" strokeWidth="3" />
                            <path d="M42 60 L45 68 H55 L58 60" fill="#080808" strokeWidth="3" />
                            <ellipse cx="44" cy="44" rx="4" ry="6" fill="white" />
                            <ellipse cx="56" cy="44" rx="4" ry="6" fill="white" />
                            <path d="M50 48 L48 52 H52 Z" fill="white" />
                            <path d="M45 64 H55 M48 60 V68 M52 60 V68" strokeWidth="1.5" />
                        </svg>
                    ) : (
                        <>
                            {(hasBrand?.logoUrl && isCustomTheme) ? (
                                <div className="flex justify-center mb-6">
                                    <img
                                        src={hasBrand.logoUrl}
                                        alt="Company Logo"
                                        className="max-h-16 object-contain rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl"
                                    style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </>
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
            <div key={field.id} id={`field-${field.id}`} className={`${theme.fieldCard} relative`} style={brandCardStyle}>
                {form?.theme === "death-note" && <DeathNoteBorder />}
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
                {form?.theme === "doodle" && <DoodleBackground />}
                {form?.theme === "forest" && <ForestBackground />}
                {form?.theme === "death-note" && <DeathNoteFonts />}
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
                <div className="w-full max-w-md space-y-6 z-10">
                    <div className="text-center space-y-2">
                        {(hasBrand?.logoUrl && isCustomTheme) && (
                            <div className="flex justify-center mb-6">
                                <img
                                    src={hasBrand.logoUrl}
                                    alt="Company Logo"
                                    className="max-h-16 object-contain rounded-lg"
                                />
                            </div>
                        )}
                        {form?.theme === "death-note" ? (
                            <DeathNoteHeader />
                        ) : (
                            <>
                                <h1 className={`text-3xl font-extrabold tracking-tight ${theme.title}`} style={brandTextStyle}>{form.title}</h1>
                                {form.description && (
                                    <p className={`${theme.subtitle}`} style={brandTextStyle}>{form.description}</p>
                                )}
                            </>
                        )}
                    </div>

                    <div className={`${theme.emailCard} relative`} style={brandCardStyle}>
                        {form?.theme === "death-note" && <DeathNoteBorder />}
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
                                    style={(hasBrand && isCustomTheme) ? { backgroundColor: hasBrand.textColor, color: hasBrand.backgroundColor } : undefined}
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
    const hasLogic = sortedFields.some((f: any) => f.conditionalRules && Array.isArray(f.conditionalRules) && f.conditionalRules.length > 0);
    const progressPercent = isLastQuestion ? 100 : Math.round((currentQuestionStep / totalQuestions) * 100);

    return (
        <div className={`${theme.page} relative`} style={brandStyle}>
            {form?.theme === "doodle" && <DoodleBackground />}
            {form?.theme === "forest" && <ForestBackground />}
            {form?.theme === "death-note" && <DeathNoteFonts />}
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
            <div className="max-w-2xl mx-auto space-y-2 z-10 relative">
                <div className="text-center space-y-3 mb-8">
                    {(hasBrand?.logoUrl && isCustomTheme) && (
                        <div className="flex justify-center mb-6">
                            <img
                                src={hasBrand.logoUrl}
                                alt="Company Logo"
                                className="max-h-16 object-contain rounded-lg"
                            />
                        </div>
                    )}
                    {form?.theme === "death-note" ? (
                        <DeathNoteHeader />
                    ) : (
                        <>
                            <h1 className={`text-3xl font-extrabold tracking-tight ${theme.title}`} style={brandTextStyle}>{form.title}</h1>
                            {form.description && (
                                <p className={`text-lg max-w-xl mx-auto ${theme.subtitle}`} style={brandTextStyle}>{form.description}</p>
                            )}
                        </>
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
                            <span>
                                {isLastQuestion 
                                    ? "Final Question" 
                                    : hasLogic 
                                        ? `Question ${currentQuestionStep}` 
                                        : `Question ${currentQuestionStep} of ${totalQuestions}`}
                            </span>
                            <span className="opacity-60">
                                {isLastQuestion ? "Ready to submit" : `${progressPercent}% Complete`}
                            </span>
                        </div>
                    )}
                    {activeField && (
                        <div className="w-full rounded-full h-1.5 mb-6 overflow-hidden border border-border/10"
                            style={{
                                backgroundColor: (hasBrand && isCustomTheme)
                                    ? `${hasBrand.textColor}15`
                                    : form?.theme === "death-note"
                                        ? "rgba(255, 255, 255, 0.15)"
                                        : form?.theme === "forest"
                                            ? "rgba(27, 59, 34, 0.1)"
                                            : undefined
                            }}
                        >
                            <div 
                                className="bg-primary h-full transition-all duration-300 rounded-full" 
                                style={{ 
                                    width: `${progressPercent}%`,
                                    backgroundColor: (hasBrand && isCustomTheme) 
                                        ? hasBrand.textColor 
                                        : theme.accentColor || undefined
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
                            style={(hasBrand && isCustomTheme) ? { backgroundColor: hasBrand.textColor, color: hasBrand.backgroundColor } : undefined}
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
