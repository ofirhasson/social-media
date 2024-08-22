import { LikeTarget } from "./enums";
import { UserModel } from "./UserModel";

export class LikeModel {
    _id: string;
    userId: UserModel;
    targetId: string;
    targetType: LikeTarget;

    public constructor(like?: LikeModel) {
        this.userId = like?.userId || new UserModel();
        this.targetId = like?.targetId || ""; 
        this._id = like?._id || "";
        this.targetType = like?.targetType || undefined;
    }
}
