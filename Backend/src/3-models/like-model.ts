import mongoose, { Document, Schema, Types, model } from "mongoose";
import { LikeTarget } from "./enums";

export interface ILikeModel extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  targetId: Types.ObjectId;
  targetType: LikeTarget;
  isLiked: boolean
}

export const LikeSchema = new Schema<ILikeModel>(
  {
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
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);



export const LikeModel = model<ILikeModel>("LikeModel", LikeSchema, "likes");
