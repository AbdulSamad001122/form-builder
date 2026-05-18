import { email, z } from "zod"

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe("Full name of the user"),
    email: z.email().describe("Email of the user"),
    password: z.string().min(8).describe("Password of the user"),
})
export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("Id of the user")
})