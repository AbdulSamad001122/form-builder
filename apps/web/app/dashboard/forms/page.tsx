"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCreateForm, useListFormsByUserId, useUpdateForm, useDeleteForm } from "~/hooks/api/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { FORM_THEMES, DEFAULT_THEME_ID, getThemeById } from "~/lib/form-themes"
import { Check, Palette, Search, ArrowUpDown, Loader2, Lock, Calendar, BarChart3, Edit3, Trash2, ExternalLink, Archive } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "~/components/ui/skeleton"

import { useGetCustomBrand } from "~/hooks/api/custom-brand"

function ThemePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
    const router = useRouter()
    const { data: brand, isLoading } = useGetCustomBrand()

    const handleSelectTheme = (themeId: string) => {
        if (themeId === "custom") {
            if (!isLoading && !brand) {
                toast.info("Please set up your custom branding details first! Redirecting...")
                setTimeout(() => {
                    router.push("/dashboard/branding")
                }, 1500)
                return
            }
        }
        onChange(themeId)
    }

    return (
        <div className="grid gap-2">
            <Label className="flex items-center gap-2">
                <Palette size={14} />
                Form Theme
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FORM_THEMES.map((theme) => (
                    <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleSelectTheme(theme.id)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all focus:outline-none ${
                            value === theme.id
                                ? "border-primary shadow-lg scale-105"
                                : "border-border hover:border-muted-foreground/50 hover:scale-102"
                        }`}
                    >
                        <div
                            className="h-16 w-full"
                            style={{ background: theme.previewGradient }}
                        />
                        <div className="bg-card px-2 py-1.5 text-center">
                            <p className="text-xs font-medium">{theme.name}</p>
                        </div>
                        {value === theme.id && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow">
                                <Check size={11} className="text-primary-foreground" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
            <p className="text-xs text-muted-foreground">
                {FORM_THEMES.find(t => t.id === value)?.description}
            </p>
        </div>
    )
}

// ─── Theme Swatch Badge for form cards ────────────────────────────────────────
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



export default function FormsPage() {
    const router = useRouter()
    const handleCardClick = (formId: string, e: React.MouseEvent) => {
        const target = e.target as HTMLElement
        if (target.closest('button') || target.closest('a')) {
            return
        }
        router.push(`/dashboard/forms/${formId}`)
    }
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [theme, setTheme] = useState(DEFAULT_THEME_ID)
    const [isRedirecting, setIsRedirecting] = useState(false)

    const [searchQuery, setSearchQuery] = useState("")
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
    const [visibleCount, setVisibleCount] = useState(6)
    const observerRef = useRef<HTMLDivElement | null>(null)

    const { createForm, isPending: isCreating } = useCreateForm()
    const { data: forms, isLoading } = useListFormsByUserId()
    const { updateForm, isPending: isUpdating } = useUpdateForm()
    const { deleteForm, isPending: isDeleting } = useDeleteForm()

    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [selectedForm, setSelectedForm] = useState<{ id: string, title: string, description: string | null } | null>(null)

    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editStatus, setEditStatus] = useState("DRAFT")
    const [editVisibility, setEditVisibility] = useState("UNLISTED")
    const [editTheme, setEditTheme] = useState(DEFAULT_THEME_ID)

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

    const paginatedForms = filteredAndSortedForms.slice(0, visibleCount)

    useEffect(() => {
        const sentinel = observerRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + 6, filteredAndSortedForms.length))
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(sentinel)
        return () => {
            if (sentinel) observer.unobserve(sentinel)
        }
    }, [filteredAndSortedForms.length])

    const openEditModal = (form: any) => {
        setSelectedForm(form)
        setEditTitle(form.title)
        setEditDescription(form.description || "")
        setEditStatus(form.status || "DRAFT")
        setEditVisibility(form.visibility || "UNLISTED")
        setEditTheme(form.theme || DEFAULT_THEME_ID)
        setEditOpen(true)
    }

    const openDeleteModal = (form: { id: string, title: string, description: string | null }) => {
        setSelectedForm(form)
        setDeleteOpen(true)
    }

    const handleCreateForm = (e: React.FormEvent) => {
        e.preventDefault()
        createForm({ title, description, theme }, {
            onSuccess: (data) => {
                setIsRedirecting(true)
                setOpen(false)
                setTitle("")
                setDescription("")
                setTheme(DEFAULT_THEME_ID)
                toast.success("Form created successfully!")
                router.push(`/dashboard/forms/${data.formId}`)
            },
            onError: (err) => {
                toast.error(`Failed to create form: ${err.message}`)
            }
        })
    }

    const handleUpdateForm = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedForm) return

        updateForm({
            id: selectedForm.id,
            title: editTitle,
            description: editDescription,
            status: editStatus as any,
            visibility: editVisibility as any,
            theme: editTheme,
        }, {
            onSuccess: () => {
                setEditOpen(false)
                setSelectedForm(null)
                toast.success("Form updated successfully!")
            },
            onError: (err) => {
                toast.error(`Failed to update form: ${err.message}`)
            }
        })
    }

    const handleDeleteForm = () => {
        if (!selectedForm) return

        deleteForm({ id: selectedForm.id }, {
            onSuccess: () => {
                setDeleteOpen(false)
                setSelectedForm(null)
                toast.success("Form deleted successfully!")
            },
            onError: (err) => {
                toast.error(`Failed to delete form: ${err.message}`)
            }
        })
    }

    const handleArchiveForm = (formId: string) => {
        updateForm({ id: formId, isArchived: true }, {
            onSuccess: () => {
                toast.success("Form archived successfully!")
            },
            onError: (err) => {
                toast.error(`Failed to archive form: ${err.message}`)
            }
        })
    }

    if (isRedirecting) {
        return (
            <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                        Preparing your form builder...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Forms Management</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Create Form</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create Form</DialogTitle>
                            <DialogDescription>
                                Give your form a title, description, and choose a theme.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateForm} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter form title"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter form description"
                                />
                            </div>
                            {/* Theme Picker */}
                            <ThemePicker value={theme} onChange={setTheme} />
                            <DialogFooter>
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {forms && forms.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                            <Search size={18} />
                        </span>
                        <Input
                            placeholder="Search forms by title..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setVisibleCount(6)
                            }}
                            className="pl-10 w-full bg-card"
                        />
                    </div>
                    <div className="w-full sm:w-[220px] flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground shrink-0 hidden sm:inline">Sort:</span>
                        <Select value={sortOrder} onValueChange={(value: any) => {
                            setSortOrder(value)
                            setVisibleCount(6)
                        }}>
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
                                <Skeleton className="h-8 w-16" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : forms && forms.length > 0 ? (
                filteredAndSortedForms.length > 0 ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedForms.map((form) => (
                                <Card 
                                    key={form.id} 
                                    className="group relative flex flex-col justify-between hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 rounded-xl cursor-pointer active:scale-[0.995] overflow-hidden"
                                    onClick={(e) => handleCardClick(form.id, e)}
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
                                                <Button variant="link" className="p-0 h-auto text-blue-500 hover:text-blue-600 flex items-center gap-1 text-xs" asChild onClick={(e) => e.stopPropagation()}>
                                                    <Link href={`/f/${form.id}`} target="_blank">
                                                        Open Public Form <ExternalLink size={12} />
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex flex-wrap items-center justify-end gap-1.5 pt-4 border-t mt-3" onClick={(e) => e.stopPropagation()}>
                                        <Button variant="outline" size="sm" className="flex items-center gap-1.5" asChild>
                                            <Link href={`/dashboard/forms/${form.id}/responses`}>
                                                <BarChart3 size={13} />
                                                <span className="hidden sm:inline lg:hidden 2xl:inline">Responses</span>
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex items-center gap-1.5" onClick={() => openEditModal(form)}>
                                            <Edit3 size={13} />
                                            <span className="hidden sm:inline lg:hidden 2xl:inline">Edit</span>
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground" onClick={() => handleArchiveForm(form.id)}>
                                            <Archive size={13} />
                                            <span className="hidden sm:inline lg:hidden 2xl:inline">Archive</span>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-1.5" onClick={() => openDeleteModal(form)}>
                                            <Trash2 size={13} />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        {visibleCount < filteredAndSortedForms.length && (
                            <div ref={observerRef} className="flex justify-center py-6">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </div>
                        )}
                        {visibleCount >= filteredAndSortedForms.length && filteredAndSortedForms.length > 0 && (
                            <div className="flex flex-col items-center justify-center py-8 border-t border-dashed mt-6">
                                <p className="text-xs text-muted-foreground font-medium bg-muted/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    All forms are listed
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed p-12 text-center bg-muted/10">
                        <p className="text-muted-foreground font-medium mb-2">No forms match your search query "{searchQuery}"</p>
                        <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                            Clear Search
                        </Button>
                    </div>
                )
            ) : (
                <div className="rounded-lg border border-dashed p-8 text-center bg-muted/10">
                    <p className="text-muted-foreground">No forms found. Create one to get started.</p>
                </div>
            )}

            {/* Edit Form Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Form</DialogTitle>
                        <DialogDescription>
                            Update your form details and theme.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateForm} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Enter form title"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Enter form description"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={editStatus} onValueChange={setEditStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-visibility">Visibility</Label>
                            <Select value={editVisibility} onValueChange={setEditVisibility}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select visibility" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UNLISTED">Unlisted</SelectItem>
                                    <SelectItem value="PUBLIC">Public</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Theme Picker */}
                        <ThemePicker value={editTheme} onChange={setEditTheme} />
                        <DialogFooter>
                            <Button type="submit" disabled={isUpdating} className="flex items-center gap-2">
                                {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isUpdating ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Form Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Form</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the form "{selectedForm?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteForm} disabled={isDeleting} className="flex items-center gap-2">
                            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}