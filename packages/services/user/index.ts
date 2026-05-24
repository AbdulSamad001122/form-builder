import { randomBytes, createHmac, createHash } from "node:crypto"
import * as JWT from "jsonwebtoken"
import { type CreateUserWithEmailAndPasswordInputType, createUserWithEmailAndPasswordInput, generateUserTokenPayload, generateUserTokenPayloadType, type ResetPasswordInputType } from "./model"
import { type SiginUserWithEmailAndPasswordInputType, siginUserWithEmailAndPasswordInput } from "./model"
import { db, eq, and } from "@repo/database"
import { usersTable, passwordResetTokensTable } from "../../database/schema"
import { env } from "../env"
import { Resend } from "resend"


class UserService {

    private async verifyUserToken(token: string): Promise<generateUserTokenPayloadType> {
        try {
            const verificationResult = JWT.verify(token, env.JWT_SECRET)
            const result = await generateUserTokenPayload.safeParseAsync(verificationResult)

            if (!result.success) {
                throw new Error("Your session has expired. Please log in again.")
            }

            return result.data
        } catch {
            throw new Error("Your session has expired. Please log in again.")
        }
    }

    public async getUserInfoById(id: string) {
        const [user] = await db.select({
            id: usersTable.id,
            fullName: usersTable.fullName,
            email: usersTable.email,
        }).from(usersTable).where(eq(usersTable.id, id))

        if (!user) {
            throw new Error("We could not find a user account with the requested ID.")
        }

        return user
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
            throw new Error("An account with this email address already exists. Please try logging in.")
        }

        // calc salt and create hash of password

        const salt = randomBytes(16).toString("hex")

        const hash = await this.generateHash(salt, password)


        // create user
        const userInsertResult = await db.insert(usersTable).values({ email, fullName, password: hash, salt }).returning({
            id: usersTable.id
        })

        if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) {
            throw new Error("An unexpected error occurred while creating your account. Please try again.")
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
            throw new Error("No account was found with this email address.")
        }

        if (!existingUser.password || !existingUser.salt) {
            throw new Error("This account is configured with a different login method.")

        }

        const hash = await this.generateHash(existingUser.salt, password)



        if (hash !== existingUser.password) {
            throw new Error("The email address or password you entered is incorrect.")

        }

        const { token } = await this.generateUserToken({ id: existingUser.id })


        return {
            id: existingUser.id,
            token
        }

    }

    public async verifyAndDecodeUserToken(token: string) {
        const { id } = await this.verifyUserToken(token)

        return { id }
    }

    private calculateTokenHash(token: string) {
        return createHash("sha256").update(token).digest("hex")
    }

    public async requestPasswordReset(payload: { email: string; webUrl: string }) {
        const { email, webUrl } = payload
        
        const existingUser = await this.getUserByEmail(email)
        if (!existingUser) {
            return { success: true }
        }

        const rawToken = randomBytes(32).toString("hex")
        const hashedToken = this.calculateTokenHash(rawToken)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        await db.insert(passwordResetTokensTable).values({
            userId: existingUser.id,
            tokenHash: hashedToken,
            expiresAt,
        })

        const cleanWebUrl = webUrl.replace(/\/$/, "")
        const resetLink = `${cleanWebUrl}/reset-password?email=${encodeURIComponent(email)}&token=${rawToken}`

        const resend = new Resend(env.RESEND_API_KEY)

        try {
            await resend.emails.send({
                from: 'Formit <onboarding@resend.dev>',
                to: email,
                subject: 'Reset your Formit password',
                html: `
                    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #D4CFC6; border-radius: 8px;">
                        <h2 style="color: #1A3D2B; font-weight: bold; margin-top: 0;">Reset your Formit Password</h2>
                        <p style="color: #6B6860; font-size: 14px; line-height: 1.5;">You requested to reset your password for your Formit account. Click the button below to verify your identity and enter a new password. This secure link will expire in 10 minutes.</p>
                        <div style="margin: 28px 0; text-align: center;">
                            <a href="${resetLink}" style="background-color: #1A3D2B; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Reset Password</a>
                        </div>
                        <p style="color: #6B6860; font-size: 13px; margin-bottom: 4px;">Or copy and paste this link into your browser:</p>
                        <p style="color: #1A3D2B; font-size: 12px; word-break: break-all; margin-top: 0;"><a href="${resetLink}" style="color: #1A3D2B;">${resetLink}</a></p>
                        <hr style="border: 0; border-top: 1px solid #E4E2DC; margin: 24px 0;" />
                        <p style="font-size: 12px; color: #A19E95; margin-bottom: 0;">If you did not request this password reset, please ignore this email safely.</p>
                    </div>
                `
            })
        } catch (err) {
            console.error("Failed to send password reset email via Resend:", err)
        }

        return { success: true }
    }

    public async resetPassword(payload: ResetPasswordInputType) {
        const { email, token, password } = payload

        const existingUser = await this.getUserByEmail(email)
        if (!existingUser) {
            throw new Error("This reset link is invalid or has expired. Please request a new link.")
        }

        const incomingHash = this.calculateTokenHash(token)

        const [activeToken] = await db
            .select()
            .from(passwordResetTokensTable)
            .where(
                and(
                    eq(passwordResetTokensTable.userId, existingUser.id),
                    eq(passwordResetTokensTable.tokenHash, incomingHash)
                )
            )
            .limit(1)

        if (!activeToken || activeToken.tokenHash !== incomingHash) {
            throw new Error("This reset link is invalid or has expired. Please request a new link.")
        }

        if (new Date() > new Date(activeToken.expiresAt)) {
            await db.delete(passwordResetTokensTable).where(eq(passwordResetTokensTable.id, activeToken.id))
            throw new Error("This reset link is invalid or has expired. Please request a new link.")
        }

        const salt = randomBytes(16).toString("hex")
        const hash = await this.generateHash(salt, password)

        await db.update(usersTable)
            .set({ password: hash, salt })
            .where(eq(usersTable.id, existingUser.id))

        await db.delete(passwordResetTokensTable).where(eq(passwordResetTokensTable.userId, existingUser.id))

        return { success: true }
    }

}

export default UserService