import { priority, PrismaClient, status } from "./generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import z from 'zod'
const adapter = new PrismaPg({
    connectionString : process.env.DATABASE_URL
})

export const client = new PrismaClient({
    adapter
})

export const userSchema = z.object({
    name : z.string().max(30).min(5),
    email : z.string().email()
})

export const projectSchema = z.object({
    email : z.string().email(),
    title : z.string().min(5).max(20),
    description : z.string().max(50).min(5).optional(),
    
})

export const taskSchema = z.object({
    title : z.string().max(30).min(4),
    description : z.string().max(40).min(5).optional(),
    status : z.enum(["todo", "in_progress","done"]),
    priority : z.enum(["low","medium","high"])
})

export const updateTaskSchema = z.object({
    status : z.enum(["todo","in_progress","done"]).optional(),
    priority : z.enum(["low","medium","high"]).optional(),
    title  : z.string().max(30).min(4).optional(),
    description : z.string().max(40).min(5).optional()
})