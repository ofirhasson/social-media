import { CommentModel } from "../Models/CommentModel";
import { PostModel } from "../Models/PostModel";
import { UserModel } from "../Models/UserModel";

export type AppState = {
  auth: UserModel;
//   users: Map<string, UserModel>;
//   posts: PostModel[];
};
