"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import { useListExploreForms } from "~/hooks/api/form"
import { getThemeById } from "~/lib/form-themes"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Skeleton } from "~/components/ui/skeleton"
import { Search, Copy, Download, QrCode, ExternalLink, User, Calendar, Globe, CheckCheck } from "lucide-react"
import { toast } from "sonner"
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react"

function FormCardSkeleton() {
    return (
        <Card className="relative overflow-hidden">
            <div className="h-1.5 w-full absolute top-0 left-0 bg-muted" />
            <CardHeader className="pt-5 pb-2">
                <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-5 w-2/3" />
                    <div className="flex gap-1.5">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                </div>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="py-2 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/5" />
            </CardContent>
            <CardFooter className="pt-3 border-t flex gap-2 justify-end">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8" />
            </CardFooter>
        </Card>
    )
}

function QRCodeModal({
    open,
    onClose,
    formId,
    formTitle,
}: {
    open: boolean
    onClose: () => void
    formId: string
    formTitle: string
}) {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [copied, setCopied] = useState(false)

    const formUrl = typeof window !== "undefined"
        ? `${window.location.origin}/f/${formId}`
        : `/f/${formId}`

    const handleDownload = useCallback(() => {
        const canvas = canvasRef.current?.querySelector("canvas")
        if (!canvas) return
        const url = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = url
        link.download = `${formTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_qr.png`
        link.click()
        toast.success("QR code downloaded!")
    }, [formTitle])

    const handleCopyQR = useCallback(async () => {
        const canvas = canvasRef.current?.querySelector("canvas")
        if (!canvas) return
        canvas.toBlob(async (blob) => {
            if (!blob) return
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ "image/png": blob }),
                ])
                setCopied(true)
                toast.success("QR code copied to clipboard!")
                setTimeout(() => setCopied(false), 2000)
            } catch {
                toast.error("Could not copy QR code image")
            }
        })
    }, [])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[380px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <QrCode size={18} className="text-primary" />
                        QR Code
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center gap-5 py-2">
                    <p className="text-sm text-muted-foreground text-center max-w-[260px] leading-relaxed">
                        Scan to open <span className="font-semibold text-foreground">{formTitle}</span>
                    </p>

                    <div
                        ref={canvasRef}
                        className="p-4 rounded-2xl border bg-white shadow-sm"
                    >
                        <QRCodeCanvas
                            value={formUrl}
                            size={200}
                            level="H"
                            includeMargin={false}
                            fgColor="#111827"
                            bgColor="#ffffff"
                        />
                    </div>

                    <p className="text-xs text-muted-foreground break-all text-center px-2">
                        {formUrl}
                    </p>

                    <div className="flex gap-2 w-full">
                        <Button
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={handleCopyQR}
                        >
                            {copied ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
                            {copied ? "Copied!" : "Copy Image"}
                        </Button>
                        <Button
                            className="flex-1 gap-2"
                            onClick={handleDownload}
                        >
                            <Download size={14} />
                            Download
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function ExploreFormCard({ form }: { form: any }) {
    const theme = getThemeById(form.theme)
    const [qrOpen, setQrOpen] = useState(false)
    const [linkCopied, setLinkCopied] = useState(false)

    const formUrl = typeof window !== "undefined"
        ? `${window.location.origin}/f/${form.id}`
        : `/f/${form.id}`

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(formUrl)
            setLinkCopied(true)
            toast.success("Link copied to clipboard!")
            setTimeout(() => setLinkCopied(false), 2000)
        } catch {
            toast.error("Failed to copy link")
        }
    }

    return (
        <>
            <Card className="relative overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group">
                <div
                    className="h-1.5 w-full absolute top-0 left-0 transition-all duration-300 group-hover:h-2"
                    style={{ background: theme.previewGradient }}
                />

                <CardHeader className="pt-5 pb-2 flex-shrink-0">
                    <CardTitle className="flex items-start justify-between gap-2 flex-wrap">
                        <span className="text-base font-semibold leading-tight truncate max-w-[200px]">
                            {form.title}
                        </span>
                        <div className="flex gap-1.5 shrink-0">
                            <Badge variant="default" className="text-xs px-2 py-0.5">
                                {form.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs px-2 py-0.5 flex items-center gap-1">
                                <Globe size={10} />
                                {form.visibility}
                            </Badge>
                        </div>
                    </CardTitle>
                    {form.description && (
                        <CardDescription className="line-clamp-2 text-sm mt-1">
                            {form.description}
                        </CardDescription>
                    )}
                </CardHeader>

                <CardContent className="py-2 space-y-2 flex-1">
                    <div
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border"
                        style={{
                            background: theme.previewGradient,
                            color: "white",
                            borderColor: "transparent",
                            textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                        }}
                    >
                        {theme.name}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User size={12} className="shrink-0 text-primary/60" />
                        <span className="truncate">{form.creatorName || "Anonymous"}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar size={12} className="shrink-0" />
                        <span>
                            {form.createdAt
                                ? new Date(form.createdAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })
                                : "—"}
                        </span>
                    </div>
                </CardContent>

                <CardFooter className="pt-3 border-t flex gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5 text-xs"
                        onClick={handleCopyLink}
                    >
                        {linkCopied ? <CheckCheck size={13} className="text-green-500" /> : <Copy size={13} />}
                        {linkCopied ? "Copied!" : "Copy Link"}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5 text-xs"
                        onClick={() => setQrOpen(true)}
                    >
                        <QrCode size={13} />
                        QR Code
                    </Button>
                    <Button
                        size="sm"
                        className="gap-1.5 text-xs"
                        asChild
                    >
                        <Link href={`/f/${form.id}`} target="_blank">
                            <ExternalLink size={13} />
                            Open
                        </Link>
                    </Button>
                </CardFooter>
            </Card>

            <QRCodeModal
                open={qrOpen}
                onClose={() => setQrOpen(false)}
                formId={form.id}
                formTitle={form.title}
            />
        </>
    )
}



export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [visibleCount, setVisibleCount] = useState(6)
    const observerRef = useRef<HTMLDivElement | null>(null)

    const { data: forms, isLoading } = useListExploreForms(
        searchQuery.trim().length > 0 ? searchQuery.trim() : undefined
    )

    const paginatedForms = forms
        ? forms.slice(0, visibleCount)
        : []

    useEffect(() => {
        const sentinel = observerRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + 6, forms?.length || 0))
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(sentinel)
        return () => {
            if (sentinel) observer.unobserve(sentinel)
        }
    }, [forms?.length])

    return (
        <div className="p-4 lg:p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">Explore Forms</h2>
                <p className="text-sm text-muted-foreground">
                    Discover public forms shared by the community
                </p>
            </div>

            <div className="relative mb-6 max-w-lg">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                    <Search size={17} />
                </span>
                <Input
                    id="explore-search"
                    placeholder="Search forms by title..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setVisibleCount(6)
                    }}
                    className="pl-10 bg-card"
                />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <FormCardSkeleton key={i} />
                    ))}
                </div>
            ) : forms && forms.length > 0 ? (
                <div className="space-y-4">
                    <p className="text-xs text-muted-foreground mb-1">
                        {forms.length} form{forms.length !== 1 ? "s" : ""} found
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginatedForms.map((form) => (
                            <ExploreFormCard key={form.id} form={form} />
                        ))}
                    </div>
                    {forms && visibleCount < forms.length && (
                        <div ref={observerRef} className="flex justify-center py-6">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                    )}
                    {forms && visibleCount >= forms.length && forms.length > 0 && (
                        <div className="flex flex-col items-center justify-center py-8 border-t border-dashed mt-6">
                            <p className="text-xs text-muted-foreground font-medium bg-muted/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                All public forms are listed
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed p-12 text-center bg-muted/10">
                    <QrCode size={36} className="mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-muted-foreground font-medium mb-1">
                        {searchQuery.trim().length > 0
                            ? `No public forms match "${searchQuery}"`
                            : "No public forms yet"}
                    </p>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        {searchQuery.trim().length > 0
                            ? "Try a different search term."
                            : "Forms published with public visibility will appear here."}
                    </p>
                    {searchQuery.trim().length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                             onClick={() => {
                                 setSearchQuery("")
                                 setVisibleCount(6)
                             }}
                        >
                            Clear Search
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
