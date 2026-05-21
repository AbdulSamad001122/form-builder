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
        isSuccess
    }

}

export const useUser = () => {
    const { data: user, error, isFetched, isFetching, isLoading, status } = trpc.auth.getLoggedInUserInfo.useQuery()

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

    const { mutate: logout, isPending: isLoggingOut } = trpc.auth.logout.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedInUserInfo.invalidate()
        }
    })

    return { logout, isLoggingOut }
}