import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDB from "@/lib/mongodb";
import User from "@/model/User";
import { JWT } from "next-auth/jwt";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" }, // Add name here
        isSignup: { label: "isSignup", type: "text" }, // Add isSignup flag
      },
      async authorize(credentials) {
        await connectToDB();

        if (credentials?.isSignup === "true") {
          // Handle signup logic
          const existingUser = await User.findOne({ email: credentials.email });
          if (existingUser) {
            throw new Error("User already exists");
          }

          // Create a new user
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const newUser = await User.create({
            name: credentials.name,
            email: credentials.email,
            password: hashedPassword,
            uniqueLink: `user-${Math.random().toString(36).substr(2, 9)}`, // Create a unique link
          });

          return {
            id: newUser._id,
            email: newUser.email,
            uniqueLink: newUser.uniqueLink,
          };
        }

        // Handle login logic
        const user = await User.findOne({ email: credentials?.email });
        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Await bcrypt comparison
        const isValidPassword = await bcrypt.compare(
          credentials?.password || "",
          user.password
        );
        if (!isValidPassword) {
          throw new Error("Invalid email or password");
        }

        return { id: user._id, email: user.email, uniqueLink: user.uniqueLink };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.uniqueLink = user.uniqueLink;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.user.id = token.id;
      session.user.uniqueLink = token.uniqueLink;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth({
  ...authOptions,
  session: {
    strategy: "jwt",
  },
});
export { handler as GET, handler as POST };
