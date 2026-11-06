import z from 'zod'

export const registerSession = z.object({
    token: z.string(),
    hashToken: z.string(),
    userId: z.string(),
    expiredAt: z.date()
})
