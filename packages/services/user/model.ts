import { z } from "zod"

export const createUserWithEmailAndPasswordInput = z.object({
    fullName: z.string().min(1, "Please enter your full name.").describe("Full name of the user"),
    email: z.string().email("Please enter a valid email address.").describe("Email of the user"),
    password: z.string().min(8, "Your password must be at least 8 characters long.").describe("Password of the user"),
})
export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>

export const siginUserWithEmailAndPasswordInput = z.object({
    email: z.string().email("Please enter a valid email address.").describe("Email of the user"),
    password: z.string().min(8, "Your password must be at least 8 characters long.").describe("Password of the user"),
})

export type SiginUserWithEmailAndPasswordInputType = z.infer<typeof siginUserWithEmailAndPasswordInput>

export const generateUserTokenPayload = z.object({
    id: z.string().describe("uuid of the user")
})

export type generateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>

export const forgotPasswordInput = z.object({
    email: z.string().email("Please enter a valid email address.").describe("Email of the user requesting password reset"),
})
export type ForgotPasswordInputType = z.infer<typeof forgotPasswordInput>

export const resetPasswordInput = z.object({
    email: z.string().email("Please enter a valid email address.").describe("User email"),
    token: z.string().min(1, "Your reset link has expired or is invalid. Please request a new link.").describe("Secure verification token"),
    password: z.string().min(8, "Your password must be at least 8 characters long.").describe("New user password"),
})
export type ResetPasswordInputType = z.infer<typeof resetPasswordInput>
