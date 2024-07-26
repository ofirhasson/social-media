import mongoose, { Document, Schema, Types, model } from "mongoose";

export interface IReplyModel extends Document {
  userId: Types.ObjectId;
  commentId: Types.ObjectId;
  text:string
  likes: mongoose.Schema.Types.ObjectId[];
  imageName: string;
}

export const ReplySchema = new Schema<IReplyModel>(
  {
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
      type:String,
       required: [true, "Missing text"]
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LikeModel",
        
      },
    ],
    imageName: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
    autoCreate: false,
  }
);


export const ReplyModel = model<IReplyModel>(
  "ReplyModel",
  ReplySchema,
  "replies"
);
