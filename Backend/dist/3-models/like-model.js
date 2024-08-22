import mongoose, { Schema, model } from "mongoose";
export const LikeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing target id"],
    },
    targetType: {
        type: String,
        required: [true, "Missing target type"],
    },
}, { versionKey: false, toJSON: { virtuals: true }, id: false });
export const LikeModel = model("LikeModel", LikeSchema, "likes");
