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
        onSuccess: async () => {
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
        onSuccess: async () => {
            utils.form.invalidate()
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
        onSuccess: async () => {
            utils.form.invalidate()
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
