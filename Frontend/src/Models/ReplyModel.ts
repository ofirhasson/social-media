import { convertToMap } from "../Utils/convertToMap";
import { LikeModel } from "./LikeModel";
import { UserModel } from "./UserModel";

export class ReplyModel {
    _id: string;
    userId: UserModel;
    commentId: string;
    text: string;
    likes: Map<string, LikeModel>;
    imageName: string;

    constructor(data: ReplyModel) {
        this._id = data._id || '';
        this.userId = data.userId || new UserModel();
        this.commentId = data.commentId || '';
        this.text = data.text || '';
        this.imageName = data.imageName || '';
        this.likes = convertToMap(data.likes, LikeModel) || new Map();
    }

}
