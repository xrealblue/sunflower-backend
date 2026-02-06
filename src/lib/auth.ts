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
        "https://www.realblue.lol",
        "https://bluesunflower.vercel.app",
        "https://sunflower.realblue.lol",
        "https://sunserver.realblue.lol", 
    ],
    
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    
    secret: process.env.BETTER_AUTH_SECRET as string,
    
    baseURL:"https://sunserver.realblue.lol",
       
    
    advanced: {
        useSecureCookies: isProduction,
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: isProduction,
            httpOnly: true,
            path: "/",
            // ✅ Now both frontend and backend share .realblue.lol domain!
            domain: isProduction ? ".realblue.lol" : undefined,
        },
    },
    
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
});