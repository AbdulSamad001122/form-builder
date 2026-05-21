import { useQueryClient } from "@tanstack/react-query"
import { trpc } from "~/trpc/client"

export const useSignup = () => {

    const utils = trpc.useUtils()

    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess
    } = trpc.auth.createUserWithEmailAndPassword.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedInUserInfo.invalidate()
        }
    })


    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess
    }

}

export const useSignin = () => {

    const utils = trpc.useUtils()

    const {
        mutateAsync: siginUserWithEmailAndPasswordAsync,
        mutate: siginUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess
    } = trpc.auth.signinUserWithEmailAndPassword.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedInUserInfo.invalidate()
        }
    })


    return {
        siginUserWithEmailAndPasswordAsync,
        siginUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess
    }

}

export const useUser = () => {
    const { data: user, error, isFetched, isFetching, isLoading, status } = trpc.auth.getLoggedInUserInfo.useQuery(undefined, {
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        refetchOnWindowFocus: false,
    })

    return {
        user,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    }
}

export const useLogout = () => {
    const utils = trpc.useUtils()
    const queryClient = useQueryClient()

    const { mutate: logout, isPending: isLoggingOut } = trpc.auth.logout.useMutation({
        onSuccess: async () => {
            queryClient.clear()
            await utils.auth.getLoggedInUserInfo.invalidate()
        }
    })

    return { logout, isLoggingOut }
}