import { randomBytes, createHmac } from "node:crypto"
import * as JWT from "jsonwebtoken"
import { type CreateUserWithEmailAndPasswordInputType, createUserWithEmailAndPasswordInput, generateUserTokenPayload, generateUserTokenPayloadType } from "./model"
import { type SiginUserWithEmailAndPasswordInputType, siginUserWithEmailAndPasswordInput } from "./model"
import { db, eq } from "@repo/database"
import { usersTable } from "../../database/schema"
import { env } from "../env"


class UserService {

    private async verifyUserToken(token: string): Promise<generateUserTokenPayloadType> {
        try {
            const verificationResult = JWT.verify(token, env.JWT_SECRET)
            const result = await generateUserTokenPayload.safeParseAsync(verificationResult)

            if (!result.success) {
                throw new Error("Invalid or expired token")
            }

            return result.data
        } catch {
            throw new Error("Invalid or expired token")
        }
    }

    private async getUserInfoById(id: string) {
        const user = await db.select({
            id: usersTable.id,
            fullName: usersTable.fullName,
            email: usersTable.email,
            profileImageUrl: usersTable.profileImageUrl
        }).from(usersTable).where(eq(usersTable.id, id))

        if (!user || user.length === 0) {
            throw new Error(`User with this ${id} not found}`)

        }

        return user[0]

    }

    private async generateHash(salt: string, password: string) {
        return createHmac("sha256", salt).update(password).digest("hex")

    }

    private async getUserByEmail(email: string) {
        const result = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if (!result || result.length === 0) {
            return null
        }

        return result[0]
    }

    private async generateUserToken(payload: generateUserTokenPayloadType) {
        const result = await generateUserTokenPayload.safeParseAsync(payload)

        if (!result.success) {
            throw new Error(result.error.message)
        }

        const { id } = result.data

        const token = await JWT.sign({ id }, env.JWT_SECRET)

        return { token }

    }

    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
        const { fullName, email, password } = await createUserWithEmailAndPasswordInput.parseAsync(payload)

        // check if user exist or not

        const getUserByEmail = await this.getUserByEmail(email)

        if (getUserByEmail) {
            throw new Error("User already exist")
        }

        // calc salt and create hash of password

        const salt = randomBytes(16).toString("hex")

        const hash = await this.generateHash(salt, password)


        // create user
        const userInsertResult = await db.insert(usersTable).values({ email, fullName, password: hash, salt }).returning({
            id: usersTable.id
        })

        if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) {
            throw new Error("Something went wrong while creating user")
        }

        const userId = userInsertResult[0].id
        const { token } = await this.generateUserToken({ id: userId })

        return {
            id: userId,
            token,
        }

    }

    public async siginUserWithEmailAndPassword(payload: SiginUserWithEmailAndPasswordInputType) {

        const { email, password } = await siginUserWithEmailAndPasswordInput.parseAsync(payload)

        const existingUser = await this.getUserByEmail(email)

        if (!existingUser) {
            throw new Error(`User not exist with this ${email} email`)
        }

        if (!existingUser.password || !existingUser.salt) {
            throw new Error("Invalid Authentication Method")

        }

        const hash = await this.generateHash(existingUser.salt, password)



        if (hash !== existingUser.password) {
            throw new Error("Invalid email or Password")

        }

        const { token } = await this.generateUserToken({ id: existingUser.id })


        return {
            id: existingUser.id,
            token
        }

    }

    public async verifyAndDecodeUserToken(token: string) {
        const { id } = await this.verifyUserToken(token)
        const userInfo = await this.getUserInfoById(id)

        return { ...userInfo }
    }

}

export default UserService