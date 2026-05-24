import { trpc } from "~/trpc/client"

export const useGetCustomBrand = () => {
    const { data, error, isPending, isLoading, refetch } = trpc.customBrand.getCustomBrand.useQuery(undefined)
    return { data, error, isPending, isLoading, refetch }
}

export const useUpdateCustomBrand = () => {
    const utils = trpc.useUtils()
    const { mutateAsync: updateCustomBrandAsync, isPending } = trpc.customBrand.updateCustomBrand.useMutation({
        onSettled: () => {
            utils.customBrand.getCustomBrand.invalidate()
        }
    })
    return { updateCustomBrandAsync, isPending }
}

export const useUploadLogo = () => {
    const { mutateAsync: uploadLogoAsync, isPending } = trpc.customBrand.uploadLogo.useMutation()
    return { uploadLogoAsync, isPending }
}
