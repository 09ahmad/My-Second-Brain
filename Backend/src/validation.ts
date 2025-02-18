import { string, z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3, "Username must have atleast 3 characters"),
    email: z.string().email("Invalid Email format"),
    password: z.string().min(6, "Password must contain atleast 6 characters")
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must contain atleast 6 characters")
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
