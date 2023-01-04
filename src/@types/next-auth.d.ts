import 'next-auth'
import { User } from 'next-auth'
import { JWT } from 'next-auth/jwt'


declare module 'next-auth' {
    interface User {
        id: string
        username: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        user: User
    }
}