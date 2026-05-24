"use client";

import { useState, useEffect } from "react";
import { useGetCustomBrand, useUpdateCustomBrand, useUploadLogo } from "~/hooks/api/custom-brand";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Loader2, Upload, Trash2, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

const BRAND_PRESETS = [
    {
        name: "Sleek Charcoal",
        backgroundColor: "#0B0F19",
        cardBgColor: "rgba(255, 255, 255, 0.03)",
        textColor: "#F3F4F6",
        inputBgColor: "rgba(255, 255, 255, 0.05)",
        inputTextColor: "#FFFFFF",
        inputBorderColor: "rgba(255, 255, 255, 0.1)",
    },
    {
        name: "Nordic Minimal",
        backgroundColor: "#F9F9FA",
        cardBgColor: "#FFFFFF",
        textColor: "#1F2937",
        inputBgColor: "#FFFFFF",
        inputTextColor: "#111827",
        inputBorderColor: "#E5E7EB",
    },
    {
        name: "Royal Navy",
        backgroundColor: "#0A192F",
        cardBgColor: "rgba(100, 116, 139, 0.05)",
        textColor: "#E2E8F0",
        inputBgColor: "rgba(100, 116, 139, 0.1)",
        inputTextColor: "#FFFFFF",
        inputBorderColor: "rgba(100, 116, 139, 0.2)",
    },
    {
        name: "Forest Eco",
        backgroundColor: "#F4F7F5",
        cardBgColor: "#FFFFFF",
        textColor: "#132D1B",
        inputBgColor: "#FFFFFF",
        inputTextColor: "#132D1B",
        inputBorderColor: "#C7D3C8",
    },
];

const toHexColor = (colorStr: string): string => {
    if (!colorStr) return "#000000";
    const str = colorStr.trim();
    if (str.startsWith("#")) {
        if (str.length === 4) {
            return `#${str[1]}${str[1]}${str[2]}${str[2]}${str[3]}${str[3]}`;
        }
        return str.slice(0, 7);
    }
    if (str.startsWith("rgb")) {
        const matches = str.match(/\d+/g);
        if (matches && matches.length >= 3) {
            const r = Math.min(255, Math.max(0, parseInt(matches[0] || "0")));
            const g = Math.min(255, Math.max(0, parseInt(matches[1] || "0")));
            const b = Math.min(255, Math.max(0, parseInt(matches[2] || "0")));
            return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
        }
    }
    return "#ffffff";
};

export default function BrandingPage() {
    const { data: brand, isLoading } = useGetCustomBrand();
    const { updateCustomBrandAsync, isPending: isSaving } = useUpdateCustomBrand();
    const { uploadLogoAsync, isPending: isUploading } = useUploadLogo();

    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [backgroundColor, setBackgroundColor] = useState("#0B0F19");
    const [cardBgColor, setCardBgColor] = useState("rgba(255, 255, 255, 0.03)");
    const [textColor, setTextColor] = useState("#F3F4F6");
    const [inputBgColor, setInputBgColor] = useState("rgba(255, 255, 255, 0.05)");
    const [inputTextColor, setInputTextColor] = useState("#FFFFFF");
    const [inputBorderColor, setInputBorderColor] = useState("rgba(255, 255, 255, 0.1)");

    useEffect(() => {
        if (brand) {
            setLogoUrl(brand.logoUrl);
            setBackgroundColor(brand.backgroundColor);
            setCardBgColor(brand.cardBgColor || "rgba(255, 255, 255, 0.03)");
            setTextColor(brand.textColor);
            setInputBgColor(brand.inputBgColor);
            setInputTextColor(brand.inputTextColor);
            setInputBorderColor(brand.inputBorderColor);
        }
    }, [brand]);

    const handleApplyPreset = (preset: typeof BRAND_PRESETS[0]) => {
        setBackgroundColor(preset.backgroundColor);
        setCardBgColor(preset.cardBgColor);
        setTextColor(preset.textColor);
        setInputBgColor(preset.inputBgColor);
        setInputTextColor(preset.inputTextColor);
        setInputBorderColor(preset.inputBorderColor);
        toast.success(`Applied ${preset.name} Preset`);
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            try {
                const res = await uploadLogoAsync({ logoBase64: base64String });
                setLogoUrl(res.logoUrl);
                toast.success("Logo uploaded to Cloudinary successfully!");
            } catch (err: any) {
                toast.error(err.message || "Failed to upload logo.");
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        try {
            await updateCustomBrandAsync({
                logoUrl,
                backgroundColor,
                cardBgColor,
                textColor,
                inputBgColor,
                inputTextColor,
                inputBorderColor,
            });
            toast.success("Branding updated successfully!");
        } catch (err: any) {
            toast.error(err.message || "Failed to update branding settings.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Custom Branding</h1>
                <p className="text-muted-foreground mt-1">
                    Upload your company logo and adjust visual color palettes to brand your public forms instantly.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 space-y-6">
                    <Card className="shadow-md border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-amber-500" /> Presets
                            </CardTitle>
                            <CardDescription>Select a harmonic starting theme for instant design</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            {BRAND_PRESETS.map((p) => (
                                <button
                                    key={p.name}
                                    type="button"
                                    onClick={() => handleApplyPreset(p)}
                                    className="p-3 rounded-lg border text-left flex flex-col justify-between h-20 transition-all hover:bg-muted"
                                >
                                    <span className="text-xs font-semibold">{p.name}</span>
                                    <div className="flex gap-1.5 mt-2">
                                        <span
                                            className="w-4 h-4 rounded-full border border-black/10"
                                            style={{ backgroundColor: p.backgroundColor }}
                                        />
                                        <span
                                            className="w-4 h-4 rounded-full border border-black/10"
                                            style={{ backgroundColor: p.cardBgColor }}
                                        />
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="shadow-md border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle>Company Logo</CardTitle>
                            <CardDescription>Upload your logo to appear at the top of forms</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {logoUrl ? (
                                <div className="relative border rounded-xl p-4 flex items-center justify-center group bg-zinc-50 dark:bg-zinc-950">
                                    <img src={logoUrl} alt="Logo" className="max-h-16 object-contain" />
                                    <button
                                        type="button"
                                        onClick={() => setLogoUrl(null)}
                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:scale-105 transition-all shadow-sm"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="border border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted/40 transition-colors relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        disabled={isUploading}
                                    />
                                    {isUploading ? (
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    ) : (
                                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    )}
                                    <span className="text-sm font-medium">
                                        {isUploading ? "Uploading logo..." : "Click to select an image"}
                                    </span>
                                    <span className="text-xs text-muted-foreground mt-1">PNG, JPG or SVG (Max 2MB)</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-md border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle>Color Palettes</CardTitle>
                            <CardDescription>Design exact hex styles for form states</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Page Background</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={toHexColor(backgroundColor)}
                                            onChange={(e) => setBackgroundColor(e.target.value)}
                                            className="w-10 h-10 p-0 border-0 cursor-pointer rounded-lg shrink-0"
                                        />
                                        <Input
                                            value={backgroundColor}
                                            onChange={(e) => setBackgroundColor(e.target.value)}
                                            className="font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Card/Container Background</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={toHexColor(cardBgColor)}
                                            onChange={(e) => setCardBgColor(e.target.value)}
                                            className="w-10 h-10 p-0 border-0 cursor-pointer rounded-lg shrink-0"
                                        />
                                        <Input
                                            value={cardBgColor}
                                            onChange={(e) => setCardBgColor(e.target.value)}
                                            className="font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Text & Titles</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={toHexColor(textColor)}
                                            onChange={(e) => setTextColor(e.target.value)}
                                            className="w-10 h-10 p-0 border-0 cursor-pointer rounded-lg shrink-0"
                                        />
                                        <Input
                                            value={textColor}
                                            onChange={(e) => setTextColor(e.target.value)}
                                            className="font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Input Background</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={toHexColor(inputBgColor)}
                                            onChange={(e) => setInputBgColor(e.target.value)}
                                            className="w-10 h-10 p-0 border-0 cursor-pointer rounded-lg shrink-0"
                                        />
                                        <Input
                                            value={inputBgColor}
                                            onChange={(e) => setInputBgColor(e.target.value)}
                                            className="font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Input Text Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={toHexColor(inputTextColor)}
                                            onChange={(e) => setInputTextColor(e.target.value)}
                                            className="w-10 h-10 p-0 border-0 cursor-pointer rounded-lg shrink-0"
                                        />
                                        <Input
                                            value={inputTextColor}
                                            onChange={(e) => setInputTextColor(e.target.value)}
                                            className="font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Input Border Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={toHexColor(inputBorderColor)}
                                            onChange={(e) => setInputBorderColor(e.target.value)}
                                            className="w-10 h-10 p-0 border-0 cursor-pointer rounded-lg shrink-0"
                                        />
                                        <Input
                                            value={inputBorderColor}
                                            onChange={(e) => setInputBorderColor(e.target.value)}
                                            className="font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button onClick={handleSave} disabled={isSaving} className="w-full flex items-center justify-center gap-2">
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Saving Changes
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4" /> Save Brand Configuration
                            </>
                        )}
                    </Button>
                </div>

                <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">Mockup Live Preview</h2>
                        <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full font-semibold">Active override preview</span>
                    </div>

                    <div
                        className="rounded-2xl border p-8 md:p-12 transition-all duration-300 min-h-[500px] flex flex-col justify-center relative overflow-hidden"
                        style={{ backgroundColor, color: textColor, borderColor: inputBorderColor }}
                    >
                        <div className="max-w-md mx-auto w-full space-y-6">
                            <div className="text-center space-y-3">
                                {logoUrl ? (
                                    <div className="flex justify-center">
                                        <img src={logoUrl} alt="Logo" className="max-h-12 object-contain" />
                                    </div>
                                ) : (
                                    <div className="h-10 flex items-center justify-center text-xs opacity-40 italic border border-dashed rounded-lg">
                                        Logo slot
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold tracking-tight" style={{ color: textColor }}>
                                        Preview Form Title
                                    </h3>
                                    <p className="text-sm opacity-80" style={{ color: textColor }}>
                                        This is a preview representation of how fields adjust visually.
                                    </p>
                                </div>
                            </div>

                            <div 
                                className="border rounded-xl p-6 space-y-4 shadow-sm transition-all duration-300"
                                style={{ backgroundColor: cardBgColor, borderColor: inputBorderColor }}
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold" style={{ color: textColor }}>
                                        Full Name Label
                                    </label>
                                    <input
                                        disabled
                                        placeholder="Placeholder styling..."
                                        style={{
                                            backgroundColor: inputBgColor,
                                            color: inputTextColor,
                                            borderColor: inputBorderColor,
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border outline-none text-base bg-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold" style={{ color: textColor }}>
                                        Description box
                                    </label>
                                    <textarea
                                        disabled
                                        rows={2}
                                        placeholder="Textarea input mapping..."
                                        style={{
                                            backgroundColor: inputBgColor,
                                            color: inputTextColor,
                                            borderColor: inputBorderColor,
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border outline-none text-base bg-transparent"
                                    />
                                </div>

                                <button
                                    disabled
                                    className="w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                                    style={{
                                        backgroundColor: textColor,
                                        color: backgroundColor,
                                    }}
                                >
                                    Proceed Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
