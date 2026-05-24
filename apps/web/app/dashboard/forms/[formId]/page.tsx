"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useParams } from "next/navigation"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    useCreateFormField,
    useListFormFields,
    useUpdateFormField,
    useDeleteFormField,
    useReorderFormField
} from "~/hooks/api/form-field"
import { useGetFormById, useUpdateForm } from "~/hooks/api/form"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Checkbox } from "~/components/ui/checkbox"
import { Badge } from "~/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "~/components/ui/dialog"
import { GripVertical, Edit, Trash2, Copy, Check, Globe, Lock, Eye, EyeOff, Loader2, QrCode, Download, CheckCheck, Clock, Calendar, Workflow } from "lucide-react"
import { Switch } from "~/components/ui/switch"
import LogicFlowCanvas from "~/components/canvas/LogicFlowCanvas"
import { toast } from "sonner"
import { Skeleton } from "~/components/ui/skeleton"
import { QRCodeCanvas } from "qrcode.react"

const FIELD_TYPES = [
    "TEXT", "LONG_TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD",
    "SINGLE_SELECT", "MULTI_SELECT", "CHECKBOX", "DROPDOWN", "RATING", "DATE"
] as const;

function SortableFieldItem({ field, onEdit, onDelete }: { field: any, onEdit: (field: any) => void, onDelete: (field: any) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: field.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="bg-card border rounded-lg p-4 mb-3 flex items-start gap-3 shadow-sm group">
            <div
                {...attributes}
                {...listeners}
                className="mt-1 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
            >
                <GripVertical size={20} />
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-medium flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive text-xs">*</span>}
                            <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{field.type}</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">Key: <code className="bg-muted px-1 rounded">{field.labelKey}</code></p>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(field)} className="h-8 w-8">
                            <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(field)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 size={16} />
                        </Button>
                    </div>
                </div>

                {field.description && <p className="text-sm mt-2 text-muted-foreground">{field.description}</p>}

                <div className="mt-3">
                    <Input disabled placeholder={field.placeholder || `Enter ${field.label}`} className="bg-muted/50" />
                </div>
            </div>
        </div>
    )
}

function QRShareModal({
    open,
    onClose,
    formId,
    formTitle,
    publicUrl,
}: {
    open: boolean
    onClose: () => void
    formId: string
    formTitle: string
    publicUrl: string
}) {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [copied, setCopied] = useState(false)
    const [linkCopied, setLinkCopied] = useState(false)

    const handleDownload = useCallback(() => {
        const canvas = canvasRef.current?.querySelector("canvas")
        if (!canvas) return
        const url = canvas.toDataURL("image/png")
        const a = document.createElement("a")
        a.href = url
        a.download = `${formTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_qr.png`
        a.click()
        toast.success("QR code downloaded!")
    }, [formTitle])

    const handleCopyQR = useCallback(async () => {
        const canvas = canvasRef.current?.querySelector("canvas")
        if (!canvas) return
        canvas.toBlob(async (blob) => {
            if (!blob) return
            try {
                await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
                setCopied(true)
                toast.success("QR code image copied!")
                setTimeout(() => setCopied(false), 2000)
            } catch {
                toast.error("Could not copy QR image")
            }
        })
    }, [])

    const handleCopyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(publicUrl)
            setLinkCopied(true)
            toast.success("Link copied to clipboard!")
            setTimeout(() => setLinkCopied(false), 2000)
        } catch {
            toast.error("Failed to copy link")
        }
    }, [publicUrl])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <QrCode size={18} className="text-primary" />
                        Share Form
                    </DialogTitle>
                    <DialogDescription>
                        Share <span className="font-semibold text-foreground">{formTitle}</span> via link or QR code.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    <div className="flex gap-2">
                        <Input value={publicUrl} readOnly className="font-mono text-xs bg-muted flex-1" />
                        <Button variant="outline" size="icon" className="shrink-0" onClick={handleCopyLink}>
                            {linkCopied ? <CheckCheck size={15} className="text-green-500" /> : <Copy size={15} />}
                        </Button>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div ref={canvasRef} className="p-4 bg-white rounded-2xl border shadow-sm">
                            <QRCodeCanvas
                                value={publicUrl}
                                size={190}
                                level="H"
                                includeMargin={false}
                                fgColor="#111827"
                                bgColor="#ffffff"
                            />
                        </div>

                        <div className="flex gap-2 w-full">
                            <Button variant="outline" className="flex-1 gap-2 text-sm" onClick={handleCopyQR}>
                                {copied ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
                                {copied ? "Copied!" : "Copy QR"}
                            </Button>
                            <Button className="flex-1 gap-2 text-sm" onClick={handleDownload}>
                                <Download size={14} />
                                Download
                            </Button>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        Respondents don't need an account to fill this form.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function SecuritySettingsModal({
    open,
    onClose,
    form,
    onSave,
    isSaving,
}: {
    open: boolean
    onClose: () => void
    form: any
    onSave: (payload: { isPasswordProtected: boolean; password?: string }) => void
    isSaving: boolean
}) {
    const [isProtected, setIsProtected] = useState(form?.isPasswordProtected || false)
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")

    const prevOpenRef = useRef(open)
    if (prevOpenRef.current !== open) {
        prevOpenRef.current = open
        if (open) {
            setIsProtected(form?.isPasswordProtected || false)
            setPassword("")
            setError("")
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isProtected && !form?.isPasswordProtected && !password.trim()) {
            setError("A password is required to enable protection.")
            return
        }
        if (isProtected && password.trim() && password.length < 4) {
            setError("Password must be at least 4 characters.")
            return
        }
        
        setError("")
        onSave({
            isPasswordProtected: isProtected,
            password: password.trim() || undefined,
        })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px] bg-white border border-[#D4CFC6] rounded-2xl shadow-xl p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <Lock size={18} className="text-[#1A3D2B]" />
                        Form Security
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 text-sm">
                        Require respondents to enter a password to view and submit this form.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                        <Checkbox
                            id="security-protected"
                            checked={isProtected}
                            onCheckedChange={(checked) => {
                                setIsProtected(!!checked)
                                setError("")
                            }}
                            className="border-gray-300"
                        />
                        <div className="grid gap-0.5 leading-none">
                            <label
                                htmlFor="security-protected"
                                className="text-sm font-semibold text-gray-800 cursor-pointer"
                            >
                                Enable Password Protection
                            </label>
                            <span className="text-xs text-gray-500">
                                Restrict response collection to authorized users.
                            </span>
                        </div>
                    </div>

                    {isProtected && (
                        <div className="space-y-2.5">
                            <Label htmlFor="security-password" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                {form?.isPasswordProtected ? "Update Password (Optional)" : "Form Password"}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="security-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={form?.isPasswordProtected ? "•••••••• (Leave blank to keep current)" : "Enter access password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        if (error) setError("")
                                    }}
                                    className="pr-10 border-gray-300 focus:ring-[#1A3D2B]"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {error && (
                                <p className="text-xs text-red-500 font-medium">{error}</p>
                            )}
                            {form?.isPasswordProtected && (
                                <p className="text-xs text-gray-400 italic">
                                    Leave the password blank if you only want to keep the current password.
                                </p>
                            )}
                        </div>
                    )}

                    <DialogFooter className="pt-2 gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex-1 sm:flex-none border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 sm:flex-none bg-[#1A3D2B] hover:bg-[#11261B] text-white flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Security Settings"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function LimitsSettingsModal({
    open,
    onClose,
    form,
    onSave,
    isSaving,
}: {
    open: boolean
    onClose: () => void
    form: any
    onSave: (payload: { expiresAt: string | null; responseLimit: number | null }) => void
    isSaving: boolean
}) {
    const [hasExpiry, setHasExpiry] = useState(!!form?.expiresAt)
    const [expiresAt, setExpiresAt] = useState(
        form?.expiresAt 
            ? new Date(form.expiresAt).toISOString().slice(0, 16) 
            : ""
    )
    const [hasLimit, setHasLimit] = useState(!!form?.responseLimit)
    const [responseLimit, setResponseLimit] = useState(
        form?.responseLimit ? String(form.responseLimit) : ""
    )
    const [error, setError] = useState("")

    const prevOpenRef = useRef(open)
    if (prevOpenRef.current !== open) {
        prevOpenRef.current = open
        if (open) {
            setHasExpiry(!!form?.expiresAt)
            setExpiresAt(
                form?.expiresAt 
                    ? new Date(new Date(form.expiresAt).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) 
                    : ""
            )
            setHasLimit(!!form?.responseLimit)
            setResponseLimit(
                form?.responseLimit ? String(form.responseLimit) : ""
            )
            setError("")
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (hasExpiry && !expiresAt) {
            setError("An expiration date and time is required.")
            return
        }
        if (hasLimit && (!responseLimit || parseInt(responseLimit, 10) <= 0)) {
            setError("A valid response limit greater than 0 is required.")
            return
        }
        
        setError("")
        onSave({
            expiresAt: hasExpiry ? new Date(expiresAt).toISOString() : null,
            responseLimit: hasLimit ? parseInt(responseLimit, 10) : null,
        })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px] bg-white border border-[#D4CFC6] rounded-2xl shadow-xl p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <Clock size={18} className="text-[#1A3D2B]" />
                        Form Limits & Expiry
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 text-sm">
                        Configure date/time boundaries and maximum submission limits for your form.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-3">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                            <Checkbox
                                id="enable-expiry"
                                checked={hasExpiry}
                                onCheckedChange={(checked) => {
                                    setHasExpiry(!!checked)
                                    setError("")
                                }}
                                className="border-gray-300"
                            />
                            <div className="grid gap-0.5 leading-none">
                                <label
                                    htmlFor="enable-expiry"
                                    className="text-sm font-semibold text-gray-800 cursor-pointer"
                                >
                                    Enable Expiry Date
                                </label>
                                <span className="text-xs text-gray-500">
                                    Automatically reject responses after a specific date.
                                </span>
                            </div>
                        </div>

                        {hasExpiry && (
                            <div className="space-y-2.5 px-1">
                                <Label htmlFor="expires-at" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Expiration Date & Time
                                </Label>
                                <Input
                                    id="expires-at"
                                    type="datetime-local"
                                    value={expiresAt}
                                    onChange={(e) => {
                                        setExpiresAt(e.target.value)
                                        if (error) setError("")
                                    }}
                                    className="border-gray-300 focus:ring-[#1A3D2B]"
                                />
                            </div>
                        )}

                        <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                            <Checkbox
                                id="enable-limit"
                                checked={hasLimit}
                                onCheckedChange={(checked) => {
                                    setHasLimit(!!checked)
                                    setError("")
                                }}
                                className="border-gray-300"
                            />
                            <div className="grid gap-0.5 leading-none">
                                <label
                                    htmlFor="enable-limit"
                                    className="text-sm font-semibold text-gray-800 cursor-pointer"
                                >
                                    Enable Response Limit
                                </label>
                                <span className="text-xs text-gray-500">
                                    Cap the total number of allowed submissions.
                                </span>
                            </div>
                        </div>

                        {hasLimit && (
                            <div className="space-y-2.5 px-1">
                                <Label htmlFor="response-limit" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Maximum Submissions
                                </Label>
                                <Input
                                    id="response-limit"
                                    type="number"
                                    min="1"
                                    placeholder="e.g., 30"
                                    value={responseLimit}
                                    onChange={(e) => {
                                        setResponseLimit(e.target.value)
                                        if (error) setError("")
                                    }}
                                    className="border-gray-300 focus:ring-[#1A3D2B]"
                                />
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="text-xs text-red-500 font-medium px-1">{error}</p>
                    )}

                    <DialogFooter className="pt-2 gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex-1 sm:flex-none border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 sm:flex-none bg-[#1A3D2B] hover:bg-[#11261B] text-white flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Limits"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function FormBuilderPage() {
    const params = useParams()
    const formId = params.formId as string

    const { data: form, isLoading: isFormLoading, refetch: refetchForm } = useGetFormById(formId)
    const { data: fields, isLoading } = useListFormFields(formId)
    const { createFormField, isPending: isCreating } = useCreateFormField()
    const { updateFormField, updateFormFieldAsync, isPending: isUpdating } = useUpdateFormField()
    const { deleteFormField, isPending: isDeleting } = useDeleteFormField()
    const { reorderFormField } = useReorderFormField()
    const { updateForm, isPending: isSavingForm } = useUpdateForm()

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newField, setNewField] = useState({
        label: "", description: "", placeholder: "", isRequired: false, type: "TEXT" as any, options: ""
    })

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingField, setEditingField] = useState<any>(null)

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deletingField, setDeletingField] = useState<any>(null)

    const [isShareOpen, setIsShareOpen] = useState(false)
    const [isSecurityOpen, setIsSecurityOpen] = useState(false)
    const [isLimitsOpen, setIsLimitsOpen] = useState(false)
    const [linkCopied, setLinkCopied] = useState(false)

    const [enableLogic, setEnableLogic] = useState(false)
    const [activeTab, setActiveTab] = useState<"list" | "flow">("list")
    const [isFlowFullscreen, setIsFlowFullscreen] = useState(false)

    useEffect(() => {
        if (fields) {
            const hasRules = fields.some(
                (f) => f.conditionalRules && Array.isArray(f.conditionalRules) && f.conditionalRules.length > 0
            )
            if (hasRules) {
                setEnableLogic(true)
            }
        }
    }, [fields])

    const handleSaveLogic = async (updatedFields: any[]) => {
        try {
            await Promise.all(
                updatedFields.map((field) => 
                    updateFormFieldAsync({
                        id: field.id,
                        label: field.label,
                        description: field.description,
                        placeholder: field.placeholder,
                        isRequired: field.isRequired,
                        type: field.type,
                        options: field.options,
                        conditionalRules: field.conditionalRules
                    })
                )
            )
        } catch (err: any) {
            throw new Error(err.message || "Failed to update logic paths")
        }
    }

    const publicUrl = typeof window !== "undefined"
        ? `${window.location.origin}/f/${formId}`
        : `/f/${formId}`

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(publicUrl)
            setLinkCopied(true)
            toast.success("Link copied to clipboard!")
            setTimeout(() => setLinkCopied(false), 2000)
        } catch {
            toast.error("Failed to copy link")
        }
    }

    const handleToggleStatus = () => {
        if (!form) return
        const newStatus = form.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
        updateForm({ id: formId, status: newStatus as any }, {
            onSuccess: () => {
                refetchForm()
                if (newStatus === "PUBLISHED") {
                    navigator.clipboard.writeText(publicUrl)
                    toast.success("Form published and link copied to clipboard!")
                } else {
                    toast.success("Form moved back to Draft.")
                }
            }
        })
    }

    const handleToggleVisibility = () => {
        if (!form) return
        const newVisibility = form.visibility === "PUBLIC" ? "UNLISTED" : "PUBLIC"
        updateForm({ id: formId, visibility: newVisibility as any }, {
            onSuccess: () => {
                refetchForm()
                toast.success(`Visibility changed to ${newVisibility}.`)
            }
        })
    }

    const handleSaveSecurity = (payload: { isPasswordProtected: boolean; password?: string }) => {
        updateForm({
            id: formId,
            isPasswordProtected: payload.isPasswordProtected,
            password: payload.password
        }, {
            onSuccess: () => {
                refetchForm()
                setIsSecurityOpen(false)
                toast.success("Security settings updated successfully!")
            },
            onError: (err) => {
                toast.error(`Failed to update security: ${err.message}`)
            }
        })
    }

    const handleSaveLimits = (payload: { expiresAt: string | null; responseLimit: number | null }) => {
        updateForm({
            id: formId,
            expiresAt: payload.expiresAt,
            responseLimit: payload.responseLimit
        }, {
            onSuccess: () => {
                refetchForm()
                setIsLimitsOpen(false)
                toast.success("Form submission limits and expiry updated successfully!")
            },
            onError: (err) => {
                toast.error(`Failed to update limits: ${err.message}`)
            }
        })
    }

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragEnd = (event: any) => {
        const { active, over } = event

        if (active.id !== over.id && fields) {
            const oldIndex = fields.findIndex(f => f.id === active.id)
            const newIndex = fields.findIndex(f => f.id === over.id)

            let newFractionalIndex = "1000.00"
            if (newIndex === 0 && fields[0]) {
                newFractionalIndex = (parseFloat(fields[0].index) / 2).toFixed(2)
            } else if (newIndex === fields.length - 1 && fields[fields.length - 1]) {
                newFractionalIndex = (parseFloat(fields[fields.length - 1]!.index) + 1000).toFixed(2)
            } else if (fields[newIndex]) {
                const prevItem = newIndex > oldIndex ? fields[newIndex] : fields[newIndex - 1]
                const nextItem = newIndex > oldIndex ? (fields[newIndex + 1] || fields[newIndex]) : fields[newIndex]
                newFractionalIndex = ((parseFloat(prevItem?.index || "0") + parseFloat(nextItem?.index || "0")) / 2).toFixed(2)
            }

            reorderFormField({ id: active.id, newIndex: newFractionalIndex })
        }
    }

    const handleCreateSubmit = () => {
        let optionsArray = null;
        if (["SINGLE_SELECT", "MULTI_SELECT", "DROPDOWN"].includes(newField.type) && newField.options) {
            optionsArray = newField.options.split(",").map(s => s.trim()).filter(Boolean);
        }
        createFormField({ formId, ...newField, options: optionsArray }, {
            onSuccess: () => {
                setIsCreateOpen(false)
                setNewField({ label: "", description: "", placeholder: "", isRequired: false, type: "TEXT", options: "" })
            }
        })
    }

    const handleEditSubmit = () => {
        if (!editingField) return
        let optionsArray = editingField.options;
        if (["SINGLE_SELECT", "MULTI_SELECT", "DROPDOWN"].includes(editingField.type) && typeof editingField.options === 'string') {
            optionsArray = editingField.options.split(",").map((s: string) => s.trim()).filter(Boolean);
        }
        updateFormField({
            id: editingField.id,
            label: editingField.label,
            description: editingField.description,
            placeholder: editingField.placeholder,
            isRequired: editingField.isRequired,
            type: editingField.type,
            options: optionsArray,
            conditionalRules: editingField.conditionalRules
        }, {
            onSuccess: () => {
                setIsEditOpen(false)
                setEditingField(null)
            }
        })
    }

    const handleDeleteSubmit = () => {
        if (!deletingField) return
        deleteFormField({ id: deletingField.id }, {
            onSuccess: () => {
                setIsDeleteOpen(false)
                setDeletingField(null)
            }
        })
    }

    return (
        <div className={`container mx-auto p-6 transition-all duration-300 ${enableLogic ? "max-w-none px-6 w-full" : "max-w-4xl"}`}>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Form Builder</h1>
                    {form && (
                        <p className="text-muted-foreground mt-1 text-lg font-medium">{form.title}</p>
                    )}
                    <p className="text-muted-foreground text-sm">Drag and drop fields to reorder them.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>Add Field</Button>
            </div>

            {isFormLoading ? (
                <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-muted/40 rounded-lg border">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <div className="flex-1" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                </div>
            ) : form && (
                <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-muted/40 rounded-lg border">
                    <Badge variant={form.status === "PUBLISHED" ? "default" : "secondary"} className="text-sm px-3 py-1">
                        {form.status === "PUBLISHED" ? "● Published" : "● Draft"}
                    </Badge>

                    <Badge variant="outline" className="text-sm px-3 py-1 flex items-center gap-1">
                        {form.visibility === "PUBLIC" ? <Globe size={12} /> : <Lock size={12} />}
                        {form.visibility}
                    </Badge>

                    <div className="flex-1" />

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggleVisibility}
                        disabled={isSavingForm}
                        className="flex items-center gap-2"
                    >
                        {isSavingForm ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : form.visibility === "PUBLIC" ? (
                            <EyeOff size={14} />
                        ) : (
                            <Eye size={14} />
                        )}
                        {form.visibility === "PUBLIC" ? "Make Unlisted" : "Make Public"}
                    </Button>

                    <Button
                        variant={form.status === "PUBLISHED" ? "outline" : "default"}
                        size="sm"
                        onClick={handleToggleStatus}
                        disabled={isSavingForm}
                        className="flex items-center gap-2"
                    >
                        {isSavingForm ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : form.status === "PUBLISHED" ? (
                            <EyeOff size={14} />
                        ) : (
                            <Eye size={14} />
                        )}
                        {form.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSecurityOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Lock size={14} />
                        Security
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsLimitsOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Clock size={14} />
                        Limits & Expiry
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/f/${formId}?preview=true`, "_blank")}
                        className="flex items-center gap-2"
                    >
                        <Eye size={14} />
                        Preview
                    </Button>

                    {form.status === "PUBLISHED" && (
                        <>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleCopyLink}
                                className="flex items-center gap-2"
                            >
                                {linkCopied ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
                                {linkCopied ? "Copied!" : "Copy Link"}
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsShareOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <QrCode size={14} />
                                QR Code
                            </Button>
                        </>
                    )}
                </div>
            )}

            {form && fields && fields.length > 0 && (
                <div className="bg-card border rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm select-none">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                            <Workflow className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-foreground">
                                Conditional Logic & Branching
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Branch respondent paths based on their choice answers instead of asking questions sequentially.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center gap-2">
                            <Switch 
                                id="enable-logic-toggle"
                                checked={enableLogic}
                                onCheckedChange={(checked) => {
                                    if (!checked) {
                                        const hasRules = fields.some(f => f.conditionalRules && Array.isArray(f.conditionalRules) && f.conditionalRules.length > 0)
                                        if (hasRules) {
                                            const confirmDisable = window.confirm("Disabling logic jumps will hide the canvas. Your saved visual connections will remain saved but inactive. Proceed?")
                                            if (!confirmDisable) return
                                        }
                                        setActiveTab("list")
                                    }
                                    setEnableLogic(checked)
                                }}
                            />
                            <Label htmlFor="enable-logic-toggle" className="text-xs font-semibold cursor-pointer">
                                Enable Logic Jumps
                            </Label>
                        </div>

                        {enableLogic && (
                            <div className="flex bg-muted p-0.5 rounded-lg border">
                                <Button 
                                    variant={activeTab === "list" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveTab("list")}
                                    className="h-8 text-xs px-3 shadow-none animate-in fade-in zoom-in-95 duration-150"
                                >
                                    Fields Editor
                                </Button>
                                <Button 
                                    variant={activeTab === "flow" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveTab("flow")}
                                    className="h-8 text-xs px-3 shadow-none animate-in fade-in zoom-in-95 duration-150"
                                >
                                    Visual Flow Map
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-card border rounded-lg p-4 flex gap-3 shadow-sm">
                            <Skeleton className="h-6 w-6 mt-1" />
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-5 w-1/3" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-9 w-full bg-muted/50" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : fields?.length === 0 ? (
                <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
                    <h3 className="text-lg font-medium">No fields yet</h3>
                    <p className="text-muted-foreground mt-1 mb-4">Add your first field to start building the form.</p>
                    <Button onClick={() => setIsCreateOpen(true)} variant="outline">Add Field</Button>
                </div>
            ) : enableLogic ? (
                <div className={isFlowFullscreen ? "fixed inset-0 w-screen h-screen z-50 bg-background p-6 flex flex-col animate-in fade-in duration-200 overflow-hidden" : ""}>
                    {isFlowFullscreen && (
                        <div className="flex items-center justify-between pb-3 border-b mb-4 shrink-0 select-none">
                            <div className="flex items-center gap-2">
                                <Workflow className="w-5 h-5 text-primary" />
                                <h2 className="font-bold text-base text-foreground">Immersive Logic Builder Workspace</h2>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => setIsFlowFullscreen(false)} className="h-8 text-xs">
                                Exit Workspace
                            </Button>
                        </div>
                    )}
                    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 items-start ${isFlowFullscreen ? "flex-1 min-h-0 h-full w-full" : ""}`}>
                        <div className={`lg:col-span-1 bg-card border rounded-xl p-4 shadow-sm space-y-4 overflow-y-auto pr-1 ${isFlowFullscreen ? "h-full max-h-none" : "max-h-[650px]"}`}>
                            <div className="flex items-center justify-between pb-2 border-b">
                                <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">Questions List</h3>
                                <Button size="sm" variant="outline" className="h-7 text-[10px] px-2" onClick={() => setIsCreateOpen(true)}>
                                    + Add Field
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {fields?.map((field, idx) => (
                                    <div key={field.id} className="bg-muted/30 border rounded-lg p-2.5 flex items-center justify-between gap-2 hover:border-primary/30 transition-colors group">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <span className="bg-primary/10 text-primary text-[9px] font-bold px-1 rounded shrink-0">
                                                    Q{idx + 1}
                                                </span>
                                                <span className="text-[9px] bg-muted px-1 py-0.5 rounded text-muted-foreground truncate uppercase font-semibold">
                                                    {field.type}
                                                </span>
                                            </div>
                                            <h4 className="text-[11px] font-semibold text-foreground truncate">{field.label}</h4>
                                        </div>
                                        <div className="flex items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" onClick={() => { setEditingField(field); setIsEditOpen(true) }} className="h-6 w-6">
                                                <Edit size={10} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => { setDeletingField(field); setIsDeleteOpen(true) }} className="h-6 w-6 text-destructive hover:bg-destructive/10">
                                                <Trash2 size={10} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`lg:col-span-3 ${isFlowFullscreen ? "h-full flex flex-col min-h-0" : ""}`}>
                            {activeTab === "flow" ? (
                                <LogicFlowCanvas 
                                    formId={formId}
                                    fields={fields || []}
                                    onSaveLogic={handleSaveLogic}
                                    isSaving={isUpdating}
                                    isFullscreen={isFlowFullscreen}
                                    setIsFullscreen={setIsFlowFullscreen}
                                />
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={fields?.map(f => f.id) || []}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-1">
                                            {fields?.map(field => (
                                                <SortableFieldItem
                                                    key={field.id}
                                                    field={field}
                                                    onEdit={(f) => { setEditingField(f); setIsEditOpen(true) }}
                                                    onDelete={(f) => { setDeletingField(f); setIsDeleteOpen(true) }}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={fields?.map(f => f.id) || []}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-1">
                            {fields?.map(field => (
                                <SortableFieldItem
                                    key={field.id}
                                    field={field}
                                    onEdit={(f) => { setEditingField(f); setIsEditOpen(true) }}
                                    onDelete={(f) => { setDeletingField(f); setIsDeleteOpen(true) }}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {form && (
                <QRShareModal
                    open={isShareOpen}
                    onClose={() => setIsShareOpen(false)}
                    formId={formId}
                    formTitle={form.title}
                    publicUrl={publicUrl}
                />
            )}

            {form && (
                <SecuritySettingsModal
                    open={isSecurityOpen}
                    onClose={() => setIsSecurityOpen(false)}
                    form={form}
                    onSave={handleSaveSecurity}
                    isSaving={isSavingForm}
                />
            )}

            {form && (
                <LimitsSettingsModal
                    open={isLimitsOpen}
                    onClose={() => setIsLimitsOpen(false)}
                    form={form}
                    onSave={handleSaveLimits}
                    isSaving={isSavingForm}
                />
            )}

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Field</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Field Label</Label>
                            <Input
                                placeholder="e.g. Full Name"
                                value={newField.label}
                                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Field Type</Label>
                            <Select value={newField.type} onValueChange={(val: any) => setNewField({ ...newField, type: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {FIELD_TYPES.map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Placeholder (Optional)</Label>
                            <Input
                                placeholder="e.g. John Doe"
                                value={newField.placeholder}
                                onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description (Optional)</Label>
                            <Textarea
                                placeholder="Help text for the user..."
                                value={newField.description}
                                onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                            />
                        </div>
                        {["SINGLE_SELECT", "MULTI_SELECT", "DROPDOWN"].includes(newField.type) && (
                            <div className="space-y-2">
                                <Label>Options (Comma separated)</Label>
                                <Input
                                    placeholder="Option 1, Option 2, Option 3"
                                    value={newField.options}
                                    onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                                />
                            </div>
                        )}
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="required"
                                checked={newField.isRequired}
                                onCheckedChange={(c) => setNewField({ ...newField, isRequired: !!c })}
                            />
                            <label htmlFor="required" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Required field
                            </label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isCreating}>Cancel</Button>
                        <Button onClick={handleCreateSubmit} disabled={isCreating || !newField.label} className="flex items-center gap-2">
                            {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isCreating ? "Creating..." : "Create Field"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Field</DialogTitle>
                    </DialogHeader>
                    {editingField && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Field Label</Label>
                                <Input
                                    value={editingField.label}
                                    onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Field Key (Immutable)</Label>
                                <Input disabled value={editingField.labelKey} className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label>Field Type</Label>
                                <Select value={editingField.type} onValueChange={(val: any) => setEditingField({ ...editingField, type: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FIELD_TYPES.map(t => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Placeholder (Optional)</Label>
                                <Input
                                    value={editingField.placeholder || ""}
                                    onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description (Optional)</Label>
                                <Textarea
                                    value={editingField.description || ""}
                                    onChange={(e) => setEditingField({ ...editingField, description: e.target.value })}
                                />
                            </div>
                            {["SINGLE_SELECT", "MULTI_SELECT", "DROPDOWN"].includes(editingField.type) && (
                                <div className="space-y-2">
                                    <Label>Options (Comma separated)</Label>
                                    <Input
                                        placeholder="Option 1, Option 2, Option 3"
                                        value={typeof editingField.options === 'string' ? editingField.options : (editingField.options?.join?.(', ') || '')}
                                        onChange={(e) => setEditingField({ ...editingField, options: e.target.value })}
                                    />
                                </div>
                            )}
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="edit-required"
                                    checked={editingField.isRequired}
                                    onCheckedChange={(c) => setEditingField({ ...editingField, isRequired: !!c })}
                                />
                                <label htmlFor="edit-required" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Required field
                                </label>
                            </div>
                            {["YES_NO", "SINGLE_SELECT", "MULTI_SELECT", "CHECKBOX", "DROPDOWN"].includes(editingField.type) && (
                                <div className="space-y-3 pt-3 border-t">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-semibold tracking-tight text-foreground">Logic Jumps (Conditional Routing)</Label>
                                        <p className="text-[11px] text-muted-foreground leading-normal">
                                            Define where to navigate the respondent based on their selected answer. By default, they go to the next question.
                                        </p>
                                    </div>
                                    <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                                        {(() => {
                                            const currentOptions = ["SINGLE_SELECT", "MULTI_SELECT", "DROPDOWN"].includes(editingField.type)
                                                ? (typeof editingField.options === 'string'
                                                    ? editingField.options.split(",").map((s: string) => s.trim()).filter(Boolean)
                                                    : (Array.isArray(editingField.options) ? editingField.options : []))
                                                : (editingField.type === "YES_NO"
                                                    ? ["Yes", "No"]
                                                    : (editingField.type === "CHECKBOX"
                                                        ? (editingField.options && (typeof editingField.options === 'string' || Array.isArray(editingField.options))
                                                            ? (typeof editingField.options === 'string'
                                                                ? editingField.options.split(",").map((s: string) => s.trim()).filter(Boolean)
                                                                : editingField.options)
                                                            : ["Checked"])
                                                        : []));

                                            if (currentOptions.length === 0) {
                                                return (
                                                    <p className="text-xs text-muted-foreground italic py-1">
                                                        Add options to this field first to configure logic jumps.
                                                    </p>
                                                );
                                            }

                                            const otherFields = fields?.filter((f: any) => f.id !== editingField.id) || [];
                                            const rules = Array.isArray(editingField.conditionalRules) ? editingField.conditionalRules : [];

                                            return currentOptions.map((opt: string, idx: number) => {
                                                const activeRule = rules.find((r: any) => String(r.value) === String(opt));
                                                return (
                                                    <div key={idx} className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">If answer is</div>
                                                            <div className="text-xs font-semibold truncate text-foreground">{opt}</div>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground font-bold shrink-0">➜</div>
                                                        <div className="flex-[2] min-w-0">
                                                            <Select
                                                                value={activeRule?.targetFieldId || "default"}
                                                                onValueChange={(val) => {
                                                                    let nextRules = [...rules];
                                                                    const ruleIndex = nextRules.findIndex((r: any) => String(r.value) === String(opt));
                                                                    if (val === "default") {
                                                                        if (ruleIndex > -1) {
                                                                            nextRules.splice(ruleIndex, 1);
                                                                        }
                                                                    } else {
                                                                        if (ruleIndex > -1) {
                                                                            nextRules[ruleIndex] = {
                                                                                ...nextRules[ruleIndex],
                                                                                targetFieldId: val
                                                                            };
                                                                        } else {
                                                                            nextRules.push({
                                                                                id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                                                                value: opt,
                                                                                targetFieldId: val
                                                                            });
                                                                        }
                                                                    }
                                                                    setEditingField({
                                                                        ...editingField,
                                                                        conditionalRules: nextRules
                                                                    });
                                                                }}
                                                            >
                                                                <SelectTrigger className="h-8 text-xs bg-background">
                                                                    <SelectValue placeholder="Next Question (Default)" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="default">Next Question (Default)</SelectItem>
                                                                    {otherFields.map((f: any) => (
                                                                        <SelectItem key={f.id} value={f.id} className="text-xs max-w-[260px] truncate">
                                                                            {f.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                    <SelectItem value="submit" className="text-xs font-medium text-primary">
                                                                        Submit Form (End)
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isUpdating}>Cancel</Button>
                        <Button onClick={handleEditSubmit} disabled={isUpdating} className="flex items-center gap-2">
                            {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Field</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the field "{deletingField?.label}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteSubmit} disabled={isDeleting} className="flex items-center gap-2">
                            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isDeleting ? "Deleting..." : "Delete Field"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
