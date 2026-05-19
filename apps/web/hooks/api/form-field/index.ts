import { trpc } from "~/trpc/client"

export const useCreateFormField = () => {
    const utils = trpc.useUtils()
    const { mutateAsync: createFormFieldAsync, mutate: createFormField, error, isPending, isError, isSuccess } = trpc.formField.createFormField.useMutation({
        onSuccess: () => {
            utils.formField.invalidate()
        }
    })
    return { createFormFieldAsync, createFormField, error, isPending, isError, isSuccess }
}

export const useUpdateFormField = () => {
    const utils = trpc.useUtils()
    const { mutateAsync: updateFormFieldAsync, mutate: updateFormField, error, isPending, isError, isSuccess } = trpc.formField.updateFormField.useMutation({
        onSuccess: () => {
            utils.formField.invalidate()
        }
    })
    return { updateFormFieldAsync, updateFormField, error, isPending, isError, isSuccess }
}

export const useDeleteFormField = () => {
    const utils = trpc.useUtils()
    const { mutateAsync: deleteFormFieldAsync, mutate: deleteFormField, error, isPending, isError, isSuccess } = trpc.formField.deleteFormField.useMutation({
        onSuccess: () => {
            utils.formField.invalidate()
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
    const { mutateAsync: reorderFormFieldAsync, mutate: reorderFormField, error, isPending, isError, isSuccess } = trpc.formField.reorderFormField.useMutation({
        onSuccess: () => {
            utils.formField.invalidate()
        }
    })
    return { reorderFormFieldAsync, reorderFormField, error, isPending, isError, isSuccess }
}
