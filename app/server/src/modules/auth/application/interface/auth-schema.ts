import z from "zod";

export const registerSchema = z.object({
    email: z.email(),
    username: z.string().min(8),
    password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

