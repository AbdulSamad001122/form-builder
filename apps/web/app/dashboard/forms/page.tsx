"use client"

import { useState } from "react"
import Link from "next/link"
import { useCreateForm, useListFormsByUserId, useUpdateForm, useDeleteForm } from "~/hooks/api/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card"
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

export default function FormsPage() {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const { createForm } = useCreateForm()
    const { data: forms, isLoading } = useListFormsByUserId()
    const { updateForm, isPending: isUpdating } = useUpdateForm()
    const { deleteForm, isPending: isDeleting } = useDeleteForm()

    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [selectedForm, setSelectedForm] = useState<{ id: string, title: string, description: string | null } | null>(null)

    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")

    const openEditModal = (form: { id: string, title: string, description: string | null }) => {
        setSelectedForm(form)
        setEditTitle(form.title)
        setEditDescription(form.description || "")
        setEditOpen(true)
    }

    const openDeleteModal = (form: { id: string, title: string, description: string | null }) => {
        setSelectedForm(form)
        setDeleteOpen(true)
    }

    const handleCreateForm = (e: React.FormEvent) => {
        e.preventDefault()
        createForm({ title, description }, {
            onSuccess: () => {
                setOpen(false)
                setTitle("")
                setDescription("")
            }
        })
    }

    const handleUpdateForm = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedForm) return
        
        updateForm({ id: selectedForm.id, title: editTitle, description: editDescription }, {
            onSuccess: () => {
                setEditOpen(false)
                setSelectedForm(null)
            }
        })
    }

    const handleDeleteForm = () => {
        if (!selectedForm) return
        
        deleteForm({ id: selectedForm.id }, {
            onSuccess: () => {
                setDeleteOpen(false)
                setSelectedForm(null)
            }
        })
    }

    return (
        <div className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Forms Management</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Create Form</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Form</DialogTitle>
                            <DialogDescription>
                                Give your form a title and a brief description.
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
                            <DialogFooter>
                                <Button type="submit">Create</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <p className="text-muted-foreground">Loading forms...</p>
                </div>
            ) : forms && forms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {forms.map((form) => (
                        <Card key={form.id} className="hover:shadow-md transition-shadow relative">
                            <Link href={`/dashboard/forms/${form.id}`} className="absolute inset-0 z-0"></Link>
                            <CardHeader className="relative z-10 pointer-events-none">
                                <CardTitle>{form.title}</CardTitle>
                                {form.description && (
                                    <CardDescription>{form.description}</CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="relative z-10 pointer-events-none">
                                <p className="text-xs text-muted-foreground">
                                    Created at: {new Date(form.createdAt!).toLocaleDateString()}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 relative z-10">
                                <Button variant="outline" size="sm" onClick={() => openEditModal(form)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => openDeleteModal(form)}>Delete</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">No forms found. Create one to get started.</p>
                </div>
            )}

            {/* Edit Form Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Form</DialogTitle>
                        <DialogDescription>
                            Update your form details.
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
                        <DialogFooter>
                            <Button type="submit" disabled={isUpdating}>{isUpdating ? "Saving..." : "Save Changes"}</Button>
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
                        <Button variant="destructive" onClick={handleDeleteForm} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}