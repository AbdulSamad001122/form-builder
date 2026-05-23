"use client"

import { useState } from "react"
import Link from "next/link"
import { useListArchivedForms, useUpdateForm } from "~/hooks/api/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { FORM_THEMES, DEFAULT_THEME_ID, getThemeById } from "~/lib/form-themes"
import { Check, Palette, Search, ArrowUpDown, Loader2, Lock, Calendar, ArchiveRestore, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "~/components/ui/skeleton"

function ThemeSwatch({ themeId }: { themeId?: string | null }) {
    const theme = getThemeById(themeId)
    return (
        <span
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border"
            style={{
                background: theme.previewGradient,
                color: "white",
                borderColor: "transparent",
                textShadow: "0 1px 2px rgba(0,0,0,0.4)"
            }}
        >
            {theme.name}
        </span>
    )
}

export default function ArchivePage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

    const { data: forms, isLoading } = useListArchivedForms()
    const { updateForm } = useUpdateForm()

    const handleRestoreForm = (formId: string) => {
        updateForm({ id: formId, isArchived: false }, {
            onSuccess: () => {
                toast.success("Form restored successfully!")
            },
            onError: (err) => {
                toast.error(`Failed to restore form: ${err.message}`)
            }
        })
    }

    const filteredAndSortedForms = forms
        ? [...forms]
              .filter((form) =>
                  form.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .sort((a, b) => {
                  const dateA = new Date(a.createdAt!).getTime()
                  const dateB = new Date(b.createdAt!).getTime()
                  return sortOrder === "newest" ? dateB - dateA : dateA - dateB
              })
        : []

    return (
        <div className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Archived Forms</h2>
            </div>

            {forms && forms.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                            <Search size={18} />
                        </span>
                        <Input
                            placeholder="Search archived forms by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-full bg-card"
                        />
                    </div>
                    <div className="w-full sm:w-[220px] flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground shrink-0 hidden sm:inline">Sort:</span>
                        <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                            <SelectTrigger className="w-full bg-card">
                                <SelectValue placeholder="Sort order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="relative overflow-hidden space-y-4 p-5">
                            <div className="h-1.5 w-full bg-muted absolute top-0 left-0" />
                            <div className="flex justify-between items-center mt-2">
                                <Skeleton className="h-5 w-1/3" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <div className="flex justify-end gap-2 pt-2 border-t mt-4">
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : forms && forms.length > 0 ? (
                filteredAndSortedForms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredAndSortedForms.map((form) => (
                            <Card 
                                key={form.id} 
                                className="group relative flex flex-col justify-between hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden"
                            >
                                <div
                                    className="h-1.5 w-full absolute top-0 left-0 transition-all duration-300 group-hover:h-2"
                                    style={{ background: getThemeById(form.theme).previewGradient }}
                                />
                                <CardHeader className="pb-2 pt-5">
                                    <CardTitle className="flex items-start justify-between gap-2 flex-wrap">
                                        <span className="truncate max-w-[150px] font-semibold text-foreground group-hover:text-primary transition-colors">{form.title}</span>
                                        <div className="flex gap-1.5 shrink-0 flex-wrap">
                                            <Badge variant={form.status === "PUBLISHED" ? "default" : "secondary"}>
                                                {form.status}
                                            </Badge>
                                            <Badge variant="outline">{form.visibility}</Badge>
                                            {form.isPasswordProtected && (
                                                <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5 flex items-center gap-1">
                                                    <Lock size={10} className="shrink-0" />
                                                    Locked
                                                </Badge>
                                            )}
                                        </div>
                                    </CardTitle>
                                    {form.description && (
                                        <CardDescription className="line-clamp-2 mt-1">{form.description}</CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="py-2 space-y-2.5 flex-1 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <ThemeSwatch themeId={form.theme} />
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Calendar size={12} className="shrink-0" />
                                            <span>Created: {new Date(form.createdAt!).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    {form.status === "PUBLISHED" && (
                                        <div className="mt-1">
                                            <Button variant="link" className="p-0 h-auto text-blue-500 hover:text-blue-600 flex items-center gap-1 text-xs" asChild>
                                                <Link href={`/f/${form.id}`} target="_blank">
                                                    Open Public Form <ExternalLink size={12} />
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2 pt-4 border-t mt-3">
                                    <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-primary hover:bg-primary/5 border-primary/20 hover:border-primary/40" onClick={() => handleRestoreForm(form.id)}>
                                        <ArchiveRestore size={13} />
                                        <span>Restore Form</span>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed p-12 text-center bg-muted/10">
                        <p className="text-muted-foreground font-medium mb-2">No archived forms match your search query "{searchQuery}"</p>
                        <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                            Clear Search
                        </Button>
                    </div>
                )
            ) : (
                <div className="rounded-lg border border-dashed p-8 text-center bg-muted/10">
                    <p className="text-muted-foreground">No archived forms found.</p>
                </div>
            )}
        </div>
    )
}
