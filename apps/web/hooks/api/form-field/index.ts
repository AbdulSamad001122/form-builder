import { useParams } from "next/navigation"
import { trpc } from "~/trpc/client"

export const useCreateFormField = () => {
    const utils = trpc.useUtils()
    const params = useParams()
    const urlFormId = typeof params?.formId === "string" ? params.formId : ""

    const { mutateAsync: createFormFieldAsync, mutate: createFormField, error, isPending, isError, isSuccess } = trpc.formField.createFormField.useMutation({
        onMutate: async (newField) => {
            const formId = newField.formId || urlFormId
            if (!formId) return

            await utils.formField.listFormFields.cancel({ formId })
            await utils.form.getFormById.cancel({ id: formId })

            const previousFields = utils.formField.listFormFields.getData({ formId })
            const previousForm = utils.form.getFormById.getData({ id: formId })

            const maxIndex = previousFields && previousFields.length > 0
                ? Math.max(...previousFields.map(f => parseFloat(f.index) || 0))
                : 0
            const nextIndex = (maxIndex + 1).toFixed(2)

            const tempField = {
                id: `temp-field-${Date.now()}`,
                formId,
                label: newField.label,
                labelKey: newField.label.toLowerCase().replace(/[^a-z0-9]/g, "_") || `field_${Date.now()}`,
                description: newField.description || null,
                placeholder: newField.placeholder || null,
                options: newField.options || null,
                isRequired: newField.isRequired || false,
                type: newField.type,
                index: nextIndex,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            utils.formField.listFormFields.setData({ formId }, (old) => {
                return old ? [...old, tempField] : [tempField]
            })

            utils.form.getFormById.setData({ id: formId }, (old) => {
                if (!old) return old
                return {
                    ...old,
                    fields: old.fields ? [...old.fields, tempField] : [tempField]
                }
            })

            return { previousFields, previousForm, formId }
        },
        onError: (err, newField, context) => {
            if (context?.formId) {
                if (context.previousFields) {
                    utils.formField.listFormFields.setData({ formId: context.formId }, context.previousFields)
                }
                if (context.previousForm) {
                    utils.form.getFormById.setData({ id: context.formId }, context.previousForm)
                }
            }
        },
        onSettled: (data, error, variables) => {
            const formId = variables.formId || urlFormId
            if (formId) {
                utils.formField.listFormFields.invalidate({ formId })
                utils.form.getFormById.invalidate({ id: formId })
            }
        }
    })

    return { createFormFieldAsync, createFormField, error, isPending, isError, isSuccess }
}

export const useUpdateFormField = () => {
    const utils = trpc.useUtils()
    const params = useParams()
    const urlFormId = typeof params?.formId === "string" ? params.formId : ""

    const { mutateAsync: updateFormFieldAsync, mutate: updateFormField, error, isPending, isError, isSuccess } = trpc.formField.updateFormField.useMutation({
        onMutate: async (updatedField) => {
            const formId = urlFormId
            if (!formId) return

            await utils.formField.listFormFields.cancel({ formId })
            await utils.form.getFormById.cancel({ id: formId })

            const previousFields = utils.formField.listFormFields.getData({ formId })
            const previousForm = utils.form.getFormById.getData({ id: formId })

            const updateCacheFn = (oldFields: any[] | undefined): any[] => {
                if (!oldFields) return []
                const newFields = oldFields.map((f) => {
                    if (f.id === updatedField.id) {
                        return {
                            ...f,
                            ...updatedField,
                            description: updatedField.description !== undefined ? updatedField.description : f.description,
                            placeholder: updatedField.placeholder !== undefined ? updatedField.placeholder : f.placeholder,
                            options: updatedField.options !== undefined ? updatedField.options : f.options,
                            isRequired: updatedField.isRequired !== undefined ? updatedField.isRequired : f.isRequired,
                            type: updatedField.type !== undefined ? updatedField.type : f.type,
                            index: updatedField.index !== undefined ? updatedField.index : f.index,
                            updatedAt: new Date()
                        }
                    }
                    return f
                })
                if (updatedField.index !== undefined) {
                    newFields.sort((a, b) => parseFloat(a.index) - parseFloat(b.index))
                }
                return newFields
            }

            utils.formField.listFormFields.setData({ formId }, updateCacheFn)

            utils.form.getFormById.setData({ id: formId }, (old) => {
                if (!old) return old
                return {
                    ...old,
                    fields: updateCacheFn(old.fields)
                }
            })

            return { previousFields, previousForm, formId }
        },
        onError: (err, updatedField, context) => {
            if (context?.formId) {
                if (context.previousFields) {
                    utils.formField.listFormFields.setData({ formId: context.formId }, context.previousFields)
                }
                if (context.previousForm) {
                    utils.form.getFormById.setData({ id: context.formId }, context.previousForm)
                }
            }
        },
        onSettled: () => {
            const formId = urlFormId
            if (formId) {
                utils.formField.listFormFields.invalidate({ formId })
                utils.form.getFormById.invalidate({ id: formId })
            }
        }
    })

    return { updateFormFieldAsync, updateFormField, error, isPending, isError, isSuccess }
}

export const useDeleteFormField = () => {
    const utils = trpc.useUtils()
    const params = useParams()
    const urlFormId = typeof params?.formId === "string" ? params.formId : ""

    const { mutateAsync: deleteFormFieldAsync, mutate: deleteFormField, error, isPending, isError, isSuccess } = trpc.formField.deleteFormField.useMutation({
        onMutate: async ({ id }) => {
            const formId = urlFormId
            if (!formId) return

            await utils.formField.listFormFields.cancel({ formId })
            await utils.form.getFormById.cancel({ id: formId })

            const previousFields = utils.formField.listFormFields.getData({ formId })
            const previousForm = utils.form.getFormById.getData({ id: formId })

            utils.formField.listFormFields.setData({ formId }, (old) => {
                return old?.filter((f) => f.id !== id)
            })

            utils.form.getFormById.setData({ id: formId }, (old) => {
                if (!old) return old
                return {
                    ...old,
                    fields: old.fields ? old.fields.filter((f: any) => f.id !== id) : []
                }
            })

            return { previousFields, previousForm, formId }
        },
        onError: (err, { id }, context) => {
            if (context?.formId) {
                if (context.previousFields) {
                    utils.formField.listFormFields.setData({ formId: context.formId }, context.previousFields)
                }
                if (context.previousForm) {
                    utils.form.getFormById.setData({ id: context.formId }, context.previousForm)
                }
            }
        },
        onSettled: () => {
            const formId = urlFormId
            if (formId) {
                utils.formField.listFormFields.invalidate({ formId })
                utils.form.getFormById.invalidate({ id: formId })
            }
        }
    })

    return { deleteFormFieldAsync, deleteFormField, error, isPending, isError, isSuccess }
}

export const useListFormFields = (formId: string) => {
    const { data, error, isError, isPending, isLoading, isSuccess, refetch } = trpc.formField.listFormFields.useQuery({ formId }, {
        enabled: !!formId
    })
    return { data, error, isError, isPending, isLoading, isSuccess, refetch }
}

export const useReorderFormField = () => {
    const utils = trpc.useUtils()
    const params = useParams()
    const urlFormId = typeof params?.formId === "string" ? params.formId : ""

    const { mutateAsync: reorderFormFieldAsync, mutate: reorderFormField, error, isPending, isError, isSuccess } = trpc.formField.reorderFormField.useMutation({
        onMutate: async ({ id, newIndex }) => {
            const formId = urlFormId
            if (!formId) return

            await utils.formField.listFormFields.cancel({ formId })
            await utils.form.getFormById.cancel({ id: formId })

            const previousFields = utils.formField.listFormFields.getData({ formId })
            const previousForm = utils.form.getFormById.getData({ id: formId })

            const reorderCacheFn = (oldFields: any[] | undefined): any[] => {
                if (!oldFields) return []
                const updated = oldFields.map((f) => {
                    if (f.id === id) {
                        return { ...f, index: newIndex }
                    }
                    return f
                })
                return [...updated].sort((a, b) => parseFloat(a.index) - parseFloat(b.index))
            }

            utils.formField.listFormFields.setData({ formId }, reorderCacheFn)

            utils.form.getFormById.setData({ id: formId }, (old) => {
                if (!old) return old
                return {
                    ...old,
                    fields: reorderCacheFn(old.fields)
                }
            })

            return { previousFields, previousForm, formId }
        },
        onError: (err, { id, newIndex }, context) => {
            if (context?.formId) {
                if (context.previousFields) {
                    utils.formField.listFormFields.setData({ formId: context.formId }, context.previousFields)
                }
                if (context.previousForm) {
                    utils.form.getFormById.setData({ id: context.formId }, context.previousForm)
                }
            }
        },
        onSettled: () => {
            const formId = urlFormId
            if (formId) {
                utils.formField.listFormFields.invalidate({ formId })
                utils.form.getFormById.invalidate({ id: formId })
            }
        }
    })

    return { reorderFormFieldAsync, reorderFormField, error, isPending, isError, isSuccess }
}
