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
        },
    },
    
    secret: process.env.BETTER_AUTH_SECRET as string,
    
    baseURL: isProduction
        ? "https://sunflower-backend-vv4o.onrender.com"
        : "http://localhost:3001",
    
    advanced: {
        // ✅ THIS IS THE KEY FIX - disable secure cookies in dev
        useSecureCookies: isProduction, // false in development!
        
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: isProduction, // ✅ This will be false in dev
            httpOnly: true,
            path: "/",
        },
    },
    
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
});