// @ts-check
import { z } from 'zod'

export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(
    (str) => process.env.VERCEL_URL ?? str,
    process.env.VERCEL ? z.string() : z.string().url(),
  ),
  NODE_ENV: z.enum(['development', 'test', 'production']),
})

export const clientSchema = z.object({

})

export const clientEnv = {

}
