import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import { prisma } from '@/server/db/prisma'
import { compare } from 'bcryptjs'

const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
})

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  jwt: {
    maxAge: 60 * 60 * 24,
  },
  secret: process.env.JWT_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: 'Username', type: 'text' },
        passowrd: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, request) {
        const creds = await loginSchema.parseAsync(credentials)

        const user = await prisma.user.findUnique({
          where: {
            username: creds.username,
          },
        })

        if (!user) {
          throw new Error('User or password are incorrects')
        }

        const isValidpassword = compare(creds.password, user.password)

        if (!isValidpassword) {
          throw new Error('User or password are incorrects')
        }

        return {
          id: user.id,
          image: '',
          name: '',
          email: user.username,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }

      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
}
export default NextAuth(authOptions)
