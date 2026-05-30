import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../../backend/db/prisma";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;  

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            image: user.image ?? null,  
          }
        });
      }
      return true;
    },

    async session({ session }) {
      if (!session.user?.email) return session;  

      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email }
      });

      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.college = dbUser.college;
        session.user.username = dbUser.username;
      }

      return session;
    }
  }
});

export { handler as GET, handler as POST };