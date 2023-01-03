// @ts-check
import { z } from 'zod'

export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
})

export const clientSchema = z.object({

})

export const clientEnv = {

}
