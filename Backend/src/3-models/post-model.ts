import mongoose, { Document, Schema, Types, model } from "mongoose";
import { appConfig } from "../2-utils/app-config";
import { PrivacyOptions } from "./enums";
import { ICommentModel } from "./comment-model";
import { ILikeModel } from "./like-model";

export interface IPostModel extends Document {
    userId: Types.ObjectId;
    targetUserId: Types.ObjectId;
    privacyOptions: PrivacyOptions;
    content: string;
    imageNames: string[];
    likes: Map<string, ILikeModel>;
    comments: Map<string, ICommentModel>;
    created: Date
}

export const PostSchema = new Schema<IPostModel>(
    {
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

        likes:
        {
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
    },
    { timestamps: true, versionKey: false, id: false, toJSON: { virtuals: true } }
);


PostSchema.virtual("photosUrl").get(function (this: IPostModel) {
    const images = Array.isArray(this.imageNames)
        ? this.imageNames
        : [this.imageNames];
    return images?.map((image) => appConfig.postsImageUrl + image);
});

export const PostModel = model<IPostModel>("PostModel", PostSchema, "posts");
