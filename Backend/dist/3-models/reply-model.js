import mongoose, { Schema, model } from "mongoose";
export const ReplySchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: [true, "Missing user id"],
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommentModel",
        required: [true, "Missing comment id"],
    },
    text: {
        type: String,
        required: [true, "Missing text"]
    },
    likes: {
        type: Map,
        of: { type: mongoose.Schema.Types.ObjectId, ref: "LikeModel" },
        default: {},
    },
    imageName: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
    autoCreate: false,
});
export const ReplyModel = model("ReplyModel", ReplySchema, "replies");
