import { CommentModel } from "./CommentModel";
import { PrivacyOptions } from "./enums";
import { LikeModel } from "./LikeModel";
import { UserModel } from "./UserModel";

export class PostModel {
  _id:string  
  userId: UserModel;
  targetUserId: string;
  privacyOptions: PrivacyOptions;
  content: string;
  imageNames: string[];
  photosUrl: string[]
  images: FileList
  likes: LikeModel[];
  comments: CommentModel[];
  created:string
}
