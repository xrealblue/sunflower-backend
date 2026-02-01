import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [
        "http://localhost:3000",
        "https://www.realblue.lol",
        "https://bluesunflower.vercel.app",
        "https://sunflower.realblue.lol",
    ],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    secret: process.env.BETTER_AUTH_SECRET as string,
    baseURL: process.env.BETTER_AUTH_URL as string,
    
    // ✅ Add advanced configuration for debugging
    advanced: {
        useSecureCookies: true, // Important for production HTTPS
        crossSubDomainCookies: {
            enabled: true,
        },
    },
    
    // ✅ Add logging
    logger: {
        level: "debug",
        disabled: false,
    },
});

console.log("✅ Better Auth initialized");
console.log("📍 Base URL:", process.env.BETTER_AUTH_URL);
console.log("🔑 Google Client ID:", process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing");
console.log("🔒 Secret:", process.env.BETTER_AUTH_SECRET ? "✅ Set" : "❌ Missing");