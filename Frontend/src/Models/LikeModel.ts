import { LikeTarget } from "./enums";
import { UserModel } from "./UserModel";

export class LikeModel {
  _id: string;
  userId: UserModel;
  targetId: string;
  targetType: LikeTarget;
}
