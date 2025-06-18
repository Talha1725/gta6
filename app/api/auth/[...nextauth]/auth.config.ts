import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Find user in database
          const userResult = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1)

          if (!userResult.length) {
            return null
          }

          const user = userResult[0]

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash)

          if (!isValidPassword) {
            return null
          }

          return {
            id: user.id.toString(),
            email: user.email,
            role: user.role
          }
        } catch (error) {
          console.error('❌ Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Role-based redirects
      if (url.startsWith('/login') || url.startsWith('/signup')) {
        return url
      }
      
      // Default redirect for regular users
      return `${baseUrl}/`
    },
  },
  pages: {
    signIn: '/login',
    error: '/login?error=true',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
} 