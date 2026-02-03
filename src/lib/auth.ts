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
        "https://sunflower.realblue.lol",
        "https://sunflower-backend-vv4o.onrender.com",
    ],
    
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            
            // ✅ Add callback URL configuration
            redirectURI: isProduction
                ? "https://sunflower.realblue.lol/api/auth/callback/google"
                : "http://localhost:3000/api/auth/callback/google",
        },
    },
    
    secret: process.env.BETTER_AUTH_SECRET as string,
    baseURL: isProduction 
        ? "https://sunflower.realblue.lol" 
        : "http://localhost:3000",
    
    // ✅ Add redirect configuration
    account: {
        accountLinking: {
            enabled: true,
        },
    },
    
    // ✅ Set where to redirect after successful auth
    callbacks: {
        async redirect() {
            // Redirect to this page after successful OAuth
            return isProduction 
                ? "https://sunflower.realblue.lol/auth/callback"
                : "http://localhost:3000/auth/callback";
        },
    },
    
    advanced: {
        useSecureCookies: isProduction,
        crossSubDomainCookies: {
            enabled: false,
        },
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: isProduction,
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
    
    logger: {
        level: "debug",
        disabled: false,
    },
});