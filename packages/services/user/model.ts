import { z } from "zod"

export const createUserWithEmailAndPasswordInput = z.object({
    fullName: z.string().describe("Full name of the user"),
    email: z.email().describe("Email of the user"),
    password: z.string().min(8).describe("Password of the user"),

})

export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>

export const generateUserTokenPayload = z.object({
    id: z.string().describe("uuid of the user")
})

export type generateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>