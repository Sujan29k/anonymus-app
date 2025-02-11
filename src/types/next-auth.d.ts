import NextAuth from "next-auth";

// Extend the Credentials type to include isSignup and name
declare module "next-auth" {
  interface Credentials {
    email: string;
    password: string;
    isSignup?: string; // Optional field to check if it's a signup request
    name?: string; // Optional field for user's name during signup
  }
}
