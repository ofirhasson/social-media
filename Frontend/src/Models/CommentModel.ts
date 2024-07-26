import { LikeModel } from "./LikeModel";
import { ReplyModel } from "./ReplyModel";
import { UserModel } from "./UserModel";

export class CommentModel {
  _id: string;
  userId: UserModel;
  targetPostId: string;
  text: string;
  imageName: string;
  replies: ReplyModel[];
  likes: LikeModel[];


  public constructor(replies:ReplyModel[] = []) {
    this.userId = new UserModel()
    this.replies = replies
  }
}
