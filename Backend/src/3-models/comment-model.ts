import mongoose, { Document, Schema, Types, model } from "mongoose";
import { appConfig } from "../2-utils/app-config";

export interface ICommentModel extends Document {
  userId: Types.ObjectId;
  targetPostId: Types.ObjectId;
  text: string;
  imageName: string;
  replies: Types.ObjectId[];
  likes: Types.ObjectId[];
}

export const CommentSchema = new Schema<ICommentModel>(
  {
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
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LikeModel",
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReplyModel",
      },
    ],
  },
  { timestamps: true, id: false, toJSON: { virtuals: true }, versionKey: false }
);



CommentSchema.virtual("photos").get(function (
  this: ICommentModel & { imageName: string }
) {
  return {
    imageName: this.imageName
      ? appConfig.commentImageUrl + this.imageName
      : null,
  };
});

export const CommentModel = model<ICommentModel>(
  "CommentModel",
  CommentSchema,
  "comments"
);
