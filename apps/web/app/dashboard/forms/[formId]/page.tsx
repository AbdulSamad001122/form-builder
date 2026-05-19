"use client"

import { useState } from "react"
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
    arrayMove,
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Checkbox } from "~/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "~/components/ui/dialog"
import { GripVertical, Edit, Trash2 } from "lucide-react"

const FIELD_TYPES = ["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"] as const;

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

export default function FormBuilderPage() {
    const params = useParams()
    const formId = params.formId as string

    const { data: fields, isLoading } = useListFormFields(formId)
    const { createFormField, isPending: isCreating } = useCreateFormField()
    const { updateFormField, isPending: isUpdating } = useUpdateFormField()
    const { deleteFormField, isPending: isDeleting } = useDeleteFormField()
    const { reorderFormField } = useReorderFormField()

    // Create Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newField, setNewField] = useState({
        label: "", description: "", placeholder: "", isRequired: false, type: "TEXT" as any
    })

    // Edit Modal State
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingField, setEditingField] = useState<any>(null)

    // Delete Modal State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deletingField, setDeletingField] = useState<any>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        
        if (active.id !== over.id && fields) {
            const oldIndex = fields.findIndex(f => f.id === active.id)
            const newIndex = fields.findIndex(f => f.id === over.id)
            

            let newFractionalIndex = "1000.00"
            if (newIndex === 0) {
                const firstIndex = parseFloat(fields[0].index)
                newFractionalIndex = (firstIndex / 2).toFixed(2)
            } else if (newIndex === fields.length - 1) {
                const lastIndex = parseFloat(fields[fields.length - 1].index)
                newFractionalIndex = (lastIndex + 1000).toFixed(2)
            } else {
                const prevIndex = newIndex > oldIndex ? parseFloat(fields[newIndex].index) : parseFloat(fields[newIndex - 1].index)
                const nextIndex = newIndex > oldIndex ? parseFloat(fields[newIndex + 1]?.index || fields[newIndex].index) : parseFloat(fields[newIndex].index)
                newFractionalIndex = ((prevIndex + nextIndex) / 2).toFixed(2)
            }

            reorderFormField({
                id: active.id,
                newIndex: newFractionalIndex
            })
        }
    }

    const handleCreateSubmit = () => {
        createFormField({
            formId,
            ...newField
        }, {
            onSuccess: () => {
                setIsCreateOpen(false)
                setNewField({ label: "", description: "", placeholder: "", isRequired: false, type: "TEXT" })
            }
        })
    }

    const handleEditSubmit = () => {
        if (!editingField) return
        updateFormField({
            id: editingField.id,
            label: editingField.label,
            description: editingField.description,
            placeholder: editingField.placeholder,
            isRequired: editingField.isRequired,
            type: editingField.type,
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
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Form Builder</h1>
                    <p className="text-muted-foreground mt-1">Drag and drop fields to reorder them.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>Add Field</Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading fields...</div>
            ) : fields?.length === 0 ? (
                <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
                    <h3 className="text-lg font-medium">No fields yet</h3>
                    <p className="text-muted-foreground mt-1 mb-4">Add your first field to start building the form.</p>
                    <Button onClick={() => setIsCreateOpen(true)} variant="outline">Add Field</Button>
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

            {/* CREATE MODAL */}
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
                                onChange={(e) => setNewField({...newField, label: e.target.value})} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Field Type</Label>
                            <Select value={newField.type} onValueChange={(val: any) => setNewField({...newField, type: val})}>
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
                                onChange={(e) => setNewField({...newField, placeholder: e.target.value})} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description (Optional)</Label>
                            <Textarea 
                                placeholder="Help text for the user..." 
                                value={newField.description} 
                                onChange={(e) => setNewField({...newField, description: e.target.value})} 
                            />
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox 
                                id="required" 
                                checked={newField.isRequired} 
                                onCheckedChange={(c) => setNewField({...newField, isRequired: !!c})} 
                            />
                            <label htmlFor="required" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Required field
                            </label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateSubmit} disabled={isCreating || !newField.label}>Create Field</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* EDIT MODAL */}
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
                                    onChange={(e) => setEditingField({...editingField, label: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Field Key (Immutable)</Label>
                                <Input disabled value={editingField.labelKey} className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label>Field Type</Label>
                                <Select value={editingField.type} onValueChange={(val: any) => setEditingField({...editingField, type: val})}>
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
                                    onChange={(e) => setEditingField({...editingField, placeholder: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description (Optional)</Label>
                                <Textarea 
                                    value={editingField.description || ""} 
                                    onChange={(e) => setEditingField({...editingField, description: e.target.value})} 
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox 
                                    id="edit-required" 
                                    checked={editingField.isRequired} 
                                    onCheckedChange={(c) => setEditingField({...editingField, isRequired: !!c})} 
                                />
                                <label htmlFor="edit-required" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Required field
                                </label>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditSubmit} disabled={isUpdating}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DELETE MODAL */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Field</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the field "{deletingField?.label}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteSubmit} disabled={isDeleting}>Delete Field</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}
