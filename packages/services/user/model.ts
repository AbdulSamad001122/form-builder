import { z } from "zod"

export const createUserWithEmailAndPasswordInput = z.object({
    fullName: z.string().describe("Full name of the user"),
    email: z.string().email().describe("Email of the user"),
    password: z.string().min(8).describe("Password of the user"),

})
export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>

export const siginUserWithEmailAndPasswordInput = z.object({
    email: z.string().email().describe("Email of the user"),
    password: z.string().min(8).describe("Password of the user"),

})

export type SiginUserWithEmailAndPasswordInputType = z.infer<typeof siginUserWithEmailAndPasswordInput>

export const generateUserTokenPayload = z.object({
    id: z.string().describe("uuid of the user")
})

export type generateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>

export const forgotPasswordInput = z.object({
    email: z.string().email().describe("Email of the user requesting password reset"),
})
export type ForgotPasswordInputType = z.infer<typeof forgotPasswordInput>

export const resetPasswordInput = z.object({
    email: z.string().email().describe("User email"),
    token: z.string().min(1).describe("Secure verification token"),
    password: z.string().min(8).describe("New user password"),
})
export type ResetPasswordInputType = z.infer<typeof resetPasswordInput>
