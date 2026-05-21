import { z } from "zod"

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe("Full name of the user"),
    email: z.email().describe("Email of the user"),
    password: z.string().min(8).describe("Password of the user"),
})
export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("Id of the user")
})
export const signinUserWithEmailAndPasswordInputModel = z.object({
    email: z.email().describe("Email of the user"),
    password: z.string().min(8).describe("Password of the user"),
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