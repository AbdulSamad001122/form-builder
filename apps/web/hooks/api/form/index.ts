import { trpc } from "~/trpc/client"


export const useCreateForm = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess
    } = trpc.form.createForm.useMutation({
        onMutate: async (newForm) => {
            await utils.form.listFormByUserId.cancel()
            const previousForms = utils.form.listFormByUserId.getData()
            const tempForm = {
                id: `temp-${Date.now()}`,
                title: newForm.title,
                description: newForm.description || null,
                slug: newForm.slug || null,
                theme: newForm.theme || null,
                visibility: newForm.visibility || "UNLISTED",
                status: newForm.status || "DRAFT",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            utils.form.listFormByUserId.setData(undefined, (old) => {
                return old ? [tempForm, ...old] : [tempForm]
            })
            return { previousForms }
        },
        onError: (err, newForm, context) => {
            if (context?.previousForms) {
                utils.form.listFormByUserId.setData(undefined, context.previousForms)
            }
        },
        onSettled: () => {
            utils.form.invalidate()
        }
    })

    return {
        createFormAsync,
        createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess
    }
}

export const useListFormsByUserId = () => {
    const {
        data,
        error,
        isError,
        isPending,
        isLoading,
        isSuccess,
        refetch
    } = trpc.form.listFormByUserId.useQuery(undefined)

    return {
        data,
        error,
        isError,
        isPending,
        isLoading,
        isSuccess,
        refetch
    }
}

export const useUpdateForm = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: updateFormAsync,
        mutate: updateForm,
        error,
        isPending,
        isError,
        isSuccess
    } = trpc.form.updateForm.useMutation({
        onMutate: async (updatedForm) => {
            await utils.form.listFormByUserId.cancel()
            await utils.form.getFormById.cancel({ id: updatedForm.id })

            const previousForms = utils.form.listFormByUserId.getData()
            const previousFormDetail = utils.form.getFormById.getData({ id: updatedForm.id })

            utils.form.listFormByUserId.setData(undefined, (old) => {
                return old?.map((f) => {
                    if (f.id === updatedForm.id) {
                        return {
                            ...f,
                            ...updatedForm,
                            description: updatedForm.description !== undefined ? updatedForm.description : f.description,
                            slug: updatedForm.slug !== undefined ? updatedForm.slug : f.slug,
                            theme: updatedForm.theme !== undefined ? updatedForm.theme : f.theme,
                            visibility: updatedForm.visibility !== undefined ? updatedForm.visibility : f.visibility,
                            status: updatedForm.status !== undefined ? updatedForm.status : f.status,
                            updatedAt: new Date().toISOString()
                        }
                    }
                    return f
                })
            })

            utils.form.getFormById.setData({ id: updatedForm.id }, (old) => {
                if (!old) return old
                return {
                    ...old,
                    ...updatedForm,
                    description: updatedForm.description !== undefined ? updatedForm.description : old.description,
                    slug: updatedForm.slug !== undefined ? updatedForm.slug : old.slug,
                    theme: updatedForm.theme !== undefined ? updatedForm.theme : old.theme,
                    visibility: updatedForm.visibility !== undefined ? updatedForm.visibility : old.visibility,
                    status: updatedForm.status !== undefined ? updatedForm.status : old.status,
                    updatedAt: new Date().toISOString()
                }
            })

            return { previousForms, previousFormDetail, formId: updatedForm.id }
        },
        onError: (err, updatedForm, context) => {
            if (context?.previousForms) {
                utils.form.listFormByUserId.setData(undefined, context.previousForms)
            }
            if (context?.previousFormDetail) {
                utils.form.getFormById.setData({ id: context.formId }, context.previousFormDetail)
            }
        },
        onSettled: (data, error, variables) => {
            utils.form.listFormByUserId.invalidate()
            utils.form.getFormById.invalidate({ id: variables.id })
        }
    })

    return {
        updateFormAsync,
        updateForm,
        error,
        isPending,
        isError,
        isSuccess
    }
}

export const useDeleteForm = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: deleteFormAsync,
        mutate: deleteForm,
        error,
        isPending,
        isError,
        isSuccess
    } = trpc.form.deleteForm.useMutation({
        onMutate: async ({ id }) => {
            await utils.form.listFormByUserId.cancel()
            const previousForms = utils.form.listFormByUserId.getData()

            utils.form.listFormByUserId.setData(undefined, (old) => {
                return old?.filter((f) => f.id !== id)
            })

            return { previousForms }
        },
        onError: (err, { id }, context) => {
            if (context?.previousForms) {
                utils.form.listFormByUserId.setData(undefined, context.previousForms)
            }
        },
        onSettled: () => {
            utils.form.listFormByUserId.invalidate()
        }
    })

    return {
        deleteFormAsync,
        deleteForm,
        error,
        isPending,
        isError,
        isSuccess
    }
}

export const useGetPublicForm = (id: string) => {
    const {
        data,
        error,
        isError,
        isPending,
        isLoading,
        isSuccess,
        refetch
    } = trpc.form.getPublicForm.useQuery({ id }, {
        enabled: !!id,
        refetchOnWindowFocus: false,
        retry: false,
    })

    return {
        data,
        error,
        isError,
        isPending,
        isLoading,
        isSuccess,
        refetch
    }
}

export const useGetFormById = (id: string) => {
    const {
        data,
        error,
        isError,
        isPending,
        isLoading,
        isSuccess,
        refetch
    } = trpc.form.getFormById.useQuery({ id }, {
        enabled: !!id,
        refetchOnWindowFocus: false,
    })

    return {
        data,
        error,
        isError,
        isPending,
        isLoading,
        isSuccess,
        refetch
    }
}

export const useGetDashboardStats = () => {
    const {
        data,
        error,
        isError,
        isPending,
        isLoading,
        isSuccess,
        refetch
    } = trpc.form.getDashboardStats.useQuery(undefined)

    return {
        data,
        error,
        isError,
        isPending,
        isLoading,
        isSuccess,
        refetch
    }
}

export const useListExploreForms = (search?: string) => {
    const {
        data,
        error,
        isError,
        isPending,
        isLoading,
        isSuccess,
        refetch
    } = trpc.form.listExploreForms.useQuery({ search }, {
        refetchOnWindowFocus: false,
    })

    return {
        data,
        error,
        isError,
        isPending,
        isLoading,
        isSuccess,
        refetch
    }
}
