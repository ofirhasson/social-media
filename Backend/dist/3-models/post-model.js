import mongoose, { Schema, model } from "mongoose";
import { appConfig } from "../2-utils/app-config";
export const PostSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: [true, "Missing user id"],
    },
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
    },
    privacyOptions: {
        type: String,
        required: [true, "Missing privacy option"],
    },
    content: {
        type: String,
    },
    imageNames: {
        type: [String],
    },
    likes: {
        type: Map,
        of: { type: mongoose.Schema.Types.ObjectId, ref: "LikeModel" },
        default: {},
    },
    comments: {
        type: Map,
        of: { type: mongoose.Schema.Types.ObjectId, ref: "CommentModel" },
        default: {},
    },
    created: {
        type: Date,
        default: new Date()
    }
}, { timestamps: true, versionKey: false, id: false, toJSON: { virtuals: true } });
PostSchema.virtual("photosUrl").get(function () {
    const images = Array.isArray(this.imageNames)
        ? this.imageNames
        : [this.imageNames];
    return images === null || images === void 0 ? void 0 : images.map((image) => appConfig.postsImageUrl + image);
});
export const PostModel = model("PostModel", PostSchema, "posts");
