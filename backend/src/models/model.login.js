import mongoose, { Schema } from "mongoose";
const userScheme = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["superAdmin", "support", "finance", "compliance", "user", "listener"],
            default: "user"
        },
        token: { type: String },

        username: {
            type: String,
            required: true,
            unique: true
        },
        cCode: {
            type: String,
            required: true,
        },

        phoneNumber: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "blocked", "pending"],
            default: "active"
        },
        registered: {
            type: Date,
            default: Date.now
        },
        lastActive: {
            type: Date
        },
        sessions: [{
            type: Schema.Types.ObjectId,
            ref: "Session"
        }],
        tickets: [{
            type: Schema.Types.ObjectId,
            ref: "SupportTicket"
        }]
    }, {
    timestamps: true
});

const User = mongoose.model("User", userScheme);

export { User };