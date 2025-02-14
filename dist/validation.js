"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username must have atleast 3 characters"),
    email: zod_1.z.string().email("Invalid Email format"),
    password: zod_1.z.string().min(6, "Password must contain atleast 6 characters")
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must contain atleast 6 characters")
});
