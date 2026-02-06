import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    
    emailAndPassword: {
        enabled: true,
    },
    
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://www.realblue.lol",
        "https://bluesunflower.vercel.app",
        "https://sunflower.realblue.lol",
        "https://sunflower-backend-vv4o.onrender.com",
    ],
    
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            // ✅ ADD THIS - explicitly set the redirect URI
            redirectURI: isProduction 
                ? "https://sunflower-backend-vv4o.onrender.com/api/auth/callback/google"
                : "http://localhost:3001/api/auth/callback/google",
        },
    },
    
    secret: process.env.BETTER_AUTH_SECRET as string,
    
    // ✅ CRITICAL: baseURL must match where your backend is hosted
    baseURL: isProduction
        ? "https://sunflower-backend-vv4o.onrender.com"
        : "http://localhost:3001",
    
    advanced: {
        useSecureCookies: isProduction,
        cookiePrefix: "better-auth", // ✅ Add explicit prefix
        defaultCookieAttributes: {
            sameSite: "lax", // ✅ Critical for OAuth
            secure: isProduction,
            httpOnly: true,
            path: "/",
        },
    },
    
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
    },
});

console.log("✅ Better Auth initialized");
console.log("📍 Base URL:", isProduction ? "https://sunflower-backend-vv4o.onrender.com" : "http://localhost:3001");
console.log("🌍 Environment:", process.env.NODE_ENV || "development");
console.log("🔑 Google Client ID:", process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing");