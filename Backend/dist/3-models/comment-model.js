import mongoose, { Schema, model } from "mongoose";
import { appConfig } from "../2-utils/app-config";
export const CommentSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: [true, "Missing user id"],
    },
    targetPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostModel",
        required: [true, "Missing post id"],
    },
    text: {
        type: String,
        required: [true, "Missing text"],
    },
    imageName: {
        type: String,
    },
    likes: {
        type: Map,
        of: { type: mongoose.Schema.Types.ObjectId, ref: "LikeModel" },
        default: {},
    },
    replies: {
        type: Map,
        of: { type: mongoose.Schema.Types.ObjectId, ref: "ReplyModel" },
        default: {},
    },
}, { timestamps: true, id: false, toJSON: { virtuals: true }, versionKey: false });
CommentSchema.virtual("photos").get(function () {
    return {
        imageName: this.imageName
            ? appConfig.commentImageUrl + this.imageName
            : null,
    };
});
export const CommentModel = model("CommentModel", CommentSchema, "comments");
