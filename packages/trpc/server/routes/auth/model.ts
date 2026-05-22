import { z } from "zod"

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().min(1, "Please enter your full name.").describe("Full name of the user"),
    email: z.string().email("Please enter a valid email address.").describe("Email of the user"),
    password: z.string().min(8, "Your password must be at least 8 characters long.").describe("Password of the user"),
})
export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("Id of the user")
})
export const signinUserWithEmailAndPasswordInputModel = z.object({
    email: z.string().email("Please enter a valid email address.").describe("Email of the user"),
    password: z.string().min(8, "Your password must be at least 8 characters long.").describe("Password of the user"),
})
export const signinUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("Id of the user"),
    token: z.string().describe("Token of the user")
})

export const getLoggedInUserInfoInputModel = z.undefined()
export const getLoggedInUserInfoOutputModel = z.object({
    id: z.string().describe("uuid of the user"),
    fullName: z.string().describe("Full name of the user"),
    email: z.string().describe("Email of the user"),
})

export const logoutOutputModel = z.object({
    success: z.boolean().describe("Whether the logout was successful"),
})

export const forgotPasswordInputModel = z.object({
    email: z.string().email("Please enter a valid email address.").describe("User email address to reset password"),
    webUrl: z.string().url("Please enter a valid website address.").describe("Base origin URL of web client"),
})
export const forgotPasswordOutputModel = z.object({
    success: z.boolean().describe("Success flag"),
})

export const resetPasswordInputModel = z.object({
    email: z.string().email("Please enter a valid email address.").describe("User email address"),
    token: z.string().min(1, "Your reset link has expired or is invalid. Please request a new link.").describe("Raw validation token"),
    password: z.string().min(8, "Your password must be at least 8 characters long.").describe("New chosen password"),
})
export const resetPasswordOutputModel = z.object({
    success: z.boolean().describe("Success flag"),
})