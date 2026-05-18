import { trpc } from "~/trpc/client"

export const useSignup = () => {
    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess
    } = trpc.auth.createUserWithEmailAndPassword.useMutation()


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
    const {
        mutateAsync: siginUserWithEmailAndPasswordAsync,
        mutate: siginUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess
    } = trpc.auth.siginUserWithEmailAndPassword.useMutation()


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
