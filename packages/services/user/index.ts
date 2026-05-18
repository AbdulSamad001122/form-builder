import { randomBytes, createHmac } from "node:crypto"
import * as JWT from "jsonwebtoken"
import { type CreateUserWithEmailAndPasswordInputType, createUserWithEmailAndPasswordInput, generateUserTokenPayload, generateUserTokenPayloadType } from "./model"
import { db, eq } from "@repo/database"
import { usersTable } from "../../database/schema"
import { env } from "../env"


class UserService {

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

        const hash = createHmac("sha256", salt).update(password).digest("hex")


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
}

export default UserService