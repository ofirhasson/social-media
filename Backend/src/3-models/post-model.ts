import mongoose, { Document, Schema, Types, model } from "mongoose";
import { appConfig } from "../2-utils/app-config";
import { PrivacyOptions } from "./enums";

export interface IPostModel extends Document {
  userId: Types.ObjectId;
  targetUserId: Types.ObjectId;
  privacyOptions: PrivacyOptions;
  content: string;
  imageNames: string[];
  likes: mongoose.Schema.Types.ObjectId[];
  comments: mongoose.Schema.Types.ObjectId[];
  created:Date
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

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LikeModel",
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommentModel",
      },
    ],
    created: {
        type:Date,
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
