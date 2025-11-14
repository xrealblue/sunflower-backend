import type { IUser } from "@/types";
import mongoose, { Schema, model } from "mongoose";


export const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30,
        match: [/^[a-z0-9._]+$/, 'Username can only contain letters, numbers, dots, and underscores'],
    },
    displayName: {
        type: String,
        required: true,
    },
    notifications: {
    
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

export const User = mongoose.model<IUser>("User", UserSchema);




