import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

const isProduction = process.env.NODE_ENV === "production";
const frontendURL = isProduction 
    ? "https://sunflower.realblue.lol" 
    : "http://localhost:3000";

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
        },
    },
    
    secret: process.env.BETTER_AUTH_SECRET as string,
    baseURL: process.env.BETTER_AUTH_URL as string,
    
    advanced: {
        useSecureCookies: isProduction,
        crossSubDomainCookies: {
            enabled: true,
        },
        // ✅ Add this to handle redirects properly
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: isProduction,
        },
    },
    
    // ✅ Configure redirect URLs
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
    },
    
    logger: {
        level: "debug",
        disabled: false,
    },
});

console.log("✅ Better Auth initialized");
console.log("📍 Base URL:", process.env.BETTER_AUTH_URL);
console.log("🎯 Frontend URL:", frontendURL);
console.log("🌍 Environment:", process.env.NODE_ENV || "development");
console.log("🔑 Google Client ID:", process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing");