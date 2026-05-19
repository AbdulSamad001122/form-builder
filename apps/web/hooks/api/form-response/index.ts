import { trpc } from "~/trpc/client";

export const useSubmitFormResponse = () => {
    const utils = trpc.useUtils()
    const mutation = trpc.formResponse.submitResponse.useMutation({
        onSuccess: () => {
            utils.formResponse.listResponses.invalidate()
        }
    })
    return mutation
}

export const useListFormResponses = (formId: string) => {
    const query = trpc.formResponse.listResponses.useQuery({ formId }, {
        enabled: !!formId
    })
    return query
}
