import { string, z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3, "username must have atleast 3 characters"),
    password: z.string().min(6, "Password must contain atleast 6 characters")
})

export const loginSchema = z.object({
    username:z.string().min(3,"Invalid username"),
    password: z.string().min(6, "Password must contain atleast 6 characters")
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
