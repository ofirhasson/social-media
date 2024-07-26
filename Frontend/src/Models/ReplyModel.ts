import { CommentModel } from "./CommentModel";
import { LikeModel } from "./LikeModel";
import { UserModel } from "./UserModel";

export class ReplyModel {
  _id: string;
  userId: UserModel;
  commentId: string;
  text: string;
  likes: LikeModel[];
  imageName: string;


//   public constructor() {
//     this.commentId = new CommentModel()
//   }
}
